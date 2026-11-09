/**
 * "Open tutorial in Playground" and "Run in Playground": which tutorials get
 * a Playground block, and what it opens.
 *
 * A tutorial has at most one Playground entry point: the block gen:paths
 * writes as its `playground.mdx`, for the top of its intro page. Code
 * blocks, demo terminals, the stepper and step pages have no Playground
 * control. Both kinds open the new Solana Playground at `CONFIG.origin` in
 * playground.js (`playgroundOrigin`). The block is one of two kinds, from the
 * tutorial's example folder:
 *
 * - Program tutorials (Anchor/Native, PLAYGROUND_KINDS): "Open tutorial in
 *   Playground" imports the folder from GitHub.
 *   /docs-assets/scripts/playground.js points the button at
 *   `<origin>/github/<owner>/<repo>/tree/<ref>/<data-pg-open>` (GitHub's own
 *   path after `/github/`; the old `beta.solpg.io/github.com/…` form is a 404
 *   there). Off for now (PLAYGROUND_PROGRAMS): the imported programs don't
 *   build in Playground.
 * - TypeScript tutorials whose folder has a `playground.ts`
 *   (PLAYGROUND_RUN_FILE): "Run in Playground" opens that one file with a
 *   link (`<origin>/open#v=1&name=…&title=…&from=…&sol=…&code=…`, its
 *   docs/open-in-playground-link.md). The file must follow the rules of
 *   `playgroundScriptProblems` (only PLAYGROUND_PACKAGES, no relative or
 *   Node.js imports, no `process`, none of PLAYGROUND_BLOCKED_WORDS even in
 *   a comment, at most 100 KiB).
 *
 * The program kind mirrors Playground's own GitHub import (client-v2
 * `utils/github.ts` and `frameworks/`, solana-playground master 58bed70e,
 * 2026-11-10): `/github/{path}` lists the repository at the ref with one Git
 * Trees API request, keeps the folder's .js/.json/.py/.rs/.ts files, then
 * picks a framework:
 *   - Anchor:   a `lib.rs` containing `#[program]`, and no .py file
 *               containing `seahorse.prelude`
 *   - Native:   any .rs containing `entrypoint!`
 *   - Seahorse: any .py containing `seahorse.prelude`
 * and keeps only `src/**.rs`, `client/**.{js,ts}` and `tests/**.{js,ts}`
 * (Anchor/Native: no Cargo.toml, Anchor.toml or Rust tests). A folder with
 * no program opens as a TypeScript project instead; the docs give
 * TypeScript tutorials the Run link, so client code (TS, JS, Rust binaries,
 * Python) gets a language kind (`ts`, `js`, `rust`, `py`), and a `ts` folder
 * gets the Run block when it has a `playground.ts`.
 *
 * Pure apart from reading the committed example tree and playground.js;
 * deterministic.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { isBuiltin } from "node:module";
import path from "node:path";
import ts from "typescript";
import { docsPublicAssets, toPosix } from "../lib/paths.ts";

export type PlaygroundKind =
  | "anchor"
  | "native"
  | "seahorse"
  | "ts"
  | "js"
  | "rust"
  | "py"
  | "other";

/** Kinds Playground's GitHub import opens: "Open tutorial in Playground". */
export const PLAYGROUND_KINDS: readonly PlaygroundKind[] = ["anchor", "native"];

/**
 * Whether program tutorials (PLAYGROUND_KINDS) get "Open tutorial in
 * Playground". Off: Playground's hosted build server compiles every program
 * against its own manifest, anchor-lang 0.29.0 and solana-program 1.16.24
 * (it never reads the folder's Cargo.toml; its Anchor 1.1.2 template is only
 * on the server's /unstable routes, which no hosted server serves), and the
 * docs' programs use Anchor 1.x, whose `CpiContext::new` takes the program
 * id where 0.29 takes an `AccountInfo`. So `programs/build-first-program`
 * fails to build there (E0308 in initialize.rs, tested 2026-11-10). While off, gen:paths writes
 * no block for a program tutorial and no page may hand-write one
 * (playground.test.ts checks both). To turn it on once the build server
 * builds Anchor 1.x: open each program folder at `<origin>/github/…`, build,
 * deploy and call it on devnet, set this to true, run gen:paths, and add the
 * hand-written buttons back (AUTHORING.md, "Open tutorial in Playground").
 */
export const PLAYGROUND_PROGRAMS = false;

/** File types Playground's GitHub import loads (its language list). */
const PG_EXTENSIONS = new Set([".js", ".json", ".py", ".rs", ".ts"]);
const SKIP_DIRS = new Set(["node_modules", "target", ".git"]);
/** Characters Playground's GitHub URL parser accepts in a path. */
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

