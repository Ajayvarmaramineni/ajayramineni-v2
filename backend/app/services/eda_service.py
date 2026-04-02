from __future__ import annotations
"""
services/eda_service.py
Generates all EDA outputs: numeric stats, categorical summaries,
correlation matrix, distribution data, and time trend data.
"""

import math
import pandas as pd
import numpy as np
from scipy import stats as scipy_stats
from app.services.parser_service import _infer_semantic_type, _detect_date_columns


def _json_safe(obj):
    """
    Recursively replace any non-finite float (NaN, Inf, -Inf) with None
    so FastAPI's JSON encoder never chokes — which would kill the uvicorn worker.
    """
    if isinstance(obj, float):
        return None if not math.isfinite(obj) else obj
    if isinstance(obj, dict):
        return {k: _json_safe(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_json_safe(v) for v in obj]
    return obj


def run_eda(df: pd.DataFrame) -> dict:
    """Run full EDA and return chart-ready structured data."""
    num_cols  = df.select_dtypes(include="number").columns.tolist()
    cat_cols  = df.select_dtypes(include="object").columns.tolist()
    date_cols = _detect_date_columns(df)

    # NOTE: hypothesis tests (scipy) are computed via the dedicated
    # /hypothesis/{file_id} endpoint to avoid scipy SEGFAULT killing uvicorn.
    hyp = {"t_tests": [], "anova": [], "chi_square": [], "normality": []}

    result = {
        "numeric_summaries":    _numeric_summaries(df, num_cols),
        "categorical_summaries": _categorical_summaries(df, cat_cols),
        "correlations":         _correlation_matrix(df, num_cols),
        "distribution_data":    _distribution_data(df, num_cols),
        "time_trend_data":      _time_trend_data(df, date_cols, num_cols),
        "hypothesis_tests":     hyp,
        "column_type_counts":   {
            "numeric":     len(num_cols),
            "categorical": len(cat_cols),
            "datetime":    len(date_cols),
        },
        "outlier_analysis":      _json_safe(_detect_outliers(df, num_cols)),
        "group_comparisons":     _json_safe(_compute_group_comparisons(df, num_cols, cat_cols)),
        "categorical_patterns":  _json_safe(_analyze_categorical_patterns(df, cat_cols)),
    }
    # Sanitize the entire response: replace NaN/Inf with None before JSON serialization
    return _json_safe(result)


# ─── Numeric analysis ─────────────────────────────────────────────────────────

def _numeric_summaries(df: pd.DataFrame, cols: list) -> list:
    results = []
    for col in cols:
        s = df[col].dropna()
        if len(s) == 0:
            continue
        results.append({
            "column":  col,
            "count":   int(s.count()),
            "mean":    round(float(s.mean()), 4),
            "median":  round(float(s.median()), 4),
            "std":     round(float(s.std()), 4),
            "min":     round(float(s.min()), 4),
            "max":     round(float(s.max()), 4),
            "q1":      round(float(s.quantile(0.25)), 4),
            "q3":      round(float(s.quantile(0.75)), 4),
            "skewness": round(float(s.skew()), 4),
            "kurtosis": round(float(s.kurtosis()), 4),
        })
    return results


# ─── Categorical analysis ─────────────────────────────────────────────────────

def _categorical_summaries(df: pd.DataFrame, cols: list) -> list:
    results = []
    for col in cols:
        freq    = df[col].value_counts(dropna=True).head(15)
        results.append({
            "column":          col,
            "unique_count":    int(df[col].nunique(dropna=True)),
            "top_categories":  [{"value": str(k), "count": int(v)} for k, v in freq.items()],
            "missing_count":   int(df[col].isna().sum()),
        })
    return results


# ─── Correlation matrix ───────────────────────────────────────────────────────

def _correlation_matrix(df: pd.DataFrame, cols: list) -> dict:
    if len(cols) < 2:
        return {"columns": [], "matrix": []}
    corr = df[cols].corr().round(3)
    # Replace NaN with None so JSON serialization doesn't crash
    # (NaN is not valid JSON — it kills the uvicorn worker mid-response)
    raw = corr.values.tolist()
    matrix = [[None if (isinstance(v, float) and v != v) else v for v in row] for row in raw]
    return {
        "columns": cols,
        "matrix":  matrix,
        # Flat list of strong pairs for highlight cards
        "strong_pairs": _strong_pairs(corr, cols),
    }


def _strong_pairs(corr: pd.DataFrame, cols: list, threshold: float = 0.7) -> list:
    pairs = []
    for i, a in enumerate(cols):
        for j, b in enumerate(cols):
            if j <= i:
                continue
            v = corr.loc[a, b]
            if abs(v) >= threshold:
                pairs.append({"col_a": a, "col_b": b, "r": round(float(v), 3)})
    return sorted(pairs, key=lambda x: abs(x["r"]), reverse=True)[:5]


# ─── Distribution data (histogram bins) ──────────────────────────────────────

def _distribution_data(df: pd.DataFrame, cols: list, bins: int = 20) -> list:
    results = []
    for col in cols[:8]:          # cap at 8 columns for performance
        vals = df[col].dropna()
        if len(vals) == 0:
            continue
        counts, edges = np.histogram(vals, bins=bins)
        results.append({
            "column":    col,
            "bin_edges": [round(float(e), 4) for e in edges.tolist()],
            "counts":    counts.tolist(),
        })
    return results


# ─── Time trend data ──────────────────────────────────────────────────────────

def _time_trend_data(df: pd.DataFrame, date_cols: list, num_cols: list) -> list:
    """
    For each detected date column, aggregate numeric targets by month.
    Returns chart-ready [{date, value}] arrays.
    """
    if not date_cols or not num_cols:
        return []

    trends = []
    for dcol in date_cols[:1]:          # use first date column for MVP
        try:
            tmp = df.copy()
            tmp[dcol] = pd.to_datetime(tmp[dcol], errors="coerce")
            tmp = tmp.dropna(subset=[dcol])
            if tmp.empty:
                continue
            tmp["_period"] = tmp[dcol].dt.to_period("M").astype(str)

            for ncol in num_cols[:3]:   # trend for top-3 numeric cols
                agg = tmp.groupby("_period")[ncol].mean().reset_index()
                agg.columns = ["period", "value"]
                trends.append({
                    "date_column":    dcol,
                    "value_column":   ncol,
                    "aggregation":    "monthly_mean",
                    "data":           [
                        {"period": r["period"], "value": None if (v != v) else round(float(v), 4)}
                        for _, r in agg.iterrows()
                        for v in (float(r["value"]),)
                    ],
                })
        except Exception:
            continue

    return trends


# ─── Hypothesis tests ─────────────────────────────────────────────────────────

def _hypothesis_tests(df: pd.DataFrame, num_cols: list, cat_cols: list) -> dict:
    """
    Run a suite of hypothesis tests and return structured results.
    - Independent t-tests: for each binary categorical × numeric pair
    - One-way ANOVA:       for each multi-class categorical × numeric pair (≤6 groups)
    - Chi-square:          for each categorical pair (≤10 unique values each)
    - Normality: Shapiro-Wilk (≤5000 rows) or Kolmogorov-Smirnov (>5000 rows)
    """
    results: dict = {
        "t_tests":    [],
        "anova":      [],
        "chi_square": [],
        "normality":  [],
    }

    # ── Normality tests ──
    # Shapiro-Wilk for small samples (≤5000), K-S test for large samples
    for col in num_cols[:8]:
        vals = df[col].dropna()
        if len(vals) < 3:
            continue
        try:
            if len(vals) <= 5000:
                stat, p = scipy_stats.shapiro(vals)
                test_name = "Shapiro-Wilk"
            else:
                sample = vals.sample(2000, random_state=42) if len(vals) > 2000 else vals
                mean, std = float(sample.mean()), float(sample.std())
                if std == 0:
                    continue
                stat, p = scipy_stats.kstest(sample, "norm", args=(mean, std))
                test_name = "Kolmogorov-Smirnov"
            results["normality"].append({
                "column":    col,
                "test":      test_name,
                "statistic": round(float(stat), 4),
                "p_value":   round(float(p), 4),
                "normal":    p > 0.05,
                "interpretation": "Likely normal (p > 0.05)" if p > 0.05 else "Not normal (p ≤ 0.05)",
            })
        except Exception:
            continue

    # ── T-tests & ANOVA: each cat col vs each num col ──
    for cat in cat_cols[:6]:
        groups = df[cat].dropna().unique()
        if len(groups) < 2 or len(groups) > 6:
            continue
        group_series = [df[df[cat] == g] for g in groups]

        for num in num_cols[:6]:
            group_vals = [g[num].dropna().values for g in group_series]
            group_vals = [v for v in group_vals if len(v) >= 2]
            if len(group_vals) < 2:
                continue

            if len(group_vals) == 2:
                # Independent t-test
                try:
                    stat, p = scipy_stats.ttest_ind(group_vals[0], group_vals[1], equal_var=False)
                    results["t_tests"].append({
                        "group_col":   cat,
                        "value_col":   num,
                        "group_a":     str(groups[0]),
                        "group_b":     str(groups[1]),
                        "t_statistic": round(float(stat), 4),
                        "p_value":     round(float(p), 4),
                        "significant": p < 0.05,
                        "interpretation": (
                            f"Significant difference in {num} between {groups[0]} and {groups[1]} (p={p:.3f})"
                            if p < 0.05
                            else f"No significant difference in {num} between groups (p={p:.3f})"
                        ),
                    })
                except Exception:
                    continue
            else:
                # One-way ANOVA
                try:
                    stat, p = scipy_stats.f_oneway(*group_vals)
                    results["anova"].append({
                        "group_col":   cat,
                        "value_col":   num,
                        "groups":      [str(g) for g in groups],
                        "f_statistic": round(float(stat), 4),
                        "p_value":     round(float(p), 4),
                        "significant": p < 0.05,
                        "interpretation": (
                            f"Significant difference in {num} across {cat} groups (p={p:.3f})"
                            if p < 0.05
                            else f"No significant difference in {num} across groups (p={p:.3f})"
                        ),
                    })
                except Exception:
                    continue

    # ── Chi-square: categorical pairs ──
    eligible = [c for c in cat_cols if df[c].nunique() <= 10][:5]
    for i, col_a in enumerate(eligible):
        for col_b in eligible[i+1:]:
            try:
                ct = pd.crosstab(df[col_a], df[col_b])
                if ct.shape[0] < 2 or ct.shape[1] < 2:
                    continue
                chi2, p, dof, _ = scipy_stats.chi2_contingency(ct)
                results["chi_square"].append({
                    "col_a":      col_a,
                    "col_b":      col_b,
                    "chi2":       round(float(chi2), 4),
                    "p_value":    round(float(p), 4),
                    "dof":        int(dof),
                    "significant": p < 0.05,
                    "interpretation": (
                        f"{col_a} and {col_b} are dependent (p={p:.3f})"
                        if p < 0.05
                        else f"{col_a} and {col_b} appear independent (p={p:.3f})"
                    ),
                })
            except Exception:
                continue

    # Cap to avoid overwhelming the UI
    results["t_tests"]    = results["t_tests"][:8]
    results["anova"]      = results["anova"][:6]
    results["chi_square"] = results["chi_square"][:6]

    return results


# ─── Outlier detection (IQR method) ──────────────────────────────────────────

def _detect_outliers(df: pd.DataFrame, cols: list) -> list:
    """
    Detect outliers in numeric columns using the IQR method.
    Returns only columns that have at least one outlier.
    """
    results = []
    for col in cols:
        s = df[col].dropna()
        if len(s) < 4:
            continue
        q1  = float(s.quantile(0.25))
        q3  = float(s.quantile(0.75))
        iqr = q3 - q1
        if iqr == 0:
            continue
        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr
        outlier_mask  = (s < lower) | (s > upper)
        outlier_count = int(outlier_mask.sum())
        if outlier_count == 0:
            continue
        results.append({
            "column":        col,
            "outlier_count": outlier_count,
            "outlier_pct":   round(outlier_count / len(s) * 100, 2),
            "lower_bound":   round(lower, 4),
            "upper_bound":   round(upper, 4),
            "q1":            round(q1, 4),
            "q3":            round(q3, 4),
        })
    return results


# ─── Group comparisons ────────────────────────────────────────────────────────

def _compute_group_comparisons(df: pd.DataFrame, num_cols: list, cat_cols: list) -> list:
    """
    For each binary categorical column compare all numeric columns between the two groups.
    Filters out groups with fewer than 3 observations.
    """
    results = []
    for cat in cat_cols:
        groups = df[cat].dropna().unique()
        if len(groups) != 2:
            continue
        group_a_label = str(groups[0])
        group_b_label = str(groups[1])
        mask_a = df[cat] == groups[0]
        mask_b = df[cat] == groups[1]
        for num in num_cols:
            try:
                vals_a = df.loc[mask_a, num].dropna()
                vals_b = df.loc[mask_b, num].dropna()
                if len(vals_a) < 3 or len(vals_b) < 3:
                    continue
                results.append({
                    "grouping_col": cat,
                    "group_a":      group_a_label,
                    "group_b":      group_b_label,
                    "numeric_col":  num,
                    "mean_a":       round(float(vals_a.mean()), 4),
                    "mean_b":       round(float(vals_b.mean()), 4),
                    "median_a":     round(float(vals_a.median()), 4),
                    "median_b":     round(float(vals_b.median()), 4),
                    "std_a":        round(float(vals_a.std()), 4),
                    "std_b":        round(float(vals_b.std()), 4),
                    "count_a":      int(len(vals_a)),
                    "count_b":      int(len(vals_b)),
                })
            except Exception:
                continue
    return results


# ─── Categorical pattern analysis ─────────────────────────────────────────────

def _analyze_categorical_patterns(df: pd.DataFrame, cat_cols: list) -> list:
    """
    Create cross-tabulations between categorical column pairs.
    Limited to first 5 columns for performance.
    """
    results = []
    eligible = cat_cols[:5]
    for i, col_a in enumerate(eligible):
        for col_b in eligible[i + 1:]:
            try:
                unique_a = int(df[col_a].nunique(dropna=True))
                unique_b = int(df[col_b].nunique(dropna=True))
                total_combinations = unique_a * unique_b
                results.append({
                    "col_a":              col_a,
                    "col_b":              col_b,
                    "unique_a":           unique_a,
                    "unique_b":           unique_b,
                    "total_combinations": total_combinations,
                })
            except Exception:
                continue
    return results
