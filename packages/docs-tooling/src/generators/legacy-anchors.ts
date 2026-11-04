/**
 * gen:legacy-anchors.
 *
 *   tsx src/generators/legacy-anchors.ts [--check]
 *
 * Old links keep their `#anchor` when a section moves. A browser never sends
 * the fragment, so no redirect can send `#old` somewhere else; the docs
 * app's client fallback (apps/docs/src/lib/docs/legacy-anchors.ts) does it:
 * when the hash matches no element on the page, it looks the page and the
 * anchor up in this generator's output and moves to the section that holds
 * the content now. Renamed headings on the same English page don't need an
 * entry: give them `anchorAliases` in the page's frontmatter (no JavaScript
 * needed).
 *
 * Source: apps/docs/content/legacy-anchors/<locale>.json (`en` and each docs
 * locale), one object per page an old link lands on today, without the
 * locale prefix:
 *
 * ```json
 * {
 *   "/developers/docs/quickstart": {
 *     "create-a-playground-wallet": "/developers/docs/programs/build-first-program#connect-a-playground-wallet",
 *     "quick-start": "#follow-along-locally"
 *   }
 * }
 * ```
 *
 * A target is `#id` (same page), `/path#id` or `/path` (top of another
 * page). Ids are the English page's, also in the locale files: on a
 * translated page the generator uses the translated heading at the same
 * position (the translation's headings must match the English ones level for
 * level, else the entry falls back to the top of the page, with a warning).
 *
 * Output: apps/docs/public/docs-assets/legacy-anchors/<locale>.json, served at
 * /docs-assets/legacy-anchors/<locale>.json and fetched only when a hash
 * matches nothing. Keys and targets are public paths (`/ja/developers/...`).
 *
 * Checks (errors fail `--check` and `verify`): every file is a known locale,
 * every page and target page exists, and every target id is on its page (a
 * renamed target heading: add its old id to that page's `anchorAliases`, or
 * update the entry). So a fallback always lands on an existing id and never
 * moves twice. An entry for an id the page has again is reported and kept:
 * the page's own id wins in the browser, and the entry applies again if the
 * id goes (for example when Lingo translates the page's headings).
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { pageIds, type PageId } from "../lib/page-ids.ts";
import { docsPublicAssets, repoRoot } from "../lib/paths.ts";
import { DEFAULT_LOCALE, DOCS_LOCALES } from "../lib/locales.ts";
import {
  applyOutputs,
  emptyResult,
  finish,
  GENERATED_MARK,
  isMain,
  isRecord,
  pageFileFor,
  parseFlags,
  printResult,
  readJson,
  resolveDocsRoot,
  type GeneratorOptions,
  type GeneratorResult,
  type Problem,
} from "./_lib.ts";

export const SOURCE_DIR = "legacy-anchors";
export const DEFAULT_OUT_DIR = path.join(docsPublicAssets, "legacy-anchors");
/** The /developers landing is a React page; its ids are read from here. */
export const HUB_FILE = path.join(
  repoRoot,
  "apps/docs/src/app/(docs)/[locale]/developers/developers-hub.tsx",
);
const HUB_PAGE = "/developers";

export interface LegacyAnchorsOptions extends GeneratorOptions {
  /** Output folder (defaults to apps/docs/public/docs-assets/legacy-anchors). */
  outDir?: string;
  /** Source of the /developers landing (its ids). */
  hubFile?: string;
}

/** page -> old anchor -> target, as in the source files. */
export type LegacyAnchorSource = Record<string, Record<string, string>>;

/** Ids of the /developers landing: literal `id="…"` plus `aliases={[…]}`. */
export function hubIds(source: string): PageId[] {
  const ids: PageId[] = [...source.matchAll(/\bid="([^"]+)"/g)].map((m) => ({
    id: m[1]!,
    kind: "element" as const,
  }));
  for (const m of source.matchAll(/id="([^"]+)"\s*aliases=\{\[([^\]]*)\]\}/g))
    for (const a of m[2]!.matchAll(/"([^"]+)"/g))
      ids.push({ id: a[1]!, kind: "alias", of: m[1]! });
  return ids;
}

