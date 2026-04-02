from __future__ import annotations
"""
routes/share.py
POST /share        — save a report to Supabase, return share_id
GET  /share/{id}   — retrieve a saved report by share_id
"""

import os
import random
import string
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any
from supabase import create_client, Client

router = APIRouter()

# ── Supabase client (lazy-initialised so missing env vars don't crash startup) ─

_client: Client | None = None

def _get_client() -> Client:
    global _client
    if _client is None:
        url = os.environ.get("SUPABASE_URL", "").strip()
        key = os.environ.get("SUPABASE_KEY", "").strip()
        if not url or not key:
            raise HTTPException(
                status_code=503,
                detail="Share feature is not configured (missing SUPABASE_URL / SUPABASE_KEY).",
            )
        _client = create_client(url, key)
    return _client


def _make_id(length: int = 10) -> str:
    chars = string.ascii_lowercase + string.digits
    return "".join(random.choices(chars, k=length))


# ── Request / response models ─────────────────────────────────────────────────

class ShareRequest(BaseModel):
    file_name: str
    data: dict[str, Any]          # full pipeline result {analyze, cleaning, eda, scope, insights}


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("")
async def create_share(body: ShareRequest):
    """Save report to Supabase, return share_id."""
    db = _get_client()
    share_id = _make_id()

    try:
        db.table("shared_reports").insert({
            "id":        share_id,
            "file_name": body.file_name,
            "data":      body.data,
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save report: {str(e)}")

    return {"share_id": share_id}


@router.get("/{share_id}")
async def get_share(share_id: str):
    """Retrieve a saved report from Supabase."""
    db = _get_client()

    try:
        res = db.table("shared_reports") \
                .select("*") \
                .eq("id", share_id) \
                .single() \
                .execute()
    except Exception as e:
        raise HTTPException(status_code=404, detail="Report not found or has expired.")

    if not res.data:
        raise HTTPException(status_code=404, detail="Report not found.")

    return res.data
