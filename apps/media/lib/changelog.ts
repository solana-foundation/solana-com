export const CHANGELOG_CATEGORY = "Changelog";
export const CHANGELOG_PAGE_SIZE = 13;
export const CHANGELOG_SUBSCRIBE_URL =
  "https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=f1bc79b9-a1cd-463a-8c2c-e761b2fa108d";

export function isChangelogCategory(value: unknown): boolean {
  return (
    typeof value === "string" &&
    value.trim().toLowerCase() === CHANGELOG_CATEGORY.toLowerCase()
  );
}
