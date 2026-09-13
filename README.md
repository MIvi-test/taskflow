# TaskFlow

## Текущее состояние: v1.1

TaskFlow v1.1 — full-stack приложение на React, FastAPI, PostgreSQL и Caddy.
React-приложение собирается через Vite, Caddy отдаёт production-сборку frontend и проксирует API-запросы в FastAPI, а PostgreSQL хранит данные задач и проектов.

История версий и поэтапные изменения находятся в [CHANGELOG.md](CHANGELOG.md).

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
- Backend: FastAPI + SQLAlchemy 2.0 + Gunicorn
- База данных: PostgreSQL 16
- Асинхронность: Async SQLAlchemy + psycopg 3
- Reverse proxy и frontend server: Caddy
- Контейнеризация: Docker Compose

## Быстрый старт

### Локальная разработка frontend
```bash
npm install
npm run dev
```

Frontend будет доступен по адресу: http://localhost:5173

### Локальная разработка backend
```bash
cd backend
uv sync
uv run uvicorn main:app --reload --port 8000
```

API будет доступно по адресу: http://localhost:8000/docs

## Docker
```bash
docker compose up --build
```

После запуска приложение доступно по адресу http://localhost.

- Frontend: http://localhost
- API: http://localhost/api
- Swagger: http://localhost/docs
- PostgreSQL доступен внутри Docker-сети как `postgres:5432`

Остановка сервисов:

```bash
docker compose down
```

Для полного удаления данных PostgreSQL:

```bash
docker compose down -v
```