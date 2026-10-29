import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/here-for/me/route";

const mocks = vi.hoisted(() => ({
  ballot: vi.fn(),
  session: vi.fn(),
  person: vi.fn(),
  graph: vi.fn(),
}));
vi.mock("@/lib/awards-session", () => ({
  readAwardsBallot: mocks.ballot,
  newAwardsBallot: () => ({ ballotId: "new", value: "cookie" }),
  awardsBallotCookie: { name: "ballot", options: {} },
}));
vi.mock("@/lib/here-for/x-auth", () => ({ readXSession: mocks.session }));
vi.mock("@/lib/here-for/data", () => ({
  loadMeByBallot: mocks.person,
  loadPersonalGraph: mocks.graph,
}));
beforeEach(() => {
  vi.resetAllMocks();
  mocks.session.mockReturnValue(null);
  mocks.person.mockResolvedValue(null);
  mocks.graph.mockResolvedValue({ people: [], adds: [] });
});
const request = () => new NextRequest("http://localhost:3005/api/here-for/me");

describe("profile reads", () => {
  it("does no database work for a new anonymous visitor", async () => {
    const response = await GET(request());
    expect(response.status).toBe(200);
    expect((await response.json()).handle).toBeNull();
    expect(response.headers.get("set-cookie")).toContain("ballot=cookie");
    expect(mocks.person).not.toHaveBeenCalled();
    expect(mocks.graph).not.toHaveBeenCalled();
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it("skips graph reads for an existing ballot without a profile", async () => {
    mocks.ballot.mockReturnValue("existing");
    expect((await GET(request())).status).toBe(200);
    expect(mocks.person).toHaveBeenCalledWith("existing");
    expect(mocks.graph).not.toHaveBeenCalled();
  });
  it("loads only the signed-in profile's graph", async () => {
    mocks.session.mockReturnValue({ handle: "@me" });
    expect((await GET(request())).status).toBe(200);
    expect(mocks.person).not.toHaveBeenCalled();
    expect(mocks.graph).toHaveBeenCalledWith("@me");
  });
});
