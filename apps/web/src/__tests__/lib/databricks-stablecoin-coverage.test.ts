import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { DataApiResponseError } from "@/lib/databricks/server";
import { getStablecoinCoverage } from "@/lib/databricks/stablecoin-coverage";

const config = { baseUrl: "https://data.solana.com", apiKey: "test-key" };

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: "",
    json: () => Promise.resolve(body),
  } as Response;
}

describe("data-api stablecoin coverage client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches /stablecoin-coverage with the api key and maps rows in order", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        source: "memory_cache",
        data: {
          generatedAt: "2026-11-20T10:00:00+00:00",
          truncated: false,
          providers: [
            "Allium",
            "Blockworks",
            "DefiLlama",
            "Dune",
            "Top Ledger",
          ],
          rows: [
            {
              token: "USDC",
              mint_address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              coverage: {
                Allium: true,
                Blockworks: true,
                DefiLlama: true,
                Dune: false,
                "Top Ledger": true,
              },
            },
            {
              token: null,
              mint_address: "52GzcLDMfBveMRnWXKX7U3Pa5Lf7QLkWWvsJRDjWDBSk",
              coverage: { Dune: true },
            },
            { token: "BAD", coverage: { Allium: true } },
          ],
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await getStablecoinCoverage(config);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://data.solana.com/stablecoin-coverage",
      { cache: "no-store", headers: { "x-api-key": "test-key" } },
    );
    expect(result).toEqual({
      generatedAt: "2026-11-20T10:00:00+00:00",
      rows: [
        {
          token: "USDC",
          mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          // data-api's "DefiLlama" becomes the dashboard's "DeFiLlama"
          coverage: {
            Allium: true,
            Blockworks: true,
            DeFiLlama: true,
            Dune: false,
            "Top Ledger": true,
          },
        },
        {
          token: null,
          mintAddress: "52GzcLDMfBveMRnWXKX7U3Pa5Lf7QLkWWvsJRDjWDBSk",
          // providers missing from the payload count as not covered
          coverage: {
            Allium: false,
            Blockworks: false,
            DeFiLlama: false,
            Dune: true,
            "Top Ledger": false,
          },
        },
      ],
    });
  });

  it("throws on a non-2xx response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(503, { detail: "down" })),
    );

    await expect(getStablecoinCoverage(config)).rejects.toThrow(
      DataApiResponseError,
    );
  });

  it("throws when the payload has no rows", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(200, { data: {} })),
    );

    await expect(getStablecoinCoverage(config)).rejects.toThrow(
      "invalid-payload",
    );
  });
});
