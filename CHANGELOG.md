# Changelog

История развития TaskFlow по версиям.

## v1.2 — UI roadmap, тёмная тема и актуальная архитектура

### Интерфейс

- Добавлена светлая и тёмная тема с сохранением выбора в `localStorage`.
- Добавлен переключатель темы в шапке и тёмные варианты для доски, списка, Sidebar и модальных окон.
- Создан проект `Observability Roadmap` со стартовыми задачами из `plan.md`.
- Этапы Docker Compose и Prometheus отмечены выполненными; задачи Grafana отмечены как выполняемые.
- Добавлена безопасная миграция стартовых задач без удаления сохранённых пользовательских данных.
- Задачи получили связь с проектом; Sidebar теперь действительно фильтрует задачи по выбранному проекту.

### Документация

- Окно архитектуры в UI обновлено под React, Caddy, FastAPI, PostgreSQL и Prometheus.
- README и `plan.md` синхронизированы с текущей структурой и состоянием проекта.

## v1.1 — PostgreSQL, Caddy и production frontend

TaskFlow v1.1 работает как full-stack приложение на React, FastAPI, PostgreSQL и Caddy.

### Хранение данных

- SQLite заменён на PostgreSQL 16.
- В Docker Compose добавлен отдельный сервис PostgreSQL.
- Данные PostgreSQL сохраняются в постоянном Docker volume.
- Добавлены healthcheck PostgreSQL и передача `DATABASE_URL` в FastAPI.

### Backend и асинхронность

- Backend переведён на асинхронные SQLAlchemy-сессии и CRUD-операции.
- Запросы используют `AsyncSession`, `select()` и `await`.
- FastAPI запускается через Gunicorn с несколькими workers и репликами.
- Добавлена защита инициализации схемы PostgreSQL advisory lock-ом, чтобы workers не создавали ENUM одновременно.

### Frontend и раздача приложения

- React frontend собирается в production через Vite.
- Caddy отдаёт собранные `index.html`, JavaScript и CSS из `dist/`.
- Запросы `/api/*`, `/docs` и `/openapi.json` проксируются в FastAPI.
- Неизвестные frontend-маршруты возвращают собранный `index.html`.

### Инфраструктура

- Caddy добавлен как reverse proxy и единая точка входа приложения.
- Dockerfile разделён на этапы сборки React, Caddy и production-образа FastAPI.
- FastAPI и PostgreSQL запускаются через Docker Compose.

## v1.0 — базовая версия

- React frontend запускался отдельно через Vite.
- FastAPI backend запускался на отдельном порту.
- Данные хранились в SQLite.
- Docker использовался для упаковки приложения.
- Frontend и API не были объединены общим reverse proxy.
- Production-раздача React-сборки через Caddy отсутствовала.
