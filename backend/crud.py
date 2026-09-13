"""
CRUD операции для базы данных
"""

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models import Task, Project, TaskStatus, TaskPriority
from schemas import TaskCreate, TaskUpdate, ProjectCreate


# ============ Task CRUD ============

async def get_tasks(
    db: AsyncSession,
    status: Optional[TaskStatus] = None,
    skip: int = 0,
    limit: int = 100,
) -> list[Task]:
    """Получить список задач с опциональной фильтрацией"""
    query = select(Task)
    if status:
        query = query.where(Task.status == status)
    result = await db.execute(
        query.order_by(Task.created_at.desc()).offset(skip).limit(limit)
    )
    return list(result.scalars().all())


async def get_task(db: AsyncSession, task_id: int) -> Optional[Task]:
    """Получить задачу по ID"""
    result = await db.execute(select(Task).where(Task.id == task_id))
    return result.scalar_one_or_none()


async def create_task(db: AsyncSession, task: TaskCreate) -> Task:
    """Создать новую задачу"""
    db_task = Task(**task.model_dump())
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task


async def update_task(db: AsyncSession, task_id: int, task_update: TaskUpdate) -> Optional[Task]:
    """Обновить задачу"""
    db_task = await get_task(db, task_id)
    if not db_task:
        return None

    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)

    await db.commit()
    await db.refresh(db_task)
    return db_task


async def delete_task(db: AsyncSession, task_id: int) -> bool:
    """Удалить задачу"""
    db_task = await get_task(db, task_id)
    if not db_task:
        return False
    await db.delete(db_task)
    await db.commit()
    return True


# ============ Project CRUD ============

async def get_projects(db: AsyncSession, skip: int = 0, limit: int = 100) -> list[Project]:
    """Получить список проектов"""
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.tasks))
        .order_by(Project.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().unique().all())


async def get_project(db: AsyncSession, project_id: int) -> Optional[Project]:
    """Получить проект по ID"""
    result = await db.execute(select(Project).where(Project.id == project_id))
    return result.scalar_one_or_none()


async def create_project(db: AsyncSession, project: ProjectCreate) -> Project:
    """Создать новый проект"""
    db_project = Project(**project.model_dump())
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    return db_project


async def delete_project(db: AsyncSession, project_id: int) -> bool:
    """Удалить проект"""
    db_project = await get_project(db, project_id)
    if not db_project:
        return False
    await db.delete(db_project)
    await db.commit()
    return True
