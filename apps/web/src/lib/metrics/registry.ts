import registryJson from "@/data/metrics/registry.json";

export type MetricUnit = "usd" | "count" | "ms";

export type MetricPeriod =
  | { kind: "point" }
  | { kind: "trailing"; days: number };

/** Daily-median rollup over /data providers, matching the dashboard KPIs. */
export type DataApiLiveSpec = {
  provider: "data-api";
  /** Summed per day when more than one metric is listed. */
  metrics: string[];
  /** Daily multiplier, e.g. SOL price to value SOL-denominated fees in USD. */
  multiplyBy?: string;
  /** Window total of these metrics divides the window total of `metrics`. */
  divideBy?: string[];
  rollup: "sum" | "avg" | "last";
  days: number;
};

export type RwaXyzLiveSpec = {
  provider: "rwa-xyz";
  field: "distributedValueUSD" | "assetCount" | "holderCount";
};

export type MetricDefinition = {
  unit: MetricUnit;
  definition: string;
  period: MetricPeriod;
  source: { name: string; url: string };
  owner: string;
  /** Absent for curated snapshots. */
  live?: DataApiLiveSpec | RwaXyzLiveSpec;
  /**
   * Curated value: published as-is for snapshot metrics, and the explicit
   * fallback for live metrics when their source fails or returns nothing.
   */
  snapshot: { value: number; asOf: string };
  verifiedAt: string;
  reviewBy: string;
};

export type MetricKey = keyof typeof registryJson;

export const metricRegistry = registryJson as unknown as Record<
  MetricKey,
  MetricDefinition
>;

export function getMetricDefinition(key: MetricKey): MetricDefinition {
  return metricRegistry[key];
}
