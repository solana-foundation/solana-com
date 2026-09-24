import { isPublishedAtOrBefore } from "./publishing";

export function isPublishedReport(
  report:
    | {
        status?: string | null;
        publishedAt?: string | null;
      }
    | null
    | undefined,
  now: Date = new Date(),
) {
  return Boolean(
    report &&
    report.status === "published" &&
    isPublishedAtOrBefore(report.publishedAt, now),
  );
}
