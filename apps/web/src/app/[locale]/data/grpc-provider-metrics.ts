import { normalizeProviderName, type MetricRow } from "./data-config";
import { getProviderColor } from "./dashboard-providers";
import type { ChartSeries, SeriesPoint } from "./time-series-chart";

export const grpcTableMetrics = [
  "P50",
  "P95",
  "P99",
  "Avg",
  "Missed Updates",
  "Downtime",
  "Reconnects",
] as const;
export type GrpcTableMetric = (typeof grpcTableMetrics)[number];
export type GrpcSortKey = "provider" | GrpcTableMetric;
export type GrpcProviderItem = {
  provider: string;
  values: Record<GrpcTableMetric, number | null>;
  trend: SeriesPoint[];
};

export function getGrpcTrendSeries(
  rows: readonly MetricRow[],
  metric: string,
  selectedProviders: ReadonlySet<string>,
  stepSeconds: number,
): ChartSeries[] {
  const providers = new Map<string, Map<number, number>>();
  const timestamps = new Set<number>();
  for (const row of rows) {
    const provider = normalizeProviderName(row.providerName);
    const date = Date.parse(row.date);
    if (
      row.metricName !==
        (metric === "Downtime" ||
        metric === "Reconnects" ||
        metric === "Missed Updates"
          ? `gRPC ${metric} Trend`
          : `gRPC ${metric} Lag`) ||
      !selectedProviders.has(provider) ||
      !Number.isFinite(date) ||
      !Number.isFinite(row.value) ||
      row.value < 0
    )
      continue;
    const values = providers.get(provider) ?? new Map<number, number>();
    values.set(date, row.value);
    providers.set(provider, values);
    timestamps.add(date);
  }
  const orderedTimes = [...timestamps].sort((a, b) => a - b);
  const timesWithGaps = orderedTimes.flatMap((time, index) => {
    const next = orderedTimes[index + 1];
    return next !== undefined && next - time > stepSeconds * 1500
      ? [time, time + stepSeconds * 1000]
      : [time];
  });
  return [...providers.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([provider, values]) => ({
      id: provider,
      label: provider,
      color: getProviderColor(provider),
      points: timesWithGaps.map((timestamp) => ({
        date: new Date(timestamp),
        value: values.get(timestamp) ?? 0,
        defined: values.has(timestamp),
      })),
    }));
}

export function getGrpcProviderItems(
  rows: readonly MetricRow[],
  stepSeconds: number,
): GrpcProviderItem[] {
  const providers = new Map<string, GrpcProviderItem>();
  for (const row of rows) {
    const metric = grpcTableMetrics.find(
      (label) =>
        row.metricName ===
        (label === "Downtime" ||
        label === "Reconnects" ||
        label === "Missed Updates"
          ? `gRPC ${label}`
          : `gRPC ${label} Lag Entire Period`),
    );
    if (!metric || !Number.isFinite(row.value) || row.value < 0) continue;
    const provider = normalizeProviderName(row.providerName);
    const item = providers.get(provider) ?? {
      provider,
      values: {
        P50: null,
        P95: null,
        P99: null,
        Avg: null,
        "Missed Updates": null,
        Downtime: null,
        Reconnects: null,
      },
      trend: [],
    };
    item.values[metric] = row.value;
    providers.set(provider, item);
  }
  const trends = new Map(
    getGrpcTrendSeries(rows, "P50", new Set(providers.keys()), stepSeconds).map(
      (series) => [series.id, series.points],
    ),
  );
  return [...providers.values()].map((item) => ({
    ...item,
    trend: trends.get(item.provider) ?? [],
  }));
}

export function formatGrpcDowntime(seconds: number, locale: string) {
  const unit = seconds < 60 ? "second" : seconds < 3600 ? "minute" : "hour";
  const value =
    unit === "second"
      ? seconds
      : unit === "minute"
        ? seconds / 60
        : seconds / 3600;
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit,
    unitDisplay: "narrow",
    maximumFractionDigits: 1,
  }).format(value);
}

export function sortGrpcProviderItems(
  items: readonly GrpcProviderItem[],
  key: GrpcSortKey,
  direction: "ascending" | "descending",
) {
  const multiplier = direction === "ascending" ? 1 : -1;
  return [...items].sort((a, b) => {
    if (key === "provider")
      return a.provider.localeCompare(b.provider) * multiplier;
    const first = a.values[key],
      second = b.values[key];
    if (first === null)
      return second === null ? a.provider.localeCompare(b.provider) : 1;
    if (second === null) return -1;
    return (
      (first - second) * multiplier || a.provider.localeCompare(b.provider)
    );
  });
}
