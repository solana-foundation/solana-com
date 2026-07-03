import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
import { fetchNewsNavItemsWithPosts } from "@/lib/news-nav-data";
import type { NewsNavItem } from "@/lib/news-nav";

const mockReader = reader;

const NAV_ITEMS: NewsNavItem[] = [
  { label: "Ecosystem", slug: "ecosystem" },
  { label: "Developers", slug: "developers" },
  { label: "DeFi", slug: "defi" },
  { label: "Breakpoint", slug: "breakpoint" },
];

describe("fetchNewsNavItemsWithPosts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-24T00:00:00.000Z"));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns only nav categories with currently published posts", async () => {
    const posts = {
      "ecosystem-post": {
        status: "published",
        publishedAt: "2026-03-11T00:00:00.000Z",
        categories: [{ category: "ecosystem" }],
      },
      "defi-post": {
        status: "published",
        publishedAt: "2026-03-12T00:00:00.000Z",
        categories: ["DeFi"],
      },
      "breakpoint-draft": {
        status: "draft",
        publishedAt: "2026-03-13T00:00:00.000Z",
        categories: [{ category: "breakpoint" }],
      },
      "developers-scheduled": {
        status: "published",
        publishedAt: "2099-03-13T00:00:00.000Z",
        categories: [{ category: "developers" }],
      },
    };

    mockReader.collections.posts.list.mockResolvedValue(Object.keys(posts));
    mockReader.collections.posts.read.mockImplementation((slug: string) =>
      Promise.resolve(posts[slug as keyof typeof posts] ?? null),
    );

    const result = await fetchNewsNavItemsWithPosts(NAV_ITEMS);

    expect(result.map((item) => item.slug)).toEqual(["ecosystem", "defi"]);
  });

  it("falls back to the configured nav when posts cannot be listed", async () => {
    mockReader.collections.posts.list.mockRejectedValue(new Error("no posts"));

    await expect(fetchNewsNavItemsWithPosts(NAV_ITEMS)).resolves.toEqual(
      NAV_ITEMS,
    );
  });
});
