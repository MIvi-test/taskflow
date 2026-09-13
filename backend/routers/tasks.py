"""
API роутер для задач (Tasks)
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from database import get_db
from models import TaskStatus
from schemas import TaskCreate, TaskUpdate, TaskResponse
import crud

router = APIRouter()


@router.get("/tasks", response_model=list[TaskResponse], summary="Получить все задачи")
async def read_tasks(
    status: Optional[TaskStatus] = Query(None, description="Фильтр по статусу"),
    skip: int = Query(0, ge=0, description="Пропустить N записей"),
    limit: int = Query(100, ge=1, le=1000, description="Максимум записей"),
    db: AsyncSession = Depends(get_db),
):
    """
    Возвращает список задач с опциональной фильтрацией по статусу.
    Поддерживает пагинацию через skip и limit.
    """
    tasks = await crud.get_tasks(db, status=status, skip=skip, limit=limit)
    return tasks


@router.get("/tasks/{task_id}", response_model=TaskResponse, summary="Получить задачу по ID")
async def read_task(task_id: int, db: AsyncSession = Depends(get_db)):
    """Возвращает задачу по её ID"""
    task = await crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("/tasks", response_model=TaskResponse, status_code=201, summary="Создать задачу")
async def create_task(task: TaskCreate, db: AsyncSession = Depends(get_db)):
    """
    Создаёт новую задачу.
    
    - **title**: название задачи (обязательно)
    - **description**: описание задачи
    - **status**: статус (todo, in_progress, done)
    - **priority**: приоритет (low, medium, high)
    """
    return await crud.create_task(db=db, task=task)


@router.put("/tasks/{task_id}", response_model=TaskResponse, summary="Обновить задачу")
async def update_task(task_id: int, task_update: TaskUpdate, db: AsyncSession = Depends(get_db)):
    """
    Обновляет существующую задачу.
    Все поля опциональны — обновятся только переданные.
    """
    updated_task = await crud.update_task(db, task_id=task_id, task_update=task_update)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task


@router.delete("/tasks/{task_id}", status_code=204, summary="Удалить задачу")
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db)):
    """Удаляет задачу по ID"""
    success = await crud.delete_task(db, task_id=task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return None
