import { isPublishedAtOrBefore } from "./publishing";

export function isPublishedReport(
  report:
    | {
        isReport?: boolean | null;
        status?: string | null;
        publishedAt?: string | null;
      }
    | null
    | undefined,
  now: Date = new Date(),
) {
  return Boolean(
    report &&
      report.isReport &&
      report.status === "published" &&
      isPublishedAtOrBefore(report.publishedAt, now),
  );
}
