const MINUTE_MS = 60_000;
const CLEANUP_INTERVAL_MS = 5 * MINUTE_MS;

export const EPOCH1000_CHECK_LIMITS = {
  ip: { max: 10, windowMs: MINUTE_MS },
  wallet: { max: 4, windowMs: 10 * MINUTE_MS },
  concurrentGlobal: 12,
  concurrentPerIp: 2,
} as const;

interface Counter {
  count: number;
  resetAt: number;
}

interface RateLimitState {
  ipCounters: Map<string, Counter>;
  walletCounters: Map<string, Counter>;
  activeByIp: Map<string, number>;
  activeGlobal: number;
  lastPrunedAt: number;
}

export type Epoch1000RateLimitResult =
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
  walletCounters: new Map(),
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

export function checkEpoch1000LookupRateLimit({
  ip,
  wallet,
  now = Date.now(),
}: {
  ip: string;
  wallet: string;
  now?: number;
}): Epoch1000RateLimitResult {
  pruneExpiredCounters(now);

  const activeForIp = state.activeByIp.get(ip) ?? 0;
  if (state.activeGlobal >= EPOCH1000_CHECK_LIMITS.concurrentGlobal) {
    return reject("Wallet checks are busy. Try again in a few seconds.", 5);
  }

  if (activeForIp >= EPOCH1000_CHECK_LIMITS.concurrentPerIp) {
    return reject(
      "You already have wallet checks running. Try again in a few seconds.",
      5,
    );
  }

  const ipRetryAfter = hitFixedWindow(
    state.ipCounters,
    ip,
    EPOCH1000_CHECK_LIMITS.ip,
    now,
  );
  if (ipRetryAfter) {
    return reject("Too many wallet checks. Try again shortly.", ipRetryAfter);
  }

  const walletRetryAfter = hitFixedWindow(
    state.walletCounters,
    wallet,
    EPOCH1000_CHECK_LIMITS.wallet,
    now,
  );
  if (walletRetryAfter) {
    return reject(
      "This wallet was checked recently. Try again shortly.",
      walletRetryAfter,
    );
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

export function resetEpoch1000LookupRateLimitForTests() {
  state.ipCounters.clear();
  state.walletCounters.clear();
  state.activeByIp.clear();
  state.activeGlobal = 0;
  state.lastPrunedAt = 0;
}

function reject(error: string, retryAfter: number): Epoch1000RateLimitResult {
  return { ok: false, error, retryAfter };
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
  pruneMap(state.walletCounters, now);
}

function pruneMap(counters: Map<string, Counter>, now: number) {
  for (const [key, counter] of counters) {
    if (counter.resetAt <= now) counters.delete(key);
  }
}
