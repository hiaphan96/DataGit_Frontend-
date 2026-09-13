from fastapi import FastAPI
from app.api.runs import router as runs_router
from app.api.comparison import router as comparison_router

from app.api.projects import router as projects_router
from app.api.evidence import router as evidence_router

from app.core.config import settings
from app.db.database import Base, engine
from app.db import models



# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "application": settings.app_name,
    }

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# API routers
app.include_router(projects_router)
app.include_router(evidence_router)
app.include_router(runs_router)
app.include_router(comparison_router)