import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendJson } from '../_lib/http.js';
import { requireAuth } from '../_lib/auth.js';

// Lightweight check for the client route guard. Always 200 with a boolean so
// the SPA can decide whether to show the login screen. Real enforcement lives
// on the data endpoints, not here.
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }
  try {
    await requireAuth(req);
    return sendJson(res, 200, { authenticated: true });
  } catch {
    return sendJson(res, 200, { authenticated: false });
  }
}
