export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  project_id?: number | null;
  /** Технический ключ встроенной roadmap-задачи. Не используется для пользовательских задач. */
  seed_key?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  color: string;
  tasks_count: number;
  /** Технический ключ встроенного проекта. */
  seed_key?: string;
  created_at: string;
}

export type ViewMode = 'board' | 'list';
export type FilterStatus = 'all' | 'todo' | 'in_progress' | 'done';
export type Theme = 'light' | 'dark';

export type TaskDraft = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'seed_key'>;
export type ProjectDraft = Omit<Project, 'id' | 'tasks_count' | 'created_at' | 'seed_key'>;
