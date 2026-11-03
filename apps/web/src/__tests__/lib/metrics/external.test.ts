import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  unstable_cache: <T>(fn: T) => fn,
}));

import {
  defiLlamaUrl,
  extractDefiLlamaValue,
  extractX402Value,
} from "@/lib/metrics/external";
import { computeNakamotoCoefficient } from "@/lib/metrics/nakamoto";

describe("extractDefiLlamaValue", () => {
  it("reads the chain, protocol, and aggregator figures DefiLlama publishes", () => {
    expect(
      extractDefiLlamaValue(
        { provider: "defillama", query: "chain-tvl", slug: "Solana" },
        [
          { name: "Ethereum", tvl: 6e10 },
          { name: "Solana", tvl: 5.36e9 },
        ],
      ),
    ).toBe(5.36e9);
    expect(
      extractDefiLlamaValue(
        { provider: "defillama", query: "protocol-tvl", slug: "kamino" },
        {
          currentChainTvls: { Solana: 1.28e9, "Solana-borrowed": 8.2e8 },
        },
      ),
    ).toBe(1.28e9);
    expect(
      extractDefiLlamaValue(
        {
          provider: "defillama",
          query: "aggregator-volume",
          slug: "jupiter-aggregator",
        },
        { totalAllTime: 1.31e12 },
      ),
    ).toBe(1.31e12);
  });

  it("rejects missing or non-positive values so the snapshot is used", () => {
    const spec = {
      provider: "defillama",
      query: "protocol-tvl",
      slug: "exponent",
    } as const;
    expect(extractDefiLlamaValue(spec, { currentChainTvls: {} })).toBe(
      undefined,
    );
    expect(
      extractDefiLlamaValue(spec, { currentChainTvls: { Solana: 0 } }),
    ).toBe(undefined);
    expect(extractDefiLlamaValue(spec, null)).toBe(undefined);
  });

  it("builds the public API URL for each query", () => {
    expect(
      defiLlamaUrl({
        provider: "defillama",
        query: "protocol-tvl",
        slug: "raydium",
      }),
    ).toBe("https://api.llama.fi/protocol/raydium");
  });
});

describe("extractDefiLlamaValue for stablecoins", () => {
  it("uses the latest complete day, not today's partial reading", () => {
    const day = 24 * 60 * 60;
    const today = 20_000 * day;
    expect(
      extractDefiLlamaValue(
        {
          provider: "defillama",
          query: "stablecoin-chain-supply",
          slug: "120",
          chain: "Solana",
        },
        {
          chainBalances: {
            Solana: {
              tokens: [
                { date: today - 2 * day, circulating: { peggedUSD: 7.0e8 } },
                { date: today - day, circulating: { peggedUSD: 7.08e8 } },
                { date: today, circulating: { peggedUSD: 6.7e8 } },
              ],
            },
          },
        },
        today * 1000 + 3600_000,
      ),
    ).toBe(7.08e8);
  });
});

describe("extractX402Value", () => {
  const solana = {
    total_transactions: 781_624,
    total_amount: 339_667_253_085,
    unique_buyers: 1362,
    unique_sellers: 1282,
  };
  const all = {
    total_transactions: 3_776_966,
    total_amount: 1_533_733_121_979,
  };

  it("reads Solana figures and converts USDC base units", () => {
    expect(
      extractX402Value(
        { provider: "x402scan", query: "transactions", timeframe: 30 },
        solana,
      ),
    ).toBe(781_624);
    expect(
      extractX402Value(
        { provider: "x402scan", query: "volume-usd", timeframe: 30 },
        solana,
      ),
    ).toBeCloseTo(339_667.25, 2);
  });

  it("computes Solana's share of all chains", () => {
    expect(
      extractX402Value(
        { provider: "x402scan", query: "transaction-share", timeframe: 30 },
        solana,
        all,
      ),
    ).toBeCloseTo(20.69, 1);
    expect(
      extractX402Value(
        { provider: "x402scan", query: "volume-share", timeframe: 30 },
        solana,
        {},
      ),
    ).toBe(undefined);
  });
});

describe("computeNakamotoCoefficient", () => {
  it("counts the fewest validators holding more than a third of stake", () => {
    expect(computeNakamotoCoefficient(["40", "30", "20", "10"])).toBe(1);
    expect(computeNakamotoCoefficient([10, 10, 10, 10, 10, 10])).toBe(3);
    expect(computeNakamotoCoefficient([])).toBe(undefined);
  });
});
