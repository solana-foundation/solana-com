import { beforeEach, describe, expect, it } from "vitest";
import {
  checkLearnAssessmentRateLimit,
  clientIpFromHeaders,
  LEARN_ASSESSMENT_LIMITS,
  resetLearnAssessmentRateLimitForTests,
} from "../src/lib/learn-assessment-rate-limit";

describe("learning assessment rate limit", () => {
  beforeEach(() => {
    resetLearnAssessmentRateLimitForTests();
  });

  it("limits repeated grading requests from one IP", () => {
    for (let index = 0; index < LEARN_ASSESSMENT_LIMITS.perIp.max; index++) {
      const result = checkLearnAssessmentRateLimit({
        ip: "203.0.113.1",
        now: 1_000,
      });
      expect(result.ok).toBe(true);
      if (result.ok) result.release();
    }

    const limited = checkLearnAssessmentRateLimit({
      ip: "203.0.113.1",
      now: 1_000,
    });

    expect(limited.ok).toBe(false);
    if (!limited.ok) expect(limited.retryAfter).toBe(600);
  });

  it("caps concurrent grading requests and releases leases", () => {
    const first = checkLearnAssessmentRateLimit({
      ip: "203.0.113.2",
      now: 1_000,
    });
    expect(first.ok).toBe(true);

    const concurrent = checkLearnAssessmentRateLimit({
      ip: "203.0.113.2",
      now: 1_000,
    });
    expect(concurrent.ok).toBe(false);

    if (first.ok) first.release();

    const afterRelease = checkLearnAssessmentRateLimit({
      ip: "203.0.113.2",
      now: 1_000,
    });
    expect(afterRelease.ok).toBe(true);
    if (afterRelease.ok) afterRelease.release();
  });

  it("parses the first forwarded client IP", () => {
    expect(
      clientIpFromHeaders(
        new Headers({
          "x-forwarded-for": "203.0.113.10, 10.0.0.1",
        }),
      ),
    ).toBe("203.0.113.10");
  });
});