/** Playground's framework detection + layout conversion, as a kind. */
export function detectProgramKind(
  files: [path: string, content: string][],
): PlaygroundKind | undefined {
  const isSeahorse = files.some(
    ([p, c]) => p.endsWith(".py") && c.includes("seahorse.prelude"),
  );
  const isAnchor =
    !isSeahorse &&
    files.some(([p, c]) => p.endsWith("lib.rs") && c.includes("#[program]"));
  const isNative = files.some(
    ([p, c]) => p.endsWith(".rs") && c.includes("entrypoint!"),
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
 * The kind of a whole folder (`absDir`), as Playground would import it:
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

// ---------------------------------------------------------------------------
// "Run in Playground": one TypeScript file, opened from a link
// ---------------------------------------------------------------------------

/** A TypeScript tutorial's single-file Playground version, in its folder. */
export const PLAYGROUND_RUN_FILE = "playground.ts";

/**
 * What a linked file may import: the packages the new Playground loads
 * (`supported-packages.json` plus `client-v2/supported-packages.json` in
 * solana-playground, master 58bed70e, 2026-11-09). A file that imports
 * anything else shows which package Playground can't load, and nothing runs.
 * `@solana-program/token` (the Token Program client) is not on it.
 *
 * Playground loads its own versions, not docs-examples' (client-v2/package.json
 * at the same commit: @solana/kit 8.6.0, @solana/kit-plugin-rpc and
 * @solana/kit-plugin-signer 0.23.0, @solana-program/token-2022 0.20.0,
 * @solana-program/system 0.16.0; docs-examples has kit 8.4.0, the plugins
 * 0.19.0, token-2022 0.19.0 and system 0.15.0). A playground.ts's Surfpool
 * test checks its behaviour and SOL budget on docs-examples' versions only,
 * so when either side changes these packages, run the file in Playground
 * again.
 */
export const PLAYGROUND_PACKAGES: readonly string[] = [
  "@solana/kit",
  "@solana/kit-plugin-rpc",
  "@solana/kit-plugin-signer",
  "@solana-program/system",
  "@solana-program/token-2022",
  "@clockwork-xyz/sdk",
  "@coral-xyz/anchor",
  "@metaplex-foundation/js",
  "@metaplex-foundation/mpl-bubblegum",
  "@metaplex-foundation/mpl-token-metadata",
  "@project-serum/anchor",
  "@solana/buffer-layout",
  "@solana/spl-account-compression",
  "@solana/spl-token",
  "@solana/spl-token-metadata",
  "@solana/web3.js",
  "assert",
  "bn.js",
  "borsh",
  "buffer",
  "mocha",
];

/**
 * Words Playground refuses anywhere in a file, comments and strings
 * included: before a run it checks the code (minus its import lines) with
 * `code.includes(word)` and stops with "'top' is not allowed", so "stop",
 * "desktop" or "allocation" count too (BLACKLISTED_GLOBALS in
 * client-v2/src/utils/js-runtime/js-runtime.ts, master 58bed70e).
 */
export const PLAYGROUND_BLOCKED_WORDS: readonly string[] = [
  "window",
  "globalThis",
  "document",
  "location",
  "top",
  "chrome",
];

/** Largest file a link may carry, inflated (Playground's own limit). */
export const PLAYGROUND_MAX_BYTES = 100 * 1024;

/**
 * Devnet SOL a run needs, the link's `sol`: when the Playground wallet holds
 * less, Run asks the reader to fund it first. 0.02 SOL is what solana.com's
 * devnet faucet gives a new wallet; the test of each playground.ts funds its
 * wallet with exactly this much, so a file that needs more fails there.
 */
export const PLAYGROUND_SOL = "0.02";

/**
 * The site the link's `from` page is on: Playground links back to it ("Back
 * to the docs") and ignores any page that isn't https on solana.com.
 */
export const PLAYGROUND_FROM_SITE = "https://solana.com";

/** The script whose `CONFIG.origin` is the new Playground's origin. */
export const PLAYGROUND_SCRIPT = path.join(
  docsPublicAssets,
  "scripts",
  "playground.js",
);

/**
 * The new Playground's origin, read from `CONFIG.origin` in playground.js:
 * the one place it is set, for both kinds of button. playground.js applies
 * it to links in the browser; gen:paths writes it into the generated Run
 * href so the link also works without JavaScript (change it there, then run
 * gen:paths).
 */
export function playgroundOrigin(script = PLAYGROUND_SCRIPT): string {
  const m = /^\s*origin:\s*"(https:\/\/[a-z0-9.-]+)",?\s*$/m.exec(
    readFileSync(script, "utf8"),
  );
  if (!m)
    throw new Error(
      `${script}: CONFIG.origin must be "https://<host>" on a line of its own`,
    );
  return m[1]!;
}

/**
 * Why a file can't run from a Playground link (empty when it can): it is
 * one file, so no relative imports; it runs in the browser, so no Node.js
 * modules and no `process`; it imports only PLAYGROUND_PACKAGES; it has none
 * of PLAYGROUND_BLOCKED_WORDS, not even in a comment; and it fits in a link
 * (PLAYGROUND_MAX_BYTES).
 */
export function playgroundScriptProblems(code: string): string[] {
  const out: string[] = [];
  const bytes = Buffer.byteLength(code, "utf8");
  if (!code.trim()) out.push("is empty");
  if (bytes > PLAYGROUND_MAX_BYTES)
    out.push(
      `is ${bytes} bytes; a Playground link carries at most ${PLAYGROUND_MAX_BYTES}`,
    );
  for (const { fileName: spec } of ts.preProcessFile(code, true, true)
    .importedFiles) {
    if (PLAYGROUND_PACKAGES.includes(spec)) continue;
    if (spec.startsWith(".") || spec.startsWith("/"))
      out.push(`imports "${spec}": Playground runs one file`);
    else if (spec.startsWith("node:") || isBuiltin(spec))
      out.push(`imports the Node.js module "${spec}"`);
    else
      out.push(
        `imports "${spec}", which Playground can't load (PLAYGROUND_PACKAGES)`,
      );
  }
  const lines = code.split("\n");
  for (const word of PLAYGROUND_BLOCKED_WORDS) {
    const at = lines.flatMap((l, i) => (l.includes(word) ? [i + 1] : []));
    if (at.length)
      out.push(
        `contains "${word}" (line ${at.join(", ")}), which Playground refuses anywhere in a file, comments included`,
      );
  }
  const file = ts.createSourceFile(
    PLAYGROUND_RUN_FILE,
    code,
    ts.ScriptTarget.Latest,
    true,
  );
  const visit = (n: ts.Node): void => {
    if (ts.isIdentifier(n) && n.text === "process") {
      const p = n.parent;
      const isName =
        (ts.isPropertyAccessExpression(p) && p.name === n) ||
        (ts.isPropertyAssignment(p) && p.name === n);
      if (!isName) {
        const { line } = file.getLineAndCharacterOfPosition(n.getStart());
        out.push(`uses process (line ${line + 1}), which browsers don't have`);
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(file);
  return out;
}

/**
 * A link's `code`: the file's UTF-8 bytes as raw DEFLATE (RFC 1951),
 * base64url without padding. The blocks are stored (BTYPE 00), not
 * compressed: stored blocks are the same bytes on every machine, so
 * `gen:paths --check` is stable, while zlib builds compress the same file
 * to different bytes (Node's bundled zlib and zlib 1.3.1 do). The cost is
 * size, about 4/3 of the file's.
 */
export function encodePlaygroundCode(code: string): string {
  const data = Buffer.from(code, "utf8");
  const parts: Buffer[] = [];
  const MAX = 0xffff;
  for (let at = 0; ; at += MAX) {
    const chunk = data.subarray(at, at + MAX);
    const last = at + MAX >= data.length;
    const head = Buffer.alloc(5);
    head[0] = last ? 1 : 0; // BFINAL, BTYPE 00, padded to the byte
    head.writeUInt16LE(chunk.length, 1);
    head.writeUInt16LE(~chunk.length & 0xffff, 3);
    parts.push(head, chunk);
    if (last) break;
  }
  return Buffer.concat(parts).toString("base64url");
}

/** What a "Run in Playground" link carries, before encoding. */
export interface PlaygroundRunLink {
  /** File name in Playground: letters, digits, `.`, `_`, `-`, then `.ts`. */
  name: string;
  /** Shown above the code as "From solana.com: <title>". */
  title: string;
  /** The docs page, on PLAYGROUND_FROM_SITE. */
  from: string;
  /** The file's text. */
  code: string;
}

/** The link that opens one file in the new Playground at `origin`. */
export function playgroundRunHref(origin: string, link: PlaygroundRunLink) {
  const params = new URLSearchParams({
    v: "1",
    name: link.name,
    title: link.title,
    from: link.from,
    sol: PLAYGROUND_SOL,
    code: encodePlaygroundCode(link.code),
  });
  return `${origin}/open#${params}`;
}
