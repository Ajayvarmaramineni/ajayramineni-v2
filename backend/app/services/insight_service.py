from __future__ import annotations
"""
services/insight_service.py
Rule-based plain-English insight generator (MVP).
Future: pass computed stats to an LLM for richer summaries.
"""

import pandas as pd


def generate_insights(
    df: pd.DataFrame,
    eda: dict,
    cleaning: dict,
    scope: dict,
) -> dict:
    """
    Generate top findings, warnings, and next-step suggestions
    from pre-computed EDA, cleaning, and scope results.
    """
    findings     = []
    warnings     = []
    next_steps   = []

    n = len(df)

    # ── Findings from group comparisons ──────────────────────────────────
    group_comps = eda.get("group_comparisons", [])
    findings.extend(_generate_comparative_insights(group_comps))

    # ── Findings from correlations ────────────────────────────────────────
    strong_pairs = eda.get("correlations", {}).get("strong_pairs", [])
    for pair in strong_pairs[:3]:
        direction = "positively" if pair["r"] > 0 else "negatively"
        findings.append({
            "type":    "correlation",
            "icon":    "link",
            "title":   f"{pair['col_a']} and {pair['col_b']} are strongly correlated",
            "detail":  f"Pearson r = {pair['r']} — these columns move {direction} together. Consider checking for multicollinearity if using both as features.",
        })

    # ── Findings from numeric summaries ──────────────────────────────────
    for col_stat in eda.get("numeric_summaries", []):
        skew = col_stat.get("skewness", 0)
        if abs(skew) > 2:
            direction = "right" if skew > 0 else "left"
            findings.append({
                "type":   "skewed_distribution",
                "icon":   "bar-chart",
                "title":  f"{col_stat['column']} has a heavily skewed distribution",
                "detail": f"Skewness = {skew:.2f} ({direction}-skewed). A log or square-root transform may improve model performance.",
            })

    # ── Findings from categorical summaries ──────────────────────────────
    for cat_stat in eda.get("categorical_summaries", []):
        top = cat_stat.get("top_categories", [])
        if top:
            top_count = top[0]["count"]
            top_pct   = round(top_count / n * 100, 1)
            if top_pct > 70:
                findings.append({
                    "type":   "class_dominance",
                    "icon":   "tag",
                    "title":  f"Most records in '{cat_stat['column']}' belong to one category",
                    "detail": f"'{top[0]['value']}' accounts for {top_pct}% of rows. Class imbalance may affect classification models.",
                })

    # ── Findings from time trends ─────────────────────────────────────────
    if eda.get("time_trend_data"):
        findings.append({
            "type":   "time_series",
            "icon":   "trending-up",
            "title":  "Time trend data detected",
            "detail": f"Date column found — trend analysis over time is available for {len(eda['time_trend_data'])} metric(s).",
        })

    # ── Warnings from outlier analysis ───────────────────────────────────
    for outlier in eda.get("outlier_analysis", []):
        pct = outlier.get("outlier_pct", 0)
        if pct > 5:
            col   = outlier.get("column", "")
            lower = outlier.get("lower_bound")
            upper = outlier.get("upper_bound")
            lower_str = f"{lower:.4g}" if isinstance(lower, (int, float)) else "—"
            upper_str = f"{upper:.4g}" if isinstance(upper, (int, float)) else "—"
            warnings.append({
                "type":   "outliers",
                "icon":   "alert-triangle",
                "title":  f"{col} contains {pct}% outliers",
                "detail": (
                    f"{outlier.get('outlier_count')} values fall outside the normal range "
                    f"[{lower_str}, {upper_str}] (IQR method). These may distort model performance."
                ),
            })

    # ── Warnings from cleaning ────────────────────────────────────────────
    for issue in cleaning.get("issues", []):
        if issue["severity"] in ("high", "medium"):
            warnings.append({
                "type":   issue["type"],
                "icon":   "alert-triangle",
                "title":  f"Data quality issue in '{issue['column']}'" if issue["column"] else "Data quality issue",
                "detail": issue["detail"],
            })

    if cleaning.get("duplicate_rows", 0) > 0:
        warnings.append({
            "type":   "duplicates",
            "icon":   "refresh",
            "title":  f"{cleaning['duplicate_rows']} duplicate rows detected",
            "detail": "Duplicate rows can bias model training and skew statistics. Removing them is recommended.",
        })

    if cleaning.get("quality_score", 100) < 60:
        warnings.append({
            "type":   "low_quality",
            "icon":   "alert-circle",
            "title":  "Overall data quality is low",
            "detail": f"Quality score: {cleaning['quality_score']}/100. Address missing values and duplicates before running ML models.",
        })

    # ── Next steps from scope ─────────────────────────────────────────────
    if scope.get("descriptive_analysis_possible", {}).get("possible"):
        next_steps.append({"icon": "clipboard", "action": "Review the EDA tab for distributions and correlations"})

    if scope.get("classification_possible", {}).get("possible"):
        targets = scope["classification_possible"].get("candidate_targets", [])
        label   = f" (target: {targets[0]})" if targets else ""
        next_steps.append({"icon": "target", "action": f"Run a classification model{label} — your data supports it"})

    if scope.get("regression_possible", {}).get("possible"):
        targets = scope["regression_possible"].get("candidate_targets", [])
        label   = f" (target: {targets[0]})" if targets else ""
        next_steps.append({"icon": "trending-up", "action": f"Run a regression model{label} — your data supports it"})

    if scope.get("clustering_possible", {}).get("possible"):
        next_steps.append({"icon": "users", "action": "Try K-Means clustering to discover natural groupings"})

    if scope.get("time_series_possible", {}).get("possible"):
        next_steps.append({"icon": "clock", "action": "Explore the trend charts — time series analysis is available"})

    if cleaning.get("recommended_actions"):
        next_steps.append({"icon": "wand", "action": "Apply the cleaning recommendations to improve data quality before modelling"})

    # ── Fallback if no findings ───────────────────────────────────────────
    if not findings:
        findings.append({
            "type":   "summary",
            "icon":   "check-circle",
            "title":  "Dataset looks clean",
            "detail": f"{n} rows and {len(df.columns)} columns loaded. No major anomalies detected.",
        })

    return {
        "top_findings":      findings[:6],
        "warnings":          warnings[:5],
        "suggested_next_steps": next_steps[:5],
        "insight_count":     len(findings) + len(warnings),
    }


