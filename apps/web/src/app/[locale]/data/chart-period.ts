import type { ChartPeriodView, PeriodRollup } from "./data-config";
import type { ChartSeries, SeriesPoint } from "./time-series-chart";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Re-buckets daily series into the selected period view. Runs per series, so
 * provider filtering and colors from `buildSeries` carry through unchanged.
 */
export function applyPeriodView(
  series: ChartSeries[],
  view: ChartPeriodView,
  rollup: PeriodRollup,
): ChartSeries[] {
  if (view === "daily") {
    return series;
  }

  return series.map((item) => ({
    ...item,
    points:
      view === "cumulative"
        ? getCumulativePoints(item.points)
        : getPeriodPoints(item.points, view, rollup),
  }));
}

function getCumulativePoints(points: SeriesPoint[]): SeriesPoint[] {
  let total = 0;

  return sortByDate(points).map((point) => {
    total += point.value;

    return { date: point.date, value: total };
  });
}

function getPeriodPoints(
  points: SeriesPoint[],
  view: "weekly" | "monthly",
  rollup: PeriodRollup,
): SeriesPoint[] {
  const buckets = new Map<number, SeriesPoint[]>();

  for (const point of sortByDate(points)) {
    const start = getPeriodStart(point.date, view).getTime();
    const bucket = buckets.get(start) ?? [];

    bucket.push(point);
    buckets.set(start, bucket);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([start, bucketPoints]) => {
      const date = new Date(start);

      return {
        date,
        period: {
          days: bucketPoints.length,
          length: getPeriodLength(date, view),
        },
        value: rollupValues(
          bucketPoints.map((point) => point.value),
          rollup,
        ),
      };
    });
}

/** UTC Monday for weekly views, UTC first of the month for monthly views. */
export function getPeriodStart(date: Date, view: "weekly" | "monthly") {
  if (view === "monthly") {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  }

  const daysSinceMonday = (date.getUTCDay() + 6) % 7;

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
      daysSinceMonday * DAY_IN_MS,
  );
}

function getPeriodLength(start: Date, view: "weekly" | "monthly") {
  return view === "weekly"
    ? 7
    : new Date(
        Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0),
      ).getUTCDate();
}

function rollupValues(values: number[], rollup: PeriodRollup) {
  if (rollup === "last") {
    return values.at(-1) ?? 0;
  }

  const sum = values.reduce((total, value) => total + value, 0);

  return rollup === "avg" ? sum / values.length : sum;
}

function sortByDate(points: SeriesPoint[]) {
  return [...points].sort((a, b) => a.date.getTime() - b.date.getTime());
}
