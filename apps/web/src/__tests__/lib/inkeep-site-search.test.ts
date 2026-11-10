import { describe, expect, it } from "vitest";
import { buildSiteSearchResponse } from "../../../../../packages/ui-chrome/src/inkeep-search";
import { findSitePages } from "../../../../../packages/ui-chrome/src/inkeep-site-context";
import {
  getSourceCategory,
  transformInkeepSource,
} from "../../../../../packages/ui-chrome/src/inkeep-sources";

describe("site-wide search", () => {
  it.each([
    ["wallets", "https://solana.com/wallets"],
    ["walletts", "https://solana.com/wallets"],
    ["media kit", "https://solana.com/branding"],
    ["official logos", "https://solana.com/branding"],
    ["Superteam", "https://superteam.fun/"],
    ["Agent Registry", "https://solana.com/agent-registry"],
    ["SDP", "https://solana.com/solutions/sdp"],
    ["events", "https://solana.com/events"],
  ])("finds the maintained destination for %s", (query, url) => {
    expect(findSitePages(query)[0]?.url).toBe(url);
  });

  it("does not promote a related fee page over a technical transaction query", () => {
    expect(findSitePages("transactions")).toEqual([]);
    expect(
      findSitePages("How do accounts store data and who can modify them?"),
    ).toEqual([]);
  });

  it("keeps preferred language and distinct sections while consolidating result variants", () => {
    const hit = (url: string) => ({ id: url, url, title: "Article" });
    const response = buildSiteSearchResponse(
      {
        data: {
          search: {
            searchHits: [
              hit("https://solana.com/de/news/example"),
              hit("https://solana.com/news/example?utm_source=search"),
              hit("https://solana.com/news/example"),
              hit("https://solana.com/llms-full.txt"),
              hit("https://solana.com/docs/core/accounts#owner"),
              hit("https://solana.com/docs/core/accounts#data"),
            ],
          },
        },
      },
      "no navigation match",
    );
    expect(
      response?.data.search.searchHits.map((result) => result.url),
    ).toEqual([
      "https://solana.com/news/example?utm_source=search",
      "https://solana.com/docs/core/accounts#owner",
      "https://solana.com/docs/core/accounts#data",
    ]);
  });

  it("provides useful navigation during an upstream failure without inventing broad results", () => {
    expect(
      buildSiteSearchResponse(null, "wallets")?.data.search.searchHits[0]?.url,
    ).toBe("https://solana.com/wallets");
    expect(buildSiteSearchResponse(null, "Quantum Banana SDK")).toBeNull();
  });

  it("handles root-only URLs and distinguishes malformed data from zero results", () => {
    const response = buildSiteSearchResponse(
      {
        data: {
          search: {
            searchHits: [
              {
                id: "aggregate",
                rootRecord: { url: "https://solana.com/llms.txt" },
              },
              {
                id: "account",
                rootRecord: { url: "https://solana.com/docs/core/accounts" },
              },
            ],
          },
        },
      },
      "account ownership",
    );
    expect(response?.data.search.searchHits.map((hit) => hit.id)).toEqual([
      "account",
    ]);
    expect(
      buildSiteSearchResponse(
        { data: { search: {} } },
        "no matching destination",
      ),
    ).toBeNull();
    expect(
      buildSiteSearchResponse(
        { data: { search: { searchHits: [] } } },
        "no matching destination",
      )?.data.search.searchHits,
    ).toEqual([]);
  });

  it.each([
    ["https://solana.com/news/example", "News & research"],
    ["https://solana.com/es/docs/core/accounts", "Learn & docs"],
    ["https://solana.com/solutions/tokenization", "Pages & products"],
    ["https://solana.com/events", "Community & events"],
    ["https://www.anchor-lang.com/docs", "Developer resources"],
    ["https://example.com/solana.com/docs", null],
  ])("classifies %s by host and path", (url, category) => {
    expect(getSourceCategory(url)).toBe(category);
  });

  it("stops presenting news as Solana Docs", () => {
    const source = {
      url: "https://solana.com/news/example",
      title: "News",
      description: "A news article",
      breadcrumbs: ["Docs", "News"],
      tabs: ["Solana Docs"],
      type: "site" as const,
      icon: {},
    };
    const transformed = transformInkeepSource(
      source as Parameters<typeof transformInkeepSource>[0],
      "searchResultItem",
    );
    expect(transformed.breadcrumbs).toEqual(["News & research", "News"]);
    expect(transformed.tabs).toEqual([
      ["News & research", { breadcrumbs: ["News"] }],
    ]);
  });
});
