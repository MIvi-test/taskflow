import { Project, ProjectDraft, Task, TaskDraft } from './types';
import { observabilityProject, roadmapTasks } from './data/roadmap';

// API base URL - change this when running FastAPI backend
const API_BASE = 'http://localhost:8000/api';

// For demo purposes, we use localStorage
// When backend is running, switch to fetch calls

const STORAGE_KEYS = {
  tasks: 'taskflow_tasks',
  projects: 'taskflow_projects',
  roadmapVersion: 'taskflow_roadmap_version',
};

const ROADMAP_VERSION = 1;

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

const defaultTasks = roadmapTasks;
const defaultProjects = [observabilityProject];

function mergeSeedData<T extends { seed_key?: string }>(items: T[], seeds: T[]): T[] {
  const existingSeedKeys = new Set(
    items.flatMap(item => item.seed_key ? [item.seed_key] : []),
  );
  return [...items, ...seeds.filter(seed => {
    const seedKey = seed.seed_key;
    return seedKey !== undefined && !existingSeedKeys.has(seedKey);
  })];
}

// Initialize storage with defaults if empty
export function initializeStorage(): void {
  const hasTasks = Boolean(localStorage.getItem(STORAGE_KEYS.tasks));
  const hasProjects = Boolean(localStorage.getItem(STORAGE_KEYS.projects));

  if (!hasTasks) {
    saveToStorage(STORAGE_KEYS.tasks, defaultTasks);
  }
  if (!hasProjects) {
    saveToStorage(STORAGE_KEYS.projects, defaultProjects);
  }

  const savedVersion = Number(localStorage.getItem(STORAGE_KEYS.roadmapVersion) ?? 0);
  if (savedVersion < ROADMAP_VERSION) {
    // У пользователей со старой демо-доской сохраняем личные задачи и
    // добавляем только отсутствующие roadmap-задачи по стабильному seed_key.
    const tasks = getFromStorage<Task>(STORAGE_KEYS.tasks, []);
    const projects = getFromStorage<Project>(STORAGE_KEYS.projects, []);
    saveToStorage(STORAGE_KEYS.tasks, mergeSeedData(tasks, roadmapTasks));
    saveToStorage(STORAGE_KEYS.projects, mergeSeedData(projects, defaultProjects));
    localStorage.setItem(STORAGE_KEYS.roadmapVersion, String(ROADMAP_VERSION));
  }
}

// Tasks API
export async function getTasks(): Promise<Task[]> {
  return getFromStorage<Task>(STORAGE_KEYS.tasks, defaultTasks);
}

export async function createTask(task: TaskDraft): Promise<Task> {
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

export async function createProject(project: ProjectDraft): Promise<Project> {
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
