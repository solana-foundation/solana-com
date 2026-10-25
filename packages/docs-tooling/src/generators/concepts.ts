/**
 * gen:concepts.
 *
 *   tsx src/generators/concepts.ts [--check] [--sync]
 *
 * Source: apps/docs/content/concepts/concepts.en.json (+ concepts.<loc>.json from Lingo)
 *
 * ```jsonc
 * {
 *   "_ui": { "learnMore": "Learn more", … },   // optional UI strings
 *   "account": {
 *     "name": "Accounts", "cat": "The basics",
 *     "short": "Everything on Solana … lives in *accounts* …",  // inline markdown
 *     "href": "/docs/core/accounts",
 *     "label": "New concept"                                   // optional, unused
 *   }
 * }
 * ```
 *
 * Output, per language with a source file, under snippets/concepts/<lang>/:
 * - `<key>.mdx`: the concept row, a quiet glossary line (name, the first
 *   sentence of `short`, a link to `href`) in `<div className="sol-concept">`
 *   (SSR, readable without JS). `import Accounts from
 *   "/snippets/concepts/en/account.mdx"` then `<Accounts />`; a step's
 *   imports in a row render as one list.
 * - `<key>.short.mdx`: the `short` sentence only, for `## In short` on the
 *   concept's canonical page.
 * - `<key>.used-in.mdx`: "You've used this in: …" backlinks to every path page
 *   that introduces (imports the card) or mentions (chip) the concept. Built
 *   from the pages themselves, so it cannot drift.
 * - `coverage.mdx`: the concept × path table (where each concept is taught).
 *
 * `--sync` rewrites every inline concept chip in content pages. Authors write
 *
 *   <span className="sol-chip" data-concept="account">accounts</span>
 *
 * (or the spec's `<Tooltip data-concept="account">accounts</Tooltip>`), and
 * sync expands it to
 *
 *   <span className="sol-chip" data-concept="account"><Tooltip headline="Accounts"
 *   tip="…" cta="Learn more" href="/docs/core/accounts">accounts</Tooltip><span
 *   className="nojs-only"> ([Accounts](/docs/core/accounts): …)</span></span>
 *
 * The marker lives on the wrapper `<span>` because Tooltip does not pass
 * unknown props to the DOM, and the `nojs-only` span carries the tooltip
 * text plus a real link for readers without JavaScript (the Tooltip trigger
 * is a `<button>` and its tip/href only exist in the client payload). Only
 * elements with `data-concept` are touched; the trigger text is kept. Sync
 * also re-points `/snippets/concepts/<lang>/` imports in locale pages.
 *
 * `--check` runs the same page sync in memory and fails when any page is out
 * of date (a stale chip after a `short` edit is drift, like a stale snippet).
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { mdxCodec } from "../lib/codec.ts";
import { DEFAULT_LOCALE } from "../lib/locales.ts";
import type { AstNode } from "../types.ts";
import {
  applyOutputs,
  checkInlineMarkdown,
  emptyResult,
  finish,
  getAttr,
  hasClass,
  header,
  isJsx,
  isMain,
  isRecord,
  jsxText,
  link,
  localizeHref,
  mdInline,
  mdText,
  pageFileFor,
  parseFlags,
  plainText,
  printResult,
  readJson,
  resolveDocsRoot,
  setAttrs,
  setChildren,
  sourceLanguages,
  syncPages,
  syncSnippetImports,
  text,
  uiStrings,
  walkTree,
  type GeneratorOptions,
  type GeneratorResult,
  type Problem,
} from "./_lib.ts";
import { loadPaths, pathPages, type PathsSource } from "./paths.ts";

export const CONCEPT_UI = {
  newConcept: "New concept",
  learnMore: "Learn more",
  usedIn: "You've used this in:",
  notUsed: "Not used in a tutorial yet.",
  overview: "Overview",
  step: "Step",
  concept: "Concept",
  mentioned: "mentioned",
  notUsedCell: "not used",
  gap: "not taught in a tutorial",
};
export type ConceptUi = typeof CONCEPT_UI;

export interface ConceptDef {
  key: string;
  name: string;
  cat: string;
  short: string;
  href: string;
  label?: string;
}
export interface ConceptsSource {
  lang: string;
  ui: ConceptUi;
  concepts: ConceptDef[];
}

const KEY_RE = /^[a-z][a-z0-9-]*$/;
const FIELDS = new Set(["name", "cat", "short", "href", "label"]);
const RESERVED = new Set(["_ui", "$schema"]);
/** Snippet names the generator uses besides `<key>.mdx`. */
const RESERVED_KEYS = new Set(["coverage"]);

