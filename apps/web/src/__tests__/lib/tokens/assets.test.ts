import { fetchTokenizedAssets } from "@/lib/tokens/assets";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalApiKey = process.env.TOKENS_API_KEY;
const originalApiBaseUrl = process.env.TOKENS_API_BASE_URL;
const originalFetch = global.fetch;

const mockCuratedResponse = {
  assets: [
    {
      assetId: "nvidia",
      name: "NVIDIA",
      symbol: "NVDA",
      category: "equity",
      imageUrl: "https://api.tokens.xyz/logos/xstocks/NVDAx.png",
      stats: {
        price: 211.86,
        liquidity: 3815081,
        volume24hUSD: 1323988935,
        volume30dUSD: 51984835,
        marketCap: 75803629,
        priceChange24hPercent: 2.48,
        priceChange1hPercent: 0.03,
      },
      primaryVariant: {
        label: "xStock",
        issuerUrl: "https://example.com",
        market: {
          marketCap: 72863250,
          liquidity: 3803916,
          volume24hUSD: 2188493,
          price: 213.83,
          priceChange24hPercent: -3.79,
        },
      },
    },
    {
      assetId: "usd",
      name: "US Dollar",
      symbol: "USD",
      category: "stablecoin",
      imageUrl: "https://api.tokens.xyz/logos/currencies/usd.png",
      stats: {
        price: 1,
        liquidity: 945903424,
        volume24hUSD: 687462551,
        volume30dUSD: 38424008443,
        marketCap: 16242775818,
        priceChange24hPercent: -0.01,
        priceChange1hPercent: 0,
      },
      primaryVariant: {
        name: "USD Coin",
        symbol: "USDC",
        market: {
          marketCap: 8418273617,
          liquidity: 661521077,
          volume24hUSD: 323033440,
          price: 1,
          priceChange24hPercent: -0.01,
        },
      },
    },
    {
      assetId: "solana",
      name: "Solana",
      symbol: "SOL",
      category: "crypto",
      imageUrl: null,
      stats: null,
      primaryVariant: null,
    },
  ],
};

const mockMarketsResponse = {
  includes: {
    markets: {
      ok: true,
      data: {
        markets: [
          {
            source: "Orca",
          },
        ],
      },
    },
  },
};

describe("fetchTokenizedAssets", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    process.env.TOKENS_API_KEY = "test-api-key";
    process.env.TOKENS_API_BASE_URL = "https://api.tokens.xyz/v1/";
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.endsWith("/v1/assets/usd?include=markets")) {
        return {
          ok: true,
          json: async () => mockMarketsResponse,
        };
      }

      return {
        ok: true,
        json: async () => mockCuratedResponse,
      };
    });
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.TOKENS_API_KEY;
    } else {
      process.env.TOKENS_API_KEY = originalApiKey;
    }

    if (originalApiBaseUrl === undefined) {
      delete process.env.TOKENS_API_BASE_URL;
    } else {
      process.env.TOKENS_API_BASE_URL = originalApiBaseUrl;
    }

    fetchMock.mockReset();
    global.fetch = originalFetch;
  });

  it("normalizes a versioned API base URL before fetching curated assets", async () => {
    const assets = await fetchTokenizedAssets();
    const calledUrls = fetchMock.mock.calls.map(([url]) => String(url));

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.tokens.xyz/v1/assets/curated?list=all&groupBy=asset&limit=500",
      expect.objectContaining({
        headers: {
          "x-api-key": "test-api-key",
          accept: "application/json",
        },
        next: { revalidate: 60 * 60 },
      }),
    );
    expect(calledUrls).toContain(
      "https://api.tokens.xyz/v1/assets/usd?include=markets",
    );
    expect(assets).toHaveLength(2);
    expect(assets.map((asset) => asset.assetId)).toEqual(["usd", "nvidia"]);
    expect(assets.find((asset) => asset.assetId === "usd")?.issuer).toBe(
      "Orca",
    );
    expect(assets.find((asset) => asset.assetId === "nvidia")?.issuer).toBe(
      "xStock",
    );
  });

  it("normalizes an unversioned API base URL before fetching curated assets", async () => {
    process.env.TOKENS_API_BASE_URL = "https://api.tokens.xyz";

    await fetchTokenizedAssets();

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.tokens.xyz/v1/assets/curated?list=all&groupBy=asset&limit=500",
      expect.any(Object),
    );
  });

  it("does not fetch when the API key is missing", async () => {
    delete process.env.TOKENS_API_KEY;

    await expect(fetchTokenizedAssets()).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
