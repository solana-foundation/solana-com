// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/here-for/card/route";

const mocks = vi.hoisted(() => ({
  adds: vi.fn(),
  mutual: vi.fn(),
  graph: vi.fn(),
}));
vi.mock("@/lib/here-for/data", () => ({
  loadCardAdds: mocks.adds,
  loadIsMutual: mocks.mutual,
  loadPersonalGraph: mocks.graph,
}));

const request = (search: string) =>
  new NextRequest(
    `http://localhost:3005/breakpoint/api/here-for/card?${search}`,
  );

beforeEach(() => vi.resetAllMocks());

describe("social card rendering", () => {
  it.each(["your3", "mutual", "mutuals"])(
    "renders the %s demo with real fonts and artwork as a 1200×630 PNG",
    async (type) => {
      const response = await GET(request(`type=${type}&demo=1`));
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("image/png");
      const bytes = Buffer.from(await response.arrayBuffer());
      expect(bytes.subarray(0, 8)).toEqual(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      );
      expect(bytes.readUInt32BE(16)).toBe(1200);
      expect(bytes.readUInt32BE(20)).toBe(630);
      expect(mocks.adds).not.toHaveBeenCalled();
      expect(mocks.mutual).not.toHaveBeenCalled();
      expect(mocks.graph).not.toHaveBeenCalled();
    },
  );

  it("rejects invalid handles and unsupported variants", async () => {
    expect((await GET(request("type=your3&handle=invalid!"))).status).toBe(404);
    expect((await GET(request("type=unknown&demo=1"))).status).toBe(404);
    expect(mocks.adds).not.toHaveBeenCalled();
  });

  it("does not claim a mutual connection absent from the graph", async () => {
    mocks.mutual.mockResolvedValue(false);
    expect(
      (await GET(request("type=mutual&handle=alice&with=bob"))).status,
    ).toBe(404);
  });

  it("returns an explicit unavailable response when data cannot load", async () => {
    mocks.adds.mockRejectedValue(new Error("database unavailable"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const response = await GET(request("type=your3&handle=alice"));
      expect(response.status).toBe(503);
      expect(await response.text()).toBe("Card unavailable");
    } finally {
      log.mockRestore();
    }
  });
});
