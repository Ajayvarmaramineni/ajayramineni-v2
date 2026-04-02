from __future__ import annotations
"""
routes/analyze.py — POST /analyze/{file_id}
Runs summary profiling on the uploaded dataset.
Returns dataset_summary, column_summary, missing_value_summary, duplicate_summary.
"""

from fastapi import APIRouter, HTTPException
from app.services.file_service import FILE_STORE
from app.services.parser_service import build_column_summary, build_dataset_summary

router = APIRouter()


@router.post("/{file_id}")
def analyze_dataset(file_id: str):
    """Run full profiling on the dataset and return structured summary."""
    record = FILE_STORE.get(file_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"file_id '{file_id}' not found. Upload the file first.")

    df = record["df"]

    dataset_summary = build_dataset_summary(df, record)
    column_summary  = build_column_summary(df)

    # Missing values per column
    missing_summary = {
        col: {
            "missing_count": int(df[col].isna().sum()),
            "missing_pct":   round(df[col].isna().mean() * 100, 2),
        }
        for col in df.columns
        if df[col].isna().sum() > 0
    }

    # Duplicates
    dup_count = int(df.duplicated().sum())
    duplicate_summary = {
        "duplicate_rows":   dup_count,
        "duplicate_pct":    round(dup_count / len(df) * 100, 2) if len(df) else 0,
        "has_duplicates":   dup_count > 0,
    }

    return {
        "file_id":          file_id,
        "dataset_summary":  dataset_summary,
        "column_summary":   column_summary,
        "missing_summary":  missing_summary,
        "duplicate_summary": duplicate_summary,
    }
