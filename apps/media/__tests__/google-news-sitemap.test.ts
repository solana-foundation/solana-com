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
import {
  GOOGLE_NEWS_SITEMAP_CANONICAL_URL,
  getGoogleNewsSitemapResponse,
} from "@/lib/google-news-sitemap";

const mockReader = reader;

describe("getGoogleNewsSitemapResponse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses the conventional sitemap-news filename as the canonical submission URL", () => {
    expect(GOOGLE_NEWS_SITEMAP_CANONICAL_URL).toBe(
      "https://solana.com/news/sitemap-news.xml",
    );
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
    // The stale post pads the sitemap as a plain <url> entry, but only the
    // fresh post carries <news:news> metadata.
    expect(xml).toContain("<loc>https://solana.com/news/stale-post</loc>");
    expect(xml.match(/<news:news>/g)).toHaveLength(1);
    expect(xml).not.toContain("Old Solana News");
    expect(xml).not.toContain("draft-post");
    expect(xml).not.toContain("future-post");
    // Newest first: the fresh post precedes the padded older post.
    expect(xml.indexOf("fresh-post")).toBeLessThan(xml.indexOf("stale-post"));
  });

  it("pads the sitemap with the newest older posts so the urlset is never empty", async () => {
    const olderSlugs = Array.from(
      { length: 15 },
      (_, index) => `older-post-${index}`,
    );

    mockReader.collections.posts.list.mockResolvedValue(olderSlugs);
    mockReader.collections.posts.read.mockImplementation((slug: string) => {
      const index = Number(slug.replace("older-post-", ""));
      return Promise.resolve({
        status: "published",
        title: `Older Solana News ${index}`,
        publishedAt: new Date(
          Date.UTC(2026, 3, 1, 12, 0, 0) - index * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });
    });

    const response = await getGoogleNewsSitemapResponse(
      new Date("2026-04-14T12:00:00.000Z"),
    );
    const xml = await response.text();

    expect(response.status).toBe(200);
    expect(xml.match(/<url>/g)).toHaveLength(10);
    expect(xml).toContain("<loc>https://solana.com/news/older-post-0</loc>");
    expect(xml).toContain("<loc>https://solana.com/news/older-post-9</loc>");
    expect(xml).not.toContain("older-post-10");
    // None of the padded posts are within 48 hours, so no news metadata.
    expect(xml).not.toContain("<news:news>");
  });

  it("includes only 48-hour posts when the window has enough articles", async () => {
    const freshSlugs = Array.from(
      { length: 12 },
      (_, index) => `fresh-post-${index}`,
    );

    mockReader.collections.posts.list.mockResolvedValue([
      ...freshSlugs,
      "stale-post",
    ]);
    mockReader.collections.posts.read.mockImplementation((slug: string) => {
      if (slug === "stale-post") {
        return Promise.resolve({
          status: "published",
          title: "Old Solana News",
          publishedAt: "2026-04-01T11:59:59.000Z",
        });
      }

      const index = Number(slug.replace("fresh-post-", ""));
      return Promise.resolve({
        status: "published",
        title: `Fresh Solana News ${index}`,
        publishedAt: new Date(
          Date.UTC(2026, 3, 13, 13, 0, 0) - index * 1000,
        ).toISOString(),
      });
    });

    const response = await getGoogleNewsSitemapResponse(
      new Date("2026-04-14T12:00:00.000Z"),
    );
    const xml = await response.text();

    expect(xml.match(/<url>/g)).toHaveLength(12);
    expect(xml.match(/<news:news>/g)).toHaveLength(12);
    expect(xml).not.toContain("stale-post");
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

  it("limits the news sitemap to the newest 1,000 recent posts", async () => {
    const slugs = Array.from(
      { length: 1001 },
      (_, index) => `recent-post-${index}`,
    );

    mockReader.collections.posts.list.mockResolvedValue(slugs);
    mockReader.collections.posts.read.mockImplementation((slug: string) => {
      const index = Number(slug.replace("recent-post-", ""));
      const publishedAt = new Date(
        Date.UTC(2026, 3, 14, 12, 0, 0) - index * 1000,
      ).toISOString();

      return Promise.resolve({
        status: "published",
        title: `Recent Solana News ${index}`,
        publishedAt,
      });
    });

    const response = await getGoogleNewsSitemapResponse(
      new Date("2026-04-14T12:00:00.000Z"),
    );
    const xml = await response.text();

    expect(xml.match(/<news:news>/g)).toHaveLength(1000);
    expect(xml).toContain("recent-post-0");
    expect(xml).toContain("recent-post-999");
    expect(xml).not.toContain("recent-post-1000");
  });
});
