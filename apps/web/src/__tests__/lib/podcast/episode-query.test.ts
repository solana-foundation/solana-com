import { describe, expect, it } from "vitest";

import {
  DEFAULT_EPISODE_SORT,
  MAX_EPISODE_PAGE,
  buildEpisodesUrl,
  parseEpisodePage,
  parseEpisodeSort,
} from "@/lib/podcast/episode-query";

describe("parseEpisodePage", () => {
  it("accepts whole page numbers", () => {
    expect(parseEpisodePage("0")).toBe(0);
    expect(parseEpisodePage("3")).toBe(3);
  });

  it("falls back to the first page for missing or non-numeric input", () => {
    // Regression: `Number("abc")` is NaN, which the default parameter on
    // getEpisodes could not catch, so `offset=NaN` reached the upstream API.
    expect(parseEpisodePage("abc")).toBe(0);
    expect(parseEpisodePage("")).toBe(0);
    expect(parseEpisodePage(null)).toBe(0);
    expect(parseEpisodePage(undefined)).toBe(0);
    expect(parseEpisodePage("Infinity")).toBe(0);
  });

  it("rejects negative pages that would slice from the end", () => {
    expect(parseEpisodePage("-1")).toBe(0);
    expect(parseEpisodePage("-999")).toBe(0);
  });

  it("floors fractional pages", () => {
    expect(parseEpisodePage("2.9")).toBe(2);
  });

  it("clamps absurd pages to the maximum", () => {
    expect(parseEpisodePage("999999999999999999999")).toBe(MAX_EPISODE_PAGE);
    expect(parseEpisodePage(String(MAX_EPISODE_PAGE + 1))).toBe(
      MAX_EPISODE_PAGE,
    );
  });
});

describe("parseEpisodeSort", () => {
  it("accepts the values the upstream API supports", () => {
    expect(parseEpisodeSort("asc")).toBe("asc");
    expect(parseEpisodeSort("desc")).toBe("desc");
  });

  it("falls back to the default for anything else", () => {
    expect(parseEpisodeSort("sideways")).toBe(DEFAULT_EPISODE_SORT);
    expect(parseEpisodeSort("")).toBe(DEFAULT_EPISODE_SORT);
    expect(parseEpisodeSort(null)).toBe(DEFAULT_EPISODE_SORT);
    expect(parseEpisodeSort(undefined)).toBe(DEFAULT_EPISODE_SORT);
  });
});

describe("buildEpisodesUrl", () => {
  const base = {
    podcastId: "podcast-id",
    limit: 15,
    offset: 0,
    query: "",
    sort: "desc",
  };

  it("builds the expected upstream url", () => {
    expect(buildEpisodesUrl({ ...base, query: "solana" })).toBe(
      "https://api.simplecast.com/podcasts/podcast-id/episodes" +
        "?status=published&limit=15&offset=0&search=solana&sort=desc",
    );
  });

  it("encodes a search term so it cannot inject extra parameters", () => {
    // Regression: the url was assembled by string interpolation, so a search
    // term containing `&` added parameters to the upstream request — letting a
    // caller override the app's own limit.
    const url = new URL(buildEpisodesUrl({ ...base, query: "foo&limit=500" }));

    expect(url.searchParams.getAll("limit")).toEqual(["15"]);
    expect(url.searchParams.get("search")).toBe("foo&limit=500");
  });

  it("encodes a search term so it cannot truncate the query string", () => {
    // Regression: `#` started a fragment, dropping `sort` from the request.
    const url = new URL(buildEpisodesUrl({ ...base, query: "foo#bar" }));

    expect(url.hash).toBe("");
    expect(url.searchParams.get("search")).toBe("foo#bar");
    expect(url.searchParams.get("sort")).toBe("desc");
  });

  it("encodes spaces and unicode in the search term", () => {
    const url = new URL(
      buildEpisodesUrl({ ...base, query: "solana breakpoint 東京" }),
    );

    expect(url.searchParams.get("search")).toBe("solana breakpoint 東京");
  });

  it("encodes the podcast id", () => {
    const url = new URL(
      buildEpisodesUrl({ ...base, podcastId: "id with spaces" }),
    );

    expect(url.pathname).toBe("/podcasts/id%20with%20spaces/episodes");
  });

  it("always produces a parseable url", () => {
    const queries = ["", "?", "#", "&", "%", "a=b&c=d", "../../etc/passwd"];

    for (const query of queries) {
      const url = new URL(buildEpisodesUrl({ ...base, query }));

      expect(url.origin).toBe("https://api.simplecast.com");
      expect(url.pathname).toBe("/podcasts/podcast-id/episodes");
      expect(url.searchParams.get("search")).toBe(query);
    }
  });
});
