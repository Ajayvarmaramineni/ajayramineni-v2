from __future__ import annotations
"""
routes/scope.py — GET /scope/{file_id}
Evaluates what types of analysis are realistically feasible with the dataset.
Returns feasibility flags, reasoning, and missing requirements.
"""

from fastapi import APIRouter, HTTPException
from app.services.file_service import FILE_STORE
from app.services.scope_service import evaluate_scope

router = APIRouter()


@router.get("/{file_id}")
def get_scope(file_id: str):
    """
    Evaluate what analyses are possible:
    - Descriptive analysis
    - Regression
    - Classification
    - Clustering
    - Time series
    """
    record = FILE_STORE.get(file_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"file_id '{file_id}' not found.")

    df = record["df"]
    result = evaluate_scope(df)

    return {
        "file_id": file_id,
        **result,
    }
