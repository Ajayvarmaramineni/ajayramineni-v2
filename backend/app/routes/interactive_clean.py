from __future__ import annotations
"""
routes/interactive_clean.py — POST /interactive-clean/{file_id}
Applies user-selected cleaning operations to a DataFrame,
stores the result as a new file_id, and returns it.
"""

import uuid
import os
import tempfile
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import pandas as pd
import numpy as np
import io
from typing import Optional

from app.services.file_service import FILE_STORE

router = APIRouter()

TEMP_DIR = tempfile.gettempdir()

# ── In-memory operation history: maps file_id -> parent_file_id ──────────────
CLEAN_PARENTS: dict[str, str] = {}
# Maps file_id -> list of operation descriptions applied to produce it
CLEAN_LOG: dict[str, list[str]] = {}


class CleanOp(BaseModel):
    op:       str   # drop_column | fill_nulls | drop_null_rows | drop_duplicates
                    # remove_outliers | clean_text | convert_type
    column:   Optional[str] = None
    strategy: Optional[str] = None   # mean | median | mode | constant |
                                     # forward_fill | backward_fill | interpolate | knn
                                     # (for remove_outliers) iqr | zscore | winsorize
                                     # (for clean_text) trim | lower | upper | remove_special
                                     # (for convert_type) numeric | datetime | string
    value:    Optional[str] = None   # constant value for fill_nulls
    threshold: Optional[float] = None  # Z-score threshold (default 3.0) or IQR multiplier (default 1.5)
    lower_pct: Optional[float] = None  # lower percentile for winsorize (default 0.05)
    upper_pct: Optional[float] = None  # upper percentile for winsorize (default 0.95)


class CleanRequest(BaseModel):
    operations: list[CleanOp]


