from __future__ import annotations
"""
services/scope_service.py
Determines what types of analysis are realistically feasible.
This is the core differentiator of Statlab — it explains WHY something
is or isn't possible, rates confidence, surfaces warnings, and gives
actionable suggestions to unlock blocked analyses.
"""

import pandas as pd
from app.services.parser_service import _infer_semantic_type, _detect_date_columns

MIN_ROWS_ML          = 100
MIN_ROWS_TIME_SERIES = 30
MIN_NUMERIC_FEATURES = 2
MIN_ROWS_PER_CLASS   = 10
MAX_CLASS_IMBALANCE  = 20   # majority class can be at most 20x the minority


def evaluate_scope(df: pd.DataFrame) -> dict:
    n         = len(df)
    num_cols  = df.select_dtypes(include="number").columns.tolist()
    cat_cols  = df.select_dtypes(include="object").columns.tolist()
    date_cols = _detect_date_columns(df)

    # Exclude ID / pure-identifier columns from usable features
    feature_num = [c for c in num_cols if _infer_semantic_type(df[c], c) not in ("identifier",)]
    feature_cat = [c for c in cat_cols if _infer_semantic_type(df[c], c) not in ("identifier", "datetime")]

    descriptive  = _check_descriptive(df, n, feature_num, feature_cat)
    regression   = _check_regression(df, n, feature_num)
    classif      = _check_classification(df, n, feature_num, feature_cat)
    clustering   = _check_clustering(n, feature_num)
    time_series  = _check_time_series(df, n, date_cols, feature_num)

    # Collect all candidate targets for the top-level summary
    numeric_candidates  = regression.get("candidate_targets", [])
    category_candidates = classif.get("candidate_targets", [])

    scope_results = {
        "descriptive_analysis_possible": descriptive,
        "regression_possible":           regression,
        "classification_possible":       classif,
        "clustering_possible":           clustering,
        "time_series_possible":          time_series,
        "data_quality_score":            _quality_score(df),
        "dataset_size_label":            _size_label(n),
        "feature_count":                 len(feature_num) + len(feature_cat),
        "numeric_target_candidates":     numeric_candidates,
        "categorical_target_candidates": category_candidates,
        "date_columns_found":            date_cols,
    }
    scope_results["suggested_pipeline"] = _generate_pipeline(scope_results)
    return scope_results


# ─── Confidence helper ────────────────────────────────────────────────────────

def _confidence(possible: bool, n: int, feature_count: int, warnings: list) -> str:
    """Rate confidence as high / medium / low / none."""
    if not possible:
        return "none"
    warning_count = len(warnings)
    if n >= 500 and feature_count >= 4 and warning_count == 0:
        return "high"
    if n >= MIN_ROWS_ML and feature_count >= MIN_NUMERIC_FEATURES and warning_count <= 1:
        return "medium"
    return "low"


# ─── Individual checks ────────────────────────────────────────────────────────

def _check_descriptive(df, n, num_cols, cat_cols) -> dict:
    total_features = len(num_cols) + len(cat_cols)
    possible = n > 0 and total_features >= 2
    warnings: list[str] = []

    if n > 0 and n < 30:
        warnings.append("Very few rows — statistics may not be representative")
    if total_features > 50:
        warnings.append("Large column count — consider focusing on key variables")

    missing: list[str] = []
    if not possible:
        missing.append("At least 2 non-ID columns required")

    reasoning = (
        f"Dataset has {n:,} rows and {total_features} usable columns — "
        "full descriptive statistics, distributions, and profiling are available."
        if possible else
        "Dataset appears empty or has too few meaningful columns for descriptive analysis."
    )

    suggestions: list[str] = []
    if not possible:
        suggestions.append("Ensure the file has at least 2 data columns with non-identifier content")

    return {
        "possible":              possible,
        "confidence":            _confidence(possible, n, total_features, warnings),
        "reasoning":             reasoning,
        "what_supports":         f"{total_features} usable columns, {n:,} rows" if possible else "",
        "what_is_missing":       ", ".join(missing) if missing else "",
        "missing_requirements":  missing,
        "warnings":              warnings,
        "actionable_suggestions": suggestions,
        "candidate_targets":     [],
    }


