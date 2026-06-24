import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchEpisodeByIdFromRSS } from "@/lib/podcast-rss";

describe("fetchEpisodeByIdFromRSS", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses the Buzzsprout HTML fallback for episode lookups by slug or id", async () => {
    const html = `<h2>1 episodes</h2><div id="episode_19027082" class="flex gap-4 py-5 md:py-8"><a class="w-12 h-12" href="/2092514/episodes/19027082-irina-chuchkina-on-wallet-in-telegram-how-crypto-wallets-are-reaching-100m-users?t=0"></a><a class="w-full" href="/2092514/episodes/19027082-irina-chuchkina-on-wallet-in-telegram-how-crypto-wallets-are-reaching-100m-users"><img src="https://example.com/cover.jpg" /><h3 id="title_episode_19027082">Irina Chuchkina on Wallet in Telegram: How Crypto Wallets Are Reaching 100M+ Users</h3><div id="description_episode_19027082">Episode description</div><time datetime="2026-04-20T00:00:00Z" class="whitespace-nowrap"></time><span>•</span> 44:12</a></div>`;

    const fetchMock = vi.fn().mockImplementation(
      async () =>
        new Response(html, {
          status: 200,
          headers: {
            "content-type": "text/html",
          },
        }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const bySlug = await fetchEpisodeByIdFromRSS(
      "19027082-irina-chuchkina-on-wallet-in-telegram-how-crypto-wallets-are-reaching-100m-users",
      "https://rss.buzzsprout.com/2092514.rss",
      "the-index",
    );
    const byId = await fetchEpisodeByIdFromRSS(
      "19027082",
      "https://rss.buzzsprout.com/2092514.rss",
      "the-index",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://www.buzzsprout.com/2092514/episodes",
      expect.any(Object),
    );
    expect(bySlug?.id).toBe("19027082");
    expect(bySlug?.slug).toBe(
      "19027082-irina-chuchkina-on-wallet-in-telegram-how-crypto-wallets-are-reaching-100m-users",
    );
    expect(byId?.title).toContain("Irina Chuchkina");
    expect(byId?.audioUrl).toContain("/2092514/episodes/19027082");
  });

  it("parses the redesigned Buzzsprout episode markup", async () => {
    const html = `<h2>1 episodes</h2><div id="episode_19255333" class="flex gap-4 py-5 md:py-8"><a class="w-12 h-12 flex" title="Play episode" href="/2617232/episodes/19255333-how-sofi-continues-to-reshape-banking-with-stablecoins?t=0"></a><a class="w-full no-underline" href="/2617232/episodes/19255333-how-sofi-continues-to-reshape-banking-with-stablecoins"><div class="show-notes flex justify-between"><div dir="auto"><h3 id="title_episode_19255333" class="text-base">How SoFI Continues to Reshape Banking with Stablecoins</h3><p id="description_episode_19255333" class="py-2 text-sm">Episode description</p><div class="flex"><time datetime="May 28, 2026" class="whitespace-nowrap">May 28, 2026</time><span >•</span> 24:08</div></div><img alt="Artwork" src="https://example.com/cover.jpg" /></div></a></div>`;

    const fetchMock = vi.fn().mockImplementation(
      async () =>
        new Response(html, {
          status: 200,
          headers: {
            "content-type": "text/html",
          },
        }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const episode = await fetchEpisodeByIdFromRSS(
      "19255333",
      "https://rss.buzzsprout.com/2617232.rss",
      "mint-condition",
    );

    expect(episode?.id).toBe("19255333");
    expect(episode?.slug).toBe(
      "19255333-how-sofi-continues-to-reshape-banking-with-stablecoins",
    );
    expect(episode?.title).toBe(
      "How SoFI Continues to Reshape Banking with Stablecoins",
    );
    expect(episode?.description).toBe("Episode description");
    expect(episode?.duration).toBe(24 * 60 + 8);
  });

  it("falls back to the RSS feed when Buzzsprout scraping finds no episodes", async () => {
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Mint Condition</title>
    <item>
      <title>How SoFI Continues to Reshape Banking with Stablecoins</title>
      <guid isPermaLink="false">Buzzsprout-19255333</guid>
      <pubDate>Thu, 28 May 2026 12:00:00 +0000</pubDate>
      <enclosure url="https://www.buzzsprout.com/2617232/episodes/19255333-how-sofi-continues-to-reshape-banking-with-stablecoins.mp3" length="17431539" type="audio/mpeg" />
      <itunes:duration>1448</itunes:duration>
      <description>Episode description</description>
    </item>
  </channel>
</rss>`;

    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("buzzsprout.com/2617232/episodes")) {
        // Scrape returns markup the parser cannot understand
        return new Response("<html><body>redesigned page</body></html>", {
          status: 200,
          headers: { "content-type": "text/html" },
        });
      }
      return new Response(rssXml, {
        status: 200,
        headers: { "content-type": "application/rss+xml" },
      });
    });

    vi.stubGlobal("fetch", fetchMock);

    // Look up by the same slug the Buzzsprout website scraper would produce,
    // proving episode URLs stay stable when falling back to RSS
    const episode = await fetchEpisodeByIdFromRSS(
      "19255333-how-sofi-continues-to-reshape-banking-with-stablecoins",
      "https://rss.buzzsprout.com/2617232.rss",
      "mint-condition",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://rss.buzzsprout.com/2617232.rss",
      expect.any(Object),
    );
    expect(episode?.id).toBe("19255333");
    expect(episode?.slug).toBe(
      "19255333-how-sofi-continues-to-reshape-banking-with-stablecoins",
    );
    expect(episode?.title).toBe(
      "How SoFI Continues to Reshape Banking with Stablecoins",
    );
    expect(episode?.audioUrl).toContain("/2617232/episodes/19255333");
  });
});
