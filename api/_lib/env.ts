// Centralized env access. Every getter FAILS CLOSED: if a required secret is
// missing/misconfigured, it throws and the caller returns 500 rather than
// degrading into an insecure state.

export class ConfigError extends Error {}

function required(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === '') {
    throw new ConfigError(`Missing required env var: ${name}`);
  }
  return v;
}

export function getJwtSecret(): Uint8Array {
  const secret = required('JWT_SECRET');
  if (secret.length < 32) {
    throw new ConfigError('JWT_SECRET must be at least 32 characters');
  }
  return new TextEncoder().encode(secret);
}

export function getAdminPasswordHash(): string {
  return required('ADMIN_PASSWORD_HASH');
}

export function getGitHubConfig() {
  return {
    token: required('GITHUB_TOKEN'),
    repo: required('GITHUB_REPO'), // "owner/repo"
    branch: process.env.GITHUB_BRANCH?.trim() || 'main',
  };
}