def _apply_operations(df: pd.DataFrame, operations: list[CleanOp]) -> tuple[pd.DataFrame, list[str]]:
    """Apply a list of operations to a DataFrame, returning (result_df, applied_descriptions)."""
    applied: list[str] = []

    for op in operations:
        try:
            if op.op == "drop_column":
                if not op.column or op.column not in df.columns:
                    continue
                df = df.drop(columns=[op.column])
                applied.append(f"Dropped column '{op.column}'")

            elif op.op == "fill_nulls":
                if not op.column or op.column not in df.columns:
                    continue
                col = df[op.column]
                if op.strategy == "mean" and pd.api.types.is_numeric_dtype(col):
                    df[op.column] = col.fillna(col.mean())
                    applied.append(f"Filled nulls in '{op.column}' with mean ({col.mean():.2f})")
                elif op.strategy == "median" and pd.api.types.is_numeric_dtype(col):
                    df[op.column] = col.fillna(col.median())
                    applied.append(f"Filled nulls in '{op.column}' with median ({col.median():.2f})")
                elif op.strategy == "mode":
                    mode_val = col.mode()
                    if not mode_val.empty:
                        df[op.column] = col.fillna(mode_val[0])
                        applied.append(f"Filled nulls in '{op.column}' with mode ({mode_val[0]})")
                elif op.strategy == "constant" and op.value is not None:
                    fill_val: str | float = op.value
                    if pd.api.types.is_numeric_dtype(col):
                        try:
                            fill_val = float(op.value)
                        except ValueError:
                            pass
                    df[op.column] = col.fillna(fill_val)
                    applied.append(f"Filled nulls in '{op.column}' with '{op.value}'")
                elif op.strategy == "forward_fill":
                    df[op.column] = col.ffill()
                    applied.append(f"Filled nulls in '{op.column}' with forward fill")
                elif op.strategy == "backward_fill":
                    df[op.column] = col.bfill()
                    applied.append(f"Filled nulls in '{op.column}' with backward fill")
                elif op.strategy == "interpolate":
                    if pd.api.types.is_numeric_dtype(col):
                        df[op.column] = col.interpolate(method="linear", limit_direction="both")
                        applied.append(f"Filled nulls in '{op.column}' with linear interpolation")
                    else:
                        applied.append(f"Skipped interpolation for non-numeric column '{op.column}'")
                elif op.strategy == "knn":
                    if pd.api.types.is_numeric_dtype(col):
                        from sklearn.impute import KNNImputer
                        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
                        if op.column in numeric_cols and len(numeric_cols) > 0 and len(df) > 1:
                            n_neighbors = max(1, min(5, len(df) - 1))
                            imputer = KNNImputer(n_neighbors=n_neighbors)
                            df[numeric_cols] = imputer.fit_transform(df[numeric_cols])
                            applied.append(f"Filled nulls in '{op.column}' with KNN imputation")
                    else:
                        applied.append(f"Skipped KNN imputation for non-numeric column '{op.column}'")

            elif op.op == "drop_null_rows":
                if not op.column or op.column not in df.columns:
                    continue
                before = len(df)
                df = df.dropna(subset=[op.column])
                dropped = before - len(df)
                applied.append(f"Dropped {dropped} rows with nulls in '{op.column}'")

            elif op.op == "drop_duplicates":
                before = len(df)
                df = df.drop_duplicates()
                dropped = before - len(df)
                applied.append(f"Removed {dropped} duplicate rows")

            elif op.op == "remove_outliers":
                if not op.column or op.column not in df.columns:
                    continue
                if not pd.api.types.is_numeric_dtype(df[op.column]):
                    applied.append(f"Skipped outlier removal for non-numeric column '{op.column}'")
                    continue
                before = len(df)
                method = op.strategy or "iqr"
                if method == "iqr":
                    multiplier = op.threshold if op.threshold is not None else 1.5
                    q1 = df[op.column].quantile(0.25)
                    q3 = df[op.column].quantile(0.75)
                    iqr = q3 - q1
                    lower = q1 - multiplier * iqr
                    upper = q3 + multiplier * iqr
                    df = df[(df[op.column] >= lower) & (df[op.column] <= upper)]
                    removed = before - len(df)
                    applied.append(f"Removed {removed} outliers from '{op.column}' using IQR (×{multiplier})")
                elif method == "zscore":
                    threshold = op.threshold if op.threshold is not None else 3.0
                    col_std = df[op.column].std()
                    if col_std > 0:
                        zscores = np.abs((df[op.column] - df[op.column].mean()) / col_std)
                        df = df[zscores <= threshold]
                    removed = before - len(df)
                    applied.append(f"Removed {removed} outliers from '{op.column}' using Z-score (threshold={threshold})")
                elif method == "winsorize":
                    lower_pct = op.lower_pct if op.lower_pct is not None else 0.05
                    upper_pct = op.upper_pct if op.upper_pct is not None else 0.95
                    lower_val = df[op.column].quantile(lower_pct)
                    upper_val = df[op.column].quantile(upper_pct)
                    df[op.column] = df[op.column].clip(lower=lower_val, upper=upper_val)
                    applied.append(
                        f"Winsorized '{op.column}' at [{lower_pct*100:.0f}%, {upper_pct*100:.0f}%] "
                        f"-> [{lower_val:.3g}, {upper_val:.3g}]"
                    )

            elif op.op == "clean_text":
                if not op.column or op.column not in df.columns:
                    continue
                if not op.strategy:
                    continue
                col_series = df[op.column].astype(str)
                strategies = [s.strip() for s in op.strategy.split(",")]
                steps_applied: list[str] = []
                for s in strategies:
                    if s == "trim":
                        col_series = col_series.str.strip()
                        steps_applied.append("trimmed whitespace")
                    elif s == "lower":
                        col_series = col_series.str.lower()
                        steps_applied.append("lowercased")
                    elif s == "upper":
                        col_series = col_series.str.upper()
                        steps_applied.append("uppercased")
                    elif s == "title":
                        col_series = col_series.str.title()
                        steps_applied.append("title-cased")
                    elif s == "remove_special":
                        col_series = col_series.str.replace(r"[^a-zA-Z0-9\s_\-.]", "", regex=True)
                        steps_applied.append("removed special characters")
                df[op.column] = col_series
                applied.append(f"Cleaned text in '{op.column}': {', '.join(steps_applied)}")

            elif op.op == "convert_type":
                if not op.column or op.column not in df.columns:
                    continue
                to_type = op.strategy or "numeric"
                if to_type == "numeric":
                    original_nulls = df[op.column].isna().sum()
                    df[op.column] = pd.to_numeric(df[op.column], errors="coerce")
                    new_nulls = df[op.column].isna().sum() - original_nulls
                    applied.append(f"Converted '{op.column}' to numeric ({new_nulls} values coerced to NaN)")
                elif to_type == "datetime":
                    df[op.column] = pd.to_datetime(df[op.column], errors="coerce")
                    applied.append(f"Converted '{op.column}' to datetime")
                elif to_type == "string":
                    df[op.column] = df[op.column].astype(str)
                    applied.append(f"Converted '{op.column}' to string")

        except Exception as e:
            applied.append(f"Skipped '{op.op}' on '{op.column}': {str(e)}")

    return df, applied


