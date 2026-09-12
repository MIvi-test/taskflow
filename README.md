# TaskFlow

Простой full-stack проект для управления задачами и проектами. Приложение объединяет React frontend и FastAPI backend, позволяет создавать задачи, управлять статусами, фильтровать и искать записи, а также организовывать проекты.

## Возможности
- Kanban-доска для задач
- Список задач с фильтрацией по статусу
- Поиск по названию и описанию
- Создание и удаление проектов
- Редактирование задач и статусов
- API документация через Swagger

## Стек
- Frontend: React + TypeScript + Vite
- Backend: FastAPI + SQLAlchemy
- База данных: SQLite
- Контейнеризация: Docker

## Быстрый старт

### 1) Установка frontend
```bash
npm install
npm run dev
```

Frontend будет доступен по адресу: http://localhost:5173

### 2) Запуск backend
```bash
cd backend
uv sync
uv run uvicorn main:app --reload --port 8000
```

API будет доступно по адресу: http://localhost:8000/docs

## Docker
```bash
docker build -t taskflow .
docker run -p 8000:8000 taskflow
```

Проект состоит из отдельного React-приложения и FastAPI API, которые работают вместе через localhost на разных портах.