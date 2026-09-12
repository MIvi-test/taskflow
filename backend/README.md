# TaskFlow — Full-Stack Task Manager

Пет-проект для демонстрации фулл-стек разработки.

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│              Tailwind CSS + TypeScript               │
│                    Port 5173                         │
└───────────────────────┬─────────────────────────────┘
                        │ HTTP/REST API
┌───────────────────────▼─────────────────────────────┐
│                  Backend (FastAPI)                    │
│           SQLAlchemy ORM + Pydantic                   │
│                    Port 8000                         │
└───────────────────────┬─────────────────────────────┘
                        │ ORM
┌───────────────────────▼─────────────────────────────┐
│              Database (SQLite/PostgreSQL)             │
│                  taskflow.db                         │
└─────────────────────────────────────────────────────┘
```

## 🚀 Быстрый старт (Backend)

```bash
# 1. Перейти в папку backend
cd backend

# 2. Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# 3. Установить зависимости
pip install -r requirements.txt

# 4. Запустить сервер
uvicorn main:app --reload --port 8000

# 5. Открыть документацию Swagger UI
# http://localhost:8000/docs
```

## 📁 Структура Backend

```
backend/
├── main.py          # FastAPI приложение, CORS, роутеры
├── database.py      # SQLAlchemy engine, session, Base
├── models.py        # ORM модели (Task, Project)
├── schemas.py       # Pydantic схемы валидации
├── crud.py          # CRUD операции (Create, Read, Update, Delete)
├── routers/
│   ├── tasks.py     # API endpoints для задач
│   └── projects.py  # API endpoints для проектов
├── requirements.txt # Python зависимости
└── README.md        # Этот файл
```

## 🔌 API Endpoints

### Tasks
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | Получить все задачи |
| GET | `/api/tasks/{id}` | Получить задачу по ID |
| POST | `/api/tasks` | Создать задачу |
| PUT | `/api/tasks/{id}` | Обновить задачу |
| DELETE | `/api/tasks/{id}` | Удалить задачу |

### Projects
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | Получить все проекты |
| POST | `/api/projects` | Создать проект |
| DELETE | `/api/projects/{id}` | Удалить проект |

## 🛠️ Технологии

### Backend
- **Python 3.11+** — основной язык
- **FastAPI** — веб-фреймворк для API
- **SQLAlchemy 2.0** — ORM для работы с БД
- **Pydantic** — валидация данных
- **Uvicorn** — ASGI сервер
- **SQLite** — база данных (по умолчанию)

### Frontend
- **React 18** — UI библиотека
- **TypeScript** — типизация
- **Tailwind CSS** — стилизация
- **Vite** — сборщик

## 📝 Примеры запросов

### Создать задачу
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Изучить FastAPI",
    "description": "Пройти туториал и создать pet project",
    "status": "in_progress",
    "priority": "high"
  }'
```

### Получить все задачи
```bash
curl http://localhost:8000/api/tasks
```

### Обновить статус задачи
```bash
curl -X PUT http://localhost:8000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'
```

## 🔧 Переключение на PostgreSQL

1. Установите драйвер: `pip install psycopg2-binary`
2. В `database.py` измените URL:
```python
DATABASE_URL = "postgresql://user:password@localhost:5432/taskflow"
```

## 📄 Лицензия

MIT
