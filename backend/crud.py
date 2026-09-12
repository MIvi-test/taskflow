"""
CRUD операции для базы данных
"""

from sqlalchemy.orm import Session
from typing import Optional

from models import Task, Project, TaskStatus, TaskPriority
from schemas import TaskCreate, TaskUpdate, ProjectCreate


# ============ Task CRUD ============

def get_tasks(
    db: Session,
    status: Optional[TaskStatus] = None,
    skip: int = 0,
    limit: int = 100,
) -> list[Task]:
    """Получить список задач с опциональной фильтрацией"""
    query = db.query(Task)
    if status:
        query = query.filter(Task.status == status)
    return query.order_by(Task.created_at.desc()).offset(skip).limit(limit).all()


def get_task(db: Session, task_id: int) -> Optional[Task]:
    """Получить задачу по ID"""
    return db.query(Task).filter(Task.id == task_id).first()


def create_task(db: Session, task: TaskCreate) -> Task:
    """Создать новую задачу"""
    db_task = Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task_update: TaskUpdate) -> Optional[Task]:
    """Обновить задачу"""
    db_task = get_task(db, task_id)
    if not db_task:
        return None

    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)

    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int) -> bool:
    """Удалить задачу"""
    db_task = get_task(db, task_id)
    if not db_task:
        return False
    db.delete(db_task)
    db.commit()
    return True


# ============ Project CRUD ============

def get_projects(db: Session, skip: int = 0, limit: int = 100) -> list[Project]:
    """Получить список проектов"""
    return db.query(Project).order_by(Project.created_at.desc()).offset(skip).limit(limit).all()


def get_project(db: Session, project_id: int) -> Optional[Project]:
    """Получить проект по ID"""
    return db.query(Project).filter(Project.id == project_id).first()


def create_project(db: Session, project: ProjectCreate) -> Project:
    """Создать новый проект"""
    db_project = Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def delete_project(db: Session, project_id: int) -> bool:
    """Удалить проект"""
    db_project = get_project(db, project_id)
    if not db_project:
        return False
    db.delete(db_project)
    db.commit()
    return True
