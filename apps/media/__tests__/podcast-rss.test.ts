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
});
