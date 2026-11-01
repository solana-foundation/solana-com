import { describe, expect, it } from "vitest";
import type { MetricRow } from "@/app/[locale]/data/data-config";
import { getGrpcUptimeRows } from "@/app/[locale]/data/grpc-uptime-metrics";

const start = Date.parse("2026-10-28T12:00:00Z");
const end = start + 6 * 60_000;
function row(
  minute: number,
  value: number,
  metricName = "gRPC Downtime Trend",
  providerName = "helius",
): MetricRow {
  return {
    date: new Date(start + minute * 60_000).toISOString(),
    value,
    metricName,
    providerName,
    unit: metricName === "gRPC Downtime Trend" ? "Seconds" : "Count",
  };
}

describe("gRPC uptime timeline", () => {
  it("merges adjacent observations and outages, retaining unknown gaps across the requested range", () => {
    const [provider] = getGrpcUptimeRows(
      [row(0, 0), row(1, 0), row(3, 12), row(4, 18)],
      new Set(["Helius"]),
      start,
      end,
      60,
    );
    expect(provider.provider).toBe("Helius");
    expect(provider.segments).toEqual([
      { start, end: start + 2 * 60_000, status: "observed", downtime: 0 },
      {
        start: start + 2 * 60_000,
        end: start + 3 * 60_000,
        status: "unknown",
        downtime: 0,
      },
      {
        start: start + 3 * 60_000,
        end: start + 5 * 60_000,
        status: "outage",
        downtime: 30,
      },
      { start: start + 5 * 60_000, end, status: "unknown", downtime: 0 },
    ]);
  });

  it("clips buckets to the selected range and preserves summed outages across regions", () => {
    const [provider] = getGrpcUptimeRows(
      [row(-1, 90), row(5, 0), row(7, 20)],
      new Set(["Helius"]),
      start,
      end,
      120,
    );
    expect(provider.segments[0]).toEqual({
      start,
      end: start + 60_000,
      status: "outage",
      downtime: 90,
    });
    expect(provider.segments.at(-1)).toEqual({
      start: start + 5 * 60_000,
      end,
      status: "observed",
      downtime: 0,
    });
  });

  it("places reconnects at exact times without treating a reconnect as observed uptime", () => {
    const event = "gRPC Reconnect Event";
    const [provider] = getGrpcUptimeRows(
      [
        row(0.5, 1, event),
        row(0.5, 2, event),
        row(6, 1, event),
        row(-1, 1, event),
        row(2, 0, event),
        row(2, -1, event),
        row(2, 0.5, event),
        row(2, 1, event, "Alchemy"),
      ],
      new Set(["Helius"]),
      start,
      end,
      60,
    );
    expect(provider.reconnects).toEqual([{ time: start + 30_000, count: 3 }]);
    expect(provider.segments).toEqual([
      { start, end, status: "unknown", downtime: 0 },
    ]);
  });

  it("leaves providers with no measurements unknown and ignores invalid buckets and totals", () => {
    const providers = getGrpcUptimeRows(
      [
        row(0, -1),
        row(1, Number.NaN),
        row(2, 100, "gRPC Downtime"),
        { ...row(3, 0), date: "invalid" },
        row(0, 0, "gRPC Downtime Trend", "Unselected"),
      ],
      new Set(["Helius", "Alchemy"]),
      start,
      end,
      60,
    );
    expect(providers.map((provider) => provider.provider)).toEqual([
      "Alchemy",
      "Helius",
    ]);
    for (const provider of providers)
      expect(provider.segments).toEqual([
        { start, end, status: "unknown", downtime: 0 },
      ]);
    expect(getGrpcUptimeRows([], new Set(), start, end, 60)).toEqual([]);
    expect(getGrpcUptimeRows([], new Set(["Helius"]), start, end, 0)).toEqual(
      [],
    );
  });
});
