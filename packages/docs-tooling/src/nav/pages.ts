/**
 * Page inventory of the English docs content. A page is written as its page
 * id (the navigation format, see lib/content-paths.ts).
 */
import { fileToPage, langOfFile, listPageFiles } from "../lib/content-paths.ts";
import { DEFAULT_LOCALE } from "../lib/locales.ts";
import { docsRoot } from "../lib/paths.ts";
import type { NavPage } from "./types.ts";

/** Every English page id (docs, learn and cookbook). */
export function loadEnglishPages(root: string = docsRoot): Set<NavPage> {
  return new Set(
    listPageFiles(root)
      .filter((f) => langOfFile(f) === DEFAULT_LOCALE)
      .map((f) => fileToPage(f)!),
  );
}

/**
 * Public URL path of a page ("developers/docs/core/index" ->
 * "/developers/docs/core").
 */
export function urlOf(page: NavPage): string {
  return "/" + page.replace(/(^|\/)index$/, "").replace(/\/$/, "");
}

/**
 * Page that serves an internal URL ("/developers/docs/video-guides" ->
 * "developers/docs/video-guides/index"), or undefined.
 */
export function pageForUrl(
  url: string,
  pages: ReadonlySet<NavPage>,
): NavPage | undefined {
  const p = url.replace(/^\//, "").replace(/\/$/, "");
  if (pages.has(p)) return p;
  if (pages.has(`${p}/index`)) return `${p}/index`;
  return undefined;
}
