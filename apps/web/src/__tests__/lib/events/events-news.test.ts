import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchEventsNews } from "@/lib/media/events-news";
import { fetchLatestPosts } from "@/lib/media/post";
import type { PostItem } from "@/types/media";

vi.mock("@/lib/media/post", () => ({ fetchLatestPosts: vi.fn() }));

const post = (id: string, publishedAt: string): PostItem => ({
  id,
  title: id,
  url: `/news/${id}`,
  published: publishedAt,
  publishedAt,
  tags: [],
  categories: [],
  description: "",
  heroImage: null,
  author: { name: "", avatar: null },
});

beforeEach(() => vi.clearAllMocks());

describe("events news feed", () => {
  it("combines event and community posts, deduplicates, and returns the latest four", async () => {
    vi.mocked(fetchLatestPosts)
      .mockResolvedValueOnce({
        posts: [
          post("one", "2026-10-01"),
          post("two", "2026-10-02"),
          post("three", "2026-10-03"),
        ],
      })
      .mockResolvedValueOnce({
        posts: [
          post("three", "2026-10-03"),
          post("four", "2026-10-04"),
          post("five", "2026-10-05"),
        ],
      });

    const posts = await fetchEventsNews();

    expect(posts.map((item) => item.id)).toEqual([
      "five",
      "four",
      "three",
      "two",
    ]);
    expect(fetchLatestPosts).toHaveBeenCalledWith({ tag: "events", limit: 8 });
    expect(fetchLatestPosts).toHaveBeenCalledWith({
      category: "community",
      limit: 8,
    });
  });
});
