import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onUpdateTask: (id: number, updates: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
}

const statusConfig = {
  todo: { label: 'К выполнению', color: 'bg-amber-100 text-amber-700' },
  in_progress: { label: 'В работе', color: 'bg-blue-100 text-blue-700' },
  done: { label: 'Готово', color: 'bg-green-100 text-green-700' },
};

const priorityConfig = {
  high: { label: 'Высокий', color: 'text-red-600', icon: 'fa-arrow-up' },
  medium: { label: 'Средний', color: 'text-amber-600', icon: 'fa-minus' },
  low: { label: 'Низкий', color: 'text-green-600', icon: 'fa-arrow-down' },
};

export default function TaskList({ tasks, onEditTask, onUpdateTask, onDeleteTask }: TaskListProps) {
  const handleStatusToggle = (task: Task) => {
    const statusFlow: Task['status'][] = ['todo', 'in_progress', 'done'];
    const currentIndex = statusFlow.indexOf(task.status);
    const nextStatus = statusFlow[(currentIndex + 1) % statusFlow.length];
    onUpdateTask(task.id, { status: nextStatus });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
        <div className="col-span-1"></div>
        <div className="col-span-4">Задача</div>
        <div className="col-span-2">Статус</div>
        <div className="col-span-2">Приоритет</div>
        <div className="col-span-2">Обновлено</div>
        <div className="col-span-1"></div>
      </div>

      {/* Tasks */}
      <div className="divide-y divide-gray-100 dark:divide-slate-800">
        {tasks.map(task => (
          <div
            key={task.id}
            className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 dark:hover:bg-slate-800/70 transition-colors group cursor-pointer"
            onClick={() => onEditTask(task)}
          >
            {/* Checkbox */}
            <div className="col-span-1">
              <button
                onClick={(e) => { e.stopPropagation(); handleStatusToggle(task); }}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.status === 'done'
                    ? 'bg-green-500 border-green-500 text-white'
                    : task.status === 'in_progress'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 dark:border-slate-600 hover:border-indigo-500'
                }`}
              >
                {task.status === 'done' && <i className="fas fa-check text-xs"></i>}
                {task.status === 'in_progress' && <i className="fas fa-spinner fa-spin text-xs text-blue-500"></i>}
              </button>
            </div>

            {/* Title & Description */}
            <div className="col-span-4">
                <h3 className={`font-medium text-sm ${task.status === 'done' ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-900 dark:text-slate-100'}`}>
                {task.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 truncate">{task.description}</p>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[task.status].color}`}>
                {statusConfig[task.status].label}
              </span>
            </div>

            {/* Priority */}
            <div className="col-span-2">
              <span className={`inline-flex items-center gap-1 text-xs font-medium ${priorityConfig[task.priority].color}`}>
                <i className={`fas ${priorityConfig[task.priority].icon} text-xs`}></i>
                {priorityConfig[task.priority].label}
              </span>
            </div>

            {/* Date */}
            <div className="col-span-2 text-xs text-gray-500 dark:text-slate-400">
              {new Date(task.updated_at).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>

            {/* Delete */}
            <div className="col-span-1 flex justify-end">
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all p-1"
              >
                <i className="fas fa-trash-alt text-xs"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-slate-500">
          <i className="fas fa-search text-3xl mb-3 block"></i>
          <p className="text-sm">Задачи не найдены</p>
        </div>
      )}
    </div>
  );
}