def _check_regression(df, n, num_cols) -> dict:
    candidates = [c for c in num_cols if df[c].nunique() > 10]
    possible   = n >= MIN_ROWS_ML and len(candidates) >= 1 and len(num_cols) >= MIN_NUMERIC_FEATURES

    warnings: list[str] = []
    # Check missing-value rate on numeric columns
    high_miss = [c for c in num_cols if df[c].isna().mean() > 0.2]
    if high_miss:
        warnings.append(f"High missing values in: {', '.join(high_miss[:3])} — imputation recommended before modelling")
    if len(num_cols) == MIN_NUMERIC_FEATURES:
        warnings.append("Only the minimum number of numeric features — model may be underpowered")
    if n < 500:
        warnings.append(f"Small dataset ({n} rows) — model generalisation may be limited")

    missing: list[str] = []
    if n < MIN_ROWS_ML:
        missing.append(f"Need at least {MIN_ROWS_ML} rows (have {n})")
    if len(candidates) < 1:
        missing.append("Need a continuous numeric target column (high cardinality)")
    if len(num_cols) < MIN_NUMERIC_FEATURES:
        missing.append(f"Need at least {MIN_NUMERIC_FEATURES} numeric feature columns (have {len(num_cols)})")

    reasoning = (
        f"Found {len(candidates)} continuous numeric target candidate(s) across {len(num_cols)} numeric features with {n:,} rows."
        if possible else
        "Insufficient numeric columns or rows to build a regression model."
    )

    suggestions: list[str] = []
    if n < MIN_ROWS_ML:
        suggestions.append(f"Collect more data — at least {MIN_ROWS_ML} rows needed (you have {n})")
    if len(candidates) < 1:
        suggestions.append("Add a numeric column with many distinct values to use as the prediction target")
    if len(num_cols) < MIN_NUMERIC_FEATURES:
        suggestions.append("Add more numeric columns to use as predictor features")

    return {
        "possible":               possible,
        "confidence":             _confidence(possible, n, len(num_cols), warnings),
        "reasoning":              reasoning,
        "what_supports":          f"{len(candidates)} target candidate(s), {len(num_cols)} numeric columns, {n:,} rows" if possible else "",
        "what_is_missing":        ", ".join(missing) if missing else "",
        "missing_requirements":   missing,
        "warnings":               warnings,
        "actionable_suggestions": suggestions,
        "candidate_targets":      candidates[:5],
    }


