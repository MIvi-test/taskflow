# План развития TaskFlow

## Выполнено

- [x] Упаковать сервис: Docker Compose, PostgreSQL, три реплики FastAPI и Caddy.
- [x] Инструментировать сервис: RED-метрики FastAPI, Prometheus и node_exporter.

## В работе: Grafana и алерты

- [ ] Добавить Grafana в Docker Compose с постоянным volume.
- [ ] Подключить Prometheus как datasource через provisioning.
- [ ] Собрать RED-дашборд: RPS, p95 latency, error rate, активные запросы.
- [ ] Добавить Alertmanager и правила на рост p95 latency и 5xx.

## Следующие этапы

### Агрегация логов

- [ ] Добавить Loki и Promtail.
- [ ] Перевести логи FastAPI в структурированный формат с `request_id`.
- [ ] Связать логи со всплесками на дашборде и алертами.

### Управляемый сбой и документация

- [ ] Остановить реплику, создать нагрузку на CPU или задержку БД.
- [ ] Зафиксировать реакцию метрик, алертов и логов.
- [ ] Написать postmortem и runbook восстановления.

### DevSecOps (опционально)

- [ ] Добавить GitHub Actions.
- [ ] Запускать Bandit для Python-кода и Trivy для Docker-образа до деплоя.
