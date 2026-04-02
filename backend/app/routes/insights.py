from __future__ import annotations
"""
routes/insights.py — GET /insights/{file_id}
Generates plain-English insights from computed stats using rule-based logic (MVP).
Returns top findings, warnings, and suggested next steps.
"""

from fastapi import APIRouter, HTTPException
from app.services.file_service import FILE_STORE
from app.services.eda_service import run_eda
from app.services.cleaning_service import run_cleaning_diagnostics
from app.services.scope_service import evaluate_scope
from app.services.insight_service import generate_insights

router = APIRouter()


@router.get("/{file_id}")
def get_insights(file_id: str):
    """
    Generate rule-based plain-English insights.
    Computes EDA + cleaning + scope internally, then produces findings.
    """
    record = FILE_STORE.get(file_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"file_id '{file_id}' not found.")

    df = record["df"]

    eda_result      = run_eda(df)
    cleaning_result = run_cleaning_diagnostics(df)
    scope_result    = evaluate_scope(df)

    insights = generate_insights(df, eda_result, cleaning_result, scope_result)

    return {
        "file_id": file_id,
        **insights,
    }
