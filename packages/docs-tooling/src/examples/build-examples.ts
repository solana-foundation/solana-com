/**
 * `examples build [--check]` (`examples:build`).
 *
 * packages/docs-examples/**\/blocks.json + the sliced source files + the
 * recorded `.output.txt` files -> apps/docs/content/snippets/examples/<id>.mdx
 * and apps/docs/content/snippets/examples/index.json, plus verbatim copies of
 * the recorded data files the docs app imports (DATA_FILES). The output is
 * committed (the docs build reads the snippets as content); `--check`
 * regenerates in memory and fails when the committed files differ (or a
 * stale snippet is left behind).
 *
 * Output lookup per tab:
 * explicit `output`, then `<file minus ext>.<region>.output.txt`, then
 * `<file minus ext>.output.txt`; trailing whitespace trimmed. Only runnable
 * blocks show output, and a tab without one gets no Run button.
 */
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { docsRoot, repoRoot, toPosix } from "../lib/paths.ts";
import { stableJson, type Block, type BlocksFile } from "./blocks.ts";
import {
  formatRanges,
  parseRanges,
  rewriteWeb3jsSpecifier,
  sliceRegion,
} from "./include.ts";
import { renderSnippet, type RenderTab } from "./render.ts";
import { readRunMeta, type RunMeta } from "../lib/terminal.ts";

export const examplesRoot = path.join(repoRoot, "packages", "docs-examples");
export const snippetsRoot = path.join(docsRoot, "snippets", "examples");

const SKIP = new Set(["node_modules", "target", ".git"]);

/** Recorded data the docs app imports, copied verbatim under snippetsRoot. */
const DATA_FILES = ["paths/defi/settle-trade/settle-walkthrough.json"];

export function findBlocksFiles(root = examplesRoot): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir).sort()) {
      const p = path.join(dir, name);
      if (statSync(p).isDirectory()) {
        if (!SKIP.has(name)) walk(p);
      } else if (name === "blocks.json") out.push(p);
    }
  };
  walk(root);
  return out;
}

export interface IndexEntry {
  snippet: string;
  blocks: string;
  runnable: boolean;
  runner?: string;
  tabs: {
    title: string;
    file?: string;
    region?: string;
    output?: string;
    outputSha256?: string;
  }[];
}

export interface BuildResult {
  /** Repo-relative path -> content. */
  files: Map<string, string>;
  errors: string[];
  notes: string[];
  index: Record<string, IndexEntry>;
  /** For --check: files that differ or are missing/stale. */
  stale: string[];
  written: string[];
  removed: string[];
  outputsEmbedded: number;
}

export function outputCandidates(file: string, region?: string): string[] {
  const stem = file.replace(/\.[^./]+$/, "");
  return [
    ...(region ? [`${stem}.${region}.output.txt`] : []),
    `${stem}.output.txt`,
  ];
}

export function readOutput(abs: string): string | undefined {
  if (!existsSync(abs)) return undefined;
  return readFileSync(abs, "utf8").replace(/\s+$/, "");
}

function resolveTab(
  dirAbs: string,
  dirRel: string,
  tab: Block["tabs"][number],
  where: string,
  errors: string[],
): (RenderTab & { outputRel?: string; fileRel?: string }) | null {
  let code: string;
  let fileRel: string | undefined;
  if (tab.file) {
    const abs = path.join(dirAbs, tab.file);
    fileRel = toPosix(path.relative(repoRoot, abs));
    if (!existsSync(abs)) {
      errors.push(`${where}: cannot read "${fileRel}"`);
      return null;
    }
    const source = readFileSync(abs, "utf8");
    try {
      code = tab.region
        ? sliceRegion({
            source,
            region: tab.region,
            lang: tab.lang,
            file: fileRel,
          })
        : source.replace(/\s+$/, "");
    } catch (err) {
      errors.push(`${where}: ${(err as Error).message}`);
      return null;
    }
  } else if (typeof tab.code === "string") {
    code = tab.code.replace(/\s+$/, "");
  } else {
    errors.push(`${where}: tab "${tab.title}" has neither "file" nor "code"`);
    return null;
  }
  code = rewriteWeb3jsSpecifier(code);
  let highlight: string | undefined;
  if (tab.highlight) {
    try {
      const ranges = parseRanges(tab.highlight);
      const lines = code.split("\n").length;
      const bad = ranges.find((r) => r[1] > lines);
      if (bad)
        errors.push(
          `${where}: highlight=${tab.highlight} exceeds the included region (only ${lines} lines)`,
        );
      highlight = formatRanges(ranges);
    } catch (err) {
      errors.push(`${where}: ${(err as Error).message}`);
    }
  }
  let output: string | undefined;
  let outputRel: string | undefined;
  const candidates = tab.output
    ? [tab.output]
    : tab.file
      ? outputCandidates(tab.file, tab.region)
      : [];
  for (const c of candidates) {
    const text = readOutput(path.join(dirAbs, c));
    if (text !== undefined) {
      output = text;
      outputRel = toPosix(path.join(dirRel, c));
      break;
    }
  }
  if (tab.output && output === undefined)
    errors.push(`${where}: explicit output "${tab.output}" is missing`);
  let runMeta: RunMeta | undefined;
  if (output !== undefined && outputRel) {
    runMeta = readRunMeta(
      path.join(examplesRoot, outputRel),
      errors,
      `${where} (${tab.title})`,
    );
    const lines = output.split("\n").length;
    for (const c of runMeta?.commands ?? [])
      if (c.at >= lines)
        errors.push(
          `${where} (${tab.title}): run.json command at line ${c.at} is past the output (${lines} lines)`,
        );
  }
  return {
    title: tab.title,
    lang: tab.lang,
    code,
    highlight,
    output,
    outputNote: tab.outputNote,
    runMeta,
    outputRel,
    fileRel,
  };
}

