import { describe, expect, it } from "vitest";
import type { MetricRow } from "@/app/[locale]/data/data-config";
import { computeDataApiMetric } from "@/lib/metrics/data-api";

function rows(
  metricName: string,
  byDate: Record<string, Record<string, number>>,
): MetricRow[] {
  return Object.entries(byDate).flatMap(([date, providers]) =>
    Object.entries(providers).map(([providerName, value]) => ({
      date,
      metricName,
      providerName,
      unit: "count",
      value,
    })),
  );
}

describe("computeDataApiMetric", () => {
  const transactions = rows("Tx", {
    "2026-10-01": { A: 10, B: 20, C: 30 },
    "2026-10-02": { A: 40, B: 50, C: 60 },
    "2026-10-03": { A: 70, B: 80, C: 90 },
    // Partial day: one of three providers has reported.
    "2026-10-04": { A: 1 },
  });

  it("sums daily provider medians over the window and skips partial days", () => {
    expect(
      computeDataApiMetric(
        { provider: "data-api", metrics: ["Tx"], rollup: "sum", days: 2 },
        transactions,
      ),
    ).toEqual({ value: 130, endDate: "2026-10-03" });
  });

  it("averages unique counts and reads the last level", () => {
    expect(
      computeDataApiMetric(
        { provider: "data-api", metrics: ["Tx"], rollup: "avg", days: 3 },
        transactions,
      )?.value,
    ).toBe(50);
    expect(
      computeDataApiMetric(
        { provider: "data-api", metrics: ["Tx"], rollup: "last", days: 1 },
        transactions,
      ),
    ).toEqual({ value: 80, endDate: "2026-10-03" });
  });

  it("values a ratio per day before dividing window totals", () => {
    const data = [
      ...rows("Fees", {
        "2026-10-01": { A: 1 },
        "2026-10-02": { A: 3 },
      }),
      ...rows("Price", {
        "2026-10-01": { A: 100 },
        "2026-10-02": { A: 200 },
      }),
      ...rows("Ok", {
        "2026-10-01": { A: 300 },
        "2026-10-02": { A: 300 },
      }),
      ...rows("Failed", {
        "2026-10-01": { A: 100 },
        "2026-10-02": { A: 100 },
      }),
    ];

    // (1 * 100 + 3 * 200) / (400 + 400)
    expect(
      computeDataApiMetric(
        {
          provider: "data-api",
          metrics: ["Fees"],
          multiplyBy: "Price",
          divideBy: ["Ok", "Failed"],
          rollup: "sum",
          days: 30,
        },
        data,
      ),
    ).toEqual({ value: 0.875, endDate: "2026-10-02" });
  });

  it("returns nothing when a required metric is missing", () => {
    expect(
      computeDataApiMetric(
        { provider: "data-api", metrics: ["Missing"], rollup: "sum", days: 30 },
        transactions,
      ),
    ).toBeUndefined();
  });
});
