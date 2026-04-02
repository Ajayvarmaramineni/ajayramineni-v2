from __future__ import annotations
"""
utils/validators.py — File upload validation rules.
"""

from fastapi import HTTPException

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls", ".json"}
MAX_FILE_SIZE_MB   = 50
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


def validate_upload(filename: str, content: bytes):
    """Raise HTTPException if the upload fails any validation rule."""

    if not filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(content) > MAX_FILE_SIZE_BYTES:
        size_mb = round(len(content) / 1024 / 1024, 1)
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb} MB). Maximum allowed size is {MAX_FILE_SIZE_MB} MB.",
        )
