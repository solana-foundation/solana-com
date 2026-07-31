import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@solana-com/ui-chrome/assets/favicon.png", () => ({
  default: { src: "/favicon.png" },
}));

vi.mock("@/lib/post-data", () => ({
  fetchLatestPosts: vi.fn(),
}));

import { fetchLatestPosts } from "@/lib/post-data";
import {
  buildChangelogFeed,
  CHANGELOG_RSS_CANONICAL_URL,
} from "@/lib/changelog-rss";

const mockFetchLatestPosts = fetchLatestPosts as ReturnType<typeof vi.fn>;

describe("buildChangelogFeed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchLatestPosts.mockResolvedValue({
      posts: [
        {
          id: "solana-changelog-july-23-2026",
          published: "Jul 23, 2026",
          publishedAt: "2026-07-23T13:04:00.000Z",
          title: "Solana Changelog: July 23, 2026",
          tags: ["Developer"],
          categories: ["Changelog", "Developers"],
          url: "/news/solana-changelog-july-23-2026",
          description: "Validator clients and program SDKs shipped updates.",
          heroImage:
            "/uploads/posts/solana-changelog-july-23-2026/heroImage.webp",
          author: {
            name: "Solana Foundation",
            avatar: null,
          },
          cursor: "solana-changelog-july-23-2026",
        },
      ],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it("queries only the changelog category", async () => {
    await buildChangelogFeed();

    expect(mockFetchLatestPosts).toHaveBeenCalledWith({
      category: "Changelog",
      limit: 20,
    });
  });

  it("publishes canonical article and feed URLs", async () => {
    const feed = await buildChangelogFeed();
    const rss = feed.rss2();

    expect(CHANGELOG_RSS_CANONICAL_URL).toBe(
      "https://solana.com/changelog/rss.xml",
    );
    expect(rss).toContain("<title>Solana Changelog</title>");
    expect(rss).toContain(
      "https://solana.com/news/solana-changelog-july-23-2026",
    );
    expect(rss).toContain(
      "Validator clients and program SDKs shipped updates.",
    );
  });
});
