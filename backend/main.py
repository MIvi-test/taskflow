"""
TaskFlow Backend - FastAPI + SQLAlchemy
========================================
Документация API:
    http://localhost:8000/docs
"""

import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from database import Base, close_database, engine
from routers import tasks, projects


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Инициализация и корректное завершение async-базы данных."""
    async with engine.begin() as connection:
        # Gunicorn запускает несколько workers одновременно. Без блокировки
        # они могут параллельно создать один и тот же PostgreSQL ENUM.
        await connection.execute(text("SELECT pg_advisory_lock(824731)"))
        try:
            await connection.run_sync(Base.metadata.create_all)
        finally:
            await connection.execute(text("SELECT pg_advisory_unlock(824731)"))
    try:
        yield
    finally:
        await close_database()


app = FastAPI(
    title="TaskFlow API",
    description="REST API для управления задачами и проектами",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(tasks.router, prefix="/api", tags=["Tasks"])
app.include_router(projects.router, prefix="/api", tags=["Projects"])


@app.get("/")
async def root():
    return {
        "message": "TaskFlow API is running!",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}