export function conceptsDir(docsRoot: string) {
  return path.join(docsRoot, "concepts");
}

const str = (v: unknown): v is string =>
  typeof v === "string" && v.trim() !== "";

/**
 * Validate one concepts.<lang>.json. Locale files are merged over English per
 * field; keys, order and hrefs always come from English.
 */
export function parseConcepts(
  raw: unknown,
  file: string,
  problems: Problem[],
  english?: ConceptsSource,
): ConceptsSource {
  const err = (message: string) =>
    problems.push({ level: "error", file, message });
  const out: ConceptsSource = {
    lang: DEFAULT_LOCALE,
    ui: { ...CONCEPT_UI },
    concepts: [],
  };
  if (!isRecord(raw)) {
    err("must be a JSON object of concept definitions");
    return out;
  }
  out.ui = uiStrings(CONCEPT_UI, english?.ui, raw._ui);
  if (english) {
    out.concepts = english.concepts.map((en) => {
      const t = raw[en.key];
      if (!isRecord(t)) return en;
      const pick = (f: "name" | "cat" | "short") => {
        const v = t[f];
        if (!str(v)) return en[f];
        const bad = f === "short" ? checkInlineMarkdown(v) : undefined;
        if (bad) {
          err(`${en.key}.${f} ${bad}`);
          return en[f];
        }
        return v;
      };
      return {
        ...en,
        name: pick("name"),
        cat: pick("cat"),
        short: pick("short"),
        label: str(t.label) ? t.label : en.label,
      };
    });
    return out;
  }
  for (const [key, v] of Object.entries(raw)) {
    if (RESERVED.has(key)) continue;
    const at = (m: string) => err(`${key}: ${m}`);
    if (!KEY_RE.test(key) || RESERVED_KEYS.has(key))
      at("key must be kebab-case ([a-z][a-z0-9-]*) and not a reserved name");
    if (!isRecord(v)) {
      at("must be an object");
      continue;
    }
    for (const f of Object.keys(v))
      if (!FIELDS.has(f)) at(`unknown field "${f}"`);
    for (const f of ["name", "cat", "short", "href"] as const)
      if (!str(v[f])) at(`"${f}" must be a non-empty string`);
    const bad = str(v.short) ? checkInlineMarkdown(v.short) : undefined;
    if (bad) at(`"short" ${bad}`);
    if (str(v.href) && !/^(\/|https:\/\/)/.test(v.href))
      at(`"href" must be root-relative or https`);
    out.concepts.push({
      key,
      name: String(v.name ?? ""),
      cat: String(v.cat ?? ""),
      short: String(v.short ?? ""),
      href: String(v.href ?? ""),
      label: str(v.label) ? v.label : undefined,
    });
  }
  return out;
}

