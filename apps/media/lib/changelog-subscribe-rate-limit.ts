const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const CLEANUP_INTERVAL_MS = 5 * MINUTE_MS;

export const CHANGELOG_SUBSCRIBE_LIMITS = {
  ip: { max: 10, windowMs: MINUTE_MS },
  email: { max: 3, windowMs: HOUR_MS },
  concurrentGlobal: 20,
  concurrentPerIp: 3,
} as const;

interface Counter {
  count: number;
  resetAt: number;
}

const state = {
  ipCounters: new Map<string, Counter>(),
  emailCounters: new Map<string, Counter>(),
  activeByIp: new Map<string, number>(),
  activeGlobal: 0,
  lastPrunedAt: 0,
};

export type ChangelogSubscribeRateLimitResult =
  | { ok: true; release: () => void }
  | { ok: false; retryAfter: number };

export function checkChangelogSubscribeRateLimit({
  headers,
  email,
  now = Date.now(),
}: {
  headers: Headers;
  email: string;
  now?: number;
}): ChangelogSubscribeRateLimitResult {
  pruneExpiredCounters(now);

  const ip = clientKey(headers);
  const activeForIp = state.activeByIp.get(ip) ?? 0;

  if (state.activeGlobal >= CHANGELOG_SUBSCRIBE_LIMITS.concurrentGlobal) {
    return { ok: false, retryAfter: 5 };
  }

  if (activeForIp >= CHANGELOG_SUBSCRIBE_LIMITS.concurrentPerIp) {
    return { ok: false, retryAfter: 5 };
  }

  const ipRetryAfter = hitFixedWindow(
    state.ipCounters,
    ip,
    CHANGELOG_SUBSCRIBE_LIMITS.ip,
    now,
  );
  if (ipRetryAfter) return { ok: false, retryAfter: ipRetryAfter };

  const emailRetryAfter = hitFixedWindow(
    state.emailCounters,
    email.toLowerCase(),
    CHANGELOG_SUBSCRIBE_LIMITS.email,
    now,
  );
  if (emailRetryAfter) return { ok: false, retryAfter: emailRetryAfter };

  state.activeGlobal += 1;
  state.activeByIp.set(ip, activeForIp + 1);

  let released = false;
  return {
    ok: true,
    release() {
      if (released) return;
      released = true;

      state.activeGlobal = Math.max(0, state.activeGlobal - 1);
      const nextForIp = Math.max(0, (state.activeByIp.get(ip) ?? 1) - 1);
      if (nextForIp) {
        state.activeByIp.set(ip, nextForIp);
      } else {
        state.activeByIp.delete(ip);
      }
    },
  };
}

export function resetChangelogSubscribeRateLimitForTests() {
  state.ipCounters.clear();
  state.emailCounters.clear();
  state.activeByIp.clear();
  state.activeGlobal = 0;
  state.lastPrunedAt = 0;
}

function clientKey(headers: Headers): string {
  const realIp = headers.get("x-real-ip");
  if (realIp) return bucketIp(realIp.trim());

  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const hops = forwardedFor.split(",");
    return bucketIp(hops[hops.length - 1]?.trim() || "unknown");
  }

  return "unknown";
}

function bucketIp(ip: string): string {
  const address = ip.toLowerCase();
  if (!address.includes(":") || address.includes(".")) return address;

  const [head, tail = ""] = address.split("::");
  const headParts = head ? head.split(":") : [];
  const tailParts = tail ? tail.split(":") : [];
  const missing = Math.max(8 - headParts.length - tailParts.length, 0);
  const full = [...headParts, ...Array(missing).fill("0"), ...tailParts];

  return full.slice(0, 4).join(":");
}

function hitFixedWindow(
  counters: Map<string, Counter>,
  key: string,
  limit: { max: number; windowMs: number },
  now: number,
): number | null {
  const existing = counters.get(key);
  const counter =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + limit.windowMs };

  counters.set(key, counter);

  if (counter.count >= limit.max) {
    return Math.max(1, Math.ceil((counter.resetAt - now) / 1000));
  }

  counter.count += 1;
  return null;
}

function pruneExpiredCounters(now: number) {
  if (now - state.lastPrunedAt < CLEANUP_INTERVAL_MS) return;
  state.lastPrunedAt = now;

  pruneMap(state.ipCounters, now);
  pruneMap(state.emailCounters, now);
}

function pruneMap(counters: Map<string, Counter>, now: number) {
  for (const [key, counter] of counters) {
    if (counter.resetAt <= now) counters.delete(key);
  }
}
