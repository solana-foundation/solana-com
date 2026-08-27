import { isPublishedAtOrBefore } from "./publishing";

export function isPublishedUpgrade<
  T extends {
    status?: string | null;
    publishedAt?: string | null;
  },
>(upgrade: T | null | undefined, now: Date = new Date()): upgrade is T {
  return Boolean(
    upgrade?.status === "published" &&
    isPublishedAtOrBefore(upgrade.publishedAt, now),
  );
}
