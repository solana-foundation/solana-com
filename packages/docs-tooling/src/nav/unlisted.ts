/**
 * English pages deliberately left out of navigation/en.json, with the reason.
 * The docs still build them (every .mdx file is published), so this list must
 * stay short and each entry needs an owner to remove the file.
 *
 * Hidden-but-navigable pages (the Learn articles, docs/tags) are NOT here:
 * they sit in `hidden: true` tabs in en.json.
 */
import type { UnlistedPage } from "./types.ts";

export const UNLISTED: readonly UnlistedPage[] = [];

export function isUnlisted(page: string): UnlistedPage | undefined {
  return UNLISTED.find((u) => u.page === page);
}
