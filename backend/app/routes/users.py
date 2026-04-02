from __future__ import annotations
"""
routes/users.py
POST /users/register  — upsert a user into Supabase on signup
POST /users/track     — log an analysis run, increment counter
"""

import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client

router = APIRouter()

_client: Client | None = None

def _db() -> Client:
    global _client
    if _client is None:
        url = os.environ.get("SUPABASE_URL", "").strip()
        key = os.environ.get("SUPABASE_KEY", "").strip()
        if not url or not key:
            raise HTTPException(status_code=503, detail="Database not configured.")
        _client = create_client(url, key)
    return _client


class RegisterRequest(BaseModel):
    name:        str
    email:       str
    institution: str


class TrackRequest(BaseModel):
    user_email: str
    file_name:  str
    row_count:  int = 0
    col_count:  int = 0


@router.post("/register")
async def register_user(body: RegisterRequest):
    """Upsert user into Supabase. Called after OTP verification."""
    db = _db()
    email = body.email.strip().lower()
    try:
        # Upsert so re-registering the same email doesn't error
        db.table("users").upsert({
            "name":        body.name.strip(),
            "email":       email,
            "institution": body.institution.strip(),
        }, on_conflict="email").execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save user: {str(e)}")
    return {"ok": True}


@router.post("/track")
async def track_analysis(body: TrackRequest):
    """Log one analysis run and bump the user's counter."""
    db = _db()
    email = body.user_email.strip().lower()
    try:
        # Insert analysis record
        db.table("analyses").insert({
            "user_email": email,
            "file_name":  body.file_name,
            "row_count":  body.row_count,
            "col_count":  body.col_count,
        }).execute()

        # Increment analyses_count + update last_active
        db.rpc("increment_analyses", {"user_email": email}).execute()
    except Exception:
        # Non-critical — don't fail the user's request
        pass
    return {"ok": True}
