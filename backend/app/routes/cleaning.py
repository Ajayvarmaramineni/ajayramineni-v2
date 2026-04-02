from __future__ import annotations
"""
routes/cleaning.py — GET /cleaning/{file_id}
Returns cleaning findings and recommendations without auto-applying them.
Per the architecture: show recommendations, do not auto-apply all fixes.
"""

from fastapi import APIRouter, HTTPException
from app.services.file_service import FILE_STORE
from app.services.cleaning_service import run_cleaning_diagnostics

router = APIRouter()


@router.get("/{file_id}")
def get_cleaning_report(file_id: str):
    """
    Detect data quality issues and return recommended actions.
    Does NOT modify the dataset — recommendations only.
    """
    record = FILE_STORE.get(file_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"file_id '{file_id}' not found.")

    df = record["df"]
    report = run_cleaning_diagnostics(df)

    return {
        "file_id": file_id,
        **report,
    }
