const LOCALE_OVERRIDES: Record<string, string> = {
  // Day-first ordering, matching the hero's "15–17 November 2026".
  en: "en-GB",
};

function parseIsoDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Formats an inclusive event date range, e.g. "15–17 November 2027". Dates are
 * calendar days, so they are parsed and formatted in UTC to avoid shifting
 * across time zones.
 */
export function formatEventDateRange(
  locale: string,
  startDate: string | null,
  endDate: string | null,
) {
  const start = startDate ? parseIsoDate(startDate) : null;
  if (!start) return null;
  const end = (endDate ? parseIsoDate(endDate) : null) ?? start;

  const formatter = new Intl.DateTimeFormat(
    LOCALE_OVERRIDES[locale] ?? locale,
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    },
  );

  return end.getTime() === start.getTime()
    ? formatter.format(start)
    : formatter.formatRange(start, end);
}
