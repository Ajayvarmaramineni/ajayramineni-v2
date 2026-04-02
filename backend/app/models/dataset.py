from __future__ import annotations
"""
models/dataset.py — Pydantic response models for dataset endpoints.
"""

from pydantic import BaseModel
from typing import Optional


class DatasetRecord(BaseModel):
    id:          str
    user_id:     Optional[str] = None
    file_name:   str
    file_path:   str
    file_type:   str
    row_count:   int
    column_count: int
    created_at:  Optional[str] = None


class UploadResponse(BaseModel):
    file_id:           str
    file_name:         str
    row_count:         int
    column_count:      int
    detected_file_type: str
    columns:           list[str]
    preview_rows:      list[dict]
