// Shared contracts for the admin GUI. Mirror the server-side validators in
// api/_lib/validate.ts — keep them in sync.

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  github_url: string | null;
  demo_url: string | null;
  screenshot_url: string | null;
  clickable: boolean;
  clickable_override: boolean;
  sort_order: number;
}

export type JobIconKey = 'code' | 'cart' | 'box' | 'tag';
export const JOB_ICONS: JobIconKey[] = ['code', 'cart', 'box', 'tag'];

export interface JobRecord {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  summary: string;
  icon: JobIconKey;
  color: string;
  file: string;
  bullets: string[];
  logo_url: string | null;
  sort_order: number;
}
