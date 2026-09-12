import { Project } from '../types';

interface SidebarProps {
  projects: Project[];
  selectedProject: number | null;
  onSelectProject: (id: number | null) => void;
  onNewProject: () => void;
  onDeleteProject: (id: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  stats: { total: number; todo: number; inProgress: number; done: number };
}

export default function Sidebar({
  projects,
  selectedProject,
  onSelectProject,
  onNewProject,
  onDeleteProject,
  isOpen,
  onToggle,
  stats,
}: SidebarProps) {
  if (!isOpen) return null;

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-bolt text-white text-sm"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">TaskFlow</h1>
            <p className="text-xs text-gray-500">Full-Stack Demo</p>
          </div>
          <button onClick={onToggle} className="ml-auto text-gray-400 hover:text-gray-600">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Статистика</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500">Всего</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-xs text-blue-500">В работе</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-amber-600">{stats.todo}</div>
            <div className="text-xs text-amber-500">К выполнению</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-600">{stats.done}</div>
            <div className="text-xs text-green-500">Готово</div>
          </div>
        </div>
      </div>

      {/* All Tasks */}
      <div className="p-4">
        <button
          onClick={() => onSelectProject(null)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
            selectedProject === null
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <i className="fas fa-layer-group text-sm"></i>
          <span className="font-medium text-sm">Все задачи</span>
          <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {stats.total}
          </span>
        </button>
      </div>

      {/* Projects */}
      <div className="flex-1 overflow-auto px-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Проекты</h3>
          <button
            onClick={onNewProject}
            className="text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <i className="fas fa-plus text-xs"></i>
          </button>
        </div>
        <div className="space-y-1">
          {projects.map(project => (
            <div
              key={project.id}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                selectedProject === project.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onSelectProject(project.id)}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
              ></div>
              <span className="font-medium text-sm truncate flex-1">{project.name}</span>
              <span className="text-xs text-gray-400">{project.tasks_count}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
              >
                <i className="fas fa-trash-alt text-xs"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <i className="fab fa-react text-blue-400"></i>
          <span>React</span>
          <span className="mx-1">•</span>
          <i className="fab fa-python text-yellow-500"></i>
          <span>FastAPI</span>
          <span className="mx-1">•</span>
          <i className="fas fa-database text-green-500"></i>
          <span>SQLAlchemy</span>
        </div>
      </div>
    </aside>
  );
}
