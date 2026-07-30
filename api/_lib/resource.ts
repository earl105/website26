// Shared GET/POST handler for the JSON resources (projects, jobs). Centralizing
// this keeps the security ordering identical for both: auth first, origin check
// on writes, strict validation, then a fresh-SHA commit.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendJson, isSameOrigin, parseBody } from './http.js';
import { requireAuth, Unauthorized } from './auth.js';
import { ConfigError } from './env.js';
import { getJsonFile, putJsonFile } from './github.js';
import type { ValidationResult } from './validate.js';

interface ResourceOptions {
  path: string;
  commitMessage: string;
  validate: (input: unknown) => ValidationResult<unknown>;
}

export async function handleResource(
  req: VercelRequest,
  res: VercelResponse,
  opts: ResourceOptions,
): Promise<void> {
  try {
    if (req.method === 'GET') {
      await requireAuth(req);
      const file = await getJsonFile(opts.path);
      return sendJson(res, 200, { data: file.content, sha: file.sha });
    }

    if (req.method === 'POST') {
      // CSRF defense-in-depth, then real auth.
      if (!isSameOrigin(req)) return sendJson(res, 403, { error: 'Bad origin' });
      await requireAuth(req);

      const body = parseBody(req);
      const result = opts.validate(body.data);
      if (!result.ok) {
        return sendJson(res, 400, { error: 'Validation failed', details: result.errors.slice(0, 50) });
      }

      // Fetch the current SHA immediately before writing to avoid stale-SHA conflicts.
      const current = await getJsonFile(opts.path);
      const commit = await putJsonFile(opts.path, result.value, current.sha, opts.commitMessage);
      return sendJson(res, 200, { ok: true, commit });
    }

    res.setHeader('Allow', 'GET, POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    if (err instanceof Unauthorized) return sendJson(res, 401, { error: 'Unauthorized' });
    if (err instanceof ConfigError) {
      console.error('Config error:', err.message);
      return sendJson(res, 500, { error: 'Server not configured' });
    }
    console.error(`Resource error (${opts.path}):`, err);
    return sendJson(res, 502, { error: 'Upstream error' });
  }
}
