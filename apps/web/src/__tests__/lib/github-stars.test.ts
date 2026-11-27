import { afterEach, describe, expect, it, vi } from "vitest";

import { getGHStargazers } from "@/utils/followerFunctions";

const GITHUB_API_URL =
  "https://api.github.com/repos/solana-foundation/solana-com";

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe("getGHStargazers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a valid count with 60-second revalidation", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { stargazers_count: 540 }));

    vi.stubGlobal("fetch", fetchMock);

    await expect(getGHStargazers()).resolves.toBe(540);

    expect(fetchMock).toHaveBeenCalledWith(GITHUB_API_URL, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 60 },
    });
  });

  it("preserves a genuine zero-star count", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(200, { stargazers_count: 0 })),
    );

    await expect(getGHStargazers()).resolves.toBe(0);
  });

  it("rejects HTTP 403 instead of returning zero", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(403, { message: "rate limited" })),
    );

    await expect(getGHStargazers()).rejects.toThrow(
      "Failed to fetch GitHub stars: 403",
    );
  });

  it.each([
    ["missing", {}],
    ["negative", { stargazers_count: -1 }],
    ["non-integer", { stargazers_count: 1.5 }],
    ["string", { stargazers_count: "540" }],
  ])("rejects %s star counts", async (_label, body) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(200, body)));

    await expect(getGHStargazers()).rejects.toThrow(
      "Invalid GitHub star count",
    );
  });

  it("propagates network failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network unavailable")),
    );

    await expect(getGHStargazers()).rejects.toThrow("Network unavailable");
  });
});
