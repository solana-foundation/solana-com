/**
 * gen:nav-labels.
 *
 *   tsx src/generators/nav-labels.ts [--check]
 *
 * Source: apps/docs/content/navigation/en.json. Output:
 * apps/docs/content/navigation/en/labels.json, every label the docs chrome
 * takes from the navigation (tab names, group names, sidebar link titles and
 * the time tags of tutorial paths), keyed by the slug of the English label
 * (`labelSlug`, as apps/docs src/lib/docs/nav-labels.ts):
 *
 * ```json
 * {
 *   "tabs": { "start-here": "Start here", … },
 *   "groups": { "payment-basics": "Payment basics", … },
 *   "links": { "github": "GitHub", … },
 *   "tags": { "8-min": "~8 min", … }
 * }
 * ```
 *
 * Lingo translates it to navigation/<locale>/labels.json (.lingo/config.json),
 * and apps/docs (src/lib/docs/nav-labels.ts) shows a locale's label where it
 * has one and the English label otherwise. Page titles are not here: the
 * sidebar takes them from each page's (translated) frontmatter.
 *
 * Every docs locale gets a navigation/<locale>/labels.json, `{}` until Lingo
 * fills it, so the app can import each one. Locale files are Lingo's: this
 * generator only creates a missing one, never edits one.
 *
 * Two different English labels with the same slug in one section are an
 * error (they would share a translation).
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { DOCS_LOCALES, DEFAULT_LOCALE } from "../lib/locales.ts";
import { docsRoot as defaultDocsRoot } from "../lib/paths.ts";
import { isGroup, type NavEntry, type NavFile } from "../nav/types.ts";
import {
  applyOutputs,
  emptyResult,
  finish,
  isMain,
  parseFlags,
  printResult,
  readJson,
  type GeneratorOptions,
  type GeneratorResult,
} from "./_lib.ts";

export const NAV_LABEL_SECTIONS = ["tabs", "groups", "links", "tags"] as const;
export type NavLabelSection = (typeof NAV_LABEL_SECTIONS)[number];
export type NavLabels = Record<NavLabelSection, Record<string, string>>;

/**
 * Slug of an English label, e.g. "Video tutorials" -> "video-tutorials",
 * "~8 min" -> "8-min". Must stay the same as `labelSlug` in apps/docs
 * src/lib/docs/nav-labels.ts (the app's test checks every label).
 */
export function labelSlug(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "x"
  );
}

export function navLabelsFile(docsRoot: string, locale: string) {
  return path.join(docsRoot, "navigation", locale, "labels.json");
}

/** Every label of `nav`, by section, keyed by slug (sorted). */
export function collectNavLabels(
  nav: NavFile,
  problems: GeneratorResult["problems"] = [],
): NavLabels {
  const found: Record<NavLabelSection, Map<string, string>> = {
    tabs: new Map(),
    groups: new Map(),
    links: new Map(),
    tags: new Map(),
  };
  const add = (section: NavLabelSection, label: string | undefined) => {
    if (typeof label !== "string" || !label.trim()) return;
    const key = labelSlug(label);
    const had = found[section].get(key);
    if (had !== undefined && had !== label)
      problems.push({
        level: "error",
        file: "navigation/en.json",
        message: `${section}: "${had}" and "${label}" have the same key "${key}"; rename one`,
      });
    else found[section].set(key, label);
  };
  const entry = (e: NavEntry) => {
    if (typeof e === "string") return;
    if (isGroup(e)) {
      add("groups", e.group);
      add("tags", e.tag);
      e.pages.forEach(entry);
    } else if (e.type === "link") add("links", e.title);
  };
  for (const tab of nav.tabs) {
    add("tabs", tab.tab);
    tab.groups?.forEach(entry);
    tab.pages?.forEach(entry);
  }
  const sorted = (m: Map<string, string>) =>
    Object.fromEntries([...m].sort(([a], [b]) => (a < b ? -1 : 1)));
  return {
    tabs: sorted(found.tabs),
    groups: sorted(found.groups),
    links: sorted(found.links),
    tags: sorted(found.tags),
  };
}

export function generateNavLabels(
  opts: GeneratorOptions = {},
): GeneratorResult {
  const docsRoot = opts.docsRoot ?? defaultDocsRoot;
  const check = Boolean(opts.check);
  const r = emptyResult();
  const navFile = path.join(docsRoot, "navigation", `${DEFAULT_LOCALE}.json`);
  if (!existsSync(navFile)) {
    r.problems.push({
      level: "error",
      file: "navigation/en.json",
      message: "missing",
    });
    return finish(r, check);
  }
  const labels = collectNavLabels(readJson(navFile) as NavFile, r.problems);
  const files = new Map<string, string>([
    [
      navLabelsFile(docsRoot, DEFAULT_LOCALE),
      `${JSON.stringify(labels, null, 2)}\n`,
    ],
  ]);
  // A placeholder for each locale Lingo has not translated yet.
  for (const locale of DOCS_LOCALES) {
    const file = navLabelsFile(docsRoot, locale);
    if (!existsSync(file)) files.set(file, "{}\n");
  }
  applyOutputs(docsRoot, files, [], check, r);
  return finish(r, check);
}

if (isMain(import.meta.url)) {
  const { check } = parseFlags(process.argv.slice(2));
  const r = generateNavLabels({ check });
  printResult("gen:nav-labels", r, check);
  process.exit(r.ok ? 0 : 1);
}
