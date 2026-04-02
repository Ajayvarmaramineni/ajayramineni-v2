from __future__ import annotations
"""
services/file_service.py
Handles temp file storage and the in-memory FILE_STORE for MVP.
Production upgrade: swap save_temp_file for S3/R2 upload.
"""

import os
import tempfile

# In-memory store: file_id → { file_id, file_name, file_path, file_type, row_count, column_count, columns, df }
FILE_STORE: dict = {}

TEMP_DIR = tempfile.gettempdir()


def save_temp_file(file_id: str, filename: str, content: bytes) -> str:
    """Write uploaded bytes to a temp file and return the path."""
    ext  = os.path.splitext(filename)[1].lower()
    path = os.path.join(TEMP_DIR, f"statlab_{file_id}{ext}")
    with open(path, "wb") as f:
        f.write(content)
    return path


def get_file_record(file_id: str) -> dict | None:
    """Retrieve a stored file record by ID."""
    return FILE_STORE.get(file_id)


def delete_temp_file(file_id: str):
    """Remove temp file from disk and memory store."""
    record = FILE_STORE.pop(file_id, None)
    if record and os.path.exists(record.get("file_path", "")):
        os.remove(record["file_path"])
