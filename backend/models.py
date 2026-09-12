"""
SQLAlchemy ORM модели
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
import enum

from database import Base


class TaskStatus(str, enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Task(Base):
    """Модель задачи"""
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, default="")
    status = Column(SAEnum(TaskStatus), default=TaskStatus.TODO, nullable=False)
    priority = Column(SAEnum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    project = relationship("Project", back_populates="tasks")

    def __repr__(self):
        return f"<Task(id={self.id}, title='{self.title}', status={self.status})>"


class Project(Base):
    """Модель проекта"""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, default="")
    color = Column(String(7), default="#6366f1")  # Hex color
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Project(id={self.id}, name='{self.name}')>"
