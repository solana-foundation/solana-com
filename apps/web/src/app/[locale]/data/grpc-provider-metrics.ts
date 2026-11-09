import { normalizeProviderName, type MetricRow } from "./data-config";
import { getProviderColor } from "./dashboard-providers";
import type { ChartSeries, SeriesPoint } from "./time-series-chart";

export const grpcTableMetrics = [
  "Avg",
  "P50",
  "P95",
  "P99",
  "Miss Rate",
  "Downtime",
  "Reconnects",
] as const;
export type GrpcTableMetric = (typeof grpcTableMetrics)[number];
export type GrpcSortKey = "provider" | GrpcTableMetric;
// The default ranking has no column of its own, so no header shows a sort arrow.
export type GrpcSortState = GrpcSortKey | "ranking";
export const defaultGrpcSortKey: GrpcSortState = "ranking";
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
        metric === "Miss Rate"
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
        (label === "Downtime" || label === "Reconnects" || label === "Miss Rate"
          ? `gRPC ${label}`
          : `gRPC ${label} Lag Entire Period`),
    );
    if (!metric || !Number.isFinite(row.value) || row.value < 0) continue;
    const provider = normalizeProviderName(row.providerName);
    const item = providers.get(provider) ?? {
      provider,
      values: {
        "Miss Rate": null,
        Avg: null,
        P50: null,
        P95: null,
        P99: null,
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

function compareNullableValues(first: number | null, second: number | null) {
  if (first === null) return second === null ? 0 : 1;
  if (second === null) return -1;
  return first - second;
}

// The default ranking orders by miss rate, then average lag, so a provider that
// drops updates never ranks above one that delivers them all. A column sort uses
// only that column, falling back to the ranking when values tie.
export function sortGrpcProviderItems(
  items: readonly GrpcProviderItem[],
  key: GrpcSortState,
  direction: "ascending" | "descending",
) {
  const multiplier = direction === "ascending" ? 1 : -1;
  return [...items].sort((a, b) => {
    if (key === "provider")
      return a.provider.localeCompare(b.provider) * multiplier;
    if (key === "ranking")
      return (
        compareNullableValues(a.values["Miss Rate"], b.values["Miss Rate"]) ||
        compareNullableValues(a.values.Avg, b.values.Avg) ||
        a.provider.localeCompare(b.provider)
      );
    const first = a.values[key],
      second = b.values[key];
    // Providers without a value always sink, whichever way the column sorts.
    if (first === null || second === null) {
      const missing = compareNullableValues(first, second);
      if (missing) return missing;
    } else if (first !== second) return (first - second) * multiplier;
    return (
      compareNullableValues(a.values["Miss Rate"], b.values["Miss Rate"]) ||
      compareNullableValues(a.values.Avg, b.values.Avg) ||
      a.provider.localeCompare(b.provider)
    );
  });
}
