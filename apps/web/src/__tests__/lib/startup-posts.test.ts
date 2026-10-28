import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../apps-urls", () => ({
  MEDIA_APP_URL: "https://media-preview.vercel.app",
}));

import { fetchStartupPosts } from "@/lib/media/post";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

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
  it("serves published stories when the Media preview is protected and the new production endpoint is absent", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubGlobal("window", undefined);
    const post = (id: string, day: number) => ({
      id,
      title: id,
      url: `/news/${id}`,
      publishedAt: `2026-01-${day}T00:00:00Z`,
    });
    const shared = post("shared", 26);
    const product = post("product", 25);
    const hackathon = post("hackathon", 24);
    const fourth = post("fourth", 23);
    const older = post("older", 10);
    const fetchMock = vi.fn(async (url: string) => {
      if (url.startsWith("https://media-preview.vercel.app")) {
        return new Response("Authentication Required", { status: 401 });
      }
      if (url.includes("/posts/startups"))
        return new Response("Not Found", { status: 404 });
      const query = new URL(url).searchParams;
      expect(query.get("excludeCategory")).toBe("changelog");
      return Response.json({
        posts:
          query.get("tag") === "product"
            ? [shared, product, older]
            : [shared, hackathon, fourth],
      });
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect((await fetchStartupPosts()).posts.map((post) => post.id)).toEqual([
      "shared",
      "product",
      "hackathon",
      "fourth",
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://solana-com-media.vercel.app/api/posts/latest?limit=4&excludeCategory=changelog&tag=product",
      { next: { revalidate: 300 } },
    );
  });

  it("uses the dedicated feed directly when available in a preview", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ posts: [{ id: "dedicated" }] }));
    vi.stubGlobal("fetch", fetchMock);
    expect((await fetchStartupPosts()).posts).toEqual([{ id: "dedicated" }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
