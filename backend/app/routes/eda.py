from __future__ import annotations
"""
routes/eda.py — GET /eda/{file_id}
Returns EDA outputs including numeric stats, categorical summaries,
correlations, distribution data, and time trend data when applicable.
"""

import traceback

from fastapi import APIRouter, HTTPException
from app.services.file_service import FILE_STORE
from app.services.eda_service import run_eda

router = APIRouter()


@router.get("/{file_id}")
def get_eda(file_id: str):
    """Run exploratory data analysis and return chart-ready structured data."""
    record = FILE_STORE.get(file_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"file_id '{file_id}' not found.")

    df = record["df"]
    try:
        result = run_eda(df)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"EDA computation failed: {exc}\n{traceback.format_exc()}",
        ) from exc

    return {
        "file_id": file_id,
        **result,
    }
