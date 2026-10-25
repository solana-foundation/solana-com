/**
 * Example block manifests.
 *
 * A *block* is one or more flavour tabs, each a slice of a tested source
 * file. Blocks are declared in `packages/docs-examples/<dir>/blocks.json`,
 * next to the code they slice:
 *
 *   { "transfer": { "runnable": true, "tabs": [
 *       { "title": "Kit", "lang": "ts", "file": "kit.ts", "region": "transfer" },
 *       { "title": "Legacy", "lang": "ts", "file": "legacy.ts", "region": "transfer", "highlight": "24-30" } ] } }
 *
 * Block id = `<dir>/<name>` (dir relative to packages/docs-examples), which is
 * also the generated snippet path:
 * `apps/docs/content/snippets/examples/<id>.mdx`.
 */

export interface BlockTab {
  /** Tab label (Kit, Legacy, Rust, Python...). */
  title: string;
  /** Fence language, normalized (ts, rust, py...). */
  lang: string;
  /**
   * Source file, relative to the blocks.json directory (posix). Absent only
   * for an inline tab (`code`).
   */
  file?: string;
  /**
   * Inline code for a tab that has no tested source file. Prefer adding a
   * real file.
   */
  code?: string;
  region?: string;
  /** 1-based line ranges within the slice, e.g. "24-30" or "8,10-12". */
  highlight?: string;
  /** Explicit recorded-output file, relative to the blocks.json directory. */
  output?: string;
  /** Overrides the block's outputNote for this tab. */
  outputNote?: string;
}

export interface Block {
  /**
   * Only runnable blocks show recorded output, and only tabs that HAVE an
   * output get one (no Run button without recorded output).
   */
  runnable: boolean;
  /** In-browser runner id from run-examples.js (e.g. "generate-keypair"). */
  runner?: string;
  /** Overrides the default "Output from a local Surfpool network". */
  outputNote?: string;
  tabs: BlockTab[];
}

export type BlocksFile = Record<string, Block>;

/** Stable JSON for blocks.json / index.json (2-space, trailing newline). */
export function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}
