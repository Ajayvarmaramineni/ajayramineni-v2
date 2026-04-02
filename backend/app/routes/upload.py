from __future__ import annotations
"""
routes/upload.py — POST /upload
Accepts a CSV or XLSX file, validates it, parses it into a DataFrame,
stores it in memory (MVP: temp storage), and returns a file_id + summary.
"""

import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.file_service import save_temp_file, get_file_record, FILE_STORE
from app.services.parser_service import parse_file
from app.utils.validators import validate_upload

router = APIRouter()


@router.post("")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload a CSV or XLSX file.
    Returns: file_id, file_name, row_count, column_count, detected_file_type, preview_rows.
    """
    # 1. Validate extension and size
    content = await file.read()
    validate_upload(file.filename, content)

    # 2. Assign unique ID and store
    file_id = str(uuid.uuid4())
    file_path = save_temp_file(file_id, file.filename, content)

    # 3. Parse into DataFrame
    df = parse_file(file_path, file.filename)

    # 4. Store in memory store
    FILE_STORE[file_id] = {
        "file_id":    file_id,
        "file_name":  file.filename,
        "file_path":  file_path,
        "file_type":  file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "csv",
        "row_count":  len(df),
        "column_count": len(df.columns),
        "columns":    list(df.columns),
        "df":         df,
    }

    # 5. Return lightweight response (no DataFrame in JSON)
    preview = df.head(100).fillna("").to_dict(orient="records")

    return {
        "file_id":        file_id,
        "file_name":      file.filename,
        "row_count":      len(df),
        "column_count":   len(df.columns),
        "detected_file_type": FILE_STORE[file_id]["file_type"],
        "columns":        list(df.columns),
        "preview_rows":   preview,
    }
