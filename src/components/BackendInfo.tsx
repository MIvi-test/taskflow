interface BackendInfoProps {
  onClose: () => void;
}

const endpoints = [
  { method: 'GET', path: '/api/tasks', desc: 'Список задач' },
  { method: 'POST', path: '/api/tasks', desc: 'Создание задачи' },
  { method: 'PUT', path: '/api/tasks/{id}', desc: 'Обновление задачи' },
  { method: 'DELETE', path: '/api/tasks/{id}', desc: 'Удаление задачи' },
  { method: 'GET', path: '/api/projects', desc: 'Список проектов' },
  { method: 'GET', path: '/api/health', desc: 'Healthcheck приложения' },
  { method: 'GET', path: '/metrics', desc: 'Метрики Prometheus' },
];

const methodColor: Record<string, string> = {
  GET: 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  PUT: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
};

export default function BackendInfo({ onClose }: BackendInfoProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-sitemap text-white text-sm"></i>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Архитектура TaskFlow</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors" aria-label="Закрыть">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6 overflow-auto flex-1 space-y-6 text-sm">
          <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/70 bg-indigo-50 dark:bg-indigo-950/40 p-4 text-indigo-950 dark:text-indigo-100">
            <p className="font-medium">Текущий источник данных доски — localStorage браузера.</p>
            <p className="mt-1 text-indigo-800 dark:text-indigo-200">FastAPI и PostgreSQL уже готовы как отдельный REST API, но React-клиент пока не отправляет в него CRUD-запросы.</p>
          </div>

          <section className="bg-gray-50 dark:bg-slate-800/70 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
              <i className="fas fa-diagram-project text-indigo-500"></i>
              Поток запросов и мониторинга
            </h3>
            <pre className="mt-3 text-xs leading-5 text-gray-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-950 rounded-lg p-4 overflow-x-auto border border-gray-200 dark:border-slate-700">{`Browser
  ├── /        → Caddy → React production build
  └── /api/*   → Caddy → FastAPI (3 replicas) → PostgreSQL

Prometheus
  ├── fastapi:8000/metrics
  └── node-exporter:9100/metrics`}</pre>
          </section>

          <section className="bg-gray-50 dark:bg-slate-800/70 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
              <i className="fas fa-folder-tree text-purple-500"></i>
              Структура проекта
            </h3>
            <pre className="mt-3 text-xs leading-5 text-gray-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-950 rounded-lg p-4 overflow-x-auto border border-gray-200 dark:border-slate-700">{`src/
├── components/       # интерфейс React
├── data/roadmap.ts   # стартовые задачи roadmap
├── hooks/useTheme.ts # светлая и тёмная тема
├── api.ts            # localStorage-репозиторий доски
└── App.tsx

backend/
├── routers/          # API задач и проектов
├── main.py           # FastAPI, healthcheck и /metrics
├── observability.py  # Counter, Histogram и Gauge
├── database.py       # async SQLAlchemy-пул
├── models.py         # ORM-модели PostgreSQL
└── pyproject.toml    # Python-зависимости

monitoring/prometheus.yaml
docker-compose.yaml · Dockerfile · Caddyfile`}</pre>
          </section>

          <section className="bg-gray-50 dark:bg-slate-800/70 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
              <i className="fas fa-plug text-green-500"></i>
              API endpoints
            </h3>
            <div className="mt-3 space-y-2">
              {endpoints.map(endpoint => (
                <div key={`${endpoint.method}-${endpoint.path}`} className="flex items-center gap-3 text-xs bg-white dark:bg-slate-950 rounded-lg px-3 py-2 border border-gray-200 dark:border-slate-700">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold ${methodColor[endpoint.method]}`}>
                    {endpoint.method}
                  </span>
                  <code className="text-gray-700 dark:text-slate-200 font-mono">{endpoint.path}</code>
                  <span className="text-gray-500 dark:text-slate-400 ml-auto">{endpoint.desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ['React + TypeScript + Vite', 'Клиент и production-сборка'],
              ['FastAPI + SQLAlchemy', 'Асинхронный REST API'],
              ['PostgreSQL 16', 'Постоянное хранилище API'],
              ['Caddy', 'Reverse proxy и раздача frontend'],
              ['Prometheus + node_exporter', 'Метрики приложения и хоста'],
              ['Docker Compose', 'Локальная production-подобная среда'],
            ].map(([name, description]) => (
              <div key={name} className="bg-gray-50 dark:bg-slate-800/70 rounded-lg p-3">
                <p className="font-medium text-gray-800 dark:text-slate-100">{name}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{description}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
