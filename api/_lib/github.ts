// Minimal GitHub Contents API client using native fetch (no Octokit dependency).
// Reads/writes a single file in the repo. The token is server-only.
import { getGitHubConfig } from './env.js';

const API = 'https://api.github.com';

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'website26-admin',
  };
}

export interface FileState {
  sha: string;
  content: unknown;
}

/** Fetch a JSON file's parsed content and blob SHA (needed to update it). */
export async function getJsonFile(path: string): Promise<FileState> {
  const { token, repo, branch } = getGitHubConfig();
  const url = `${API}/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) {
    throw new Error(`GitHub GET ${path} failed: ${res.status}`);
  }
  const data = (await res.json()) as { sha: string; content: string; encoding: string };
  const decoded = Buffer.from(data.content, data.encoding as BufferEncoding).toString('utf-8');
  return { sha: data.sha, content: JSON.parse(decoded) };
}

/**
 * Commit new JSON for a file. `sha` must be the CURRENT blob sha (fetch it
 * immediately before to avoid stale-SHA conflicts). Returns the commit sha.
 */
export async function putJsonFile(path: string, value: unknown, sha: string, message: string): Promise<string> {
  const { token, repo, branch } = getGitHubConfig();
  const url = `${API}/repos/${repo}/contents/${encodeURIComponent(path)}`;
  const body = {
    message,
    content: Buffer.from(JSON.stringify(value, null, 2) + '\n', 'utf-8').toString('base64'),
    sha,
    branch,
  };
  const res = await fetch(url, { method: 'PUT', headers: headers(token), body: JSON.stringify(body) });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub PUT ${path} failed: ${res.status} ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { commit?: { sha?: string } };
  return data.commit?.sha ?? '';
}
