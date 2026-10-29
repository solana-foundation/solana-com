import { describe, expect, it } from "vitest";
import type { MetricRow } from "@/app/[locale]/data/data-config";
import {
  getGrpcProviderItems,
  getGrpcTrendSeries,
  sortGrpcProviderItems,
  formatGrpcDowntime,
} from "@/app/[locale]/data/grpc-provider-metrics";

export function grpcRow(
  providerName: string,
  metricName: string,
  value: number,
  date = "2026-10-26T20:00:00.000Z",
): MetricRow {
  return { providerName, metricName, value, date, unit: "Milliseconds" };
}

describe("gRPC provider overview metrics", () => {
  it("uses whole-period values in the table and preserves zero and missing measurements", () => {
    const items = getGrpcProviderItems(
      [
        grpcRow("helius", "gRPC P50 Lag", 99),
        grpcRow("helius", "gRPC P50 Lag Entire Period", 0),
        grpcRow("helius", "gRPC P95 Lag Entire Period", 2),
        grpcRow("alchemy", "gRPC P50 Lag Entire Period", 1),
        grpcRow("alchemy", "gRPC Avg Lag Entire Period", 3),
      ],
      60,
    );
    const helius = items.find((item) => item.provider === "Helius")!;
    expect(helius.values).toEqual({
      P50: 0,
      P95: 2,
      P99: null,
      Avg: null,
      "Missed Updates": null,
      Downtime: null,
      Reconnects: null,
    });
    expect(helius.trend[0].value).toBe(99);
    expect(
      sortGrpcProviderItems(items, "P50", "ascending").map(
        (item) => item.provider,
      ),
    ).toEqual(["Helius", "Alchemy"]);
    expect(
      sortGrpcProviderItems(items, "Avg", "descending").map(
        (item) => item.provider,
      ),
    ).toEqual(["Alchemy", "Helius"]);
  });

  it("includes connection-only providers and sorts outage metrics without inventing latency", () => {
    const items = getGrpcProviderItems(
      [
        { ...grpcRow("Helius", "gRPC Downtime", 0), unit: "Seconds" },
        { ...grpcRow("Helius", "gRPC Reconnects", 0), unit: "Count" },
        { ...grpcRow("Alchemy", "gRPC Downtime", 90), unit: "Seconds" },
        { ...grpcRow("Alchemy", "gRPC Reconnects", 2), unit: "Count" },
      ],
      60,
    );
    expect(items).toHaveLength(2);
    expect(items[0].values.P50).toBeNull();
    expect(items[0].values.Downtime).toBe(0);
    expect(items[0].values.Reconnects).toBe(0);
    expect(
      sortGrpcProviderItems(items, "Downtime", "descending").map(
        (item) => item.provider,
      ),
    ).toEqual(["Alchemy", "Helius"]);
    expect(
      sortGrpcProviderItems(items, "Reconnects", "ascending").map(
        (item) => item.provider,
      ),
    ).toEqual(["Helius", "Alchemy"]);
    expect(formatGrpcDowntime(0, "en")).toBe("0s");
    expect(formatGrpcDowntime(12.5, "en")).toBe("12.5s");
    expect(formatGrpcDowntime(90, "en")).toBe("1.5m");
    expect(formatGrpcDowntime(7200, "en")).toBe("2h");
  });

  it("keeps whole-period missed totals separate from trends and preserves unknown values", () => {
    const rows = [
      grpcRow("Helius", "gRPC Missed Updates", 0),
      grpcRow("Alchemy", "gRPC Missed Updates", 10),
      grpcRow("Alchemy", "gRPC Missed Updates Trend", 3),
      grpcRow(
        "Alchemy",
        "gRPC Missed Updates Trend",
        7,
        "2026-10-26T20:02:00.000Z",
      ),
      grpcRow("Other", "gRPC P50 Lag Entire Period", 1),
    ];
    const items = getGrpcProviderItems(rows, 60);
    expect(
      items.find((item) => item.provider === "Alchemy")?.values[
        "Missed Updates"
      ],
    ).toBe(10);
    expect(
      items.find((item) => item.provider === "Alchemy")?.values.P50,
    ).toBeNull();
    expect(
      items.find((item) => item.provider === "Helius")?.values[
        "Missed Updates"
      ],
    ).toBe(0);
    expect(
      items.find((item) => item.provider === "Other")?.values["Missed Updates"],
    ).toBeNull();
    expect(
      sortGrpcProviderItems(items, "Missed Updates", "descending").map(
        (item) => item.provider,
      ),
    ).toEqual(["Alchemy", "Helius", "Other"]);
    const series = getGrpcTrendSeries(
      rows,
      "Missed Updates",
      new Set(["Alchemy"]),
      60,
    );
    expect(series).toHaveLength(1);
    expect(series[0].points.map((point) => point.defined)).toEqual([
      true,
      false,
      true,
    ]);
    expect(
      series[0].points
        .filter((point) => point.defined)
        .map((point) => point.value),
    ).toEqual([3, 7]);
  });

  it("builds the selected percentile without turning missing buckets into zero lag", () => {
    const series = getGrpcTrendSeries(
      [
        grpcRow("Helius", "gRPC P99.9 Lag", 0),
        grpcRow("Helius", "gRPC P99.9 Lag", 9, "2026-10-26T20:05:00.000Z"),
        grpcRow("Alchemy", "gRPC P99.9 Lag", 3),
        grpcRow("Helius", "gRPC P50 Lag", 88),
      ],
      "P99.9",
      new Set(["Helius"]),
      60,
    );
    expect(series).toHaveLength(1);
    expect(series[0].points.map((point) => point.defined)).toEqual([
      true,
      false,
      true,
    ]);
    expect(
      series[0].points
        .filter((point) => point.defined)
        .map((point) => point.value),
    ).toEqual([0, 9]);
    expect(getGrpcTrendSeries([], "P50", new Set(), 60)).toEqual([]);
  });

  it("keeps uptime trend buckets separate from table totals and latency metrics", () => {
    const rows = [
      { ...grpcRow("Alchemy", "gRPC Downtime Trend", 12), unit: "Seconds" },
      { ...grpcRow("Alchemy", "gRPC Reconnects Trend", 1), unit: "Count" },
      { ...grpcRow("Alchemy", "gRPC Downtime", 900), unit: "Seconds" },
      grpcRow("Helius", "gRPC P50 Lag", 99),
    ];
    expect(
      getGrpcTrendSeries(rows, "Downtime", new Set(["Alchemy"]), 60)[0]
        .points[0].value,
    ).toBe(12);
    expect(
      getGrpcTrendSeries(rows, "Reconnects", new Set(["Alchemy"]), 60)[0]
        .points[0].value,
    ).toBe(1);
    expect(
      getGrpcTrendSeries(rows, "Reconnects", new Set(["Helius"]), 60),
    ).toEqual([]);
  });
});
