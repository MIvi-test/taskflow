
# STAGE 1: build 
FROM node:22-slim AS builder

WORKDIR /app/

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

#STAGE 2: deps
FROM node:22-slim AS deps

WORKDIR /app/

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

### STAGE 3: Production Image
FROM python:3.14-slim AS production

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app/backend/

COPY backend/pyproject.toml backend/uv.lock ./

# RUN --mount=type=cache,target=/root/.cache/uv \
# uv sync --frozen --no-install-project --no-dev
RUN uv sync --frozen --no-install-project --no-dev

COPY ./backend/ ./

COPY --from=deps /app/node_modules /app/frontend/node_modules
COPY --from=builder /app/dist /app/frontend/dist

RUN groupadd -r appuser && useradd -r -g appuser appuser -d /app -s /sbin/nologin
RUN chown -R appuser:appuser /app


USER appuser

EXPOSE 8000

CMD ["uv", "run", "gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]