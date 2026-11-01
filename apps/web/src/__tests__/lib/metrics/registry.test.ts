import { describe, expect, it } from "vitest";
import { metricNames } from "@/app/[locale]/data/data-config";
import { formatMetricValue } from "@/lib/metrics/format";
import { metricRegistry } from "@/lib/metrics/registry";

describe("metric registry", () => {
  it("only reads data-api metrics that /data loads", () => {
    const loaded = new Set<string>(metricNames);

    for (const [key, metric] of Object.entries(metricRegistry)) {
      if (metric.live?.provider !== "data-api") continue;
      const { metrics, multiplyBy, divideBy = [] } = metric.live;

      for (const name of [
        ...metrics,
        ...(multiplyBy ? [multiplyBy] : []),
        ...divideBy,
      ]) {
        expect(loaded.has(name), `${key} reads ${name}`).toBe(true);
      }
    }
  });
});

describe("formatMetricValue", () => {
  it("renders equivalent metrics consistently", () => {
    expect(formatMetricValue(1_543_607_964_090, "usd", "en")).toBe("$1.54T");
    expect(formatMetricValue(15_034_320_730, "usd", "en")).toBe("$15B");
    expect(formatMetricValue(0.0047866, "usd", "en")).toBe("$0.0048");
    expect(formatMetricValue(3_316_891_228, "count", "en")).toBe("3.32B");
    expect(formatMetricValue(3499, "count", "en")).toBe("3,499");
    expect(formatMetricValue(200, "ms", "en")).toBe("200ms");
  });

  it("localizes separators and compact suffixes", () => {
    expect(formatMetricValue(3499, "count", "de")).toBe("3.499");
  });
});
