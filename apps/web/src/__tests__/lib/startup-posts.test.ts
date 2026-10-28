import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../apps-urls", () => ({
  MEDIA_APP_URL: "https://media-preview.vercel.app",
}));

import { fetchStartupPosts } from "@/lib/media/post";

afterEach(() => vi.unstubAllGlobals());

describe("startup posts client", () => {
  it("fetches the dedicated feed through the web rewrite", async () => {
    const posts = [{ id: "launch", title: "Launch a product" }];
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ posts }));
    vi.stubGlobal("fetch", fetchMock);

    expect(await fetchStartupPosts()).toEqual({ posts, pageInfo: undefined });
    expect(fetchMock).toHaveBeenCalledWith("/api/posts/startups", {
      next: { revalidate: 300 },
    });
  });

  it("hides the feed when Media is unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("unavailable", { status: 503 })),
    );
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await fetchStartupPosts()).toEqual({ posts: [] });
    log.mockRestore();
  });
});