/** Check one source file's shape; returns the entries that are usable. */
export function parseSource(
  raw: unknown,
  file: string,
  problems: Problem[],
): LegacyAnchorSource {
  const err = (message: string) =>
    problems.push({ level: "error", file, message });
  const out: LegacyAnchorSource = {};
  if (!isRecord(raw)) {
    err("must be an object of page -> { old anchor: target }");
    return out;
  }
  for (const [page, entries] of Object.entries(raw)) {
    if (!/^\/developers(\/|$)/.test(page)) {
      err(
        `${page}: pages are /developers paths without a locale prefix (the file name is the locale)`,
      );
      continue;
    }
    if (!isRecord(entries)) {
      err(`${page}: must be an object of old anchor -> target`);
      continue;
    }
    out[page] = {};
    for (const [anchor, target] of Object.entries(entries)) {
      if (!anchor || anchor.startsWith("#"))
        err(`${page}: "${anchor}" must be the anchor without "#"`);
      else if (
        typeof target !== "string" ||
        !/^(#.+|\/developers(\/[^#]*)?(#.+)?)$/.test(target)
      )
        err(
          `${page}#${anchor}: target must be "#id", "/developers/...#id" or "/developers/..." (got ${JSON.stringify(target)})`,
        );
      else out[page]![anchor] = target;
    }
  }
  return out;
}

interface Served {
  /** Public page path (with the locale prefix). */
  url: string;
  ids: PageId[];
  /** The English page's ids, when `ids` are a translation's. */
  english?: PageId[];
}

type Seq = { id: string; shape: string }[];
const sequence = (ids: PageId[]): Seq =>
  ids
    .filter((i) => i.kind === "heading" || i.kind === "step")
    .map((i) => ({ id: i.id, shape: `${i.kind}${i.level ?? ""}` }));

/**
 * The id `id` (an English page's) has on the served page, or undefined when
 * the page has no such section.
 */
export function placeId(served: Served, id: string): string | undefined {
  if (served.ids.some((i) => i.id === id)) return id;
  if (!served.english) return undefined;
  const en = served.english.find((i) => i.id === id);
  if (!en) return undefined;
  const owner = en.kind === "alias" ? en.of! : en.id;
  const from = sequence(served.english);
  const to = sequence(served.ids);
  if (
    from.length !== to.length ||
    from.some((s, i) => s.shape !== to[i]!.shape)
  )
    return undefined;
  const at = from.findIndex((s) => s.id === owner);
  return at < 0 ? undefined : to[at]!.id;
}

export async function runLegacyAnchors(
  opts: LegacyAnchorsOptions = {},
): Promise<GeneratorResult> {
  const docsRoot = resolveDocsRoot(opts);
  const outDir = opts.outDir ?? DEFAULT_OUT_DIR;
  const hubFile = opts.hubFile ?? HUB_FILE;
  const check = Boolean(opts.check);
  const r = emptyResult();
  const srcDir = path.join(docsRoot, SOURCE_DIR);
  const files = new Map<string, string>();

  const idCache = new Map<string, Promise<PageId[]>>();
  const idsOf = (abs: string) => {
    let p = idCache.get(abs);
    if (!p) {
      p =
        abs === hubFile
          ? Promise.resolve(
              existsSync(hubFile) ? hubIds(readFileSync(hubFile, "utf8")) : [],
            )
          : pageIds(abs);
      idCache.set(abs, p);
    }
    return p;
  };
  /** The page served at `page` in `locale`, or undefined (no such page). */
  const serve = async (
    locale: string,
    page: string,
  ): Promise<Served | undefined> => {
    const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
    const url = `${prefix}${page}`;
    if (page === HUB_PAGE)
      return existsSync(hubFile)
        ? { url, ids: await idsOf(hubFile) }
        : undefined;
    const english = pageFileFor(docsRoot, page);
    const own = prefix ? pageFileFor(docsRoot, url) : undefined;
    if (own && english)
      return { url, ids: await idsOf(own), english: await idsOf(english) };
    if (english) return { url, ids: await idsOf(english) };
    return undefined;
  };

  const sources = existsSync(srcDir)
    ? readdirSync(srcDir)
        .filter((f) => f.endsWith(".json"))
        .sort()
    : [];
  for (const name of sources) {
    const locale = name.slice(0, -".json".length);
    const rel = `${SOURCE_DIR}/${name}`;
    if (locale !== DEFAULT_LOCALE && !DOCS_LOCALES.includes(locale)) {
      r.problems.push({
        level: "error",
        file: rel,
        message: `"${locale}" is not a docs locale (en, ${DOCS_LOCALES.join(", ")})`,
      });
      continue;
    }
    const source = parseSource(
      readJson(path.join(srcDir, name)),
      rel,
      r.problems,
    );
    const out: Record<string, Record<string, string>> = {};
    const err = (message: string) =>
      r.problems.push({ level: "error", file: rel, message });
    const warn = (message: string) =>
      r.problems.push({ level: "warn", file: rel, message });
    let inactive = 0;
    for (const page of Object.keys(source).sort()) {
      const landing = await serve(locale, page);
      if (!landing) {
        err(
          `${page}: no such page (move its entries to where its old links land now)`,
        );
        continue;
      }
      for (const anchor of Object.keys(source[page]!).sort()) {
        const target = source[page]![anchor]!;
        const hash = target.indexOf("#");
        const targetPage =
          hash === 0 ? page : hash < 0 ? target : target.slice(0, hash);
        const id = hash < 0 ? "" : target.slice(hash + 1);
        const at = `${page}#${anchor}`;
        if (targetPage === page && (!id || id === anchor)) {
          err(
            `${at}: an entry must lead somewhere else on the page or to another page`,
          );
          continue;
        }
        const served =
          targetPage === page ? landing : await serve(locale, targetPage);
        if (!served) {
          err(`${at}: target page ${targetPage} does not exist`);
          continue;
        }
        let placed = id;
        if (id) {
          const found = placeId(served, id);
          if (found) placed = found;
          else if (served.english) {
            warn(
              `${at}: ${served.url} is translated and its headings don't line up with the English page's, so #${id} can't be placed; the entry goes to the top of the page`,
            );
            placed = "";
          } else {
            err(
              `${at}: ${targetPage} has no #${id} (renamed? keep the old id in that page's anchorAliases, or update the entry)`,
            );
            continue;
          }
        }
        if (landing.ids.some((i) => i.id === anchor)) {
          inactive++;
          if (locale === DEFAULT_LOCALE)
            warn(
              `${at}: the page has #${anchor} again, so the entry never applies (remove it if that is the same section)`,
            );
        }
        const value =
          served.url === landing.url
            ? placed
              ? `#${placed}`
              : ""
            : `${served.url}${placed ? `#${placed}` : ""}`;
        if (!value) continue; // a translation's page top: nothing to do
        (out[landing.url] ??= {})[anchor] = value;
      }
    }
    if (inactive && locale !== DEFAULT_LOCALE)
      r.problems.push({
        level: "warn",
        file: rel,
        message: `${inactive} entr${inactive === 1 ? "y is" : "ies are"} for ids the page has now (inactive until a translation drops them)`,
      });
    const body: Record<string, unknown> = {
      _generated: `${GENERATED_MARK}legacy-anchors.ts from apps/docs/content/${rel}. Do not edit: change the source and run \`pnpm --filter @workspace/docs-tooling gen:legacy-anchors\`.`,
    };
    for (const url of Object.keys(out).sort()) body[url] = out[url];
    files.set(path.join(outDir, name), `${JSON.stringify(body)}\n`);
  }
  if (!r.problems.some((p) => p.level === "error"))
    applyOutputs(docsRoot, files, [outDir], check, r);
  return finish(r, check);
}

if (isMain(import.meta.url)) {
  const f = parseFlags(process.argv.slice(2));
  runLegacyAnchors({ check: f.check }).then(
    (r) => {
      printResult("gen:legacy-anchors", r, f.check);
      process.exit(r.ok ? 0 : 1);
    },
    (err) => {
      console.error(err instanceof Error ? err.stack : err);
      process.exit(1);
    },
  );
}
