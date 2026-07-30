// Password verification using Node's built-in scrypt (memory-hard KDF) —
// zero external dependency. The verifier string is produced offline by
// `npm run hash-password` and stored in ADMIN_PASSWORD_HASH.
//
// Verifier format:  scrypt$N$r$p$<saltHex>$<hashHex>
import { scryptSync, timingSafeEqual } from 'node:crypto';

export function verifyPassword(password: string, verifier: string): boolean {
  const parts = verifier.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const salt = Buffer.from(parts[4], 'hex');
  const expected = Buffer.from(parts[5], 'hex');

  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false;
  if (salt.length === 0 || expected.length === 0) return false;

  let derived: Buffer;
  try {
    // maxmem must be raised for N=16384 or scrypt throws.
    derived = scryptSync(password, salt, expected.length, { N, r, p, maxmem: 64 * 1024 * 1024 });
  } catch {
    return false;
  }

  // Constant-time comparison; timingSafeEqual requires equal lengths.
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}
