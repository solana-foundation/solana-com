const UTC_TIME_ZONE = "UTC";
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const NO_TIMEZONE_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/;

export function parsePublishedAt(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return null;
  }

  const utcValue = DATE_ONLY_PATTERN.test(normalizedValue)
    ? `${normalizedValue}T00:00:00.000Z`
    : NO_TIMEZONE_PATTERN.test(normalizedValue)
      ? `${normalizedValue}Z`
      : normalizedValue;

  const parsedDate = new Date(utcValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function isPublishedAtOrBefore(
  value: unknown,
  now: Date = new Date(),
): boolean {
  const publishedAt = parsePublishedAt(value);
  return publishedAt ? publishedAt.getTime() <= now.getTime() : false;
}

export function formatPublishedAt(
  value: unknown,
  format: "short" | "long" = "short",
): string {
  const publishedAt = parsePublishedAt(value);
  if (!publishedAt) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: UTC_TIME_ZONE,
    day: "numeric",
    month: format === "short" ? "short" : "long",
    year: "numeric",
  });

  return formatter.format(publishedAt);
}
