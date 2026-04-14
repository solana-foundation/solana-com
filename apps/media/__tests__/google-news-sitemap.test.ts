import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/reader", () => ({
  reader: {
    collections: {
      posts: {
        list: vi.fn(),
        read: vi.fn(),
      },
    },
  },
}));

import { reader } from "@/lib/reader";
import { getGoogleNewsSitemapResponse } from "@/lib/google-news-sitemap";

const mockReader = reader as any;

describe("getGoogleNewsSitemapResponse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("includes only published posts from the last 48 hours", async () => {
    mockReader.collections.posts.list.mockResolvedValue([
      "fresh-post",
      "stale-post",
      "draft-post",
      "future-post",
    ]);

    mockReader.collections.posts.read.mockImplementation((slug: string) => {
      switch (slug) {
        case "fresh-post":
          return Promise.resolve({
            status: "published",
            title: "Fresh Solana News",
            publishedAt: "2026-04-13T13:00:00.000Z",
          });
        case "stale-post":
          return Promise.resolve({
            status: "published",
            title: "Old Solana News",
            publishedAt: "2026-04-11T11:59:59.000Z",
          });
        case "draft-post":
          return Promise.resolve({
            status: "draft",
            title: "Draft Solana News",
            publishedAt: "2026-04-14T08:00:00.000Z",
          });
        case "future-post":
          return Promise.resolve({
            status: "published",
            title: "Future Solana News",
            publishedAt: "2026-04-15T08:00:00.000Z",
          });
        default:
          return Promise.resolve(null);
      }
    });

    const response = await getGoogleNewsSitemapResponse(
      new Date("2026-04-14T12:00:00.000Z"),
    );
    const xml = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("application/xml");
    expect(xml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    );
    expect(xml).toContain("<loc>https://solana.com/news/fresh-post</loc>");
    expect(xml).toContain("<news:name>Solana</news:name>");
    expect(xml).toContain("<news:language>en</news:language>");
    expect(xml).toContain(
      "<news:publication_date>2026-04-13T13:00:00.000Z</news:publication_date>",
    );
    expect(xml).toContain("<news:title>Fresh Solana News</news:title>");
    expect(xml).toContain("<loc>https://solana.com/news/stale-post</loc>");
    expect(xml).toContain("<lastmod>2026-04-11T11:59:59.000Z</lastmod>");
    expect(xml).not.toContain("<news:title>Old Solana News</news:title>");
    expect(xml).not.toContain("draft-post");
    expect(xml).not.toContain("future-post");
  });

  it("escapes XML-sensitive characters in titles", async () => {
    mockReader.collections.posts.list.mockResolvedValue(["escaped-post"]);
    mockReader.collections.posts.read.mockResolvedValue({
      status: "published",
      title: 'AT&T <Solana> "News"',
      publishedAt: "2026-04-14T10:00:00.000Z",
    });

    const response = await getGoogleNewsSitemapResponse(
      new Date("2026-04-14T12:00:00.000Z"),
    );
    const xml = await response.text();

    expect(xml).toContain(
      "<news:title>AT&amp;T &lt;Solana&gt; &quot;News&quot;</news:title>",
    );
  });
});
