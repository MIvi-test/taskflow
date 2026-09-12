export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  color: string;
  tasks_count: number;
  created_at: string;
}

export type ViewMode = 'board' | 'list';
export type FilterStatus = 'all' | 'todo' | 'in_progress' | 'done';
