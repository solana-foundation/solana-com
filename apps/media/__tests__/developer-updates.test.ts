import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { fetchLatestPostsMock, nextJsonMock, readerMock, unstableCacheMock } =
  vi.hoisted(() => ({
    fetchLatestPostsMock: vi.fn(),
    nextJsonMock: vi.fn((body: unknown, init?: ResponseInit) => ({
      body,
      init,
    })),
    readerMock: {
      collections: {
        upgrades: {
          list: vi.fn(),
          read: vi.fn(),
        },
        releases: {
          list: vi.fn(),
          read: vi.fn(),
        },
      },
    },
    unstableCacheMock: vi.fn((fn: () => unknown) => fn),
  }));

vi.mock("next/cache", () => ({
  unstable_cache: unstableCacheMock,
}));

vi.mock("next/server", () => ({
  NextResponse: {
    json: nextJsonMock,
  },
}));

vi.mock("@/lib/keystatic/post-data", () => ({
  fetchLatestPosts: fetchLatestPostsMock,
}));

vi.mock("@/lib/reader", () => ({
  reader: readerMock,
}));

import { GET } from "@/app/api/developer-updates/latest/route";

describe("developer updates endpoint", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-03T00:00:00.000Z"));
    vi.clearAllMocks();

    fetchLatestPostsMock.mockImplementation(
      async ({ category }: { category: string }) =>
        category === "developers"
          ? {
              posts: [
                {
                  title: "Developer news",
                  description: [
                    {
                      type: "paragraph",
                      children: [{ type: "text", text: "Build now" }],
                    },
                  ],
                  publishedAt: "2026-08-28T00:00:00.000Z",
                  url: "/news/developer-news",
                },
              ],
            }
          : {
              posts: [
                {
                  title: "Changelog",
                  description: "Weekly changes",
                  publishedAt: "2026-08-29T00:00:00.000Z",
                  url: "/news/changelog",
                },
              ],
            },
    );

    readerMock.collections.upgrades.list.mockResolvedValue([
      "future-upgrade",
      "live-upgrade",
    ]);
    readerMock.collections.upgrades.read.mockImplementation((slug: string) =>
      Promise.resolve(
        {
          "future-upgrade": {
            title: "Future upgrade",
            description: "Not live yet",
            publishedAt: "2026-09-10T00:00:00.000Z",
            status: "published",
          },
          "live-upgrade": {
            title: "Live upgrade",
            description: "A network improvement",
            publishedAt: "2026-08-27T00:00:00.000Z",
            status: "published",
          },
        }[slug],
      ),
    );

    readerMock.collections.releases.list.mockResolvedValue([
      "planned-release",
      "shipped-release",
    ]);
    readerMock.collections.releases.read.mockImplementation((slug: string) =>
      Promise.resolve(
        {
          "planned-release": {
            name: "Agave 4.3",
            expectedDate: "2026-10-01",
            status: "planned",
          },
          "shipped-release": {
            name: "Agave 4.2",
            expectedDate: "2026-08-01",
            status: "shipped",
            overview: "agave-4-2-release-overview",
          },
        }[slug],
      ),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the latest published item from each Media collection", async () => {
    const response = (await GET()) as unknown as {
      body: { updates: unknown[] };
    };

    expect(response.body.updates).toEqual([
      {
        kind: "News",
        title: "Developer news",
        description: "Build now",
        href: "/news/developer-news",
        publishedAt: "2026-08-28T00:00:00.000Z",
      },
      {
        kind: "Changelog",
        title: "Changelog",
        description: "Weekly changes",
        href: "/news/changelog",
        publishedAt: "2026-08-29T00:00:00.000Z",
      },
      {
        kind: "Upgrade",
        title: "Live upgrade",
        description: "A network improvement",
        href: "/upgrades/live-upgrade",
        publishedAt: "2026-08-27T00:00:00.000Z",
      },
      {
        kind: "Release",
        title: "Agave 4.2",
        description:
          "The latest shipped software release for the Solana network.",
        href: "/upgrades/agave-4-2-release-overview",
        publishedAt: "2026-08-01",
      },
    ]);
    expect(fetchLatestPostsMock).toHaveBeenCalledWith({
      limit: 1,
      category: "developers",
      excludeCategory: "changelog",
    });
    expect(fetchLatestPostsMock).toHaveBeenCalledWith({
      limit: 1,
      category: "changelog",
    });
  });
});
