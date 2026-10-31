import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  unstable_cache: <T>(fn: T) => fn,
}));

import type { MetricRow } from "@/app/[locale]/data/data-config";
import { loadMetrics } from "@/lib/metrics/loader";
import { metricRegistry } from "@/lib/metrics/registry";

const supplyRows = (date: string, value: number): MetricRow[] =>
  ["Allium", "Artemis", "Dune"].map((providerName) => ({
    date,
    metricName: "Circulating Supply",
    providerName,
    unit: "USD",
    value,
  }));

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
    const metrics = await loadMetrics(["defi.tvl"], {
      dataApiRows,
      rwaStats,
      today: () => "2026-10-30",
    });

    expect(dataApiRows).not.toHaveBeenCalled();
    expect(metrics["defi.tvl"]).toMatchObject({
      value: metricRegistry["defi.tvl"].snapshot.value,
      status: "snapshot",
    });
  });
});
