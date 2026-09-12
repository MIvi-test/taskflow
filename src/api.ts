import { Task, Project } from './types';

// API base URL - change this when running FastAPI backend
const API_BASE = 'http://localhost:8000/api';

// For demo purposes, we use localStorage
// When backend is running, switch to fetch calls

const STORAGE_KEYS = {
  tasks: 'taskflow_tasks',
  projects: 'taskflow_projects',
};

// Helper to get data from localStorage
function getFromStorage<T>(key: string, defaultValue: T[]): T[] {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Default data
const defaultTasks: Task[] = [
  {
    id: 1,
    title: 'Настроить базу данных',
    description: 'Инициализировать SQLAlchemy модели и создать миграции через Alembic',
    status: 'done',
    priority: 'high',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T14:00:00Z',
  },
  {
    id: 2,
    title: 'Создать REST API endpoints',
    description: 'Реализовать CRUD операции для задач и проектов через FastAPI',
    status: 'in_progress',
    priority: 'high',
    created_at: '2026-01-16T09:00:00Z',
    updated_at: '2026-01-17T11:00:00Z',
  },
  {
    id: 3,
    title: 'Добавить авторизацию',
    description: 'Реализовать JWT токены и middleware для защиты endpoints',
    status: 'todo',
    priority: 'medium',
    created_at: '2026-01-17T08:00:00Z',
    updated_at: '2026-01-17T08:00:00Z',
  },
  {
    id: 4,
    title: 'Сверстать фронтенд',
    description: 'Создать React компоненты с Tailwind CSS для управления задачами',
    status: 'in_progress',
    priority: 'medium',
    created_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-01-19T15:00:00Z',
  },
  {
    id: 5,
    title: 'Написать тесты',
    description: 'Покрыть API endpoints unit и integration тестами с pytest',
    status: 'todo',
    priority: 'low',
    created_at: '2026-01-19T12:00:00Z',
    updated_at: '2026-01-19T12:00:00Z',
  },
  {
    id: 6,
    title: 'Деплой на сервер',
    description: 'Настроить Docker контейнеры и развернуть приложение',
    status: 'todo',
    priority: 'low',
    created_at: '2026-01-20T09:00:00Z',
    updated_at: '2026-01-20T09:00:00Z',
  },
];

const defaultProjects: Project[] = [
  {
    id: 1,
    name: 'TaskFlow Backend',
    description: 'FastAPI + SQLAlchemy серверная часть',
    color: '#6366f1',
    tasks_count: 3,
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'TaskFlow Frontend',
    description: 'React + Tailwind клиентская часть',
    color: '#06b6d4',
    tasks_count: 2,
    created_at: '2026-01-18T10:00:00Z',
  },
  {
    id: 3,
    name: 'DevOps',
    description: 'Деплой и инфраструктура',
    color: '#10b981',
    tasks_count: 1,
    created_at: '2026-01-20T09:00:00Z',
  },
];

// Initialize storage with defaults if empty
export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.tasks)) {
    saveToStorage(STORAGE_KEYS.tasks, defaultTasks);
  }
  if (!localStorage.getItem(STORAGE_KEYS.projects)) {
    saveToStorage(STORAGE_KEYS.projects, defaultProjects);
  }
}

// Tasks API
export async function getTasks(): Promise<Task[]> {
  return getFromStorage<Task>(STORAGE_KEYS.tasks, defaultTasks);
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
  const tasks = getFromStorage<Task>(STORAGE_KEYS.tasks, []);
  const newTask: Task = {
    ...task,
    id: Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveToStorage(STORAGE_KEYS.tasks, tasks);
  return newTask;
}

export async function updateTask(id: number, updates: Partial<Task>): Promise<Task | null> {
  const tasks = getFromStorage<Task>(STORAGE_KEYS.tasks, []);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...updates, updated_at: new Date().toISOString() };
  saveToStorage(STORAGE_KEYS.tasks, tasks);
  return tasks[index];
}

export async function deleteTask(id: number): Promise<boolean> {
  const tasks = getFromStorage<Task>(STORAGE_KEYS.tasks, []);
  const filtered = tasks.filter(t => t.id !== id);
  if (filtered.length === tasks.length) return false;
  saveToStorage(STORAGE_KEYS.tasks, filtered);
  return true;
}

// Projects API
export async function getProjects(): Promise<Project[]> {
  return getFromStorage<Project>(STORAGE_KEYS.projects, defaultProjects);
}

export async function createProject(project: Omit<Project, 'id' | 'tasks_count' | 'created_at'>): Promise<Project> {
  const projects = getFromStorage<Project>(STORAGE_KEYS.projects, []);
  const newProject: Project = {
    ...project,
    id: Date.now(),
    tasks_count: 0,
    created_at: new Date().toISOString(),
  };
  projects.push(newProject);
  saveToStorage(STORAGE_KEYS.projects, projects);
  return newProject;
}

export async function deleteProject(id: number): Promise<boolean> {
  const projects = getFromStorage<Project>(STORAGE_KEYS.projects, []);
  const filtered = projects.filter(p => p.id !== id);
  if (filtered.length === projects.length) return false;
  saveToStorage(STORAGE_KEYS.projects, filtered);
  return true;
}
