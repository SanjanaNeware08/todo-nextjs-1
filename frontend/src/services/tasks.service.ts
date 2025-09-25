import axios from 'axios';

export type Task = {
  _id: string;
  userId: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type TasksQuery = {
  status?: 'todo' | 'in_progress' | 'done';
  page?: number;
  limit?: number;
  search?: string;
  dueFrom?: string; // ISO date (YYYY-MM-DD)
  dueTo?: string;   // ISO date (YYYY-MM-DD)
};

export type TasksResponse = {
  success: boolean;
  message: string;
  tasks: Task[];
  pagination: {
    totalTasks: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }
}

function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function fetchTasks(query: TasksQuery = {}): Promise<TasksResponse> {
  const token = getTokenFromCookie();
  const params = new URLSearchParams();
  if (query.status) params.set('status', query.status);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);
  if (query.dueFrom) params.set('dueFrom', query.dueFrom);
  if (query.dueTo) params.set('dueTo', query.dueTo);

  const url = `http://localhost:4000/api/tasks?${params.toString()}`;
  const { data } = await axios.get<TasksResponse>(url, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return data;
}

type CreateTaskResponse = { success: boolean; message?: string; task: Task };

export async function createTask(payload: { title: string; description?: string; dueDate?: string; status?: Task['status'] }): Promise<CreateTaskResponse>{
  const token = getTokenFromCookie();
  const url = `http://localhost:4000/api/tasks`;
  const { data } = await axios.post<CreateTaskResponse>(url, payload, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return data;
}