def _check_classification(df, n, num_cols, cat_cols) -> dict:
    cat_targets = []
    imbalance_warnings: list[str] = []

    for col in cat_cols:
        n_classes = df[col].nunique(dropna=True)
        if 2 <= n_classes <= 20:
            counts   = df[col].value_counts(dropna=True)
            min_c    = counts.min()
            max_c    = counts.max()
            imb_ratio = max_c / max(min_c, 1)
            imbalance_ok = imb_ratio <= MAX_CLASS_IMBALANCE
            per_class_ok = min_c >= MIN_ROWS_PER_CLASS
            if not imbalance_ok:
                imbalance_warnings.append(f"'{col}' has a {imb_ratio:.0f}:1 class imbalance")
            cat_targets.append({
                "column":       col,
                "n_classes":    n_classes,
                "imbalance_ok": bool(imbalance_ok),
                "per_class_ok": bool(per_class_ok),
            })

    # Also check numeric cols with low cardinality (binary / ordinal labels)
    for col in num_cols:
        n_classes = df[col].nunique(dropna=True)
        if 2 <= n_classes <= 10:
            cat_targets.append({
                "column":       col,
                "n_classes":    n_classes,
                "imbalance_ok": True,
                "per_class_ok": True,
            })

    good_targets = [t for t in cat_targets if t["imbalance_ok"] and t["per_class_ok"]]
    features_ok  = len(num_cols) >= MIN_NUMERIC_FEATURES
    size_ok      = n >= MIN_ROWS_ML
    possible     = len(good_targets) > 0 and features_ok and size_ok

    warnings: list[str] = list(imbalance_warnings)
    if len(cat_cols) > 0:
        too_many = [col for col in cat_cols if df[col].nunique() > 50]
        if too_many:
            warnings.append(f"Columns with very high cardinality detected ({', '.join(too_many[:2])}) — unlikely to be useful targets")
    if n < 500 and possible:
        warnings.append(f"Small dataset ({n} rows) — cross-validation strongly recommended")

    missing: list[str] = []
    if not good_targets:
        missing.append("Need a categorical column with 2–20 balanced classes")
    if not features_ok:
        missing.append(f"Need at least {MIN_NUMERIC_FEATURES} numeric feature columns (have {len(num_cols)})")
    if not size_ok:
        missing.append(f"Need at least {MIN_ROWS_ML} rows (have {n})")

    reasoning = (
        f"Found {len(good_targets)} suitable classification target(s) with {len(num_cols)} numeric features across {n:,} rows."
        if possible else
        "No suitable classification target found, or insufficient features / rows."
    )

    suggestions: list[str] = []
    if not good_targets:
        suggestions.append("Add a categorical column with 2–20 well-distributed class labels")
    if not features_ok:
        suggestions.append("Add more numeric columns to use as predictor features")
    if not size_ok:
        suggestions.append(f"Collect at least {MIN_ROWS_ML} labelled rows")
    if imbalance_warnings:
        suggestions.append("Use oversampling (SMOTE) or class-weight balancing to handle imbalanced targets")

    return {
        "possible":               possible,
        "confidence":             _confidence(possible, n, len(num_cols), warnings),
        "reasoning":              reasoning,
        "what_supports":          f"{len(good_targets)} target candidate(s), {len(num_cols)} numeric features, {n:,} rows" if possible else "",
        "what_is_missing":        ", ".join(missing) if missing else "",
        "missing_requirements":   missing,
        "warnings":               warnings,
        "actionable_suggestions": suggestions,
        "candidate_targets":      [t["column"] for t in good_targets[:5]],
    }


def _check_clustering(n, num_cols) -> dict:
    possible = n >= MIN_ROWS_ML and len(num_cols) >= MIN_NUMERIC_FEATURES

    warnings: list[str] = []
    if len(num_cols) < 4 and possible:
        warnings.append("Few numeric features — clustering results may not be meaningful")
    if n > 50_000:
        warnings.append("Large dataset — consider mini-batch K-Means or HDBSCAN for performance")

    missing: list[str] = []
    if n < MIN_ROWS_ML:
        missing.append(f"Need at least {MIN_ROWS_ML} rows (have {n})")
    if len(num_cols) < MIN_NUMERIC_FEATURES:
        missing.append(f"Need at least {MIN_NUMERIC_FEATURES} numeric columns (have {len(num_cols)})")

    reasoning = (
        f"{len(num_cols)} numeric columns and {n:,} rows available — K-Means, DBSCAN, or hierarchical clustering are feasible."
        if possible else
        "Not enough numeric columns or rows for meaningful clustering."
    )

    suggestions: list[str] = []
    if n < MIN_ROWS_ML:
        suggestions.append(f"Collect at least {MIN_ROWS_ML} rows for reliable cluster detection")
    if len(num_cols) < MIN_NUMERIC_FEATURES:
        suggestions.append("Add more numeric columns — clustering relies on distance between numeric values")

    return {
        "possible":               possible,
        "confidence":             _confidence(possible, n, len(num_cols), warnings),
        "reasoning":              reasoning,
        "what_supports":          f"{len(num_cols)} numeric columns, {n:,} rows" if possible else "",
        "what_is_missing":        ", ".join(missing) if missing else "",
        "missing_requirements":   missing,
        "warnings":               warnings,
        "actionable_suggestions": suggestions,
        "candidate_targets":      [],
    }


