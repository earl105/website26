import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendJson, getClientIp, isSameOrigin, parseBody } from '../_lib/http.js';
import { rateLimit } from '../_lib/rateLimit.js';
import { verifyPassword } from '../_lib/password.js';
import { getAdminPasswordHash, ConfigError } from '../_lib/env.js';
import { signSession, sessionCookie } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }
  if (!isSameOrigin(req)) return sendJson(res, 403, { error: 'Bad origin' });

  // Rate limit to slow brute force: 5 attempts / 15 min per (trusted) IP, plus
  // a coarse global backstop so a distributed / IP-rotating attack is still
  // throttled. The global cap is generous enough that the single admin (who
  // needs only a handful of attempts) is not locked out in normal use.
  const window = 15 * 60 * 1000;
  const perIp = rateLimit(`login:${getClientIp(req)}`, 5, window);
  const global = rateLimit('login:_global', 100, window);
  if (!perIp.allowed || !global.allowed) {
    const retryAfter = Math.max(perIp.retryAfterSeconds, global.retryAfterSeconds);
    res.setHeader('Retry-After', String(retryAfter));
    return sendJson(res, 429, { error: 'Too many attempts. Try again later.' });
  }

  const body = parseBody(req);
  const password = typeof body.password === 'string' ? body.password : '';
  if (!password) return sendJson(res, 400, { error: 'Password required' });

  try {
    if (!verifyPassword(password, getAdminPasswordHash())) {
      // Generic message — don't reveal whether the account/format was the issue.
      return sendJson(res, 401, { error: 'Invalid credentials' });
    }
    const token = await signSession();
    res.setHeader('Set-Cookie', sessionCookie(token));
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error('Login config error:', err.message);
      return sendJson(res, 500, { error: 'Server not configured' });
    }
    console.error('Login error:', err);
    return sendJson(res, 500, { error: 'Login failed' });
  }
}
