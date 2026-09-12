"""
API роутер для проектов (Projects)
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from schemas import ProjectCreate, ProjectResponse
import crud

router = APIRouter()


@router.get("/projects", response_model=list[ProjectResponse], summary="Получить все проекты")
async def read_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Возвращает список проектов с количеством задач в каждом.
    """
    projects = crud.get_projects(db, skip=skip, limit=limit)
    # Добавляем количество задач к каждому проекту
    result = []
    for project in projects:
        project_data = ProjectResponse(
            id=project.id,
            name=project.name,
            description=project.description,
            color=project.color,
            created_at=project.created_at,
            tasks_count=len(project.tasks),
        )
        result.append(project_data)
    return result


@router.post("/projects", response_model=ProjectResponse, status_code=201, summary="Создать проект")
async def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    """
    Создаёт новый проект.
    
    - **name**: название проекта (обязательно)
    - **description**: описание проекта
    - **color**: цвет проекта в формате hex (#RRGGBB)
    """
    db_project = crud.create_project(db=db, project=project)
    return ProjectResponse(
        id=db_project.id,
        name=db_project.name,
        description=db_project.description,
        color=db_project.color,
        created_at=db_project.created_at,
        tasks_count=0,
    )


@router.delete("/projects/{project_id}", status_code=204, summary="Удалить проект")
async def delete_project(project_id: int, db: Session = Depends(get_db)):
    """
    Удаляет проект и все связанные задачи.
    """
    success = crud.delete_project(db, project_id=project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return None
