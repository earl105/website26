import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendJson, isSameOrigin } from '../_lib/http.js';
import { clearSessionCookie } from '../_lib/auth.js';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }
  if (!isSameOrigin(req)) return sendJson(res, 403, { error: 'Bad origin' });

  res.setHeader('Set-Cookie', clearSessionCookie());
  return sendJson(res, 200, { ok: true });
}
