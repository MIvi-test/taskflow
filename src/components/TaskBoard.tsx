import { Task } from '../types';

interface TaskBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onUpdateTask: (id: number, updates: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
}

const columns = [
  { status: 'todo' as const, title: 'К выполнению', color: 'amber', icon: 'fa-circle' },
  { status: 'in_progress' as const, title: 'В работе', color: 'blue', icon: 'fa-spinner' },
  { status: 'done' as const, title: 'Готово', color: 'green', icon: 'fa-check-circle' },
];

const priorityConfig = {
  high: { label: 'Высокий', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  medium: { label: 'Средний', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  low: { label: 'Низкий', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
};

export default function TaskBoard({ tasks, onEditTask, onUpdateTask, onDeleteTask }: TaskBoardProps) {
  const handleStatusChange = (taskId: number, newStatus: Task['status']) => {
    onUpdateTask(taskId, { status: newStatus });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {columns.map(column => {
        const columnTasks = tasks.filter(t => t.status === column.status);
        return (
          <div key={column.status} className="flex flex-col">
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-4">
              <i className={`fas ${column.icon} text-${column.color}-500`}></i>
              <h2 className="font-semibold text-gray-800 dark:text-slate-200">{column.title}</h2>
              <span className="ml-auto text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                {columnTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="flex-1 space-y-3 overflow-auto">
              {columnTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md dark:hover:shadow-black/30 transition-shadow group cursor-pointer"
                  onClick={() => onEditTask(task)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-slate-100 text-sm leading-tight">{task.title}</h3>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all flex-shrink-0"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-3 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${priorityConfig[task.priority].color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig[task.priority].dot}`}></span>
                      {priorityConfig[task.priority].label}
                    </span>
                    <div className="flex gap-1">
                      {column.status !== 'todo' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const prevStatus = column.status === 'done' ? 'in_progress' : 'todo';
                            handleStatusChange(task.id, prevStatus);
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                          title="Назад"
                        >
                          <i className="fas fa-chevron-left text-xs"></i>
                        </button>
                      )}
                      {column.status !== 'done' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextStatus = column.status === 'todo' ? 'in_progress' : 'done';
                            handleStatusChange(task.id, nextStatus);
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                          title="Вперёд"
                        >
                          <i className="fas fa-chevron-right text-xs"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400 dark:text-slate-500">
                    {new Date(task.updated_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              ))}
              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400 dark:text-slate-500 text-sm">
                  <i className="fas fa-inbox text-2xl mb-2 block"></i>
                  Нет задач
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
