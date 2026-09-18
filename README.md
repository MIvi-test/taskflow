# TaskFlow

TaskFlow — учебное full-stack приложение для управления задачами и изучения эксплуатации сервиса. В нём есть React-интерфейс, FastAPI REST API, PostgreSQL, production-подобный Docker Compose и базовый мониторинг Prometheus.

## Текущее состояние: v1.2

Интерфейс поддерживает светлую и тёмную темы, показывает roadmap эксплуатации и хранит данные доски в `localStorage` браузера. FastAPI с PostgreSQL уже реализованы как отдельный REST API, но React-клиент пока не использует API для CRUD-операций.

## Архитектура

```text
Browser
  ├── /        → Caddy → React production build
  └── /api/*   → Caddy → FastAPI (3 replicas) → PostgreSQL

Prometheus
  ├── fastapi:8000/metrics
  └── node-exporter:9100/metrics
```

## Стек

- Frontend: React 18, TypeScript, Vite, Tailwind CSS 4
- Backend: FastAPI, SQLAlchemy 2.0, psycopg 3, Gunicorn
- Database: PostgreSQL 16
- Reverse proxy: Caddy
- Monitoring: Prometheus и node_exporter
- Containerization: Docker Compose

## Структура проекта

```text
src/
├── components/       # интерфейс React
├── data/roadmap.ts   # стартовые задачи roadmap
├── hooks/useTheme.ts # управление темой
├── api.ts            # localStorage-репозиторий доски
└── App.tsx

backend/
├── routers/          # API задач и проектов
├── main.py           # FastAPI, healthcheck и /metrics
├── observability.py  # Prometheus Counter, Histogram и Gauge
├── database.py       # async SQLAlchemy-пул
├── models.py         # ORM-модели PostgreSQL
└── pyproject.toml    # Python-зависимости

monitoring/prometheus.yaml
docker-compose.yaml · Dockerfile · Caddyfile · plan.md
```

## Быстрый старт

```bash
docker compose up --build
```

После запуска:

- приложение: `http://localhost`
- Swagger: `http://localhost/docs`
- Prometheus: `http://localhost:9090`
- healthcheck API: `http://localhost/api/health`

Prometheus открыт только на `127.0.0.1:9090`; это намеренное ограничение, чтобы не публиковать интерфейс мониторинга наружу.

## Локальная разработка

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
cd backend
uv sync
uv run uvicorn main:app --reload --port 8000
```

Проверки frontend:

```bash
npm run typecheck
npm run build
```

## Мониторинг

FastAPI отдаёт прикладные HTTP-метрики на `/metrics`:

- `http_requests_total` — число запросов по методу, маршруту и коду ответа;
- `http_request_duration_seconds` — длительность обработки запросов;
- `http_requests_in_progress` — число выполняющихся запросов.

Prometheus забирает эти данные каждые 15 секунд. Статус целей доступен в интерфейсе Prometheus: `Status → Targets`.

История изменений — в [CHANGELOG.md](CHANGELOG.md), план развития — в [plan.md](plan.md).
