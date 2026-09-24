/**
 * In-memory fixed-window rate limiting for the public demo endpoints. State is
 * per-instance (Cloud Run may run several), so these bound each instance rather
 * than the fleet — enough to stop treasury/RPC-quota drain on a devnet demo
 * without external storage.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

/** Count a hit against `key`; returns false once `limit` hits land in the window. */
export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size >= MAX_BUCKETS) {
    for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k);
    // Still full after expiry sweep: a flood of unique keys. Evict oldest.
    for (const k of buckets.keys()) {
      if (buckets.size < MAX_BUCKETS) break;
      buckets.delete(k);
    }
  }
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

/**
 * Rate-limit key for the caller. The Cloud Run frontend appends the real client
 * IP as the last X-Forwarded-For hop (earlier hops are client-supplied, so
 * ignore them); locally the header is absent and the socket address is used.
 */
export function clientKey(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  const last = xff?.split(",").at(-1)?.trim();
  if (last) return last;
  return request.headers.get("x-real-ip") ?? "unknown";
}
