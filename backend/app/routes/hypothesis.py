from __future__ import annotations
"""
routes/hypothesis.py — GET /hypothesis/{file_id}
Runs scipy-based hypothesis tests in isolation so that any scipy
SEGFAULT (which kills the process at C level) doesn't take down
the main EDA endpoint.
"""

import traceback

from fastapi import APIRouter, HTTPException
from app.services.file_service import FILE_STORE
from app.services.eda_service import _hypothesis_tests, _json_safe

router = APIRouter()


@router.get("/{file_id}")
def get_hypothesis(file_id: str):
    """Run hypothesis tests and return structured results."""
    record = FILE_STORE.get(file_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"file_id '{file_id}' not found.")

    df = record["df"]
    num_cols = df.select_dtypes(include="number").columns.tolist()
    cat_cols = df.select_dtypes(include="object").columns.tolist()

    try:
        result = _hypothesis_tests(df, num_cols, cat_cols)
        return {"file_id": file_id, **_json_safe(result)}
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Hypothesis tests failed: {exc}\n{traceback.format_exc()}",
        ) from exc
