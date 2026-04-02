from __future__ import annotations
"""
routes/admin.py
GET   /admin/stats          — aggregate numbers for the admin dashboard
GET   /admin/users          — full user list
PATCH /admin/users/{email}  — toggle is_pro for a user
"""

import os
from fastapi import APIRouter, HTTPException, Header
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


def _require_admin(x_admin_secret: str | None):
    """Simple secret-based guard — same secret as admin login."""
    secret = os.environ.get("ADMIN_SECRET", "")
    if not secret or x_admin_secret != secret:
        raise HTTPException(status_code=403, detail="Forbidden.")


class ProToggle(BaseModel):
    is_pro: bool


@router.get("/stats")
async def get_stats(x_admin_secret: str | None = Header(default=None)):
    _require_admin(x_admin_secret)
    db = _db()

    try:
        users_res    = db.table("users").select("id, is_pro, analyses_count, created_at").execute()
        analyses_res = db.table("analyses").select("id, created_at, file_name, row_count, col_count").execute()
        shares_res   = db.table("shared_reports").select("id, created_at").execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    users     = users_res.data    or []
    analyses  = analyses_res.data or []
    shares    = shares_res.data   or []

    total_users    = len(users)
    pro_users      = sum(1 for u in users if u.get("is_pro"))
    free_users     = total_users - pro_users
    total_analyses = len(analyses)
    avg_analyses   = round(total_analyses / total_users, 1) if total_users else 0

    # New users in last 7 days
    from datetime import datetime, timezone, timedelta
    cutoff = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    new_this_week = sum(1 for u in users if u.get("created_at", "") >= cutoff)

    # Dataset stats
    rows_list = [a.get("row_count", 0) or 0 for a in analyses]
    avg_rows  = round(sum(rows_list) / len(rows_list), 0) if rows_list else 0

    return {
        "total_users":     total_users,
        "pro_users":       pro_users,
        "free_users":      free_users,
        "new_this_week":   new_this_week,
        "total_analyses":  total_analyses,
        "avg_analyses":    avg_analyses,
        "total_shares":    len(shares),
        "avg_rows":        avg_rows,
    }


@router.get("/users")
async def get_users(x_admin_secret: str | None = Header(default=None)):
    _require_admin(x_admin_secret)
    db = _db()
    try:
        res = db.table("users") \
                .select("*") \
                .order("created_at", desc=True) \
                .execute()
        return res.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/users/{email}")
async def update_user_pro(
    email: str,
    body:  ProToggle,
    x_admin_secret: str | None = Header(default=None),
):
    _require_admin(x_admin_secret)
    db = _db()
    try:
        db.table("users") \
          .update({"is_pro": body.is_pro}) \
          .eq("email", email.lower()) \
          .execute()
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
