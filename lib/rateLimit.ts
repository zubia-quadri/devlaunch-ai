/**
 * In-memory rate limiter — edge-compatible (no external dependencies).
 * Resets on cold start; suitable for single-instance and Vercel serverless.
 *
 * Usage:
 *   const result = rateLimit(userId, "insights", 5, 60_000);
 *   if (!result.allowed) return new Response("Too many requests", { status: 429, headers: { "Retry-After": String(result.retryAfter) } });
 */

interface Bucket {
  count: number;
  resetAt: number;
}

// Global map persists within a single serverless function invocation lifetime
const store = new Map<string, Bucket>();

/**
 * @param key        Unique identifier (e.g. userId)
 * @param namespace  Action name to namespace the key (e.g. "insights", "import")
 * @param limit      Max requests allowed in the window
 * @param windowMs   Time window in milliseconds
 */
export function rateLimit(
  key: string,
  namespace: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfter: number } {
  const storeKey = `${namespace}:${key}`;
  const now = Date.now();

  let bucket = store.get(storeKey);

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
  }

  bucket.count += 1;
  store.set(storeKey, bucket);

  const remaining = Math.max(0, limit - bucket.count);
  const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
  const allowed = bucket.count <= limit;

  return { allowed, remaining, retryAfter };
}
