from __future__ import annotations
"""
services/dashboard_service.py
Auto-generates dashboard widget configurations and pre-computed data
based on the structure of the uploaded dataset.
"""

import math
from datetime import datetime, timezone
from typing import Any

import numpy as np
import pandas as pd


# ── helpers ──────────────────────────────────────────────────────────────────

def _json_safe(obj: Any) -> Any:
    """Replace non-finite floats with None so JSON serialisation never fails."""
    if isinstance(obj, float):
        return None if not math.isfinite(obj) else obj
    if isinstance(obj, dict):
        return {k: _json_safe(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_json_safe(v) for v in obj]
    return obj


def _quality_score(df: pd.DataFrame) -> float:
    """Return a data-quality score in [0, 1]."""
    total_cells = df.shape[0] * df.shape[1]
    if total_cells == 0:
        return 1.0

    missing_ratio   = df.isnull().sum().sum() / total_cells
    duplicate_ratio = df.duplicated().sum() / max(len(df), 1)

    score = 1.0 - (missing_ratio * 0.7) - (duplicate_ratio * 0.3)
    return round(max(0.0, min(1.0, score)), 4)


# ── widget generators ────────────────────────────────────────────────────────

def _kpi_widget(df: pd.DataFrame) -> dict:
    total_cells  = df.shape[0] * df.shape[1]
    missing_pct  = round(df.isnull().sum().sum() / max(total_cells, 1) * 100, 1)
    return {
        "id":          "widget_kpi",
        "type":        "kpi",
        "title":       "Dataset Overview",
        "description": "High-level metrics for the uploaded dataset.",
        "columns":     [],
        "config": {
            "metrics": [
                {"label": "Total Rows",    "value": df.shape[0],         "icon": "rows"},
                {"label": "Total Columns", "value": df.shape[1],         "icon": "columns"},
                {"label": "Missing Data",  "value": f"{missing_pct}%",   "icon": "missing"},
            ],
        },
        "position": {"x": 0, "y": 0, "w": 12, "h": 2},
    }


def _distribution_widget(df: pd.DataFrame, col: str) -> dict:
    series   = df[col].dropna()
    # Use Sturges' rule for small datasets, capped at 20 bins for large ones
    n_bins   = min(20, max(5, int(1 + math.log2(max(len(series), 1)))))
    counts, edges = np.histogram(series, bins=n_bins)
    data = [
        {"bin": f"{edges[i]:.2g}–{edges[i+1]:.2g}", "count": int(counts[i])}
        for i in range(len(counts))
    ]
    return {
        "id":          f"widget_dist_{col}",
        "type":        "line",
        "title":       f"Distribution: {col}",
        "description": f"Frequency distribution for the numeric column \"{col}\".",
        "columns":     [col],
        "config":      {"data": data, "x_key": "bin", "y_key": "count", "color": "#a78bfa"},
        "position":    {"x": 0, "y": 2, "w": 6, "h": 4},
    }


def _bar_widget(df: pd.DataFrame, col: str) -> dict:
    counts = df[col].value_counts().head(10)
    data   = [{"name": str(k), "count": int(v)} for k, v in counts.items()]
    return {
        "id":          f"widget_bar_{col}",
        "type":        "bar",
        "title":       f"Top Values: {col}",
        "description": f"Most frequent values in the categorical column \"{col}\".",
        "columns":     [col],
        "config":      {"data": data, "x_key": "name", "y_key": "count", "color": "#38bdf8"},
        "position":    {"x": 6, "y": 2, "w": 6, "h": 4},
    }


def _heatmap_widget(df: pd.DataFrame, num_cols: list[str]) -> dict:
    corr_cols = num_cols[:6]  # Limit to 6 columns to keep computation fast
    corr    = df[corr_cols].corr()
    labels  = corr.columns.tolist()
    matrix  = [[round(float(corr.loc[r, c]), 3) for c in labels] for r in labels]
    return {
        "id":          "widget_heatmap",
        "type":        "heatmap",
        "title":       "Correlation Heatmap",
        "description": "Pairwise Pearson correlations between numeric columns.",
        "columns":     corr_cols,
        "config":      {"labels": labels, "matrix": matrix},
        "position":    {"x": 0, "y": 6, "w": 6, "h": 5},
    }


def _stats_table_widget(df: pd.DataFrame, num_cols: list[str]) -> dict:
    rows = []
    for col in num_cols[:12]:      # cap at 12 columns
        s = df[col].dropna()
        if s.empty:
            continue
        rows.append({
            "column": col,
            "mean":   round(float(s.mean()),   3),
            "median": round(float(s.median()), 3),
            "std":    round(float(s.std()),    3),
            "min":    round(float(s.min()),    3),
            "max":    round(float(s.max()),    3),
        })
    return {
        "id":          "widget_stats_table",
        "type":        "table",
        "title":       "Numeric Summary",
        "description": "Descriptive statistics for all numeric columns.",
        "columns":     num_cols[:12],
        "config":      {"rows": rows},
        "position":    {"x": 6, "y": 6, "w": 6, "h": 5},
    }


def _gauge_widget(df: pd.DataFrame) -> dict:
    score = _quality_score(df)
    pct   = round(score * 100, 1)
    if pct >= 80:
        rating, color = "Excellent", "#22c55e"
    elif pct >= 60:
        rating, color = "Good",      "#eab308"
    else:
        rating, color = "Needs Work", "#ef4444"
    return {
        "id":          "widget_gauge",
        "type":        "gauge",
        "title":       "Data Quality",
        "description": "Overall quality score based on completeness and uniqueness.",
        "columns":     [],
        "config":      {"score": pct, "rating": rating, "color": color},
        "position":    {"x": 0, "y": 11, "w": 12, "h": 3},
    }


# ── public API ───────────────────────────────────────────────────────────────

def generate_dashboard_config(df: pd.DataFrame) -> dict:
    """
    Analyse *df* and return a DashboardLayout dict with pre-computed widget data
    ready for the frontend to render without additional API calls.
    """
    # Sample large datasets to keep computation fast (statistically valid with 5K rows)
    if len(df) > 10000:
        df_process = df.sample(n=5000, random_state=42)
        print(f"📊 Sampling 5000 rows from {len(df)} total for dashboard generation")
    else:
        df_process = df

    num_cols = df_process.select_dtypes(include="number").columns.tolist()[:10]
    cat_cols = df_process.select_dtypes(include="object").columns.tolist()[:5]

    widgets: list[dict] = []

    # 1 — KPI card (always present; use original df for accurate row count)
    widgets.append(_kpi_widget(df))

    # 2 — Numeric distribution (first numeric col)
    if num_cols:
        widgets.append(_distribution_widget(df_process, num_cols[0]))

    # 3 — Categorical bar chart (first categorical col)
    if cat_cols:
        widgets.append(_bar_widget(df_process, cat_cols[0]))

    # 4 — Correlation heatmap (needs 3+ numeric cols)
    if len(num_cols) >= 3:
        try:
            widgets.append(_heatmap_widget(df_process, num_cols))
        except Exception as e:
            print(f"⚠️ Correlation calculation failed: {e}")

    # 5 — Stats table (needs at least one numeric col)
    if num_cols:
        widgets.append(_stats_table_widget(df_process, num_cols))

    # 6 — Data-quality gauge (always present)
    widgets.append(_gauge_widget(df_process))

    now = datetime.now(timezone.utc).isoformat()
    layout = {w["id"]: w["position"] for w in widgets}

    return _json_safe({
        "widgets":    widgets,
        "layout":     layout,
        "created_at": now,
        "updated_at": now,
    })