export function buildExamples(
  opts: { check?: boolean; write?: boolean } = {},
): BuildResult {
  const res: BuildResult = {
    files: new Map(),
    errors: [],
    notes: [],
    index: {},
    stale: [],
    written: [],
    removed: [],
    outputsEmbedded: 0,
  };
  for (const bf of findBlocksFiles()) {
    const dirAbs = path.dirname(bf);
    const dirRel = toPosix(path.relative(examplesRoot, dirAbs));
    const bfRel = toPosix(path.relative(repoRoot, bf));
    let blocks: BlocksFile;
    try {
      blocks = JSON.parse(readFileSync(bf, "utf8")) as BlocksFile;
    } catch (err) {
      res.errors.push(`${bfRel}: invalid JSON: ${(err as Error).message}`);
      continue;
    }
    for (const name of Object.keys(blocks).sort()) {
      const block = blocks[name]!;
      const id = `${dirRel}/${name}`;
      if (!/^[a-z0-9][a-z0-9._-]*$/i.test(name)) {
        res.errors.push(`${bfRel}: invalid block name "${name}"`);
        continue;
      }
      if (!Array.isArray(block.tabs) || block.tabs.length === 0) {
        res.errors.push(`${bfRel}#${name}: no tabs`);
        continue;
      }
      const titles = new Set<string>();
      const tabs: NonNullable<ReturnType<typeof resolveTab>>[] = [];
      for (const t of block.tabs) {
        if (titles.has(t.title))
          res.errors.push(`${bfRel}#${name}: duplicate tab "${t.title}"`);
        titles.add(t.title);
        const r = resolveTab(dirAbs, dirRel, t, `${bfRel}#${name}`, res.errors);
        if (r) tabs.push(r);
      }
      if (tabs.length !== block.tabs.length) continue;
      if (block.runnable) {
        const missing = tabs.filter((t) => t.output === undefined);
        if (missing.length)
          res.notes.push(
            `${id}: no recorded output for ${missing.map((t) => t.title).join(", ")} (no Run button there)`,
          );
        res.outputsEmbedded += tabs.length - missing.length;
      }
      const snippetRel = toPosix(
        path.relative(repoRoot, path.join(snippetsRoot, `${id}.mdx`)),
      );
      res.files.set(
        snippetRel,
        renderSnippet({ id, source: bfRel, block, tabs }),
      );
      res.index[id] = {
        snippet: `/${toPosix(path.relative(docsRoot, path.join(snippetsRoot, `${id}.mdx`)))}`,
        blocks: bfRel,
        runnable: block.runnable,
        ...(block.runner ? { runner: block.runner } : {}),
        tabs: tabs.map((t) => ({
          title: t.title,
          ...(t.fileRel ? { file: t.fileRel } : {}),
          ...(block.tabs.find((x) => x.title === t.title)?.region
            ? { region: block.tabs.find((x) => x.title === t.title)!.region }
            : {}),
          ...(block.runnable && t.outputRel
            ? {
                output: `packages/docs-examples/${t.outputRel}`,
                outputSha256: createHash("sha256")
                  .update(t.output!)
                  .digest("hex"),
              }
            : {}),
        })),
      };
    }
  }
  for (const rel of DATA_FILES) {
    const abs = path.join(examplesRoot, rel);
    if (!existsSync(abs)) {
      res.errors.push(`cannot read "packages/docs-examples/${rel}"`);
      continue;
    }
    res.files.set(
      toPosix(path.relative(repoRoot, path.join(snippetsRoot, rel))),
      readFileSync(abs, "utf8"),
    );
  }
  const indexRel = toPosix(
    path.relative(repoRoot, path.join(snippetsRoot, "index.json")),
  );
  res.files.set(
    indexRel,
    stableJson({
      generatedBy:
        "packages/docs-tooling src/examples/build-examples.ts (do not edit)",
      blocks: res.index,
    }),
  );

  // Compare with disk.
  const onDisk = new Set<string>();
  if (existsSync(snippetsRoot)) {
    const walk = (dir: string) => {
      for (const n of readdirSync(dir)) {
        const p = path.join(dir, n);
        if (statSync(p).isDirectory()) walk(p);
        else onDisk.add(toPosix(path.relative(repoRoot, p)));
      }
    };
    walk(snippetsRoot);
  }
  for (const [rel, text] of res.files) {
    const abs = path.join(repoRoot, rel);
    if (!existsSync(abs) || readFileSync(abs, "utf8") !== text)
      res.stale.push(rel);
  }
  const extra = [...onDisk].filter((f) => !res.files.has(f)).sort();
  res.stale.push(...extra);

  if (opts.write && !opts.check && res.errors.length === 0) {
    for (const rel of res.stale) {
      const abs = path.join(repoRoot, rel);
      const text = res.files.get(rel);
      if (text === undefined) {
        rmSync(abs);
        res.removed.push(rel);
      } else {
        mkdirSync(path.dirname(abs), { recursive: true });
        writeFileSync(abs, text);
        res.written.push(rel);
      }
    }
  }
  return res;
}
