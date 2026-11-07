/**
 * The client IP for rate limiting, read only from headers Vercel sets.
 *
 * Vercel overwrites `x-forwarded-for` and `x-real-ip` at its edge and does not
 * forward external values, so neither can be spoofed by a caller. Headers such
 * as `cf-connecting-ip`, `true-client-ip` and `forwarded` are NOT rewritten and
 * arrive exactly as the client sent them; keying a limit on them lets a caller
 * pick a fresh bucket per request. Never read those here.
 *
 * Shared by the Inkeep proxy, the epoch1000 wallet lookup and anything else
 * that passes a `rateLimitKey` to `@vercel/firewall`.
 */
export function clientIpFromHeaders(headers: Headers): string {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || "unknown";
}
