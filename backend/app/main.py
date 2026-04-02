from __future__ import annotations
"""
main.py — FastAPI application entry point for DataStatz backend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()  # picks up backend/.env when running locally

from app.routes import upload, analyze, cleaning, eda, scope, insights, hypothesis, ml, interactive_clean, share, users, admin, dashboard

app = FastAPI(
    title="DataStatz API",
    description="No-code data analysis platform — clean, explore, and understand your datasets.",
    version="0.1.0",
)

# ── CORS (allow Next.js frontend on localhost:3000 and Vercel domains) ─────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://datastatz.vercel.app",
        "https://datastatz.com",
        "https://www.datastatz.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(upload.router,   prefix="/upload",              tags=["Upload"])
app.include_router(analyze.router,  prefix="/analyze",             tags=["Analyze"])
app.include_router(cleaning.router, prefix="/cleaning",            tags=["Cleaning"])
app.include_router(eda.router,      prefix="/eda",                 tags=["EDA"])
app.include_router(scope.router,    prefix="/scope",               tags=["Scope"])
app.include_router(insights.router,    prefix="/insights",            tags=["Insights"])
app.include_router(hypothesis.router,  prefix="/hypothesis",          tags=["Hypothesis"])
app.include_router(ml.router,                prefix="/ml",               tags=["ML"])
app.include_router(interactive_clean.router, prefix="/interactive-clean", tags=["Interactive Clean"])
app.include_router(share.router,             prefix="/share",             tags=["Share"])
app.include_router(users.router,             prefix="/users",             tags=["Users"])
app.include_router(admin.router,             prefix="/admin",             tags=["Admin"])
app.include_router(dashboard.router,         prefix="/dashboard",         tags=["Dashboard"])


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "product": "DataStatz", "version": "0.1.0"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
