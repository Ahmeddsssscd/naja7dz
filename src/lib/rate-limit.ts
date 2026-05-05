/**
 * Simple in-memory token-bucket rate limiter.
 * Fine for single-region Vercel deployments + low traffic.
 * For high traffic, swap to Upstash Redis-based limiter.
 */

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Max tokens (requests) per window */
  max: number;
  /** Window in seconds */
  windowSec: number;
}

export function rateLimit(key: string, opts: RateLimitOptions): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const refillRate = opts.max / (opts.windowSec * 1000); // tokens per ms
  const b = buckets.get(key);

  if (!b) {
    buckets.set(key, { tokens: opts.max - 1, lastRefill: now });
    return { ok: true };
  }

  // Refill tokens since last call
  const elapsed = now - b.lastRefill;
  const refill = elapsed * refillRate;
  b.tokens = Math.min(opts.max, b.tokens + refill);
  b.lastRefill = now;

  if (b.tokens < 1) {
    const retryAfter = Math.ceil((1 - b.tokens) / refillRate / 1000);
    return { ok: false, retryAfter };
  }

  b.tokens -= 1;
  return { ok: true };
}

export function getClientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  return fwd.split(",")[0].trim();
}

// Periodic cleanup so memory doesn't grow forever
if (typeof globalThis !== "undefined" && !(globalThis as { __nzRLCleanup?: boolean }).__nzRLCleanup) {
  (globalThis as { __nzRLCleanup?: boolean }).__nzRLCleanup = true;
  setInterval(() => {
    const cutoff = Date.now() - 60 * 60 * 1000; // 1h
    for (const [k, b] of buckets) {
      if (b.lastRefill < cutoff) buckets.delete(k);
    }
  }, 5 * 60 * 1000);
}
