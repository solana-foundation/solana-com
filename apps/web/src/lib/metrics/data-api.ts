import type { MetricRow } from "@/app/[locale]/data/data-config";
import type { DataApiLiveSpec } from "./registry";

export type DataApiMetricResult = {
  value: number;
  /** Last day (YYYY-MM-DD) in the window. */
  endDate: string;
};

type DailyMedians = Map<string, number>;

/**
 * Computes a registry metric from data-api rows the same way /data computes
 * its KPIs: each day's value is the median across providers, then the window
 * rolls up per the spec. A day only counts once at least half the metric's
 * providers have reported, so partial latest days don't drag totals down.
 *
 * The window is the `days` calendar days ending on the latest complete day,
 * and every one of them must be present: a gap or short history returns
 * nothing (so the caller falls back to the dated snapshot) rather than a
 * total over fewer or older days than its label claims.
 */
export function computeDataApiMetric(
  spec: DataApiLiveSpec,
  rows: readonly MetricRow[],
): DataApiMetricResult | undefined {
  const series = [
    ...spec.metrics,
    ...(spec.multiplyBy ? [spec.multiplyBy] : []),
    ...(spec.divideBy ?? []),
  ].map((metric) => getDailyMedians(metric, rows));

  if (series.some((daily) => daily.size === 0)) {
    return undefined;
  }

  const available = intersectDates(series);
  const endDate = available.at(-1);

  if (!endDate) {
    return undefined;
  }

  const availableSet = new Set(available);
  const dates = getCalendarWindow(endDate, spec.days);

  if (!dates.every((date) => availableSet.has(date))) {
    return undefined;
  }

  const numeratorSeries = series.slice(0, spec.metrics.length);
  const multiplier = spec.multiplyBy ? series[spec.metrics.length] : undefined;
  const denominatorSeries = series.slice(
    spec.metrics.length + (spec.multiplyBy ? 1 : 0),
  );
  const dailyValues = dates.map(
    (date) =>
      sumAt(numeratorSeries, date) * (multiplier ? multiplier.get(date)! : 1),
  );

  let value: number;

  if (denominatorSeries.length > 0) {
    const denominator = dates.reduce(
      (total, date) => total + sumAt(denominatorSeries, date),
      0,
    );

    if (denominator === 0) {
      return undefined;
    }

    value = sum(dailyValues) / denominator;
  } else if (spec.rollup === "last") {
    value = dailyValues.at(-1)!;
  } else if (spec.rollup === "avg") {
    value = sum(dailyValues) / dailyValues.length;
  } else {
    value = sum(dailyValues);
  }

  return Number.isFinite(value) ? { value, endDate } : undefined;
}

function getDailyMedians(
  metric: string,
  rows: readonly MetricRow[],
): DailyMedians {
  const valuesByDate = new Map<string, number[]>();
  const providers = new Set<string>();

  for (const row of rows) {
    if (row.metricName !== metric || !Number.isFinite(row.value)) {
      continue;
    }

    providers.add(row.providerName);
    const date = row.date.slice(0, 10);
    const values = valuesByDate.get(date) ?? [];

    values.push(row.value);
    valuesByDate.set(date, values);
  }

  const quorum = Math.ceil(providers.size / 2);
  const medians: DailyMedians = new Map();

  for (const [date, values] of valuesByDate) {
    if (values.length >= quorum) {
      medians.set(date, getMedian(values));
    }
  }

  return medians;
}

function intersectDates(series: DailyMedians[]) {
  const [first, ...rest] = series;

  return Array.from(first.keys())
    .filter((date) => rest.every((daily) => daily.has(date)))
    .sort();
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** The `days` consecutive UTC dates (YYYY-MM-DD) ending on `endDate`. */
function getCalendarWindow(endDate: string, days: number) {
  const end = Date.parse(`${endDate}T00:00:00Z`);

  return Array.from({ length: days }, (_, index) =>
    new Date(end - (days - 1 - index) * DAY_MS).toISOString().slice(0, 10),
  );
}

function sumAt(series: DailyMedians[], date: string) {
  return series.reduce((total, daily) => total + daily.get(date)!, 0);
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

// Same median as the /data KPIs (dashboard-metrics.ts), kept local so this
// server module doesn't pull in dashboard UI code.
function getMedian(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}