def _generate_comparative_insights(group_comps: list) -> list:
    """
    Identify group differences > 10% as meaningful and generate natural language insights.
    """
    insights = []
    seen: set = set()
    for comp in group_comps:
        grouping_col = comp.get("grouping_col", "")
        group_a      = comp.get("group_a", "")
        group_b      = comp.get("group_b", "")
        numeric_col  = comp.get("numeric_col", "")
        mean_a       = comp.get("mean_a")
        mean_b       = comp.get("mean_b")
        if mean_a is None or mean_b is None or mean_a == 0:
            continue
        diff_pct = abs(mean_b - mean_a) / abs(mean_a) * 100
        if diff_pct <= 10:
            continue
        # Deduplicate by (grouping_col, numeric_col)
        key = (grouping_col, numeric_col)
        if key in seen:
            continue
        seen.add(key)
        direction = "higher" if mean_b > mean_a else "lower"
        mean_a_fmt = round(mean_a, 2)
        mean_b_fmt = round(mean_b, 2)
        insights.append({
            "type":   "group_difference",
            "icon":   "trending-up",
            "title":  f"{group_b} shows {round(diff_pct, 1)}% {direction} {numeric_col}",
            "detail": (
                f"Grouped by '{grouping_col}': {group_a} mean = {mean_a_fmt}, "
                f"{group_b} mean = {mean_b_fmt}. "
                f"Confidence: {'high' if diff_pct > 25 else 'moderate'}."
            ),
        })
    return insights[:5]
