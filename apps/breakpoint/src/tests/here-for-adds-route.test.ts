import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/here-for/adds/route";
import { HandleClaimedError } from "@/lib/here-for/data";
const mocks = vi.hoisted(() => ({
  read: vi.fn(),
  rate: vi.fn(),
  bot: vi.fn(),
  load: vi.fn(),
  cardAdds: vi.fn(),
  submit: vi.fn(),
  session: vi.fn(),
}));
vi.mock("@/lib/awards-session", () => ({ readAwardsBallot: mocks.read }));
vi.mock("@/lib/awards-abuse", () => ({
  hasSameOrigin: () => true,
  enforceSubmissionRateLimit: mocks.rate,
  clientIp: () => null,
  clientCountry: () => null,
  hashIp: () => null,
}));
vi.mock("@/lib/here-for/x-auth", () => ({ readXSession: mocks.session }));
vi.mock("botid/server", () => ({ checkBotId: mocks.bot }));
vi.mock("@/lib/here-for/data", () => ({
  loadPersonalGraph: mocks.load,
  loadCardAdds: mocks.cardAdds,
  submitAdds: mocks.submit,
  HandleClaimedError: class HandleClaimedError extends Error {},
}));
const empty = { people: [], adds: [] };
function request(body: unknown) {
  return new NextRequest("http://localhost:3005/api/here-for/adds", {
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
  mocks.read.mockReturnValue("ballot");
  mocks.rate.mockResolvedValue(false);
  mocks.bot.mockResolvedValue({ isBot: false });
  mocks.load.mockResolvedValue(empty);
  mocks.cardAdds.mockResolvedValue(null);
  mocks.submit.mockResolvedValue({});
  mocks.session.mockReturnValue({ userId: "1", handle: "@alice" });
  delete process.env.HERE_FOR_CLOSES_AT;
});
afterEach(() => {
  delete process.env.HERE_FOR_CLOSES_AT;
});
describe("here-for adds route", () => {
  it("returns contract validation codes", async () => {
    for (const [body, code] of [
      [{ adds: [] }, "invalid_adds"],
      [{ adds: ["b", "c", "d", "e"] }, "invalid_adds"],
      [{ adds: ["b", "c", "bad-name"] }, "invalid_adds"],
      [{ adds: ["alice", "b", "c"] }, "self_add"],
    ] as const) {
      const response = await POST(request(body));
      expect(response.status).toBe(400);
      expect((await response.json()).code).toBe(code);
    }
  });
  it("requires an X sign-in", async () => {
    mocks.session.mockReturnValue(null);
    const response = await POST(request({ adds: ["b", "c", "d"] }));
    expect(response.status).toBe(401);
    expect((await response.json()).code).toBe("auth_required");
    expect(mocks.submit).not.toHaveBeenCalled();
  });
  it("fails closed if the session store is unavailable", async () => {
    mocks.session.mockRejectedValueOnce(new Error("Database unavailable"));
    const response = await POST(request({ adds: ["b", "c", "d"] }));
    expect(response.status).toBe(503);
    expect(mocks.submit).not.toHaveBeenCalled();
  });
  it("uses the signed-in X handle, not one from the body", async () => {
    await POST(request({ handle: "mallory", adds: ["b", "c", "d"] }));
    expect(mocks.submit.mock.calls[0]?.[1]).toBe("@alice");
  });
  it("returns 409 when two saves race for one handle", async () => {
    mocks.submit.mockRejectedValue(new HandleClaimedError());
    const response = await POST(request({ adds: ["b", "c", "d"] }));
    expect(response.status).toBe(409);
    expect((await response.json()).code).toBe("handle_claimed");
  });
  it("allows a resubmission and returns the replaced adds", async () => {
    const people = ["alice", "b", "c", "d"].map((name, i) => ({
      id: String(i),
      handle: `@${name}`,
      claimedAt: i === 0 ? new Date("2026-10-29") : null,
    }));
    mocks.load.mockResolvedValueOnce({
      people,
      adds: [1, 2, 3].map((toId, i) => ({
        fromId: "0",
        toId: String(toId),
        rank: i + 1,
      })),
    });
    const response = await POST(request({ adds: ["b", "c", "d"] }));
    expect(response.status).toBe(200);
    expect((await response.json()).me.adds).toEqual(["@b", "@c", "@d"]);
    expect(mocks.submit).toHaveBeenCalledWith(
      "ballot",
      "@alice",
      ["@b", "@c", "@d"],
      null,
      null,
      "1",
    );
  });
  it("only announces newly mutual adds after saving", async () => {
    mocks.cardAdds.mockResolvedValue([
      { handle: "@b", mutual: true },
      { handle: "@c", mutual: false },
    ]);
    mocks.load.mockResolvedValue({
      people: ["alice", "b", "c", "d"].map((name, i) => ({
        id: String(i),
        handle: `@${name}`,
        claimedAt: new Date("2026-10-29"),
      })),
      adds: [
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 0],
        [2, 0],
      ].map(([from, to], i) => ({
        fromId: String(from),
        toId: String(to),
        rank: (i % 3) + 1,
      })),
    });
    const response = await POST(request({ adds: ["b", "c", "d"] }));
    expect(response.status).toBe(200);
    expect((await response.json()).newMutuals).toEqual(["@c"]);
    expect(mocks.cardAdds).toHaveBeenCalledWith("@alice");
    expect(mocks.load).toHaveBeenCalledTimes(1);
  });
  it("closes submissions at the configured time", async () => {
    process.env.HERE_FOR_CLOSES_AT = "2020-01-01T00:00:00Z";
    const response = await POST(request({ adds: ["b", "c", "d"] }));
    expect(response.status).toBe(403);
    expect((await response.json()).code).toBe("closed");
  });
});
