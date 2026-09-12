"""
Pydantic схемы для валидации данных
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from models import TaskStatus, TaskPriority


# ============ Task Schemas ============

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Название задачи")
    description: str = Field(default="", description="Описание задачи")
    status: TaskStatus = Field(default=TaskStatus.TODO, description="Статус задачи")
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM, description="Приоритет задачи")
    project_id: Optional[int] = Field(default=None, description="ID проекта")


class TaskCreate(TaskBase):
    """Схема для создания задачи"""
    pass


class TaskUpdate(BaseModel):
    """Схема для обновления задачи (все поля опциональны)"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    project_id: Optional[int] = None


class TaskResponse(TaskBase):
    """Схема ответа с задачей"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============ Project Schemas ============

class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Название проекта")
    description: str = Field(default="", description="Описание проекта")
    color: str = Field(default="#6366f1", pattern=r"^#[0-9a-fA-F]{6}$", description="Цвет проекта (hex)")


class ProjectCreate(ProjectBase):
    """Схема для создания проекта"""
    pass


class ProjectResponse(ProjectBase):
    """Схема ответа с проектом"""
    id: int
    tasks_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True
