const UTC_TIME_ZONE = "UTC";

export function parsePublishedAt(value: unknown): Date | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return null;
  }

  const parsedDate = new Date(normalizedValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function isPublishedAtOrBefore(
  value: unknown,
  now: Date = new Date()
): boolean {
  const publishedAt = parsePublishedAt(value);
  return publishedAt ? publishedAt.getTime() <= now.getTime() : false;
}

export function formatPublishedAt(
  value: unknown,
  format: "short" | "long" = "short"
): string {
  const publishedAt = parsePublishedAt(value);
  if (!publishedAt) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: UTC_TIME_ZONE,
    day: "2-digit",
    month: format === "short" ? "short" : "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${formatter.format(publishedAt)} UTC`;
}
