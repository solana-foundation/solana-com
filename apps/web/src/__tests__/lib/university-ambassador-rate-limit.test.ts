import { beforeEach, describe, expect, it } from "vitest";

import {
  checkUniversityAmbassadorRateLimit,
  clientIpFromHeaders,
  resetUniversityAmbassadorRateLimitForTests,
  UNIVERSITY_AMBASSADOR_SUBMISSION_LIMITS,
} from "@/lib/university-ambassador/rate-limit";

describe("university ambassador submission rate limit", () => {
  beforeEach(() => {
    resetUniversityAmbassadorRateLimitForTests();
  });

  it("limits repeated submissions from one IP", () => {
    for (
      let i = 0;
      i < UNIVERSITY_AMBASSADOR_SUBMISSION_LIMITS.ip.max;
      i += 1
    ) {
      const lease = checkUniversityAmbassadorRateLimit({
        ip: "203.0.113.1",
        now: 1_000,
      });

      expect(lease.ok).toBe(true);
      if (lease.ok) lease.release();
    }

    const limited = checkUniversityAmbassadorRateLimit({
      ip: "203.0.113.1",
      now: 1_000,
    });

    expect(limited.ok).toBe(false);
  });

  it("limits concurrent submissions and releases leases", () => {
    const first = checkUniversityAmbassadorRateLimit({
      ip: "203.0.113.2",
      now: 1_000,
    });
    const concurrent = checkUniversityAmbassadorRateLimit({
      ip: "203.0.113.2",
      now: 1_000,
    });

    expect(first.ok).toBe(true);
    expect(concurrent.ok).toBe(false);

    if (first.ok) first.release();

    const afterRelease = checkUniversityAmbassadorRateLimit({
      ip: "203.0.113.2",
      now: 1_000,
    });
    expect(afterRelease.ok).toBe(true);
    if (afterRelease.ok) afterRelease.release();
  });

  it("uses the first forwarded client IP", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.10, 10.0.0.1",
    });

    expect(clientIpFromHeaders(headers)).toBe("203.0.113.10");
  });
});
