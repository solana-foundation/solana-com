import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  unstable_cache: <T>(fn: T) => fn,
}));

import { defiLlamaUrl, extractDefiLlamaValue } from "@/lib/metrics/external";
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

describe("computeNakamotoCoefficient", () => {
  it("counts the fewest validators holding more than a third of stake", () => {
    expect(computeNakamotoCoefficient(["40", "30", "20", "10"])).toBe(1);
    expect(computeNakamotoCoefficient([10, 10, 10, 10, 10, 10])).toBe(3);
    expect(computeNakamotoCoefficient([])).toBe(undefined);
  });
});
