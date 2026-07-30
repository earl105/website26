// Typed client for the /api/admin endpoints. Cookies (the httpOnly session)
// are sent automatically for these same-origin requests.
import type { Project, JobRecord } from './types';

export class ApiError extends Error {
  status: number;
  details?: string[];
  constructor(message: string, status: number, details?: string[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* no body */
  }
  const b = (body ?? {}) as { error?: string; details?: string[] };
  if (!res.ok) {
    throw new ApiError(b.error || res.statusText, res.status, b.details);
  }
  return body as T;
}

export const getSession = (): Promise<boolean> =>
  req<{ authenticated: boolean }>('/api/admin/session')
    .then((b) => b.authenticated)
    .catch(() => false);

export const login = (password: string): Promise<{ ok: boolean }> =>
  req('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });

export const logout = (): Promise<{ ok: boolean }> =>
  req('/api/admin/logout', { method: 'POST', body: '{}' });

export const getProjects = (): Promise<{ data: Project[]; sha: string }> =>
  req('/api/admin/projects');

export const saveProjects = (data: Project[]): Promise<{ ok: boolean; commit: string }> =>
  req('/api/admin/projects', { method: 'POST', body: JSON.stringify({ data }) });

export const getJobs = (): Promise<{ data: JobRecord[]; sha: string }> =>
  req('/api/admin/jobs');

export const saveJobs = (data: JobRecord[]): Promise<{ ok: boolean; commit: string }> =>
  req('/api/admin/jobs', { method: 'POST', body: JSON.stringify({ data }) });
