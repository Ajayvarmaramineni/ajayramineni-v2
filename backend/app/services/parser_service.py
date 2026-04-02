from __future__ import annotations
"""
services/parser_service.py
Parses CSV and XLSX files into pandas DataFrames.
Builds dataset-level and column-level summaries.
"""

import pandas as pd
from fastapi import HTTPException


# ─── File parsing ─────────────────────────────────────────────────────────────

def parse_file(file_path: str, filename: str) -> pd.DataFrame:
    """Parse a CSV, XLSX, XLS, or JSON file into a DataFrame."""
    ext = filename.rsplit(".", 1)[-1].lower()
    try:
        if ext == "csv":
            df = pd.read_csv(file_path, low_memory=False)
        elif ext in ("xlsx", "xls"):
            df = pd.read_excel(file_path)
        elif ext == "json":
            # Support both records-oriented and other common JSON shapes
            df = pd.read_json(file_path)
            # Flatten one level if the JSON is a dict of columns → lists
            if not isinstance(df, pd.DataFrame):
                raise ValueError("JSON must be tabular (array of objects or columnar dict).")
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: .{ext}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse file: {str(e)}")

    if df.empty:
        raise HTTPException(status_code=422, detail="The uploaded file is empty.")

    return df


# ─── Dataset-level summary ────────────────────────────────────────────────────

def build_dataset_summary(df: pd.DataFrame, record: dict) -> dict:
    """High-level summary cards for the Overview tab."""
    num_cols = df.select_dtypes(include="number").columns.tolist()
    cat_cols = df.select_dtypes(include="object").columns.tolist()
    date_cols = _detect_date_columns(df)

    return {
        "row_count":         len(df),
        "column_count":      len(df.columns),
        "numeric_columns":   len(num_cols),
        "categorical_columns": len(cat_cols),
        "date_columns":      len(date_cols),
        "total_missing":     int(df.isna().sum().sum()),
        "missing_pct":       round(df.isna().mean().mean() * 100, 2),
        "duplicate_rows":    int(df.duplicated().sum()),
        "memory_usage_kb":   round(df.memory_usage(deep=True).sum() / 1024, 1),
    }


# ─── Column-level summary ─────────────────────────────────────────────────────

def build_column_summary(df: pd.DataFrame) -> list[dict]:
    """Per-column type, missing count, and cardinality."""
    summaries = []
    for col in df.columns:
        dtype    = str(df[col].dtype)
        n_miss   = int(df[col].isna().sum())
        n_unique = int(df[col].nunique(dropna=True))
        sample   = df[col].dropna().head(3).tolist()
        inferred = _infer_semantic_type(df[col], col)

        summaries.append({
            "column":        col,
            "dtype":         dtype,
            "semantic_type": inferred,
            "missing_count": n_miss,
            "missing_pct":   round(n_miss / len(df) * 100, 2),
            "unique_count":  n_unique,
            "sample_values": [str(v) for v in sample],
        })
    return summaries


# ─── Helpers ──────────────────────────────────────────────────────────────────

ID_HINTS    = ["id", "uuid", "key", "index", "code", "no", "_id", "number"]
DATE_HINTS  = ["date", "time", "timestamp", "created", "updated", "at", "year", "month", "day"]


def _infer_semantic_type(series: pd.Series, col_name: str) -> str:
    """Guess the semantic role of a column."""
    col_lower = col_name.lower()
    if any(h in col_lower for h in ID_HINTS):
        return "identifier"
    if any(h in col_lower for h in DATE_HINTS):
        return "datetime"
    if pd.api.types.is_numeric_dtype(series):
        if series.nunique() <= 15:
            return "categorical_numeric"
        return "numeric"
    try:
        pd.to_datetime(series.dropna().head(20))
        return "datetime"
    except Exception:
        pass
    if series.nunique() / max(len(series.dropna()), 1) < 0.05:
        return "categorical"
    return "text"


def _detect_date_columns(df: pd.DataFrame) -> list[str]:
    """Return list of columns that look like date/time."""
    result = []
    for col in df.columns:
        if _infer_semantic_type(df[col], col) == "datetime":
            result.append(col)
    return result
