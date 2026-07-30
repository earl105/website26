// Admin session: a short-lived JWT (HS256, signed with JWT_SECRET) carried in
// an httpOnly cookie. httpOnly means client JS can never read it (mitigates XSS
// token theft); Secure + SameSite=Strict mitigate CSRF and network sniffing.
import { SignJWT, jwtVerify } from 'jose';
import type { VercelRequest } from '@vercel/node';
import { getJwtSecret } from './env.js';

const COOKIE_NAME = 'admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 2; // 2 hours

export class Unauthorized extends Error {}

export async function signSession(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject('admin')
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getJwtSecret());
}

async function verifySession(token: string): Promise<void> {
  // Pin the algorithm to prevent "alg: none" / algorithm-confusion attacks.
  const { payload } = await jwtVerify(token, getJwtSecret(), { algorithms: ['HS256'] });
  if (payload.sub !== 'admin' || payload.role !== 'admin') {
    throw new Unauthorized('Invalid session subject');
  }
}

export function parseCookie(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return undefined;
}

/** Throws Unauthorized if the request lacks a valid admin session cookie. */
export async function requireAuth(req: VercelRequest): Promise<void> {
  const token = parseCookie(req.headers.cookie, COOKIE_NAME);
  if (!token) throw new Unauthorized('No session');
  try {
    await verifySession(token);
  } catch {
    throw new Unauthorized('Invalid session');
  }
}

export function sessionCookie(token: string): string {
  return [
    `${COOKIE_NAME}=${token}`,
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Path=/',
    `Max-Age=${MAX_AGE_SECONDS}`,
  ].join('; ');
}

export function clearSessionCookie(): string {
  return [`${COOKIE_NAME}=`, 'HttpOnly', 'Secure', 'SameSite=Strict', 'Path=/', 'Max-Age=0'].join('; ');
}
