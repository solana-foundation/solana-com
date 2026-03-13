import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const {
  readerMock,
  unstableCacheMock,
  nextJsonMock,
  fetchLatestLinksMock,
  extractPlainTextMock,
} = vi.hoisted(() => ({
  readerMock: {
    collections: {
      links: {
        list: vi.fn(),
        read: vi.fn(),
      },
      posts: {
        list: vi.fn(),
        read: vi.fn(),
      },
      categories: {
        read: vi.fn(),
      },
      tags: {
        read: vi.fn(),
      },
      authors: {
        read: vi.fn(),
      },
    },
  },
  unstableCacheMock: vi.fn((fn: () => unknown) => fn),
  nextJsonMock: vi.fn((body: unknown, init?: ResponseInit) => ({
    body,
    init,
  })),
  fetchLatestLinksMock: vi.fn(),
  extractPlainTextMock: vi.fn((value: string) => `plain:${value}`),
}));

vi.mock("@/lib/reader", () => ({
  reader: readerMock,
}));

vi.mock("next/cache", () => ({
  unstable_cache: unstableCacheMock,
}));

vi.mock("next/server", () => ({
  NextRequest: class {},
  NextResponse: {
    json: nextJsonMock,
  },
}));

vi.mock("@/lib/link-data", () => ({
  fetchLatestLinks: fetchLatestLinksMock,
}));

vi.mock("@/lib/post-data", () => ({
  fetchLatestPosts: vi.fn(),
}));

vi.mock("@/lib/content-renderer", () => ({
  extractPlainText: extractPlainTextMock,
}));

import { fetchLatestLinks } from "@/lib/keystatic/link-data";
import { fetchLatestPosts } from "@/lib/keystatic/post-data";
import * as keystaticPostData from "@/lib/keystatic/post-data";
import { GET as getLatestLinks } from "@/app/api/links/latest/route";
import { GET as getLatestPosts } from "@/app/api/posts/latest/route";

