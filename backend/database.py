"""
Async Database configuration for SQLAlchemy 2.0 + PostgreSQL (psycopg 3)
"""
import os
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

DEFAULT_DB_URL = "postgresql+psycopg://user:password@localhost:5432/taskflow"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_URL)

engine = create_async_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autoflush=False, 
    expire_on_commit=False,
    class_=AsyncSession,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Асинхронная зависимость для получения сессии базы данных."""
    async with AsyncSessionLocal() as session:
        yield session


async def close_database() -> None:
    """Закрыть пул соединений при остановке приложения."""
    await engine.dispose()