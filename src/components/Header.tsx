import { ViewMode, FilterStatus, Theme } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewTask: () => void;
  onToggleSidebar: () => void;
  onShowBackendInfo: () => void;
  theme: Theme;
  onThemeToggle: () => void;
}

export default function Header({
  viewMode,
  onViewModeChange,
  filterStatus,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onNewTask,
  onToggleSidebar,
  onShowBackendInfo,
  theme,
  onThemeToggle,
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4">
      <div className="flex items-center gap-4">
        {/* Sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 lg:hidden"
        >
          <i className="fas fa-bars text-lg"></i>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Поиск задач..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
          {[
            { value: 'all', label: 'Все', icon: 'fa-grip' },
            { value: 'todo', label: 'К выполнению', icon: 'fa-circle' },
            { value: 'in_progress', label: 'В работе', icon: 'fa-spinner' },
            { value: 'done', label: 'Готово', icon: 'fa-check-circle' },
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value as FilterStatus)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filterStatus === filter.value
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
              }`}
            >
              <i className={`fas ${filter.icon} mr-1`}></i>
              <span className="hidden sm:inline">{filter.label}</span>
            </button>
          ))}
        </div>

        {/* View Mode */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('board')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'board'
              ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            <i className="fas fa-columns mr-1"></i>
            <span className="hidden sm:inline">Доска</span>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'list'
              ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            <i className="fas fa-list mr-1"></i>
            <span className="hidden sm:inline">Список</span>
          </button>
        </div>

        {/* Backend Info */}
        <button
          onClick={onThemeToggle}
          className="px-3 py-2 text-gray-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 transition-colors"
          title={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
          aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
        >
          <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>

        <button
          onClick={onShowBackendInfo}
          className="px-3 py-2 text-gray-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 transition-colors"
          title="Информация о бэкенде"
        >
          <i className="fas fa-server"></i>
        </button>

        {/* New Task */}
        <button
          onClick={onNewTask}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <i className="fas fa-plus text-xs"></i>
          <span className="hidden sm:inline">Новая задача</span>
        </button>
      </div>
    </header>
  );
}