describe("latest content filters", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    readerMock.collections.categories.read.mockImplementation((slug: string) =>
      Promise.resolve(
        {
          ecosystem: { name: "Ecosystem" },
          developers: { name: "Developers" },
        }[slug] ?? null
      )
    );

    readerMock.collections.tags.read.mockImplementation((slug: string) =>
      Promise.resolve(
        {
          defi: { name: "DeFi" },
          nft: { name: "NFT" },
        }[slug] ?? null
      )
    );

    readerMock.collections.authors.read.mockResolvedValue({
      name: "Solana Foundation",
      avatar: null,
    });
  });

  describe("fetchLatestLinks", () => {
    it("filters by category name and tag slug with whitespace and casing normalized", async () => {
      const links = {
        "matching-link": {
          title: "Matching Link",
          url: "https://example.com/matching",
          linkType: "article",
          description: "match",
          publishedAt: "2026-03-10T00:00:00.000Z",
          categories: [{ category: "ecosystem" }],
          tags: [{ tag: "defi" }],
        },
        "wrong-tag": {
          title: "Wrong Tag",
          url: "https://example.com/wrong-tag",
          linkType: "article",
          description: "wrong tag",
          publishedAt: "2026-03-09T00:00:00.000Z",
          categories: [{ category: "ecosystem" }],
          tags: [{ tag: "nft" }],
        },
        "wrong-category": {
          title: "Wrong Category",
          url: "https://example.com/wrong-category",
          linkType: "article",
          description: "wrong category",
          publishedAt: "2026-03-08T00:00:00.000Z",
          categories: [{ category: "developers" }],
          tags: [{ tag: "defi" }],
        },
      };

      readerMock.collections.links.list.mockResolvedValue(Object.keys(links));
      readerMock.collections.links.read.mockImplementation((slug: string) =>
        Promise.resolve(links[slug as keyof typeof links] ?? null)
      );

      const result = await fetchLatestLinks({
        category: "  ecosystem  ",
        tag: "DEFI",
      });

      expect(result.links.map((item) => item.id)).toEqual(["matching-link"]);
    });

    it("matches string-based category and tag references by slug", async () => {
      const links = {
        "slug-match-link": {
          title: "Slug Match Link",
          url: "https://example.com/slug-match",
          linkType: "article",
          description: "slug match",
          publishedAt: "2026-03-11T00:00:00.000Z",
          categories: ["ecosystem"],
          tags: ["nft"],
        },
        "other-link": {
          title: "Other Link",
          url: "https://example.com/other",
          linkType: "article",
          description: "other",
          publishedAt: "2026-03-10T00:00:00.000Z",
          categories: ["developers"],
          tags: ["defi"],
        },
      };

      readerMock.collections.links.list.mockResolvedValue(Object.keys(links));
      readerMock.collections.links.read.mockImplementation((slug: string) =>
        Promise.resolve(links[slug as keyof typeof links] ?? null)
      );

      const result = await fetchLatestLinks({
        category: "ecosystem",
        tag: "nft",
      });

      expect(result.links.map((item) => item.id)).toEqual(["slug-match-link"]);
    });
  });

  describe("fetchLatestPosts", () => {
    it("filters by tag name alone", async () => {
      const posts = {
        "matching-post": {
          status: "published",
          title: "Matching Post",
          description: "matching post",
          date: "2026-03-10",
          author: "solana-foundation",
          categories: [{ category: "ecosystem" }],
          tags: [{ tag: "defi" }],
        },
        "other-post": {
          status: "published",
          title: "Other Post",
          description: "other post",
          date: "2026-03-09",
          author: "solana-foundation",
          categories: [{ category: "ecosystem" }],
          tags: [{ tag: "nft" }],
        },
      };

      readerMock.collections.posts.list.mockResolvedValue(Object.keys(posts));
      readerMock.collections.posts.read.mockImplementation((slug: string) =>
        Promise.resolve(posts[slug as keyof typeof posts] ?? null)
      );

      const result = await fetchLatestPosts({
        tag: "  defi  ",
      });

      expect(result.posts.map((item) => item.id)).toEqual(["matching-post"]);
    });

    it("matches mixed category and tag reference formats by slug", async () => {
      const posts = {
        "slug-match-post": {
          status: "published",
          title: "Slug Match Post",
          description: "slug match post",
          date: "2026-03-11",
          author: "solana-foundation",
          categories: ["ecosystem"],
          tags: ["defi"],
        },
        "wrong-post": {
          status: "published",
          title: "Wrong Post",
          description: "wrong post",
          date: "2026-03-10",
          author: "solana-foundation",
          categories: [{ category: "developers" }],
          tags: [{ tag: "defi" }],
        },
      };

      readerMock.collections.posts.list.mockResolvedValue(Object.keys(posts));
      readerMock.collections.posts.read.mockImplementation((slug: string) =>
        Promise.resolve(posts[slug as keyof typeof posts] ?? null)
      );

      const result = await fetchLatestPosts({
        category: "ecosystem",
        tag: "defi",
      });

      expect(result.posts.map((item) => item.id)).toEqual(["slug-match-post"]);
    });

    it("excludes draft posts from latest post results", async () => {
      const posts = {
        "published-post": {
          status: "published",
          title: "Published Post",
          description: "published post",
          date: "2026-03-11",
          author: "solana-foundation",
          categories: [{ category: "ecosystem" }],
          tags: [{ tag: "defi" }],
        },
        "draft-post": {
          status: "draft",
          title: "Draft Post",
          description: "draft post",
          date: "2026-03-12",
          author: "solana-foundation",
          categories: [{ category: "ecosystem" }],
          tags: [{ tag: "defi" }],
        },
      };

      readerMock.collections.posts.list.mockResolvedValue(Object.keys(posts));
      readerMock.collections.posts.read.mockImplementation((slug: string) =>
        Promise.resolve(posts[slug as keyof typeof posts] ?? null)
      );

      const result = await fetchLatestPosts({});

      expect(result.posts.map((item) => item.id)).toEqual(["published-post"]);
    });
  });

  describe("latest API routes", () => {
    it("includes cursor and tag in the links cache key and forwards mapped params", async () => {
      fetchLatestLinksMock.mockResolvedValue({
        links: [
          {
            id: "link-1",
            title: "Link 1",
            publishedAt: "11 Mar 2026",
            url: "https://example.com/link-1",
            source: "Source",
            linkType: "article",
            categories: ["DeFi"],
          },
        ],
      });

      const response = (await getLatestLinks({
        url: "https://example.com/api/links/latest?limit=5&cursor=cursor-1&category=defi&tag=nft",
      } as any)) as any;

      expect(unstableCacheMock).toHaveBeenCalledWith(
        expect.any(Function),
        ["links-5-cursor-1-defi-nft"],
        expect.objectContaining({
          tags: ["links"],
        })
      );
      expect(fetchLatestLinksMock).toHaveBeenCalledWith({
        limit: 5,
        cursor: "cursor-1",
        category: "DeFi",
        tag: "nft",
      });
      expect(response.body).toEqual([
        expect.objectContaining({
          id: "link-1",
          categoryId: "defi",
        }),
      ]);
    });

    it("includes tag in the posts cache key and forwards it to the data layer", async () => {
      const fetchLatestPostsSpy = vi
        .spyOn(keystaticPostData, "fetchLatestPosts")
        .mockResolvedValue({
          posts: [
            {
              id: "post-1",
              published: "11 Mar 2026",
              title: "Post 1",
              tags: ["DeFi"],
              categories: ["Ecosystem"],
              url: "/news/post-1",
              description: "rich text",
              heroImage: "/uploads/post-1.webp",
              author: {
                name: "Solana Foundation",
                avatar: null,
              },
            },
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        });

      const response = (await getLatestPosts({
        url: "https://example.com/api/posts/latest?limit=2&cursor=post-0&category=ecosystem&tag=defi",
      } as any)) as any;

      expect(unstableCacheMock).toHaveBeenCalledWith(
        expect.any(Function),
        ["posts-2-post-0-ecosystem-defi"],
        expect.objectContaining({
          tags: ["posts"],
        })
      );
      expect(fetchLatestPostsSpy).toHaveBeenCalledWith({
        limit: 2,
        cursor: "post-0",
        category: "ecosystem",
        tag: "defi",
      });
      expect(extractPlainTextMock).toHaveBeenCalledWith("rich text");
      expect(response.body).toEqual({
        posts: [
          expect.objectContaining({
            id: "post-1",
            description: "plain:rich text",
          }),
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      fetchLatestPostsSpy.mockRestore();
    });
  });
});
