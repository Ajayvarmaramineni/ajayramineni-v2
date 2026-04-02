from __future__ import annotations
"""
services/cleaning_service.py
Detects data quality issues and produces recommendations.
MVP: diagnostics only — does NOT auto-apply fixes.
"""

import pandas as pd
import numpy as np
from app.services.parser_service import _infer_semantic_type


def run_cleaning_diagnostics(df: pd.DataFrame) -> dict:
    """
    Analyse a DataFrame and return a structured cleaning report with
    findings and recommended actions. Nothing is modified.
    """
    issues         = []
    recommendations = []

    # ── 1. Missing values ──────────────────────────────────────────────────
    missing_by_col = {}
    for col in df.columns:
        n_miss = int(df[col].isna().sum())
        if n_miss == 0:
            continue
        pct = round(n_miss / len(df) * 100, 2)
        missing_by_col[col] = {"missing_count": n_miss, "missing_pct": pct}

        if pct > 50:
            issues.append({"type": "high_missingness", "column": col, "detail": f"{pct}% missing — consider dropping this column", "severity": "high"})
            recommendations.append({"action": "drop_column", "column": col, "reason": f"Over 50% of values are missing ({pct}%)"})
        elif pd.api.types.is_numeric_dtype(df[col]):
            issues.append({"type": "missing_numeric", "column": col, "detail": f"{n_miss} missing values ({pct}%)", "severity": "medium"})
            recommendations.append({"action": "fill_median", "column": col, "reason": f"Impute {n_miss} missing numeric values with median"})
        else:
            issues.append({"type": "missing_categorical", "column": col, "detail": f"{n_miss} missing values ({pct}%)", "severity": "medium"})
            recommendations.append({"action": "fill_mode", "column": col, "reason": f"Impute {n_miss} missing categorical values with mode or 'Unknown'"})

    # ── 2. Duplicate rows ─────────────────────────────────────────────────
    dup_count = int(df.duplicated().sum())
    if dup_count > 0:
        issues.append({"type": "duplicate_rows", "column": None, "detail": f"{dup_count} exact duplicate rows detected", "severity": "medium"})
        recommendations.append({"action": "drop_duplicates", "column": None, "reason": f"Remove {dup_count} exact duplicate rows"})

    # ── 3. Constant columns ───────────────────────────────────────────────
    for col in df.columns:
        if df[col].nunique(dropna=True) <= 1:
            issues.append({"type": "constant_column", "column": col, "detail": "Only one unique value — carries no information", "severity": "high"})
            recommendations.append({"action": "drop_column", "column": col, "reason": "Constant columns add no predictive value"})

    # ── 4. Mixed data types ───────────────────────────────────────────────
    for col in df.select_dtypes(include="object").columns:
        sample = df[col].dropna().head(200)
        num_parseable = sum(1 for v in sample if _is_numeric_string(str(v)))
        if 0 < num_parseable < len(sample) * 0.8 and num_parseable > len(sample) * 0.2:
            issues.append({"type": "mixed_types", "column": col, "detail": "Column contains a mix of numeric and text values", "severity": "medium"})
            recommendations.append({"action": "investigate_mixed_types", "column": col, "reason": "Mixed numeric/text values may indicate dirty data entry"})

    # ── 5. High-cardinality categorical columns ───────────────────────────
    for col in df.select_dtypes(include="object").columns:
        n_unique = df[col].nunique(dropna=True)
        cardinality_ratio = n_unique / max(len(df.dropna(subset=[col])), 1)
        sem_type = _infer_semantic_type(df[col], col)
        if cardinality_ratio > 0.9 and sem_type not in ("identifier", "datetime"):
            issues.append({"type": "high_cardinality", "column": col, "detail": f"{n_unique} unique values ({round(cardinality_ratio*100,1)}% of rows)", "severity": "low"})
            recommendations.append({"action": "review_high_cardinality", "column": col, "reason": "Nearly unique values — may be a free-text or ID column"})

    # ── 6. Outliers in numeric columns (IQR method) ───────────────────────
    outlier_warnings = []
    for col in df.select_dtypes(include="number").columns:
        vals = df[col].dropna()
        if len(vals) < 10:
            continue
        q1, q3 = vals.quantile(0.25), vals.quantile(0.75)
        iqr    = q3 - q1
        n_out  = int(((vals < q1 - 1.5 * iqr) | (vals > q3 + 1.5 * iqr)).sum())
        if n_out > 0:
            outlier_warnings.append({"column": col, "outlier_count": n_out, "pct": round(n_out / len(vals) * 100, 2)})
            issues.append({"type": "outliers", "column": col, "detail": f"{n_out} outliers detected via IQR method", "severity": "low"})

    # ── 7. Potential ID columns ───────────────────────────────────────────
    id_candidates = []
    for col in df.columns:
        if _infer_semantic_type(df[col], col) == "identifier":
            id_candidates.append(col)
            recommendations.append({"action": "flag_as_id", "column": col, "reason": "Looks like an identifier column — exclude from ML features"})

    # ── 8. Date-like columns to convert ──────────────────────────────────
    date_candidates = []
    for col in df.select_dtypes(include="object").columns:
        if _infer_semantic_type(df[col], col) == "datetime":
            date_candidates.append(col)
            recommendations.append({"action": "convert_to_datetime", "column": col, "reason": "Column appears to contain dates — parse for time series analysis"})

    return {
        "missing_by_column":    missing_by_col,
        "duplicate_rows":       dup_count,
        "outlier_warnings":     outlier_warnings,
        "id_candidates":        id_candidates,
        "date_candidates":      date_candidates,
        "issues":               issues,
        "recommended_actions":  recommendations,
        "issue_count":          len(issues),
        "quality_score":        _compute_quality_score(df, dup_count, missing_by_col, issues),
    }


def _compute_quality_score(df, dup_count, missing_by_col, issues) -> int:
    """Simple 0–100 data quality score."""
    score   = 100
    n       = len(df)
    p       = len(df.columns)
    # Penalise for duplicates
    score  -= round(dup_count / max(n, 1) * 100 * 2)
    # Penalise for missing
    total_miss = sum(v["missing_count"] for v in missing_by_col.values())
    score  -= round(total_miss / max(n * p, 1) * 100 * 3)
    # Penalise for high-severity issues
    score  -= sum(5 for i in issues if i.get("severity") == "high")
    return max(0, min(100, score))


def _is_numeric_string(s: str) -> bool:
    try:
        float(s.replace(",", "").strip())
        return True
    except ValueError:
        return False
