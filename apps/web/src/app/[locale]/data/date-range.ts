import { rangeOptions } from "./data-config";

/**
 * The dashboard's date range: a preset (last N days) or a custom From/To.
 * Shared by the dashboard and `/api/databricks/data`, so both read the URL
 * the same way. Dates are UTC `YYYY-MM-DD` strings, like `MetricRow.date`.
 */
export type DashboardRange =
  | { kind: "preset"; days: number }
  | { kind: "custom"; from: string; to: string };

export type DateBounds = { from: string; to: string };

export const defaultRangeDays = 90;

// The data view only keeps the last year, so custom ranges can't start
// earlier than the longest preset.
const maxRangeDays = Math.max(...rangeOptions.map((option) => option.value));
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function getUtcToday(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function addDays(date: string, days: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_IN_MS)
    .toISOString()
    .slice(0, 10);
}

/** True for a real calendar date in `YYYY-MM-DD` form (rejects 2026-02-30). */
export function isIsoDate(value: string | null): value is string {
  if (!value || !isoDatePattern.test(value)) {
    return false;
  }

  const time = Date.parse(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(time) && new Date(time).toISOString().slice(0, 10) === value
  );
}

/** Earliest and latest dates a custom range can use. */
export function getRangeBounds(today: string): DateBounds {
  return { from: addDays(today, -maxRangeDays), to: today };
}

export function parseRangeDays(value: string | null) {
  const parsed = value ? Number(value) : defaultRangeDays;

  return rangeOptions.some((option) => option.value === parsed)
    ? parsed
    : defaultRangeDays;
}

/**
 * Reads `from`/`to` (custom) or `days` (preset) from the URL. A custom range
 * is clamped to the last year and swapped if reversed. Missing or invalid
 * dates fall back to the `days` preset.
 */
export function parseDashboardRange(
  params: URLSearchParams,
  today: string,
): DashboardRange {
  const from = params.get("from");
  const to = params.get("to");

  if (isIsoDate(from) && isIsoDate(to)) {
    const bounds = getRangeBounds(today);
    const [start, end] = from <= to ? [from, to] : [to, from];

    return {
      kind: "custom",
      from: clampDate(start, bounds),
      to: clampDate(end, bounds),
    };
  }

  return { kind: "preset", days: parseRangeDays(params.get("days")) };
}

/** The dates a range covers. A preset keeps its existing "today minus N days" start. */
export function getRangeDates(
  range: DashboardRange,
  today: string,
): DateBounds {
  return range.kind === "custom"
    ? { from: range.from, to: range.to }
    : { from: addDays(today, -range.days), to: today };
}

/** Length of the range in days: the preset's N, or a custom range's days including both ends. */
export function getRangeDayCount(range: DashboardRange) {
  if (range.kind === "preset") {
    return range.days;
  }

  return (
    Math.round(
      (Date.parse(`${range.to}T00:00:00Z`) -
        Date.parse(`${range.from}T00:00:00Z`)) /
        DAY_IN_MS,
    ) + 1
  );
}

export function isDateInRange(date: string, bounds: DateBounds) {
  return date >= bounds.from && date <= bounds.to;
}

function clampDate(date: string, bounds: DateBounds) {
  if (date < bounds.from) {
    return bounds.from;
  }

  return date > bounds.to ? bounds.to : date;
}
