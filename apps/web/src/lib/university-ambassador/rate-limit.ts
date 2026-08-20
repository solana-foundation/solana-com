const MINUTE_MS = 60_000;
const CLEANUP_INTERVAL_MS = 5 * MINUTE_MS;

export const UNIVERSITY_AMBASSADOR_SUBMISSION_LIMITS = {
  ip: { max: 5, windowMs: 10 * MINUTE_MS },
  concurrentGlobal: 10,
  concurrentPerIp: 1,
} as const;

interface Counter {
  count: number;
  resetAt: number;
}

interface RateLimitState {
  ipCounters: Map<string, Counter>;
  activeByIp: Map<string, number>;
  activeGlobal: number;
  lastPrunedAt: number;
}

export type UniversityAmbassadorRateLimitResult =
  | {
      ok: true;
      release: () => void;
    }
  | {
      ok: false;
      error: string;
      retryAfter: number;
    };

const state: RateLimitState = {
  ipCounters: new Map(),
  activeByIp: new Map(),
  activeGlobal: 0,
  lastPrunedAt: 0,
};

export function clientIpFromHeaders(headers: Headers): string {
  const direct =
    headers.get("cf-connecting-ip") ??
    headers.get("true-client-ip") ??
    headers.get("x-real-ip");

  if (direct?.trim()) {
    return direct.trim();
  }

  const forwardedFor = headers.get("x-forwarded-for");
  const firstForwardedFor = forwardedFor?.split(",")[0]?.trim();
  if (firstForwardedFor) {
    return firstForwardedFor;
  }

  const forwarded = headers.get("forwarded");
  const forwardedMatch = forwarded?.match(/(?:^|;)\s*for="?([^;,"]+)/i);

  return forwardedMatch?.[1]?.trim() || "unknown";
}

export function checkUniversityAmbassadorRateLimit({
  ip,
  now = Date.now(),
}: {
  ip: string;
  now?: number;
}): UniversityAmbassadorRateLimitResult {
  pruneExpiredCounters(now);

  const activeForIp = state.activeByIp.get(ip) ?? 0;
  if (
    state.activeGlobal >=
    UNIVERSITY_AMBASSADOR_SUBMISSION_LIMITS.concurrentGlobal
  ) {
    return reject(
      "Applications are busy. Please try again in a few seconds.",
      5,
    );
  }

  if (activeForIp >= UNIVERSITY_AMBASSADOR_SUBMISSION_LIMITS.concurrentPerIp) {
    return reject(
      "You already have an application in progress. Please try again in a few seconds.",
      5,
    );
  }

  const retryAfter = hitFixedWindow(
    state.ipCounters,
    ip,
    UNIVERSITY_AMBASSADOR_SUBMISSION_LIMITS.ip,
    now,
  );
  if (retryAfter) {
    return reject("Too many applications. Please try again later.", retryAfter);
  }

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

export function resetUniversityAmbassadorRateLimitForTests() {
  state.ipCounters.clear();
  state.activeByIp.clear();
  state.activeGlobal = 0;
  state.lastPrunedAt = 0;
}

function reject(error: string, retryAfter: number) {
  return { ok: false as const, error, retryAfter };
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

  for (const [key, counter] of state.ipCounters) {
    if (counter.resetAt <= now) state.ipCounters.delete(key);
  }
}
