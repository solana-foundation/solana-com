import { beforeEach, describe, expect, it } from "vitest";
import {
  checkEpoch1000LookupRateLimit,
  clientIpFromHeaders,
  EPOCH1000_CHECK_LIMITS,
  resetEpoch1000LookupRateLimitForTests,
} from "@/lib/epoch1000/rate-limit";

describe("epoch1000 wallet checker rate limit", () => {
  beforeEach(() => {
    resetEpoch1000LookupRateLimitForTests();
  });

  it("limits repeated checks from one IP", () => {
    for (let i = 0; i < EPOCH1000_CHECK_LIMITS.ip.max; i++) {
      const lease = checkEpoch1000LookupRateLimit({
        ip: "203.0.113.1",
        wallet: `wallet-${i}`,
        now: 1_000,
      });

      expect(lease.ok).toBe(true);
      if (lease.ok) lease.release();
    }

    const limited = checkEpoch1000LookupRateLimit({
      ip: "203.0.113.1",
      wallet: "wallet-over-limit",
      now: 1_000,
    });

    expect(limited.ok).toBe(false);
    if (!limited.ok) {
      expect(limited.retryAfter).toBe(60);
    }
  });

  it("limits repeated checks for the same wallet across IPs", () => {
    for (let i = 0; i < EPOCH1000_CHECK_LIMITS.wallet.max; i++) {
      const lease = checkEpoch1000LookupRateLimit({
        ip: `203.0.113.${i}`,
        wallet: "same-wallet",
        now: 1_000,
      });

      expect(lease.ok).toBe(true);
      if (lease.ok) lease.release();
    }

    const limited = checkEpoch1000LookupRateLimit({
      ip: "203.0.113.99",
      wallet: "same-wallet",
      now: 1_000,
    });

    expect(limited.ok).toBe(false);
    if (!limited.ok) {
      expect(limited.retryAfter).toBe(600);
    }
  });

  it("limits concurrent checks per IP and releases leases", () => {
    const leases = Array.from(
      { length: EPOCH1000_CHECK_LIMITS.concurrentPerIp },
      (_, i) =>
        checkEpoch1000LookupRateLimit({
          ip: "203.0.113.2",
          wallet: `wallet-${i}`,
          now: 1_000,
        }),
    );

    expect(leases.every((lease) => lease.ok)).toBe(true);

    const limited = checkEpoch1000LookupRateLimit({
      ip: "203.0.113.2",
      wallet: "wallet-concurrent",
      now: 1_000,
    });
    expect(limited.ok).toBe(false);

    const firstLease = leases[0];
    if (firstLease.ok) firstLease.release();

    const allowedAfterRelease = checkEpoch1000LookupRateLimit({
      ip: "203.0.113.2",
      wallet: "wallet-after-release",
      now: 1_000,
    });
    expect(allowedAfterRelease.ok).toBe(true);

    for (const lease of leases) {
      if (lease.ok) lease.release();
    }
    if (allowedAfterRelease.ok) allowedAfterRelease.release();
  });

  it("parses the first forwarded client IP", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.10, 10.0.0.1",
    });

    expect(clientIpFromHeaders(headers)).toBe("203.0.113.10");
  });
});
