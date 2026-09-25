import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockFetchLatestLinks, mockFetchLatestPosts } = vi.hoisted(() => ({
  mockFetchLatestLinks: vi.fn(),
  mockFetchLatestPosts: vi.fn(),
}));

vi.mock("@/lib/media/link", () => ({
  fetchLatestLinks: mockFetchLatestLinks,
}));

vi.mock("@/lib/media/post", () => ({
  fetchLatestPosts: mockFetchLatestPosts,
}));

import { fetchAlpenglowNews } from "@/lib/media/alpenglow-news";

describe("fetchAlpenglowNews", () => {
  beforeEach(() => {
    mockFetchLatestPosts.mockReset();
    mockFetchLatestLinks.mockReset();
  });

  it("includes Alpenglow articles from the media link engine", async () => {
    mockFetchLatestPosts.mockResolvedValue({ posts: [] });
    mockFetchLatestLinks.mockResolvedValue({
      links: [
        {
          id: "alpenglow-a-new-consensus-for-solana",
          title: "Alpenglow: A New Consensus for Solana",
          url: "https://www.anza.xyz/blog/alpenglow-a-new-consensus-for-solana",
          date: "2025-05-19T00:00:00.000Z",
          description:
            "Meet Alpenglow, Solana's new consensus protocol with 150ms finality.",
          thumbnailImage:
            "/uploads/links/alpenglow-a-new-consensus-for-solana/thumbnailImage.png",
        },
      ],
    });

    await expect(fetchAlpenglowNews()).resolves.toEqual([
      {
        id: "alpenglow-a-new-consensus-for-solana",
        title: "Alpenglow: A New Consensus for Solana",
        date: "2025-05-19T00:00:00.000Z",
        image:
          "/api/media/image?path=%2Fuploads%2Flinks%2Falpenglow-a-new-consensus-for-solana%2FthumbnailImage.png",
        link: "https://www.anza.xyz/blog/alpenglow-a-new-consensus-for-solana",
      },
    ]);
    expect(mockFetchLatestLinks).toHaveBeenCalledWith({
      limit: 50,
      tag: "alpenglow",
      linkType: "article",
    });
  });
});
