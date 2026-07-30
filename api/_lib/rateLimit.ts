// In-memory sliding-window rate limiter. Best-effort only: serverless instances
// are ephemeral and not shared, so a determined attacker hitting many cold
// instances can exceed the limit. It still meaningfully slows brute force
// against the login endpoint (the primary concern) at zero infra cost.

type Hits = number[];
const buckets = new Map<string, Hits>();

// Periodic-ish cleanup to bound memory (runs opportunistically on each call).
function prune(now: number, windowMs: number) {
  for (const [key, hits] of buckets) {
    const kept = hits.filter((t) => now - t < windowMs);
    if (kept.length === 0) buckets.delete(key);
    else buckets.set(key, kept);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  if (buckets.size > 5000) prune(now, windowMs); // guard against unbounded growth

  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    const oldest = hits[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    buckets.set(key, hits);
    return { allowed: false, retryAfterSeconds };
  }

  hits.push(now);
  buckets.set(key, hits);
  return { allowed: true, retryAfterSeconds: 0 };
}
