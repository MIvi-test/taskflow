# TaskFlow

TaskFlow — учебное full-stack приложение для управления задачами и изучения эксплуатации сервиса. В нём есть React-интерфейс, FastAPI REST API, PostgreSQL, production-подобный Docker Compose и базовый мониторинг Prometheus.

## Текущее состояние: v1.3

Интерфейс поддерживает светлую и тёмную темы, показывает roadmap эксплуатации и хранит данные доски в `localStorage` браузера. FastAPI с PostgreSQL реализованы как отдельный REST API, но React-клиент пока не использует API для CRUD-операций. Для наблюдаемости добавлены Prometheus, node_exporter и Grafana с автоматически подключаемым datasource Prometheus.

## Архитектура

```text
Browser
  ├── /        → Caddy → React production build
  └── /api/*   → Caddy → FastAPI (3 replicas) → PostgreSQL

Prometheus
  ├── fastapi:8000/metrics
  └── node-exporter:9100/metrics

Grafana
  └── Prometheus datasource → Prometheus
```

## Стек

- Frontend: React 18, TypeScript, Vite, Tailwind CSS 4
- Backend: FastAPI, SQLAlchemy 2.0, psycopg 3, Gunicorn
- Database: PostgreSQL 16
- Reverse proxy: Caddy
- Monitoring: Prometheus, node_exporter и Grafana
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
grafana/provisioning/        # datasource Grafana
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
- Grafana: `http://localhost:3000`
- healthcheck API: `http://localhost/api/health`

Prometheus и Grafana открыты только на `127.0.0.1`; это намеренное ограничение, чтобы не публиковать интерфейсы мониторинга наружу. Логин и пароль администратора Grafana задаются переменными `GRAFANA_ADMIN_USER` и `GRAFANA_ADMIN_PASSWORD` в `.env`.

При первом запуске Compose создаёт постоянный volume `grafana_data`, а datasource Prometheus подключается через provisioning.

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

Grafana использует Prometheus как datasource. После входа через `http://localhost:3000` метрики доступны для построения дашбордов; готовые RED-дашборды и алерты входят в следующий этап развития проекта.

История изменений — в [CHANGELOG.md](CHANGELOG.md), план развития — в [plan.md](plan.md).
