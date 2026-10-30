/**
 * In-memory fixed-window rate limiting for the public demo endpoints. State is
 * per-instance (Vercel may run several), so these bound each instance rather
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
  }
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    // Deny new clients when full. Evicting a live bucket would let a burst of
    // distinct IPs reset an aggregate spending or RPC limit mid-window.
    if (!b && buckets.size >= MAX_BUCKETS) return false;
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

/**
 * Rate-limit key for the caller: the client IP. Vercel sets
 * x-vercel-forwarded-for and x-real-ip itself (a client can't spoof them),
 * and replaces x-forwarded-for with the client IP; locally none is set.
 */
export function clientKey(request: Request): string {
  const ip =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for");
  return ip?.split(",")[0]?.trim() || "unknown";
}

/**
 * The per-IP rate-limit key: the IPv4 address, or an IPv6 address's /64
 * prefix, since one host can rotate through its /64 at will.
 */
export function ipKey(ip: string): string {
  const bare = ip.replace(/^\[|\]$/g, "").replace(/%.*$/, "");
  if (!bare.includes(":")) return bare;
  const v4 = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(bare);
  if (v4) return v4[1]!;
  const [head = "", tail] = bare.split("::");
  const front = head ? head.split(":") : [];
  const back = tail ? tail.split(":") : [];
  const groups =
    tail === undefined
      ? front
      : [
          ...front,
          ...Array(Math.max(0, 8 - front.length - back.length)).fill("0"),
          ...back,
        ];
  const prefix = groups
    .slice(0, 4)
    .map((g) => (parseInt(g, 16) || 0).toString(16))
    .join(":");
  return `${prefix}::/64`;
}
