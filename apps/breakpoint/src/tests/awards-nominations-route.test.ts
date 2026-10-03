import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { awardCategories } from "@/content/awards";
import { GET, POST } from "@/app/api/nominations/route";

const {
  transaction,
  upsertNomination,
  createAttempt,
  findUser,
  readBallot,
  checkBot,
  rateLimit,
} = vi.hoisted(() => ({
  transaction: vi.fn(),
  upsertNomination: vi.fn(),
  createAttempt: vi.fn(),
  findUser: vi.fn(),
  readBallot: vi.fn(),
  checkBot: vi.fn(),
  rateLimit: vi.fn(),
}));

vi.mock("botid/server", () => ({
  checkBotId: checkBot,
}));

vi.mock("@/lib/awards-session", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/awards-session")>()),
  readAwardsBallot: readBallot,
}));

vi.mock("@/lib/awards-abuse", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/awards-abuse")>()),
  enforceSubmissionRateLimit: rateLimit,
}));

vi.mock("@/lib/awards-campaign", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/awards-campaign")>()),
  getAwardsCampaignStatus: vi.fn(() => "open"),
}));

vi.mock("@/lib/awards-db", () => ({
  awardsPrisma: { $transaction: transaction, user: { findUnique: findUser } },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(Math, "random").mockReturnValue(0);
  readBallot.mockReturnValue("test-ballot");
  checkBot.mockResolvedValue({ isBot: false });
  rateLimit.mockResolvedValue(false);
});

afterEach(() => {
  vi.restoreAllMocks();
});

function submission(body: unknown, origin = "http://localhost:3005") {
  return new NextRequest("http://localhost:3005/breakpoint/api/nominations", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("awards nomination submission", () => {
  it("saves a nomination even when an older form sends an autofilled website field", async () => {
    const categoryId = awardCategories[0]!.id;
    const nomination = {
      category: categoryId,
      twitterHandle: "@siriuscrocodile",
      submittedAt: new Date("2026-10-03T00:00:00Z"),
    };
    upsertNomination.mockResolvedValue(nomination);
    transaction.mockImplementation(async (callback) =>
      callback({
        user: { upsert: vi.fn(async () => ({ id: "test-user" })) },
        nomination: {
          findUnique: vi.fn(async () => null),
          upsert: upsertNomination,
        },
        nominationAttempt: { create: createAttempt },
      }),
    );

    const request = submission({
      categoryId,
      twitterHandle: "siriuscrocodile",
      website: "https://example.com",
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      nomination: {
        ...nomination,
        submittedAt: nomination.submittedAt.toISOString(),
      },
    });
    expect(upsertNomination).toHaveBeenCalledOnce();
    expect(createAttempt).toHaveBeenCalledOnce();
  });

  it("logs a safe reason when a request is rejected", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    const response = await POST(submission({}, "https://other.example"));

    expect(response.status).toBe(403);
    expect(JSON.parse(log.mock.calls[0]![0])).toEqual({
      event: "awards_nominations_failure",
      method: "POST",
      status: 403,
      reason: "origin_rejected",
      sampleRate: 0.01,
    });
  });

  it("samples expected rejections without changing the response", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    const response = await POST(submission({}, "https://other.example"));

    expect(response.status).toBe(403);
    expect(log).not.toHaveBeenCalled();
  });

  it("logs rate limits with a retry interval", async () => {
    rateLimit.mockResolvedValue(true);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    const response = await POST(submission({}));

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
    expect(JSON.parse(log.mock.calls[0]![0])).toMatchObject({
      status: 429,
      reason: "rate_limited",
    });
  });

  it("logs the underlying code when verification fails", async () => {
    const cause = Object.assign(new Error("Private network detail"), {
      code: "ETIMEDOUT",
    });
    checkBot.mockRejectedValue(new TypeError("fetch failed", { cause }));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(submission({}));

    expect(response.status).toBe(503);
    expect(JSON.parse(log.mock.calls[0]![0])).toEqual({
      event: "awards_nominations_failure",
      method: "POST",
      status: 503,
      reason: "verification_failed",
      errorName: "TypeError",
      errorCode: null,
      causeName: "Error",
      causeCode: "ETIMEDOUT",
    });
    expect(log.mock.calls[0]![0]).not.toContain("Private network detail");
  });

  it("logs safe error metadata when saving fails", async () => {
    const error = Object.assign(
      new Error("Private database error involving @siriuscrocodile"),
      { code: "P1001" },
    );
    transaction.mockRejectedValue(error);
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(
      submission({
        categoryId: awardCategories[0]!.id,
        twitterHandle: "siriuscrocodile",
      }),
    );

    expect(response.status).toBe(503);
    expect(JSON.parse(log.mock.calls[0]![0])).toEqual({
      event: "awards_nominations_failure",
      method: "POST",
      status: 503,
      reason: "save_failed",
      errorName: "Error",
      errorCode: "P1001",
      causeCode: null,
    });
    expect(log.mock.calls[0]![0]).not.toContain("siriuscrocodile");
  });

  it("logs ballot read failures at error level", async () => {
    findUser.mockRejectedValue(new Error("Private database error"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await GET(
      new NextRequest("http://localhost:3005/breakpoint/api/nominations"),
    );

    expect(response.status).toBe(503);
    expect(JSON.parse(log.mock.calls[0]![0])).toMatchObject({
      method: "GET",
      status: 503,
      reason: "load_failed",
    });
  });
});
