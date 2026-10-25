/**
 * verify-nav: exact coverage of navigation/en.json. Errors:
 * - a nav entry (page, group root, internal tab href) has no file;
 * - an English page is in en.json zero times or more than once
 *   (UNLISTED pages excepted).
 *
 * Translated pages need no nav entry: the docs app shows the English
 * navigation and links each entry to the translation when it exists.
 */
import { internalPath, navPaths, readEnNav } from "./build.ts";
import { loadEnglishPages, pageForUrl } from "./pages.ts";
import type { NavEntry, NavFile, NavPage } from "./types.ts";
import { isGroup } from "./types.ts";
import { isUnlisted } from "./unlisted.ts";

export interface VerifyNavResult {
  errors: string[];
  /** English page files / nav entries. */
  counts: { files: number; navEntries: number };
}

/** All page references of a nav (pages + roots), in order. */
export function navPageRefs(nav: NavFile): NavPage[] {
  const out: NavPage[] = [];
  const walk = (entries: NavEntry[]) => {
    for (const e of entries) {
      if (typeof e === "string") out.push(e);
      else if (isGroup(e)) {
        if (e.root) out.push(e.root);
        walk(e.pages);
      }
    }
  };
  for (const t of nav.tabs) {
    for (const g of t.groups ?? []) {
      if (g.root) out.push(g.root);
      walk(g.pages);
    }
    walk(t.pages ?? []);
  }
  return out;
}

export function verifyNav(opts: { docsRoot?: string } = {}): VerifyNavResult {
  const paths = navPaths(opts.docsRoot);
  const errors: string[] = [];
  const files = loadEnglishPages(paths.docsRoot);
  const nav = readEnNav(paths);
  const refs = navPageRefs(nav);
  const seen = new Map<NavPage, number>();
  for (const r of refs) {
    seen.set(r, (seen.get(r) ?? 0) + 1);
    if (!files.has(r)) errors.push(`en: nav entry "${r}" has no file`);
  }
  for (const [r, n] of seen)
    if (n > 1) errors.push(`en: "${r}" appears ${n} times`);
  for (const f of files)
    if (!seen.has(f) && !isUnlisted(f))
      errors.push(`en: page "${f}" is in no nav entry`);
  for (const t of nav.tabs) {
    const local = t.href ? internalPath(t.href) : undefined;
    if (local !== undefined && !pageForUrl(local, files))
      errors.push(`en: tab "${t.tab}" href ${t.href} has no page`);
  }
  return { errors, counts: { files: files.size, navEntries: refs.length } };
}
