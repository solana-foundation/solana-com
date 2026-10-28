import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { readerMock, unstableCacheMock } = vi.hoisted(() => ({
  readerMock: {
    collections: {
      posts: { list: vi.fn(), read: vi.fn() },
      categories: { read: vi.fn() },
      tags: { read: vi.fn() },
      authors: { read: vi.fn() },
    },
  },
  unstableCacheMock: vi.fn((fn: () => unknown) => fn),
}));

vi.mock("@/lib/reader", () => ({ reader: readerMock }));
vi.mock("next/cache", () => ({ unstable_cache: unstableCacheMock }));

import { GET } from "@/app/api/posts/startups/route";

function post(tags: string[], publishedAt: string, status = "published") {
  return {
    title: "A founder story",
    tags,
    categories: [{ category: "ecosystem" }],
    publishedAt,
    status,
    description: [
      {
        type: "paragraph",
        children: [{ type: "text", text: "Build a product" }],
      },
    ],
  };
}

describe("startup posts endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-28T00:00:00Z"));
    readerMock.collections.categories.read.mockResolvedValue({
      name: "Ecosystem",
    });
    readerMock.collections.tags.read.mockResolvedValue(null);
  });

  afterEach(() => vi.useRealTimers());

  it("returns at most four unique published product/hackathon stories, newest first", async () => {
    const posts = {
      older: post(["product"], "2026-01-01"),
      product: post(["product"], "2026-10-20"),
      both: post(["product", "hackathon"], "2026-10-25"),
      hackathon: post(["hackathon"], "2026-10-22"),
      fourth: post(["product"], "2026-10-18"),
      unrelated: post(["network"], "2026-10-27"),
      draft: post(["product"], "2026-10-27", "draft"),
      future: post(["hackathon"], "2027-01-01"),
      changelog: {
        ...post(["product"], "2026-10-27"),
        categories: [{ category: "changelog" }],
      },
    };
    readerMock.collections.posts.list.mockResolvedValue(Object.keys(posts));
    readerMock.collections.posts.read.mockImplementation(
      async (slug: keyof typeof posts) => posts[slug],
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts.map((entry: { id: string }) => entry.id)).toEqual([
      "both",
      "hackathon",
      "product",
      "fourth",
    ]);
    expect(data.posts[0].description).toBe("Build a product");
    expect(response.headers.get("cache-control")).toContain("s-maxage=300");
  });

  it("returns an empty feed when there are no matching posts", async () => {
    readerMock.collections.posts.list.mockResolvedValue([]);
    expect(await (await GET()).json()).toEqual({ posts: [] });
  });

  it("does not expose internal errors or cache a failed response", async () => {
    unstableCacheMock.mockImplementationOnce(() => async () => {
      throw new Error("internal detail");
    });
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await GET();
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Failed to fetch startup posts",
    });
    expect(response.headers.get("cache-control")).toBeNull();
    log.mockRestore();
  });
});
