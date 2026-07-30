import type { VercelRequest, VercelResponse } from '@vercel/node';

export function sendJson(res: VercelResponse, status: number, body: unknown): void {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).send(JSON.stringify(body));
}

/** Safely coerce the request body to a plain object. */
export function parseBody(req: VercelRequest): Record<string, unknown> {
  let body: unknown = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return {};
    }
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return {};
  return body as Record<string, unknown>;
}

/**
 * Client IP for rate limiting. Uses `x-real-ip`, which Vercel's proxy sets to
 * the true client IP and is NOT client-spoofable. We deliberately do NOT trust
 * the left-most `x-forwarded-for` token, which a client can forge to rotate
 * rate-limit buckets and defeat brute-force throttling.
 */
export function getClientIp(req: VercelRequest): string {
  const real = req.headers['x-real-ip'];
  if (typeof real === 'string' && real.length > 0) return real;
  if (Array.isArray(real) && real.length > 0) return real[0];
  return req.socket?.remoteAddress || 'unknown';
}

/**
 * Reject cross-site state-changing requests (CSRF defense-in-depth on top of
 * the SameSite=Strict cookie). A same-origin browser fetch always sends an
 * Origin header on POST; if it's absent or from another host, reject.
 */
export function isSameOrigin(req: VercelRequest): boolean {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
