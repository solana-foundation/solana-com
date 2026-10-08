import { describe, expect, it } from "vitest";

import {
  applyPeriodView,
  getPeriodStart,
} from "@/app/[locale]/data/chart-period";
import type { ChartDefinition } from "@/app/[locale]/data/data-config";
import { getPeriodViewOptions } from "@/app/[locale]/data/solana-data-dashboard";
import type { ChartSeries } from "@/app/[locale]/data/time-series-chart";

// Sun 2026-09-27 through Tue 2026-10-06, valued 1..10.
const fixtureDates = [
  "2026-09-27",
  "2026-09-28",
  "2026-09-29",
  "2026-09-30",
  "2026-10-01",
  "2026-10-02",
  "2026-10-03",
  "2026-10-04",
  "2026-10-05",
  "2026-10-06",
];

function makeSeries(dates = fixtureDates): ChartSeries {
  return {
    id: "Allium",
    label: "Allium",
    color: "#FFFFFF",
    points: dates.map((date) => ({
      date: new Date(`${date}T00:00:00.000Z`),
      value: fixtureDates.indexOf(date) + 1,
    })),
  };
}

function summarize(series: ChartSeries[]) {
  return series[0].points.map((point) => ({
    date: point.date.toISOString().slice(0, 10),
    value: point.value,
    period: point.period,
  }));
}

describe("getPeriodStart", () => {
  it("snaps weekly views to the UTC Monday", () => {
    expect(
      getPeriodStart(new Date("2026-09-27T00:00:00Z"), "weekly").toISOString(),
    ).toBe("2026-09-21T00:00:00.000Z");
    expect(
      getPeriodStart(new Date("2026-09-28T00:00:00Z"), "weekly").toISOString(),
    ).toBe("2026-09-28T00:00:00.000Z");
    expect(
      getPeriodStart(new Date("2026-10-04T23:30:00Z"), "weekly").toISOString(),
    ).toBe("2026-09-28T00:00:00.000Z");
  });

  it("snaps monthly views to the UTC first of the month", () => {
    expect(
      getPeriodStart(new Date("2026-10-31T23:59:00Z"), "monthly").toISOString(),
    ).toBe("2026-10-01T00:00:00.000Z");
  });
});

describe("applyPeriodView", () => {
  it("returns daily series unchanged", () => {
    const series = [makeSeries()];

    expect(applyPeriodView(series, "daily", "sum")).toBe(series);
  });

  it("sums weekly flows across a month boundary and marks partial weeks", () => {
    expect(summarize(applyPeriodView([makeSeries()], "weekly", "sum"))).toEqual(
      [
        { date: "2026-09-21", value: 1, period: { days: 1, length: 7 } },
        { date: "2026-09-28", value: 35, period: { days: 7, length: 7 } },
        { date: "2026-10-05", value: 19, period: { days: 2, length: 7 } },
      ],
    );
  });

  it("averages and takes the last value per week", () => {
    expect(
      summarize(applyPeriodView([makeSeries()], "weekly", "avg")).map(
        ({ value }) => value,
      ),
    ).toEqual([1, 5, 9.5]);
    expect(
      summarize(applyPeriodView([makeSeries()], "weekly", "last")).map(
        ({ value }) => value,
      ),
    ).toEqual([1, 8, 10]);
  });

  it("buckets by calendar month with the month's length", () => {
    expect(
      summarize(applyPeriodView([makeSeries()], "monthly", "sum")),
    ).toEqual([
      { date: "2026-09-01", value: 10, period: { days: 4, length: 30 } },
      { date: "2026-10-01", value: 45, period: { days: 6, length: 31 } },
    ]);
  });

  it("uses 28 and 29 day lengths for February", () => {
    const february = (year: number): ChartSeries => ({
      ...makeSeries(),
      points: [{ date: new Date(Date.UTC(year, 1, 10)), value: 1 }],
    });

    expect(
      applyPeriodView([february(2026)], "monthly", "sum")[0].points[0].period,
    ).toEqual({ days: 1, length: 28 });
    expect(
      applyPeriodView([february(2024)], "monthly", "sum")[0].points[0].period,
    ).toEqual({ days: 1, length: 29 });
  });

  it("counts only reported days when a provider misses a day", () => {
    const withGap = makeSeries(
      fixtureDates.filter((date) => date !== "2026-09-30"),
    );

    expect(summarize(applyPeriodView([withGap], "weekly", "sum"))[1]).toEqual({
      date: "2026-09-28",
      value: 31,
      period: { days: 6, length: 7 },
    });
  });

  it("builds a running total in date order", () => {
    const shuffled = makeSeries([...fixtureDates].reverse());
    const values = summarize(
      applyPeriodView([shuffled], "cumulative", "sum"),
    ).map(({ value }) => value);

    expect(values).toEqual([1, 3, 6, 10, 15, 21, 28, 36, 45, 55]);
  });

  it("keeps series identity so provider colors carry through", () => {
    const [weekly] = applyPeriodView([makeSeries()], "weekly", "sum");

    expect(weekly).toMatchObject({
      id: "Allium",
      label: "Allium",
      color: "#FFFFFF",
    });
  });
});

describe("getPeriodViewOptions", () => {
  const baseChart: ChartDefinition = {
    id: "daily-fees",
    tab: "overview",
    title: "Fees",
    valueLabel: "SOL",
    metrics: ["Fees"],
    aggregation: "avg",
    seriesField: "provider",
  };

  it("has no options for charts without periodViews", () => {
    expect(getPeriodViewOptions(baseChart, 90)).toEqual([]);
  });

  it("offers cumulative only when configured", () => {
    expect(
      getPeriodViewOptions(
        { ...baseChart, periodViews: { rollup: "sum", cumulative: true } },
        90,
      ),
    ).toEqual(["daily", "weekly", "monthly", "cumulative"]);
    expect(
      getPeriodViewOptions(
        { ...baseChart, periodViews: { rollup: "last" } },
        90,
      ),
    ).toEqual(["daily", "weekly", "monthly"]);
  });

  it("hides monthly on the 30D range", () => {
    expect(
      getPeriodViewOptions(
        { ...baseChart, periodViews: { rollup: "sum", cumulative: true } },
        30,
      ),
    ).toEqual(["daily", "weekly", "cumulative"]);
  });

  it("has no options for bar charts", () => {
    expect(
      getPeriodViewOptions(
        {
          ...baseChart,
          periodViews: { rollup: "avg" },
          visualization: "bar",
        },
        90,
      ),
    ).toEqual([]);
  });
});
