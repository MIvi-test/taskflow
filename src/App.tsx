import { useState, useEffect, useCallback } from 'react';
import { Task, Project, ViewMode, FilterStatus, TaskDraft, ProjectDraft } from './types';
import {
  initializeStorage,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getProjects,
  createProject,
  deleteProject,
} from './api';
import Sidebar from './components/Sidebar';
import TaskBoard from './components/TaskBoard';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import ProjectModal from './components/ProjectModal';
import Header from './components/Header';
import BackendInfo from './components/BackendInfo';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, setTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showBackendInfo, setShowBackendInfo] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadData = useCallback(async () => {
    initializeStorage();
    const [tasksData, projectsData] = await Promise.all([getTasks(), getProjects()]);
    setTasks(tasksData);
    // В localStorage число задач могло устареть. Считаем его от фактических
    // задач, чтобы Sidebar всегда показывал корректное значение.
    setProjects(projectsData.map(project => ({
      ...project,
      tasks_count: tasksData.filter(task => task.project_id === project.id).length,
    })));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTask = async (taskData: TaskDraft) => {
    await createTask(taskData);
    await loadData();
    setShowTaskModal(false);
  };

  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    await updateTask(id, updates);
    await loadData();
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
    await loadData();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleCreateProject = async (projectData: ProjectDraft) => {
    await createProject(projectData);
    await loadData();
    setShowProjectModal(false);
  };

  const handleDeleteProject = async (id: number) => {
    await deleteProject(id);
    if (selectedProject === id) setSelectedProject(null);
    await loadData();
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedProject !== null && task.project_id !== selectedProject) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onNewProject={() => setShowProjectModal(true)}
        onDeleteProject={handleDeleteProject}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        stats={stats}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewTask={() => { setEditingTask(null); setShowTaskModal(true); }}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onShowBackendInfo={() => setShowBackendInfo(true)}
          theme={theme}
          onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        />

        <main className="flex-1 overflow-auto p-6">
          {viewMode === 'board' ? (
            <TaskBoard
              tasks={filteredTasks}
              onEditTask={handleEditTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <TaskList
              tasks={filteredTasks}
              onEditTask={handleEditTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </main>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          projects={projects}
          onSave={editingTask
            ? (data: Partial<Task>) => handleUpdateTask(editingTask.id, data).then(() => setShowTaskModal(false))
            : handleCreateTask
          }
          onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
        />
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <ProjectModal
          onSave={handleCreateProject}
          onClose={() => setShowProjectModal(false)}
        />
      )}

      {/* Backend Info Modal */}
      {showBackendInfo && (
        <BackendInfo onClose={() => setShowBackendInfo(false)} />
      )}
    </div>
  );
}
