import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  unstable_cache: <T>(fn: T) => fn,
}));

import type { MetricRow } from "@/app/[locale]/data/data-config";
import {
  buildMetricsStream,
  resolveMetrics as loadMetrics,
} from "@/lib/metrics/loader";
import { metricRegistry } from "@/lib/metrics/registry";

const supplyRows = (date: string, value: number): MetricRow[] =>
  ["Allium", "Artemis", "Dune"].map((providerName) => ({
    date,
    metricName: "Circulating Supply",
    providerName,
    unit: "USD",
    value,
  }));

const external = vi.fn(async () => {
  throw new Error("external sources are not used in this test");
});

const rwaStats = async () => ({
  stats: { assetCount: 3500, distributedValueUSD: 5e9, holderCount: 850_000 },
  fetchedAt: "2026-10-30T12:00:00.000Z",
});

describe("loadMetrics", () => {
  it("resolves live values with their window end date", async () => {
    const metrics = await loadMetrics(
      ["stablecoins.circulating-supply", "rwa.asset-count"],
      {
        dataApiRows: async () => supplyRows("2026-10-29", 15e9),
        rwaStats,
        external,
        today: () => "2026-10-30",
      },
    );

    expect(metrics["stablecoins.circulating-supply"]).toMatchObject({
      value: 15e9,
      asOf: "2026-10-29",
      status: "live",
    });
    expect(metrics["rwa.asset-count"]).toMatchObject({
      value: 3500,
      asOf: "2026-10-30",
      status: "live",
    });
  });

  it("flags live data whose latest day is older than the pipeline delay", async () => {
    const metrics = await loadMetrics(["stablecoins.circulating-supply"], {
      dataApiRows: async () => supplyRows("2026-10-20", 15e9),
      rwaStats,
      external,
      today: () => "2026-10-30",
    });

    expect(metrics["stablecoins.circulating-supply"]).toMatchObject({
      asOf: "2026-10-20",
      status: "stale",
    });
  });

  it("falls back to the dated snapshot when a source fails", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const dataApiRows = vi.fn(async () => {
      throw new Error("data-api down");
    });
    const metrics = await loadMetrics(
      ["stablecoins.circulating-supply", "stablecoins.transfer-volume-30d"],
      {
        dataApiRows,
        rwaStats,
        external,
        today: () => "2026-10-30",
      },
    );
    const snapshot = metricRegistry["stablecoins.circulating-supply"].snapshot;

    expect(dataApiRows).toHaveBeenCalledTimes(1);
    expect(metrics["stablecoins.circulating-supply"]).toMatchObject({
      value: snapshot.value,
      asOf: snapshot.asOf,
      status: "fallback",
    });
    expect(metrics["stablecoins.transfer-volume-30d"].status).toBe("fallback");
    error.mockRestore();
  });

  it("publishes curated snapshots without calling live sources", async () => {
    const dataApiRows = vi.fn(async () => []);
    const metrics = await loadMetrics(["network.slot-time"], {
      dataApiRows,
      rwaStats,
      external,
      today: () => "2026-10-30",
    });

    expect(dataApiRows).not.toHaveBeenCalled();
    expect(metrics["network.slot-time"]).toMatchObject({
      value: metricRegistry["network.slot-time"].snapshot.value,
      status: "snapshot",
    });
  });

  it("resolves DefiLlama and RPC values, falling back per metric", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchExternal = vi.fn(
      async (spec: { provider: string; slug?: string }) => {
        if (spec.slug === "raydium") throw new Error("DefiLlama down");
        return {
          value: spec.provider === "solana-rpc" ? 19 : 1.2e9,
          fetchedAt: "2026-11-02T08:00:00.000Z",
        };
      },
    );
    const metrics = await loadMetrics(
      [
        "defi.protocol-tvl.kamino",
        "defi.protocol-tvl.raydium",
        "network.nakamoto-coefficient",
      ],
      {
        dataApiRows: async () => [],
        rwaStats,
        external: fetchExternal,
        today: () => "2026-11-02",
      },
    );

    expect(fetchExternal).toHaveBeenCalledTimes(3);
    expect(metrics["defi.protocol-tvl.kamino"]).toMatchObject({
      value: 1.2e9,
      asOf: "2026-11-02",
      status: "live",
    });
    expect(metrics["network.nakamoto-coefficient"]).toMatchObject({
      value: 19,
      status: "live",
    });
    expect(metrics["defi.protocol-tvl.raydium"]).toMatchObject({
      value: metricRegistry["defi.protocol-tvl.raydium"].snapshot.value,
      status: "fallback",
    });
    error.mockRestore();
  });

  it("builds one stream for every registry metric, calling each source once", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const dataApiRows = vi.fn(async () => supplyRows("2026-10-29", 15e9));
    const rwa = vi.fn(rwaStats);
    const fetchExternal = vi.fn(async () => ({
      value: 1,
      fetchedAt: "2026-10-30T00:00:00.000Z",
    }));
    const stream = await buildMetricsStream({
      dataApiRows,
      rwaStats: rwa,
      external: fetchExternal,
      today: () => "2026-10-30",
    });
    const externalKeys = Object.values(metricRegistry).filter(
      ({ live }) =>
        live?.provider === "defillama" || live?.provider === "solana-rpc",
    );

    expect(Object.keys(stream.metrics).sort()).toEqual(
      Object.keys(metricRegistry).sort(),
    );
    expect(dataApiRows).toHaveBeenCalledTimes(1);
    expect(rwa).toHaveBeenCalledTimes(1);
    expect(fetchExternal).toHaveBeenCalledTimes(externalKeys.length);
    expect(stream.metrics["stablecoins.circulating-supply"].status).toBe(
      "live",
    );
    error.mockRestore();
  });
});
