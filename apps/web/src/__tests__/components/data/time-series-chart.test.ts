import { describe, expect, it } from "vitest";

import {
  compareTooltipValues,
  getAxisValueFormatter,
  getSeriesDashPatterns,
  type ChartSeries,
} from "@/app/[locale]/data/time-series-chart";

function makeSeries(id: string, values: number[]): ChartSeries {
  return {
    id,
    label: id,
    color: "#FFFFFF",
    points: values.map((value, index) => ({
      date: new Date(Date.UTC(2026, 0, index + 1)),
      value,
    })),
  };
}

describe("getSeriesDashPatterns", () => {
  it("returns no patterns when series differ", () => {
    const patterns = getSeriesDashPatterns([
      makeSeries("a", [1, 2, 3]),
      makeSeries("b", [4, 5, 6]),
    ]);

    expect(patterns.size).toBe(0);
  });

  it("dashes a series that duplicates an earlier one", () => {
    const patterns = getSeriesDashPatterns([
      makeSeries("a", [1, 2, 3]),
      makeSeries("b", [1, 2, 3]),
    ]);

    expect(patterns.has("a")).toBe(false);
    expect(patterns.get("b")).toBe("6 4");
  });

  it("assigns distinct patterns when three series coincide", () => {
    const patterns = getSeriesDashPatterns([
      makeSeries("a", [1, 2, 3]),
      makeSeries("b", [1, 2, 3]),
      makeSeries("c", [1, 2, 3]),
    ]);

    expect(patterns.has("a")).toBe(false);
    expect(patterns.get("b")).toBe("6 4");
    expect(patterns.get("c")).toBe("2 4");
  });

  it("treats float-noise differences as coincident", () => {
    const patterns = getSeriesDashPatterns([
      makeSeries("a", [1 / 3, 2 / 3]),
      makeSeries("b", [(1 / 3) * (1 + 1e-12), (2 / 3) * (1 - 1e-12)]),
    ]);

    expect(patterns.get("b")).toBe("6 4");
  });

  it("does not dash series with matching values on different dates", () => {
    const a = makeSeries("a", [1, 2, 3]);
    const b = makeSeries("b", [1, 2, 3]);
    b.points = b.points.map((point) => ({
      ...point,
      date: new Date(point.date.getTime() + 86_400_000),
    }));

    const patterns = getSeriesDashPatterns([a, b]);

    expect(patterns.size).toBe(0);
  });
});

describe("compareTooltipValues", () => {
  it("sorts tooltip rows by value descending", () => {
    const values = [
      { color: "#FFFFFF", label: "Allium", value: 15.4 },
      { color: "#FFFFFF", label: "Artemis", value: 16.1 },
      { color: "#FFFFFF", label: "Blockworks", value: 17 },
    ];

    expect(values.sort(compareTooltipValues).map((item) => item.label)).toEqual(
      ["Blockworks", "Artemis", "Allium"],
    );
  });

  it("sorts equal values by label", () => {
    const values = [
      { color: "#FFFFFF", label: "Dune", value: 15.6 },
      { color: "#FFFFFF", label: "DeFiLlama", value: 15.6 },
    ];

    expect(values.sort(compareTooltipValues).map((item) => item.label)).toEqual(
      ["DeFiLlama", "Dune"],
    );
  });
});

describe("getAxisValueFormatter", () => {
  it("keeps percent tick labels distinct when values round near 100", () => {
    const ticks = [99.95, 100, 100.05];
    const formatter = getAxisValueFormatter(ticks, "Percent");

    expect(ticks.map(formatter)).toEqual(["99.95%", "100%", "100.05%"]);
  });

  it("keeps concise percent labels when rounded labels are already distinct", () => {
    const ticks = [95, 100];
    const formatter = getAxisValueFormatter(ticks, "Percent");

    expect(ticks.map(formatter)).toEqual(["95%", "100%"]);
  });
});