def _check_time_series(df, n, date_cols, num_cols) -> dict:
    has_dates  = len(date_cols) > 0
    has_target = len(num_cols) >= 1
    size_ok    = n >= MIN_ROWS_TIME_SERIES
    possible   = has_dates and has_target and size_ok

    warnings: list[str] = []
    if has_dates and possible:
        # Check for potential duplicate timestamps (proxy: check one date col)
        for dc in date_cols[:1]:
            try:
                parsed = pd.to_datetime(df[dc], errors="coerce")
                dup_rate = parsed.dropna().duplicated().mean()
                if dup_rate > 0.1:
                    warnings.append(f"'{dc}' has ~{dup_rate:.0%} duplicate timestamps — aggregation may be required")
                # Check for irregular intervals
                diffs = parsed.dropna().sort_values().diff().dropna()
                if diffs.std() / max(diffs.mean(), pd.Timedelta(seconds=1)) > 0.5:
                    warnings.append(f"Irregular time intervals detected in '{dc}' — consider resampling")
            except Exception:
                pass
    if n < 100 and possible:
        warnings.append(f"Short time series ({n} points) — forecasting accuracy may be limited")

    missing: list[str] = []
    if not has_dates:
        missing.append("Need a parseable date or timestamp column")
    if not has_target:
        missing.append("Need at least one numeric measurement column to forecast")
    if not size_ok:
        missing.append(f"Need at least {MIN_ROWS_TIME_SERIES} rows for trend analysis (have {n})")

    reasoning = (
        f"Date column(s) found ({', '.join(date_cols)}) with {n:,} records — time trend, forecasting, and seasonality analysis are available."
        if possible else
        "No parseable date column detected, or insufficient rows for time-series analysis."
    )

    suggestions: list[str] = []
    if not has_dates:
        suggestions.append("Add a date or timestamp column (ISO format YYYY-MM-DD recommended)")
    if not has_target:
        suggestions.append("Add a numeric column representing the metric you want to track over time")
    if not size_ok:
        suggestions.append(f"Collect at least {MIN_ROWS_TIME_SERIES} time-ordered data points")

    return {
        "possible":               possible,
        "confidence":             _confidence(possible, n, len(num_cols), warnings),
        "reasoning":              reasoning,
        "what_supports":          f"Date columns: {', '.join(date_cols)}, {n:,} records" if possible else "",
        "what_is_missing":        ", ".join(missing) if missing else "",
        "missing_requirements":   missing,
        "warnings":               warnings,
        "actionable_suggestions": suggestions,
        "candidate_targets":      [],
        "date_columns_found":     date_cols,
    }


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _quality_score(df: pd.DataFrame) -> int:
    miss  = df.isna().mean().mean() * 100
    dups  = df.duplicated().mean() * 100
    return max(0, min(100, round(100 - miss * 3 - dups * 2)))


def _size_label(n: int) -> str:
    if n < 500:    return "Very Small"
    if n < 2000:   return "Small"
    if n < 10000:  return "Medium"
    if n < 50000:  return "Large"
    return "Very Large"


# ─── Suggested pipeline generator ─────────────────────────────────────────────

