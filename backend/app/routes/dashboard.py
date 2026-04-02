from __future__ import annotations
"""
routes/dashboard.py
Endpoints for the auto-generated dashboard feature.

GET  /dashboard/{file_id}/generate        — auto-generate dashboard from dataset
POST /dashboard/{file_id}/save-layout     — save a custom layout
GET  /dashboard/{file_id}/layout          — retrieve saved layout
POST /dashboard/{file_id}/widget/{widget_id}/delete — remove a widget
POST /dashboard/{file_id}/cache/clear     — invalidate cached dashboard
"""

import time
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.file_service import FILE_STORE
from app.services.dashboard_service import generate_dashboard_config

router = APIRouter()

# In-memory layout store: file_id → layout dict
LAYOUT_STORE: dict[str, dict] = {}

# Cache timestamps for TTL-based invalidation
_cache_timestamps: dict[str, float] = {}
CACHE_TTL = 3600  # 1 hour


class SaveLayoutBody(BaseModel):
    widgets: list[dict]
    layout:  dict[str, Any]


@router.get("/{file_id}/generate")
def generate_dashboard(file_id: str):
    """Auto-generate a dashboard configuration from the uploaded dataset."""
    record = FILE_STORE.get(file_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"file_id '{file_id}' not found.")

    df = record["df"]

    # Return cached layout if still within TTL
    current_time = time.time()
    if file_id in LAYOUT_STORE:
        cache_age = current_time - _cache_timestamps.get(file_id, 0)
        if cache_age < CACHE_TTL:
            print(f"✓ Cache hit for {file_id} (age {cache_age:.0f}s)")
            return LAYOUT_STORE[file_id]

    print(f"⚙️ Generating dashboard for {file_id}")
    config = generate_dashboard_config(df)
    LAYOUT_STORE[file_id] = config
    _cache_timestamps[file_id] = current_time
    return config


@router.post("/{file_id}/save-layout")
def save_layout(file_id: str, body: SaveLayoutBody):
    """Persist a customised layout for a dataset."""
    record = FILE_STORE.get(file_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"file_id '{file_id}' not found.")

    now = datetime.now(timezone.utc).isoformat()
    existing = LAYOUT_STORE.get(file_id, {})

    LAYOUT_STORE[file_id] = {
        "widgets":    body.widgets,
        "layout":     body.layout,
        "created_at": existing.get("created_at", now),
        "updated_at": now,
    }
    return {"ok": True, "updated_at": now}


@router.get("/{file_id}/layout")
def get_layout(file_id: str):
    """Return the saved (or auto-generated) layout for a dataset."""
    record = FILE_STORE.get(file_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"file_id '{file_id}' not found.")

    if file_id not in LAYOUT_STORE:
        # Auto-generate if not yet stored
        config = generate_dashboard_config(record["df"])
        LAYOUT_STORE[file_id] = config

    return LAYOUT_STORE[file_id]


@router.post("/{file_id}/widget/{widget_id}/delete")
def delete_widget(file_id: str, widget_id: str):
    """Remove a single widget from the saved layout."""
    if file_id not in LAYOUT_STORE:
        raise HTTPException(status_code=404, detail="No layout found. Generate one first.")

    layout = LAYOUT_STORE[file_id]
    layout["widgets"] = [w for w in layout["widgets"] if w.get("id") != widget_id]
    layout["layout"]  = {k: v for k, v in layout["layout"].items() if k != widget_id}
    layout["updated_at"] = datetime.now(timezone.utc).isoformat()

    LAYOUT_STORE[file_id] = layout
    return {"ok": True}


@router.post("/{file_id}/cache/clear")
def clear_dashboard_cache(file_id: str):
    """Invalidate the cached dashboard for a dataset, forcing regeneration on next load."""
    if file_id in LAYOUT_STORE:
        del LAYOUT_STORE[file_id]
        _cache_timestamps.pop(file_id, None)
        return {"success": True, "message": f"Cache cleared for {file_id}"}
    return {"success": False, "message": "No cache found"}
