import { describe, expect, it } from "vitest";

import {
  applyQueryUpdates,
  getDashboardDataUrl,
} from "@/app/[locale]/data/dashboard-query";
import {
  getRangeBounds,
  getRangeDates,
  getRangeDayCount,
  isDateInRange,
  isIsoDate,
  parseDashboardRange,
} from "@/app/[locale]/data/date-range";

const today = "2026-10-26";

function parse(query: string) {
  return parseDashboardRange(new URLSearchParams(query), today);
}

describe("isIsoDate", () => {
  it("accepts real calendar dates only", () => {
    expect(isIsoDate("2026-04-01")).toBe(true);
    expect(isIsoDate("2024-02-29")).toBe(true);
    expect(isIsoDate("2026-02-30")).toBe(false);
    expect(isIsoDate("2026-13-40")).toBe(false);
    expect(isIsoDate("2026-4-1")).toBe(false);
    expect(isIsoDate("abc")).toBe(false);
    expect(isIsoDate("")).toBe(false);
    expect(isIsoDate(null)).toBe(false);
  });
});

describe("parseDashboardRange", () => {
  it("reads presets from days, defaulting to 90", () => {
    expect(parse("days=30")).toEqual({ kind: "preset", days: 30 });
    expect(parse("")).toEqual({ kind: "preset", days: 90 });
    expect(parse("days=45")).toEqual({ kind: "preset", days: 90 });
  });

  it("reads a custom range from from/to, ignoring days", () => {
    expect(parse("days=30&from=2026-04-01&to=2026-06-30")).toEqual({
      kind: "custom",
      from: "2026-04-01",
      to: "2026-06-30",
    });
  });

  it("swaps a reversed range", () => {
    expect(parse("from=2026-06-30&to=2026-04-01")).toEqual({
      kind: "custom",
      from: "2026-04-01",
      to: "2026-06-30",
    });
  });

  it("clamps to the last year and today", () => {
    expect(parse("from=2024-01-01&to=2027-01-01")).toEqual({
      kind: "custom",
      from: getRangeBounds(today).from,
      to: today,
    });
  });

  it("falls back to the preset when a date is missing or invalid", () => {
    expect(parse("from=2026-04-01&days=180")).toEqual({
      kind: "preset",
      days: 180,
    });
    expect(parse("from=2026-04-01&to=2026-02-30")).toEqual({
      kind: "preset",
      days: 90,
    });
  });
});

describe("range dates", () => {
  it("keeps the preset's today-minus-N-days start", () => {
    expect(getRangeDates({ kind: "preset", days: 30 }, today)).toEqual({
      from: "2026-09-26",
      to: today,
    });
  });

  it("counts custom days including both ends", () => {
    expect(
      getRangeDayCount({
        kind: "custom",
        from: "2026-04-01",
        to: "2026-04-14",
      }),
    ).toBe(14);
    expect(
      getRangeDayCount({
        kind: "custom",
        from: "2026-04-01",
        to: "2026-04-01",
      }),
    ).toBe(1);
    expect(getRangeDayCount({ kind: "preset", days: 180 })).toBe(180);
  });

  it("includes both end dates when filtering", () => {
    const bounds = { from: "2026-04-01", to: "2026-04-30" };

    expect(isDateInRange("2026-03-31", bounds)).toBe(false);
    expect(isDateInRange("2026-04-01", bounds)).toBe(true);
    expect(isDateInRange("2026-04-30", bounds)).toBe(true);
    expect(isDateInRange("2026-05-01", bounds)).toBe(false);
  });

  it("starts the bounds one year back, like the data view", () => {
    expect(getRangeBounds(today)).toEqual({ from: "2025-10-26", to: today });
  });
});

describe("range in the URL", () => {
  it("replaces days with from/to, and back", () => {
    const params = new URLSearchParams("tab=overview&days=30");

    applyQueryUpdates(
      params,
      { range: { from: "2026-04-01", to: "2026-06-30" } },
      [],
    );
    expect(params.toString()).toBe(
      "tab=overview&from=2026-04-01&to=2026-06-30",
    );

    applyQueryUpdates(params, { days: 180 }, []);
    expect(params.toString()).toBe("tab=overview&days=180");
  });

  it("requests the matching data URL", () => {
    const rpc = {
      activeTab: "overview",
      rpcInfra: "all",
      rpcMethod: "all",
      rpcRegion: "all",
      rpcTimeframe: "24h",
    } as unknown as Omit<Parameters<typeof getDashboardDataUrl>[0], "range">;

    expect(
      getDashboardDataUrl({ ...rpc, range: { kind: "preset", days: 30 } }),
    ).toBe("/api/databricks/data?days=30");
    expect(
      getDashboardDataUrl({
        ...rpc,
        range: { kind: "custom", from: "2026-04-01", to: "2026-06-30" },
      }),
    ).toBe("/api/databricks/data?from=2026-04-01&to=2026-06-30");
  });
});
