import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getRpcSenderCacheKey,
  getRpcSenderMetricRows,
  parseRpcSenderQueryOptions,
} from "@/lib/rpc/sender-server";

describe("RPC Sender query options", () => {
  it("uses the shared RPC timeframe parser and defaults", () => {
    expect(parseRpcSenderQueryOptions(new URLSearchParams()).timeframe).toBe(
      "6h",
    );
    expect(
      parseRpcSenderQueryOptions(new URLSearchParams("timeframe=30m"))
        .timeframe,
    ).toBe("30m");
    expect(
      parseRpcSenderQueryOptions(new URLSearchParams("timeframe=unknown"))
        .timeframe,
    ).toBe("6h");
  });

  it("keeps each timeframe in a distinct cache entry", () => {
    expect(getRpcSenderCacheKey({ timeframe: "30m" })).not.toBe(
      getRpcSenderCacheKey({ timeframe: "1y" }),
    );
    expect(getRpcSenderCacheKey({ timeframe: "30m" })).toContain(
      "|30m|1800|60",
    );
  });
});

describe("RPC Sender Grafana panels", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("maps the economics and time-series panels into dashboard rows", async () => {
    const now = 1_800_000_000_000;
    const fetchMock = vi.fn().mockImplementation(async (input: string) => {
      const panelId = new URL(input).pathname.split("/").at(-2);

      return new Response(
        JSON.stringify(
          panelId === "1"
            ? panelResponse(
                [
                  "provider",
                  "Transactions",
                  "Total tips (SOL)",
                  "Total fees (SOL)",
                  "Median tip (lamports)",
                  "Median fee (lamports)",
                ],
                [
                  ["jito", "helius"],
                  [204_212, 19_336],
                  [38.3, 9.38],
                  [5.6, 10.3],
                  [4_000, 5_000],
                  [5_000, 13_028],
                ],
              )
            : panelResponse(
                ["time", "provider", "txs"],
                [
                  [now - 60_000, now - 60_000, now],
                  ["jito", "helius", "jito"],
                  [7_000, 500, 7_100],
                ],
              ),
        ),
        { status: 200 },
      );
    });

    vi.spyOn(Date, "now").mockReturnValue(now);
    vi.stubGlobal("fetch", fetchMock);

    const result = await getRpcSenderMetricRows({ timeframe: "30m" });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const [, init] of fetchMock.mock.calls) {
      const request = JSON.parse(String(init?.body));

      expect(request).toEqual({
        intervalMs: 60_000,
        maxDataPoints: 30,
        timeRange: {
          from: String(now - 30 * 60 * 1000),
          timezone: "browser",
          to: String(now),
        },
      });
    }

    expect(result).toMatchObject({
      generatedAt: new Date(now).toISOString(),
      truncated: false,
    });
    expect(result.rows).toHaveLength(13);
    expect(result.rows).toContainEqual({
      date: new Date(now).toISOString(),
      metricName: "Sender Total Tips",
      providerName: "jito",
      unit: "SOL",
      value: 38.3,
    });
    expect(result.rows).toContainEqual({
      date: new Date(now - 60_000).toISOString(),
      metricName: "Sender Transactions",
      providerName: "helius",
      unit: "Count",
      value: 500,
    });
  });

  it("rejects a panel response when a required field disappears", async () => {
    const fetchMock = vi.fn().mockImplementation(
      async () =>
        new Response(JSON.stringify(panelResponse(["provider"], [["jito"]])), {
          status: 200,
        }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await expect(getRpcSenderMetricRows({ timeframe: "30m" })).rejects.toThrow(
      "missing-field:Transactions",
    );
  });
});

function panelResponse(fieldNames: string[], values: unknown[][]) {
  return {
    results: {
      A: {
        frames: [
          {
            data: { values },
            schema: {
              fields: fieldNames.map((name) => ({ name })),
            },
          },
        ],
        status: 200,
      },
    },
  };
}
