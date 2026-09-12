interface BackendInfoProps {
  onClose: () => void;
}

export default function BackendInfo({ onClose }: BackendInfoProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-server text-white text-sm"></i>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Backend: FastAPI + SQLAlchemy</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto flex-1">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 mb-4">
              Этот фронтенд работает с localStorage для демонстрации. 
              Ниже — готовый код бэкенда на <strong>FastAPI + SQLAlchemy</strong>, который можно запустить отдельно.
            </p>

            {/* Architecture */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i className="fas fa-sitemap text-indigo-500"></i>
                Архитектура проекта
              </h3>
              <pre className="text-xs text-gray-700 font-mono bg-white rounded-lg p-4 overflow-x-auto border">
{`backend/
├── main.py          # FastAPI приложение
├── database.py      # Настройка SQLAlchemy
├── models.py        # ORM модели (Task, Project)
├── schemas.py       # Pydantic схемы
├── crud.py          # CRUD операции
├── routers/
│   ├── tasks.py     # API роутер задач
│   └── projects.py  # API роутер проектов
├── requirements.txt
└── README.md`}
              </pre>
            </div>

            {/* API Endpoints */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i className="fas fa-plug text-green-500"></i>
                API Endpoints
              </h3>
              <div className="space-y-2">
                {[
                  { method: 'GET', path: '/api/tasks', desc: 'Получить все задачи' },
                  { method: 'POST', path: '/api/tasks', desc: 'Создать задачу' },
                  { method: 'GET', path: '/api/tasks/{id}', desc: 'Получить задачу по ID' },
                  { method: 'PUT', path: '/api/tasks/{id}', desc: 'Обновить задачу' },
                  { method: 'DELETE', path: '/api/tasks/{id}', desc: 'Удалить задачу' },
                  { method: 'GET', path: '/api/projects', desc: 'Получить все проекты' },
                  { method: 'POST', path: '/api/projects', desc: 'Создать проект' },
                  { method: 'DELETE', path: '/api/projects/{id}', desc: 'Удалить проект' },
                ].map((endpoint, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs bg-white rounded-lg px-3 py-2 border">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                      endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                      endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                      endpoint.method === 'PUT' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-gray-700 font-mono">{endpoint.path}</code>
                    <span className="text-gray-500 ml-auto">{endpoint.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Start */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i className="fas fa-rocket text-orange-500"></i>
                Быстрый старт
              </h3>
              <pre className="text-xs text-gray-700 font-mono bg-white rounded-lg p-4 overflow-x-auto border">
{`# 1. Перейти в папку backend
cd backend

# 2. Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\\Scripts\\activate  # Windows

# 3. Установить зависимости
pip install -r requirements.txt

# 4. Запустить сервер
uvicorn main:app --reload --port 8000

# 5. Открыть документацию API
# http://localhost:8000/docs`}
              </pre>
            </div>

            {/* Tech Stack */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i className="fas fa-layer-group text-purple-500"></i>
                Стек технологий
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <i className="fab fa-python text-yellow-500"></i>
                  <span>Python 3.11+</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="fas fa-bolt text-teal-500"></i>
                  <span>FastAPI</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="fas fa-database text-green-500"></i>
                  <span>SQLAlchemy 2.0</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="fas fa-check-circle text-blue-500"></i>
                  <span>Alembic (миграции)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="fab fa-react text-blue-400"></i>
                  <span>React 18</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <i className="fas fa-wind text-cyan-500"></i>
                  <span>Tailwind CSS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
