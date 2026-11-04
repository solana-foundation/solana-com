/**
 * Page ids <-> content files. A page id is the public URL path without the
 * leading slash, with `index` for folder pages (the navigation format):
 *
 *   developers/docs/X        <-> docs/en/X.mdx
 *   <loc>/developers/docs/X  <-> docs/<loc>/X.mdx
 *   learn/X                  <-> learn/en/X.mdx
 *   <loc>/learn/X            <-> learn/<loc>/X.mdx
 *   developers/cookbook/X    <-> cookbook/X.mdx (English only)
 *
 * File paths are relative to the content root (apps/docs/content).
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { DEFAULT_LOCALE, DOCS_LOCALES } from "./locales.ts";
import { toPosix } from "./paths.ts";

/** Content-relative `.mdx` file of a page id, or undefined. */
export function pageToFile(page: string): string | undefined {
  const parts = page.split("/");
  const loc = DOCS_LOCALES.includes(parts[0]!) ? parts.shift()! : undefined;
  const rest = parts.join("/");
  let m;
  if ((m = /^developers\/docs\/(.+)$/.exec(rest)))
    return `docs/${loc ?? DEFAULT_LOCALE}/${m[1]}.mdx`;
  if ((m = /^learn\/(.+)$/.exec(rest)))
    return `learn/${loc ?? DEFAULT_LOCALE}/${m[1]}.mdx`;
  if (!loc && (m = /^developers\/cookbook\/(.+)$/.exec(rest)))
    return `cookbook/${m[1]}.mdx`;
  return undefined;
}

/** Page id of a content-relative file, or undefined (not a page). */
export function fileToPage(file: string): string | undefined {
  const rel = toPosix(file);
  if (!rel.endsWith(".mdx")) return undefined;
  const p = rel.slice(0, -".mdx".length);
  let m;
  if ((m = /^(docs|learn)\/([^/]+)\/(.+)$/.exec(p))) {
    const [, collection, loc, rest] = m;
    if (loc !== DEFAULT_LOCALE && !DOCS_LOCALES.includes(loc!))
      return undefined;
    const prefix = loc === DEFAULT_LOCALE ? "" : `${loc}/`;
    return `${prefix}${collection === "docs" ? "developers/docs" : "learn"}/${rest}`;
  }
  if ((m = /^cookbook\/(.+)$/.exec(p))) return `developers/cookbook/${m[1]}`;
  return undefined;
}

/** Language of a content-relative file (`docs/fr/x.mdx` -> `fr`). */
export function langOfFile(file: string): string {
  const m = /^(?:docs|learn)\/([^/]+)\//.exec(toPosix(file));
  return m && DOCS_LOCALES.includes(m[1]!) ? m[1]! : DEFAULT_LOCALE;
}

/** Content-relative path of every page file (all languages), sorted. */
export function listPageFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir).sort()) {
      if (name.startsWith(".") || name.startsWith("_")) continue;
      const abs = path.join(dir, name);
      if (statSync(abs).isDirectory()) walk(abs);
      else {
        const rel = toPosix(path.relative(root, abs));
        if (fileToPage(rel)) out.push(rel);
      }
    }
  };
  for (const d of ["docs", "learn", "cookbook"]) walk(path.join(root, d));
  return out.sort();
}
