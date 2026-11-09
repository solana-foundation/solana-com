import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { awardCategories } from "@/content/awards";
import { GET, POST } from "@/app/api/votes/route";

const {
  readBallot,
  findUser,
  upsertUser,
  findVotes,
  createVote,
  findVote,
  rateLimit,
  checkBot,
  votingStatus,
  approvedFinalists,
  findFinalist,
} = vi.hoisted(() => ({
  readBallot: vi.fn(),
  findUser: vi.fn(),
  upsertUser: vi.fn(),
  findVotes: vi.fn(),
  createVote: vi.fn(),
  findVote: vi.fn(),
  rateLimit: vi.fn(),
  checkBot: vi.fn(),
  votingStatus: vi.fn(),
  approvedFinalists: vi.fn(),
  findFinalist: vi.fn(),
}));

vi.mock("botid/server", () => ({ checkBotId: checkBot }));
vi.mock("@/lib/awards-session", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/awards-session")>()),
  readAwardsBallot: readBallot,
}));
vi.mock("@/lib/awards-abuse", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/awards-abuse")>()),
  enforceVotingRateLimit: rateLimit,
}));
vi.mock("@/lib/awards-campaign", () => ({
  getAwardsVotingStatus: votingStatus,
}));
vi.mock("@/content/awards-finalists", () => ({
  getApprovedFinalists: approvedFinalists,
  findApprovedFinalist: findFinalist,
}));
vi.mock("@/lib/awards-db", () => ({
  awardsPrisma: {
    user: { findUnique: findUser, upsert: upsertUser },
    vote: { findMany: findVotes, findUnique: findVote, create: createVote },
  },
}));

const categoryId = awardCategories[0]!.id;
const savedVote = {
  category: categoryId,
  twitterHandle: "@candidate_one",
  submittedAt: new Date("2026-10-13T00:00:00Z"),
};

function submission(body: unknown) {
  return new NextRequest("http://localhost:3005/breakpoint/api/votes", {
    method: "POST",
    headers: {
      origin: "http://localhost:3005",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  readBallot.mockReturnValue("test-ballot");
  votingStatus.mockReturnValue("open");
  approvedFinalists.mockReturnValue([{ categoryId, finalists: [] }]);
  findFinalist.mockReturnValue({
    name: "Candidate One",
    twitterHandle: "@candidate_one",
  });
  rateLimit.mockResolvedValue(false);
  checkBot.mockResolvedValue({ isBot: false });
  upsertUser.mockResolvedValue({ id: "test-user" });
  findUser.mockResolvedValue({ id: "test-user" });
  findVotes.mockResolvedValue([savedVote]);
  createVote.mockResolvedValue(savedVote);
});

describe("awards voting route", () => {
  it("creates the signed ballot cookie on direct arrival", async () => {
    readBallot.mockReturnValue(null);
    findUser.mockResolvedValue(null);
    const response = await GET(
      new NextRequest("http://localhost:3005/breakpoint/api/votes"),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(await response.json()).toMatchObject({ votes: [] });
  });

  it("restores persisted votes from the signed ballot session", async () => {
    const response = await GET(
      new NextRequest("http://localhost:3005/breakpoint/api/votes"),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toMatchObject({
      votes: [
        { ...savedVote, submittedAt: savedVote.submittedAt.toISOString() },
      ],
    });
    expect(findUser).toHaveBeenCalledWith(
      expect.objectContaining({ where: { browserUuid: "test-ballot" } }),
    );
  });

  it("never writes before opening or after closing", async () => {
    for (const phase of ["not_started", "closed"]) {
      votingStatus.mockReturnValue(phase);
      expect(
        (
          await POST(
            submission({ categoryId, twitterHandle: "@candidate_one" }),
          )
        ).status,
      ).toBe(403);
    }
    expect(createVote).not.toHaveBeenCalled();
  });

  it("rejects unapproved category and finalist pairs", async () => {
    findFinalist.mockReturnValue(undefined);
    const response = await POST(
      submission({ categoryId, twitterHandle: "@candidate_two" }),
    );
    expect(response.status).toBe(400);
    expect(createVote).not.toHaveBeenCalled();
  });

  it("returns the persisted vote after a uniqueness conflict without overwriting it", async () => {
    const error = new Error("Unique constraint");
    Object.assign(error, { code: "P2002" });
    createVote.mockRejectedValue(error);
    findVote.mockResolvedValue(savedVote);
    const response = await POST(
      submission({ categoryId, twitterHandle: "@candidate_one" }),
    );
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({
      vote: { ...savedVote, submittedAt: savedVote.submittedAt.toISOString() },
    });
    expect(findVote).toHaveBeenCalledOnce();
  });
});
