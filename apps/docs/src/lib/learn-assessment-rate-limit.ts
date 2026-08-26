const MINUTE_MS = 60_000;
const CLEANUP_INTERVAL_MS = 5 * MINUTE_MS;

export const LEARN_ASSESSMENT_LIMITS = {
  perIp: { max: 5, windowMs: 10 * MINUTE_MS },
  global: { max: 60, windowMs: 10 * MINUTE_MS },
  concurrentPerIp: 1,
  concurrentGlobal: 6,
} as const;

type Counter = {
  count: number;
  resetAt: number;
};

type RateLimitResult =
  | { ok: true; release: () => void }
  | { ok: false; retryAfter: number };

const state = {
  ipCounters: new Map<string, Counter>(),
  globalCounter: undefined as Counter | undefined,
  activeByIp: new Map<string, number>(),
  activeGlobal: 0,
  lastPrunedAt: 0,
};

export function clientIpFromHeaders(headers: Headers): string {
  const direct =
    headers.get("cf-connecting-ip") ??
    headers.get("true-client-ip") ??
    headers.get("x-real-ip");

  if (direct?.trim()) return direct.trim();

  const forwardedFor = headers.get("x-forwarded-for");
  const firstForwardedFor = forwardedFor?.split(",")[0]?.trim();
  if (firstForwardedFor) return firstForwardedFor;

  const forwarded = headers.get("forwarded");
  const forwardedMatch = forwarded?.match(/(?:^|;)\s*for="?([^;,"]+)/i);
  return forwardedMatch?.[1]?.trim() || "unknown";
}

export function checkLearnAssessmentRateLimit({
  ip,
  now = Date.now(),
}: {
  ip: string;
  now?: number;
}): RateLimitResult {
  pruneExpiredCounters(now);

  const activeForIp = state.activeByIp.get(ip) ?? 0;
  if (
    state.activeGlobal >= LEARN_ASSESSMENT_LIMITS.concurrentGlobal ||
    activeForIp >= LEARN_ASSESSMENT_LIMITS.concurrentPerIp
  ) {
    return { ok: false, retryAfter: 5 };
  }

  const ipRetryAfter = hitFixedWindow(
    state.ipCounters,
    ip,
    LEARN_ASSESSMENT_LIMITS.perIp,
    now,
  );
  if (ipRetryAfter) return { ok: false, retryAfter: ipRetryAfter };

  const globalResult = hitCounter(
    state.globalCounter,
    LEARN_ASSESSMENT_LIMITS.global,
    now,
  );
  state.globalCounter = globalResult.counter;
  if (globalResult.retryAfter) {
    return { ok: false, retryAfter: globalResult.retryAfter };
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
      if (nextForIp) state.activeByIp.set(ip, nextForIp);
      else state.activeByIp.delete(ip);
    },
  };
}

export function resetLearnAssessmentRateLimitForTests() {
  state.ipCounters.clear();
  state.globalCounter = undefined;
  state.activeByIp.clear();
  state.activeGlobal = 0;
  state.lastPrunedAt = 0;
}

function hitFixedWindow(
  counters: Map<string, Counter>,
  key: string,
  limit: { max: number; windowMs: number },
  now: number,
) {
  const result = hitCounter(counters.get(key), limit, now);
  counters.set(key, result.counter);
  return result.retryAfter;
}

function hitCounter(
  existing: Counter | undefined,
  limit: { max: number; windowMs: number },
  now: number,
): { counter: Counter; retryAfter: number | null } {
  const counter =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + limit.windowMs };

  if (counter.count >= limit.max) {
    return {
      counter,
      retryAfter: Math.max(1, Math.ceil((counter.resetAt - now) / 1_000)),
    };
  }

  counter.count += 1;
  return { counter, retryAfter: null };
}

function pruneExpiredCounters(now: number) {
  if (now - state.lastPrunedAt < CLEANUP_INTERVAL_MS) return;
  state.lastPrunedAt = now;

  for (const [ip, counter] of state.ipCounters) {
    if (counter.resetAt <= now) state.ipCounters.delete(ip);
  }

  if (state.globalCounter && state.globalCounter.resetAt <= now) {
    state.globalCounter = undefined;
  }
}
