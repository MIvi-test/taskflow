"""
Database configuration for SQLAlchemy 2.0
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# SQLite database (можно заменить на PostgreSQL/MySQL)
DATABASE_URL = "sqlite:///./taskflow.db"

# Для PostgreSQL:
# DATABASE_URL = "postgresql://user:password@localhost:5432/taskflow"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # Только для SQLite
    echo=False,  # Установить True для отладки SQL запросов
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """Dependency для получения сессии базы данных"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
