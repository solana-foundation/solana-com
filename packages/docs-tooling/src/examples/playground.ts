/**
 * The kind of a tutorial's example folder, for "Open tutorial in Playground".
 *
 * Only program tutorials get a Playground button: gen:paths writes a
 * tutorial's `playground.mdx` block only when its folder's kind is in
 * PLAYGROUND_KINDS (Anchor/Native). Client tutorials (TypeScript) get none
 * until the playground can import them. /docs-assets/scripts/playground.js
 * points the button at Solana Playground's GitHub import
 * (`https://beta.solpg.io/github.com/<owner>/<repo>/tree/<ref>/<data-pg-open>`).
 * Code blocks and demo terminals have no Playground control.
 *
 * The kind mirrors the playground's own import pipeline (verified against the
 * deployed bundle of https://beta.solpg.io, 2026-10-24):
 * `/{githubUrl}` lists the path with the GitHub contents API, keeps only
 * .js/.json/.py/.rs/.ts files, then requires a framework:
 *   - Anchor:   no .py file, and a `lib.rs` containing `#[program]`
 *   - Native:   any .rs containing `entrypoint!`
 *   - Seahorse: any .py containing `seahorse.prelude`
 * and finally keeps only `src/**.rs`, `client/**.{js,ts}` and
 * `tests/**.{js,ts}` (Anchor/Native). Anything else fails with "Could not
 * identify framework" / "Could not convert files". So client code (TS, JS,
 * Rust binaries, Python) gets a language kind (`ts`, `js`, `rust`, `py`),
 * which has no button; add it to PLAYGROUND_KINDS once the playground can
 * import it.
 *
 * Pure apart from reading the committed example tree; deterministic.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { toPosix } from "../lib/paths.ts";

export type PlaygroundKind =
  | "anchor"
  | "native"
  | "seahorse"
  | "ts"
  | "js"
  | "rust"
  | "py"
  | "other";

/** Kinds the playground can import: the only ones that get a button. */
export const PLAYGROUND_KINDS: readonly PlaygroundKind[] = ["anchor", "native"];

/** File types the playground's GitHub import loads (its language list). */
const PG_EXTENSIONS = new Set([".js", ".json", ".py", ".rs", ".ts"]);
const SKIP_DIRS = new Set(["node_modules", "target", ".git"]);
/** Characters the playground's GitHub URL parser accepts in a path. */
export const PG_PATH = /^[\w\-/.]+$/;

function listFiles(absDir: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir).sort()) {
      const p = path.join(dir, name);
      if (statSync(p).isDirectory()) {
        if (!SKIP_DIRS.has(name)) walk(p);
      } else if (PG_EXTENSIONS.has(path.extname(name))) out.push(p);
    }
  };
  walk(absDir);
  return out;
}

/** The playground's framework detection + layout conversion, as a kind. */
export function detectProgramKind(
  files: [path: string, content: string][],
): PlaygroundKind | undefined {
  const isAnchor =
    !files.some(([p]) => p.endsWith(".py")) &&
    files.some(([p, c]) => p.endsWith("lib.rs") && c.includes("#[program]"));
  const isNative = files.some(
    ([p, c]) => p.endsWith(".rs") && c.includes("entrypoint!"),
  );
  const isSeahorse = files.some(
    ([p, c]) => p.endsWith(".py") && c.includes("seahorse.prelude"),
  );
  const kind: PlaygroundKind | undefined = isAnchor
    ? "anchor"
    : isNative
      ? "native"
      : isSeahorse
        ? "seahorse"
        : undefined;
  if (kind === "anchor" || kind === "native") {
    // convertToPlayground keeps only these; an empty result is an error.
    const kept = files.some(
      ([p]) =>
        /(^|\/)src\/.*\.rs$/.test(p) ||
        /(^|\/)(client|tests)\/.*\.(js|ts)$/.test(p),
    );
    if (!kept) return undefined;
  }
  return kind;
}

function languageKind(file: string): PlaygroundKind {
  switch (path.extname(file)) {
    case ".ts":
    case ".tsx":
      return "ts";
    case ".js":
    case ".mjs":
      return "js";
    case ".rs":
      return "rust";
    case ".py":
      return "py";
    default:
      return "other";
  }
}

const LANG_ORDER: PlaygroundKind[] = ["ts", "js", "rust", "py"];
const folderKinds = new Map<string, PlaygroundKind>();

/**
 * The kind of a whole folder (`absDir`), as the playground would import it:
 * its framework when the folder is a program, else the language most of its
 * source files are in (ties: ts, js, rust, py), else "other". Cached per
 * folder (the example tree does not change during a run).
 */
export function folderKind(absDir: string): PlaygroundKind {
  const hit = folderKinds.get(absDir);
  if (hit) return hit;
  const files = existsSync(absDir) ? listFiles(absDir) : [];
  const contents: [string, string][] = files.map((f) => [
    toPosix(path.relative(absDir, f)),
    readFileSync(f, "utf8"),
  ]);
  let kind = detectProgramKind(contents);
  if (!kind) {
    const counts = new Map<PlaygroundKind, number>();
    for (const f of files) {
      const k = languageKind(f);
      if (LANG_ORDER.includes(k)) counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    let best = 0;
    for (const k of LANG_ORDER)
      if ((counts.get(k) ?? 0) > best) {
        best = counts.get(k)!;
        kind = k;
      }
  }
  folderKinds.set(absDir, kind ?? "other");
  return kind ?? "other";
}
