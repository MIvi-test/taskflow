import os
from time import perf_counter
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest

from observability import (
    HTTP_REQUEST_DURATION_SECONDS,
    HTTP_REQUESTS_IN_PROGRESS,
    HTTP_REQUESTS_TOTAL,
)

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


def get_route_label(request: Request) -> str:
    """Возвращает шаблон маршрута, пригодный для Prometheus labels.

    Нельзя использовать ``request.url.path``: для ``/api/tasks/1`` и
    ``/api/tasks/2`` тогда появились бы разные временные ряды. Шаблон
    ``/api/tasks/{task_id}`` сохраняет число метрик ограниченным.
    """
    route = request.scope.get("route")
    return getattr(route, "path", None) or "unmatched"


@app.middleware("http")
async def collect_http_metrics(request: Request, call_next):
    """Собирает RED-метрики API: requests, errors и duration."""
    # Сам endpoint /metrics не относим к бизнес-запросам API, иначе каждый
    # scrape Prometheus искусственно увеличивал бы их число.
    if request.url.path == "/metrics":
        return await call_next(request)

    started_at = perf_counter()
    method = request.method
    route = "unmatched"
    status_code = 500

    # Gauge показывает именно текущее число запросов, поэтому увеличиваем его
    # до обработки запроса и всегда уменьшаем в finally.
    HTTP_REQUESTS_IN_PROGRESS.labels(method=method).inc()
    try:
        response = await call_next(request)
        status_code = response.status_code
        route = get_route_label(request)
        return response
    finally:
        duration = perf_counter() - started_at

        # Маршрут становится известен только после передачи управления
        # FastAPI. Для исключений он может остаться "unmatched".
        HTTP_REQUESTS_IN_PROGRESS.labels(method=method).dec()
        HTTP_REQUESTS_TOTAL.labels(
            method=method, route=route, status_code=status_code
        ).inc()
        HTTP_REQUEST_DURATION_SECONDS.labels(method=method, route=route).observe(duration)


# Подключение роутеров
app.include_router(tasks.router, prefix="/api", tags=["Tasks"])
app.include_router(projects.router, prefix="/api", tags=["Projects"])


@app.get("/metrics", include_in_schema=False)
def metrics() -> Response:
    """Отдаёт метрики в формате, который Prometheus забирает по scrape."""
    # generate_latest() добавляет и наши метрики, и стандартные Python/process
    # метрики. CONTENT_TYPE_LATEST сообщает Prometheus формат тела ответа.
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)


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