export function loadConcepts(
  docsRoot: string,
  problems: Problem[],
): ConceptsSource[] {
  const dir = conceptsDir(docsRoot);
  const enFile = path.join(dir, "concepts.en.json");
  if (!existsSync(enFile)) {
    problems.push({
      level: "error",
      file: "concepts/concepts.en.json",
      message: "missing",
    });
    return [];
  }
  const en = parseConcepts(
    readJson(enFile),
    "concepts/concepts.en.json",
    problems,
  );
  const out = [en];
  for (const lang of sourceLanguages(dir, "concepts").slice(1)) {
    const loc = parseConcepts(
      readJson(path.join(dir, `concepts.${lang}.json`)),
      `concepts/concepts.${lang}.json`,
      problems,
      en,
    );
    loc.lang = lang;
    out.push(loc);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Usage (backlinks and coverage), scanned from the English path pages
// ---------------------------------------------------------------------------

export interface Usage {
  key: string;
  path: string;
  /** 0 = path intro page, n = step n. */
  index: number;
  kind: "intro" | "ref";
}

const CARD_IMPORT_RE =
  /["']\/snippets\/concepts\/[a-zA-Z-]+\/([a-z][a-z0-9-]*)\.mdx["']/g;

/** Concept usage in one page's tree. */
export function usageInTree(tree: AstNode): {
  intro: Set<string>;
  ref: Set<string>;
} {
  const intro = new Set<string>();
  const ref = new Set<string>();
  walkTree(tree, (n) => {
    if (n.type === "code" || n.type === "inlineCode") return "skip";
    if (n.type === "mdxjsEsm" && typeof n.value === "string")
      for (const m of n.value.matchAll(CARD_IMPORT_RE))
        if (!RESERVED_KEYS.has(m[1]!)) intro.add(m[1]!);
    if (isJsx(n)) {
      const k = getAttr(n, "data-concept");
      if (k) {
        ref.add(k);
        return "skip";
      }
    }
  });
  return { intro, ref };
}

export function scanUsage(
  docsRoot: string,
  paths: PathsSource | undefined,
): Usage[] {
  const out: Usage[] = [];
  for (const p of paths?.paths ?? []) {
    pathPages(p).forEach((href, index) => {
      const file = pageFileFor(docsRoot, href);
      if (!file) return;
      const { tree } = mdxCodec.parse(readFileSync(file, "utf8"), {
        path: file,
      });
      const u = usageInTree(tree);
      for (const key of u.intro)
        out.push({ key, path: p.key, index, kind: "intro" });
      for (const key of u.ref)
        if (!u.intro.has(key))
          out.push({ key, path: p.key, index, kind: "ref" });
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

const hdr = (lang: string, extra: string[] = []) =>
  header(
    "concepts.ts",
    [`concepts/concepts.${lang}.json`, ...extra],
    "gen:concepts",
  );

/** The first sentence of a concept's `short`, as plain text (row definitions). */
export function firstSentence(short: string) {
  const text = plainText(short);
  return text.split(/(?<=[.!?])\s+(?=\S)|(?<=[。！？])/u)[0]!.trim();
}

/**
 * One quiet glossary row (name and a one-sentence definition, linking to the
 * concept page). A step imports its concepts one after another; consecutive
 * rows form one list in styles/concepts.css.
 */
export function renderCard(
  docsRoot: string,
  src: ConceptsSource,
  c: ConceptDef,
) {
  const { lang } = src;
  return `${hdr(lang)}
<div className="sol-concept not-prose">
[<span className="sol-concept-name">${mdText(c.name)}</span> <span className="sol-concept-def">${mdText(firstSentence(c.short))}</span>](${localizeHref(docsRoot, c.href, lang)})
</div>
`;
}

export function renderShort(src: ConceptsSource, c: ConceptDef) {
  return `${hdr(src.lang)}
${mdInline(c.short)}
`;
}

function stepLabel(ui: ConceptUi, index: number) {
  return index === 0 ? ui.overview : `${ui.step} ${index}`;
}

/** Path label/page for a usage, in the concept file's language. */
function usageTarget(docsRoot: string, paths: PathsSource, u: Usage) {
  const p = paths.paths.find((x) => x.key === u.path)!;
  return {
    p,
    href: localizeHref(docsRoot, pathPages(p)[u.index]!, paths.lang),
  };
}

export function renderUsedIn(
  docsRoot: string,
  src: ConceptsSource,
  c: ConceptDef,
  usage: Usage[],
  paths: PathsSource | undefined,
) {
  const { ui, lang } = src;
  const mine = paths ? usage.filter((u) => u.key === c.key) : [];
  const order = (u: Usage) =>
    paths!.paths.findIndex((p) => p.key === u.path) * 1000 + u.index;
  const seen = new Set<string>();
  const links = mine
    .sort((a, b) => order(a) - order(b))
    .filter((u) => {
      const id = `${u.path}/${u.index}`;
      return seen.has(id) ? false : (seen.add(id), true);
    })
    .map((u) => {
      const { p, href } = usageTarget(docsRoot, paths!, u);
      return `[${mdText(p.label)} <span className="sol-usedin-step">${mdText(stepLabel(ui, u.index))}</span>](${href})`;
    });
  const body = links.length
    ? `<span className="sol-usedin-label">${mdText(ui.usedIn)}</span> ${links.join(" ")}`
    : `<span className="sol-usedin-label">${mdText(ui.notUsed)}</span>`;
  return `${hdr(lang, [`paths/paths.${paths?.lang ?? "en"}.json`, "path pages"])}
<div className="sol-usedin not-prose" data-concept="${c.key}">
${body}
</div>
`;
}

export function renderCoverage(
  docsRoot: string,
  src: ConceptsSource,
  usage: Usage[],
  paths: PathsSource | undefined,
) {
  const { ui, lang } = src;
  const ps = paths?.paths ?? [];
  const head = [
    `<th scope="col">${mdText(ui.concept)}</th>`,
    ...ps.map((p) => `<th scope="col">${mdText(p.label)}</th>`),
  ].join("");
  const rows = src.concepts.map((c) => {
    const mine = usage.filter((u) => u.key === c.key);
    const cells = ps.map((p) => {
      const forPath = mine.filter((u) => u.path === p.key);
      const intro = forPath
        .filter((u) => u.kind === "intro")
        .sort((a, b) => a.index - b.index)[0];
      if (intro) {
        const href = localizeHref(
          docsRoot,
          pathPages(p)[intro.index]!,
          paths!.lang,
        );
        return `<td data-cov="intro">[${mdText(stepLabel(ui, intro.index))}](${href})</td>`;
      }
      if (forPath.length)
        return `<td data-cov="ref">${mdText(ui.mentioned)}</td>`;
      return `<td data-cov="none"><span aria-hidden="true">·</span><span className="sol-vh">${mdText(ui.notUsedCell)}</span></td>`;
    });
    const gap = mine.length
      ? ""
      : ` <span className="sol-cov-gap">${mdText(ui.gap)}</span>`;
    return `<tr><th scope="row">[${mdText(c.name)}](${localizeHref(docsRoot, c.href, lang)})${gap}</th>${cells.join("")}</tr>`;
  });
  return `${hdr(lang, [`paths/paths.${paths?.lang ?? "en"}.json`, "path pages"])}
<div className="sol-cov-wrap not-prose">
<table className="sol-cov">
<thead><tr>${head}</tr></thead>
<tbody>
${rows.join("\n")}
</tbody>
</table>
</div>
`;
}

export function buildConceptOutputs(
  docsRoot: string,
  sources: ConceptsSource[],
  pathSources: PathsSource[],
  usage: Usage[],
) {
  const files = new Map<string, string>();
  for (const src of sources) {
    const dir = path.join(docsRoot, "snippets", "concepts", src.lang);
    const paths =
      pathSources.find((p) => p.lang === src.lang) ?? pathSources[0];
    for (const c of src.concepts) {
      files.set(path.join(dir, `${c.key}.mdx`), renderCard(docsRoot, src, c));
      files.set(path.join(dir, `${c.key}.short.mdx`), renderShort(src, c));
      files.set(
        path.join(dir, `${c.key}.used-in.mdx`),
        renderUsedIn(docsRoot, src, c, usage, paths),
      );
    }
    files.set(
      path.join(dir, "coverage.mdx"),
      renderCoverage(docsRoot, src, usage, paths),
    );
  }
  return files;
}

// ---------------------------------------------------------------------------
// --sync: inline concept chips
// ---------------------------------------------------------------------------

/** Punctuation that must stay on the chip's line (and a possessive 's). */
const TRAILING_PUNCT_START = /^(?:[,.;:!?)\]}…”’»]+|['’]s\b)+/;
const TRAILING_PUNCT = new RegExp(`${TRAILING_PUNCT_START.source}$`);

/** Expand/refresh every `data-concept` chip in a tree. Returns true if changed. */
export function syncChips(
  tree: AstNode,
  docsRoot: string,
  src: ConceptsSource,
  problems: Problem[],
  /** Locale of the page (for link localization); defaults to the source's. */
  lang: string = src.lang,
): boolean {
  let changed = false;
  const byKey = new Map(src.concepts.map((c) => [c.key, c]));
  walkTree(tree, (n, parent, index) => {
    if (n.type === "code" || n.type === "inlineCode") return "skip";
    if (!isJsx(n)) return;
    const key = getAttr(n, "data-concept");
    if (key === undefined) return;
    const c = byKey.get(key);
    if (!c) {
      problems.push({
        level: "error",
        message: `unknown data-concept="${key}"`,
      });
      return "skip";
    }
    if (n.type !== "mdxJsxTextElement") {
      problems.push({
        level: "warn",
        message: `data-concept="${key}" on a block element; write chips inline in a sentence`,
      });
      return "skip";
    }
    let wrapper = n;
    if (n.name === "Tooltip") {
      // Spec form: <Tooltip data-concept> -> wrap it.
      wrapper = jsxText("span", [], [n]);
      parent!.children![index] = wrapper;
      changed = true;
    } else if (n.name !== "span" || !hasClass(n, "sol-chip")) {
      problems.push({
        level: "error",
        message: `data-concept="${key}" must be on <span className="sol-chip"> or <Tooltip>`,
      });
      return "skip";
    }
    // Trigger text: the existing Tooltip's children, or the span's own text.
    const kids = wrapper.children ?? [];
    const tooltip = kids.find((k) => isJsx(k) && k.name === "Tooltip");
    const trigger = tooltip
      ? (tooltip.children ?? [])
      : kids.filter((k) => !(isJsx(k) && hasClass(k, "nojs-only")));
    const href = localizeHref(docsRoot, c.href, lang);
    if (parent?.type === "tableCell")
      problems.push({
        level: "warn",
        message: `data-concept="${key}" in a table cell: syncing re-pads the whole table (codec), so the diff is not local`,
      });
    const tip = plainText(c.short);
    const tooltipNode =
      tooltip ??
      jsxText("Tooltip", [], trigger.length ? trigger : [text(c.name)]);
    if (!tooltip) changed = true;
    changed =
      setAttrs(tooltipNode, [
        ["headline", c.name],
        ["tip", tip],
        ["cta", src.ui.learnMore],
        ["href", href],
      ]) || changed;
    const nojs = jsxText(
      "span",
      [["className", "nojs-only"]],
      [text(" ("), link(href, [text(c.name)]), text(`: ${tip})`)],
    );
    changed =
      setAttrs(wrapper, [
        ["className", "sol-chip"],
        ["data-concept", key],
      ]) || changed;
    // Punctuation right after the chip ("RPC endpoint, and") moves inside
    // it, after the no-JS text, so styles/concepts.css can keep the two on
    // one line (a chip is an inline-flex box: browsers break after it).
    const nojsAt = kids.findIndex((k) => isJsx(k) && hasClass(k, "nojs-only"));
    const tail =
      nojsAt >= 0
        ? kids
            .slice(nojsAt + 1)
            .filter(
              (k) =>
                k.type === "text" && TRAILING_PUNCT.test(String(k.value ?? "")),
            )
        : [];
    let punct = tail.map((k) => String(k.value)).join("");
    const next = parent?.children?.[index + 1];
    if (next?.type === "text") {
      const m = TRAILING_PUNCT_START.exec(String(next.value ?? ""));
      if (m) {
        punct += m[0];
        next.value = String(next.value).slice(m[0].length);
        if (!next.value) parent!.children!.splice(index + 1, 1);
        changed = true;
      }
    }
    changed =
      setChildren(wrapper, [
        tooltipNode,
        nojs,
        ...(punct ? [text(punct)] : []),
      ]) || changed;
    return "skip";
  });
  return changed;
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

export function runConcepts(opts: GeneratorOptions = {}): GeneratorResult {
  const docsRoot = resolveDocsRoot(opts);
  const check = Boolean(opts.check);
  const r = emptyResult();
  const sources = loadConcepts(docsRoot, r.problems);
  if (!sources.length || r.problems.some((p) => p.level === "error"))
    return finish(r, check);
  // Paths are optional for concepts: without them backlinks are empty.
  const pathProblems: Problem[] = [];
  const pathSources = loadPaths(docsRoot, pathProblems);
  if (pathProblems.some((p) => p.level === "error"))
    r.problems.push({
      level: "warn",
      file: "paths/paths.en.json",
      message:
        "paths unavailable or invalid; backlinks and coverage have no path columns (run gen:paths for details)",
    });
  const en = sources[0]!;
  for (const c of en.concepts)
    if (c.href.startsWith("/") && !pageFileFor(docsRoot, c.href))
      r.problems.push({
        level: "warn",
        file: "concepts/concepts.en.json",
        message: `${c.key}: page ${c.href} does not exist yet`,
      });
  const usage = scanUsage(docsRoot, pathSources[0]);
  for (const u of usage)
    if (!en.concepts.some((c) => c.key === u.key))
      r.problems.push({
        level: "error",
        message: `path "${u.path}" page ${u.index} uses unknown concept "${u.key}"`,
      });
  const files = buildConceptOutputs(docsRoot, sources, pathSources, usage);
  applyOutputs(
    docsRoot,
    files,
    [path.join(docsRoot, "snippets", "concepts")],
    check,
    r,
  );
  // `--check` always verifies chips and imports in memory (stale chips are
  // drift, like stale snippets); only `--sync` without `--check` writes.
  if (opts.sync || check) {
    const byLang = new Map(sources.map((s) => [s.lang, s]));
    syncPages(
      docsRoot,
      (s) => s.includes("data-concept") || s.includes("/snippets/concepts/"),
      (tree, file, problems) => {
        const src = byLang.get(file.lang) ?? en;
        const a = syncSnippetImports(tree, "concepts", file.lang, docsRoot);
        const b = syncChips(tree, docsRoot, src, problems, file.lang);
        return a || b;
      },
      check,
      r,
    );
  }
  return finish(r, check);
}

if (isMain(import.meta.url)) {
  const f = parseFlags(process.argv.slice(2));
  const r = runConcepts({ check: f.check, sync: f.sync });
  printResult("gen:concepts", r, f.check);
  process.exit(r.ok ? 0 : 1);
}
