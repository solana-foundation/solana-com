import { describe, expect, it } from "vitest";

import {
  compareTooltipValues,
  formatValue,
  getAxisValueFormatter,
  getSeriesDashPatterns,
  getValueDomain,
  getYAxisTickValues,
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
  it("rounds percent axis labels to whole numbers and caps them at 100", () => {
    const ticks = [98.4, 99.5, 100, 100.4, 100.6];
    const formatter = getAxisValueFormatter("Percent");

    expect(ticks.map(formatter)).toEqual([
      "98%",
      "100%",
      "100%",
      "100%",
      "100%",
    ]);
  });

  it("keeps non-percent axis labels unchanged", () => {
    const formatter = getAxisValueFormatter("Milliseconds");

    expect(formatter(10.4)).toBe("10.4");
  });
});

describe("formatValue", () => {
  it("rounds percent values to whole numbers and caps them at 100", () => {
    expect(formatValue(99.4, "Percent")).toBe("99%");
    expect(formatValue(99.5, "Percent")).toBe("100%");
    expect(formatValue(100.6, "Percent")).toBe("100%");
  });
});

describe("percent y-axis domain", () => {
  it("rounds tight percent ranges near 100 to whole-number bounds capped at 100", () => {
    const domain = getValueDomain(
      makeSeries("a", [99.99996, 100.00004]).points,
      "Percent",
    );

    expect(domain).toEqual([99, 100]);
  });

  it("returns whole-number percent ticks for tight ranges near 100", () => {
    const ticks = getYAxisTickValues(
      [99.99996, 100, 100.00004],
      [99, 100],
      "Percent",
    );

    expect(ticks).toEqual([99, 100]);
  });
});