def _generate_pipeline(scope: dict) -> list[dict]:
    """
    Build a linear suggested workflow based on feasibility results.
    Each step has: id, label, description, icon, status, category, tools.
    status: "ready" | "recommended" | "optional" | "blocked"
    """

    desc_ok  = scope["descriptive_analysis_possible"].get("possible", False)
    reg_ok   = scope["regression_possible"].get("possible", False)
    cls_ok   = scope["classification_possible"].get("possible", False)
    clus_ok  = scope["clustering_possible"].get("possible", False)
    ts_ok    = scope["time_series_possible"].get("possible", False)

    any_ml   = reg_ok or cls_ok or clus_ok or ts_ok

    steps: list[dict] = []

    # ── Step 1: Always — Data Ingestion ───────────────────────────────────────
    steps.append({
        "id":          "ingest",
        "label":       "Data Ingestion",
        "description": "Load your CSV or Excel file into the analysis pipeline.",
        "icon":        "Upload",
        "status":      "ready",
        "category":    "source",
        "tools":       ["pandas", "openpyxl"],
    })

    # ── Step 2: Always — Data Cleaning ────────────────────────────────────────
    steps.append({
        "id":          "clean",
        "label":       "Data Cleaning",
        "description": "Fix missing values, remove duplicates, standardise types.",
        "icon":        "Sparkles",
        "status":      "ready",
        "category":    "processing",
        "tools":       ["pandas", "numpy"],
    })

    # ── Step 3: EDA (if descriptive is feasible) ──────────────────────────────
    steps.append({
        "id":          "eda",
        "label":       "Exploratory Analysis",
        "description": "Distributions, correlations, outliers, and summary stats.",
        "icon":        "BarChart2",
        "status":      "ready" if desc_ok else "blocked",
        "category":    "analysis",
        "tools":       ["pandas", "matplotlib", "seaborn"],
    })

    # ── Step 4: Time resampling (only if time series) ─────────────────────────
    if ts_ok:
        steps.append({
            "id":          "resample",
            "label":       "Time Resampling",
            "description": "Align timestamps, fill gaps, and set a consistent frequency.",
            "icon":        "Clock",
            "status":      "recommended",
            "category":    "processing",
            "tools":       ["pandas"],
        })

    # ── Step 5: Feature engineering (if any ML is feasible) ──────────────────
    if any_ml:
        steps.append({
            "id":          "features",
            "label":       "Feature Engineering",
            "description": "Encode categoricals, scale numerics, create derived features.",
            "icon":        "Wrench",
            "status":      "recommended",
            "category":    "processing",
            "tools":       ["scikit-learn", "pandas"],
        })

    # ── Step 6: ML model — pick the best feasible analysis ────────────────────
    if reg_ok:
        steps.append({
            "id":          "model",
            "label":       "Regression Model",
            "description": "Train a model to predict a continuous numeric target.",
            "icon":        "TrendingUp",
            "status":      "ready",
            "category":    "intelligence",
            "tools":       ["scikit-learn", "xgboost"],
        })
    elif cls_ok:
        steps.append({
            "id":          "model",
            "label":       "Classification Model",
            "description": "Train a model to predict a categorical or binary outcome.",
            "icon":        "Target",
            "status":      "ready",
            "category":    "intelligence",
            "tools":       ["scikit-learn", "xgboost"],
        })
    elif clus_ok:
        steps.append({
            "id":          "model",
            "label":       "Clustering",
            "description": "Discover hidden groupings in your data without labels.",
            "icon":        "Layers",
            "status":      "ready",
            "category":    "intelligence",
            "tools":       ["scikit-learn"],
        })
    elif ts_ok:
        steps.append({
            "id":          "model",
            "label":       "Forecasting Model",
            "description": "Model trends and seasonality to predict future values.",
            "icon":        "TrendingUp",
            "status":      "ready",
            "category":    "intelligence",
            "tools":       ["statsmodels", "prophet"],
        })
    else:
        # No ML feasible — suggest it as blocked
        steps.append({
            "id":          "model",
            "label":       "ML Model",
            "description": "Not yet feasible — see Scope tab for what is missing.",
            "icon":        "BrainCircuit",
            "status":      "blocked",
            "category":    "intelligence",
            "tools":       ["scikit-learn"],
        })

    # ── Step 7: Evaluation (only if a real ML model is feasible) ─────────────
    if any_ml and not (not reg_ok and not cls_ok and not clus_ok and not ts_ok):
        steps.append({
            "id":          "evaluate",
            "label":       "Model Evaluation",
            "description": "Measure accuracy, F1, RMSE, silhouette score, etc.",
            "icon":        "CheckSquare",
            "status":      "recommended",
            "category":    "intelligence",
            "tools":       ["scikit-learn", "matplotlib"],
        })

    # ── Step 8: Always — Output ───────────────────────────────────────────────
    steps.append({
        "id":          "output",
        "label":       "Report / Export",
        "description": "Export findings as a report, notebook, or dashboard.",
        "icon":        "FileText",
        "status":      "optional",
        "category":    "output",
        "tools":       ["jupyter", "plotly", "pandas"],
    })

    return steps
