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

  it("prioritizes slug matches over label aliases when lookup keys collide", async () => {
    const navItems: NewsNavItem[] = [
      { label: "Network", slug: "upgrades" },
      { label: "Upgrades", slug: "protocol-upgrades" },
    ];

    mockReader.collections.posts.list.mockResolvedValue(["network-post"]);
    mockReader.collections.posts.read.mockResolvedValue({
      status: "published",
      publishedAt: "2026-03-11T00:00:00.000Z",
      categories: ["upgrades"],
    });

    const result = await fetchNewsNavItemsWithPosts(navItems);

    expect(result.map((item) => item.slug)).toEqual(["upgrades"]);
  });

  it("reads post metadata concurrently within a batch", async () => {
    const slugs = ["ecosystem-post", "developers-post", "defi-post"];
    const pendingReads = new Map<string, (_post: unknown) => void>();

    mockReader.collections.posts.list.mockResolvedValue(slugs);
    mockReader.collections.posts.read.mockImplementation(
      (slug: string) =>
        new Promise((resolve) => {
          pendingReads.set(slug, resolve);
        }),
    );

    const resultPromise = fetchNewsNavItemsWithPosts(NAV_ITEMS);

    await Promise.resolve();
    await Promise.resolve();

    expect(mockReader.collections.posts.read).toHaveBeenCalledTimes(
      slugs.length,
    );

    pendingReads.get("ecosystem-post")?.({
      status: "published",
      publishedAt: "2026-03-11T00:00:00.000Z",
      categories: ["ecosystem"],
    });
    pendingReads.get("developers-post")?.({
      status: "published",
      publishedAt: "2026-03-12T00:00:00.000Z",
      categories: ["developers"],
    });
    pendingReads.get("defi-post")?.({
      status: "published",
      publishedAt: "2026-03-13T00:00:00.000Z",
      categories: ["defi"],
    });

    await expect(resultPromise).resolves.toEqual(NAV_ITEMS.slice(0, 3));
  });

  it("falls back to the configured nav when posts cannot be listed", async () => {
    mockReader.collections.posts.list.mockRejectedValue(new Error("no posts"));

    await expect(fetchNewsNavItemsWithPosts(NAV_ITEMS)).resolves.toEqual(
      NAV_ITEMS,
    );
  });
});