@router.post("/{file_id}")
async def apply_cleaning(file_id: str, body: CleanRequest):
    record = FILE_STORE.get(file_id)
    if not record:
        raise HTTPException(status_code=404, detail="Session expired — please re-upload your file.")

    if not body.operations:
        raise HTTPException(status_code=400, detail="No operations provided.")

    df: pd.DataFrame = record["df"].copy()
    df, applied = _apply_operations(df, body.operations)

    if df.empty:
        raise HTTPException(status_code=422, detail="Cleaning operations resulted in an empty dataset.")

    # Store cleaned df as a new file_id
    new_id = str(uuid.uuid4())
    original_name = record["file_name"]
    base, ext = os.path.splitext(original_name)
    new_name = f"{base}_cleaned{ext}"
    new_path = os.path.join(TEMP_DIR, f"statlab_{new_id}{ext}")

    # Persist to temp file
    try:
        if ext.lower() in (".xlsx", ".xls"):
            df.to_excel(new_path, index=False)
        elif ext.lower() == ".json":
            df.to_json(new_path, orient="records")
        else:
            df.to_csv(new_path, index=False)
    except Exception:
        df.to_csv(new_path.replace(ext, ".csv"), index=False)
        new_path = new_path.replace(ext, ".csv")
        new_name = new_name.replace(ext, ".csv")

    FILE_STORE[new_id] = {
        "file_id":      new_id,
        "file_name":    new_name,
        "file_path":    new_path,
        "file_type":    ext.lstrip(".") or "csv",
        "row_count":    len(df),
        "column_count": len(df.columns),
        "columns":      list(df.columns),
        "df":           df,
    }

    # Track parent for undo functionality
    CLEAN_PARENTS[new_id] = file_id
    # Build cumulative log
    parent_log = CLEAN_LOG.get(file_id, [])
    CLEAN_LOG[new_id] = parent_log + applied

    preview = df.head(100).fillna("").to_dict(orient="records")

    return {
        "new_file_id":   new_id,
        "file_name":     new_name,
        "row_count":     len(df),
        "column_count":  len(df.columns),
        "columns":       list(df.columns),
        "preview_rows":  preview,
        "applied":       applied,
        "original_rows": record["row_count"],
        "original_cols": record["column_count"],
    }


@router.post("/preview/{file_id}")
async def preview_cleaning(file_id: str, body: CleanRequest):
    """Apply operations and return before/after stats without persisting the result."""
    record = FILE_STORE.get(file_id)
    if not record:
        raise HTTPException(status_code=404, detail="Session expired — please re-upload your file.")

    if not body.operations:
        raise HTTPException(status_code=400, detail="No operations provided.")

    df_before: pd.DataFrame = record["df"].copy()
    df_after, applied = _apply_operations(df_before.copy(), body.operations)

    before_preview = df_before.head(5).fillna("").to_dict(orient="records")
    after_preview  = df_after.head(5).fillna("").to_dict(orient="records") if not df_after.empty else []

    return {
        "before": {
            "row_count":    len(df_before),
            "column_count": len(df_before.columns),
            "null_count":   int(df_before.isna().sum().sum()),
            "preview_rows": before_preview,
        },
        "after": {
            "row_count":    len(df_after),
            "column_count": len(df_after.columns),
            "null_count":   int(df_after.isna().sum().sum()),
            "preview_rows": after_preview,
        },
        "applied": applied,
        "rows_removed":    len(df_before) - len(df_after),
        "cols_removed":    len(df_before.columns) - len(df_after.columns),
        "nulls_removed":   int(df_before.isna().sum().sum()) - int(df_after.isna().sum().sum()),
    }


@router.get("/history/{file_id}")
async def get_history(file_id: str):
    """Return the chain of applied operations leading to this file_id."""
    if file_id not in FILE_STORE:
        raise HTTPException(status_code=404, detail="Session expired — please re-upload your file.")

    operations = CLEAN_LOG.get(file_id, [])
    parent_id  = CLEAN_PARENTS.get(file_id)
    return {
        "file_id":    file_id,
        "parent_id":  parent_id,
        "operations": operations,
        "can_undo":   parent_id is not None and parent_id in FILE_STORE,
    }


@router.post("/undo/{file_id}")
async def undo_cleaning(file_id: str):
    """Return the parent file_id (one step back in the cleaning history)."""
    if file_id not in FILE_STORE:
        raise HTTPException(status_code=404, detail="Session expired — please re-upload your file.")

    parent_id = CLEAN_PARENTS.get(file_id)
    if not parent_id or parent_id not in FILE_STORE:
        raise HTTPException(status_code=400, detail="No previous state to undo to.")

    parent_record = FILE_STORE[parent_id]
    preview = parent_record["df"].head(100).fillna("").to_dict(orient="records")

    return {
        "file_id":      parent_id,
        "file_name":    parent_record["file_name"],
        "row_count":    parent_record["row_count"],
        "column_count": parent_record["column_count"],
        "columns":      parent_record["columns"],
        "preview_rows": preview,
        "operations":   CLEAN_LOG.get(parent_id, []),
    }


@router.get("/download/{file_id}")
async def download_cleaned(file_id: str):
    """Return the cleaned DataFrame as a downloadable CSV."""
    record = FILE_STORE.get(file_id)
    if not record:
        raise HTTPException(status_code=404, detail="Session expired — please re-upload your file.")

    df: pd.DataFrame = record["df"]
    file_name = record.get("file_name", f"{file_id}_cleaned.csv")
    csv_name = file_name.rsplit(".", 1)[0] + ".csv"

    buf = io.StringIO()
    df.to_csv(buf, index=False)
    buf.seek(0)

    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{csv_name}"'},
    )
