import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  buildPodcastSitemapXml,
  PODCAST_SITEMAP_CANONICAL_URL,
} from "@/lib/podcast-sitemap";

describe("podcast episode sitemap", () => {
  it("uses the public canonical sitemap URL", () => {
    expect(PODCAST_SITEMAP_CANONICAL_URL).toBe(
      "https://solana.com/podcasts/sitemap.xml",
    );
  });

  it("renders canonical episode URLs and last-modified timestamps", () => {
    const xml = buildPodcastSitemapXml([
      {
        podcastSlug: "validated",
        episodeSlug: "build-on-solana-2026-07-23",
        publishedDate: "2026-07-23T12:00:00.000Z",
      },
    ]);

    expect(xml).toContain(
      "<loc>https://solana.com/podcasts/validated/episodes/build-on-solana-2026-07-23</loc>",
    );
    expect(xml).toContain("<lastmod>2026-07-23T12:00:00.000Z</lastmod>");
  });

  it("escapes dynamic URL content", () => {
    const xml = buildPodcastSitemapXml([
      {
        podcastSlug: "show&name",
        episodeSlug: "episode",
      },
    ]);

    expect(xml).toContain("show%26name");
    expect(xml).not.toContain("show&name");
  });
});
