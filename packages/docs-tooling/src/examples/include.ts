/**
 * Synchronous port of the parts of `@devrelkit/remark-include-code@0.1.2`
 * that the docs use. Behaviour is kept identical to the package:
 *
 * - `#region <name>` / `#endregion` markers use `//` or `#` by fence
 *   language;
 * - every region with the same name is included, joined by a blank line;
 * - the start marker's indent is stripped from each line of that region;
 * - the end marker matches ANY `#endregion` (name ignored) and nested
 *   `#region` lines are dropped;
 * - leading/trailing blank lines are trimmed; a file without a region is
 *   included whole with trailing whitespace removed.
 *
 * Plus the docs' own `remark-web3js-specifier` rewrite: the examples package
 * installs both web3.js majors under aliases, the docs show the real name.
 */

const SLASH_LANGS = new Set([
  "ts",
  "tsx",
  "typescript",
  "js",
  "jsx",
  "javascript",
  "rust",
  "rs",
  "c",
  "cpp",
  "c++",
  "go",
  "java",
  "swift",
  "kotlin",
  "kt",
  "scala",
  "dart",
]);
const HASH_LANGS = new Set([
  "py",
  "python",
  "sh",
  "bash",
  "zsh",
  "ruby",
  "rb",
  "yaml",
  "yml",
  "toml",
  "r",
  "perl",
  "pl",
]);

export function commentTokenForLang(lang: string): "//" | "#" {
  const l = lang.toLowerCase();
  if (HASH_LANGS.has(l)) return "#";
  if (SLASH_LANGS.has(l)) return "//";
  return "//";
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class RegionNotFoundError extends Error {
  constructor(region: string, file?: string) {
    super(`region "${region}" not found${file ? ` in "${file}"` : ""}`);
    this.name = "RegionNotFoundError";
  }
}

export function sliceRegion(opts: {
  source: string;
  region: string;
  lang: string;
  file?: string;
}): string {
  const token = escapeRegex(commentTokenForLang(opts.lang));
  const startRe = new RegExp(`^\\s*${token}\\s*#region\\s+(\\S+)\\s*$`);
  const endRe = new RegExp(`^\\s*${token}\\s*#endregion\\b.*$`);
  const slices: string[] = [];
  let inRegion = false;
  let buffer: string[] = [];
  let baseIndent = 0;
  for (const line of opts.source.split(/\r?\n/)) {
    if (!inRegion) {
      const m = line.match(startRe);
      if (m && m[1] === opts.region) {
        inRegion = true;
        baseIndent = (line.match(/^[ \t]*/) ?? [""])[0].length;
        buffer = [];
      }
      continue;
    }
    if (endRe.test(line)) {
      slices.push(buffer.join("\n"));
      inRegion = false;
      continue;
    }
    if (startRe.test(line)) continue;
    buffer.push(stripIndent(line, baseIndent));
  }
  if (slices.length === 0)
    throw new RegionNotFoundError(opts.region, opts.file);
  return slices.join("\n\n").replace(/^\n+|\n+$/g, "");
}

function stripIndent(line: string, n: number) {
  let i = 0;
  while (i < n && i < line.length && (line[i] === " " || line[i] === "\t")) i++;
  return line.slice(i);
}

export type LineRange = [number, number];

/** `"24-30,33"` -> `[[24,30],[33,33]]`. Throws on malformed input. */
export function parseRanges(input: string): LineRange[] {
  const out: LineRange[] = [];
  for (const piece of input.split(",")) {
    const part = piece.trim();
    if (!part) continue;
    const dash = part.indexOf("-");
    const a = Number(dash === -1 ? part : part.slice(0, dash));
    const b = Number(dash === -1 ? part : part.slice(dash + 1));
    if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < a)
      throw new Error(`invalid highlight range: "${input}"`);
    out.push([a, b]);
  }
  return out;
}

export function formatRanges(ranges: LineRange[]): string {
  return ranges.map(([a, b]) => (a === b ? String(a) : `${a}-${b}`)).join(",");
}

const WEB3JS_SPECIFIER = /@solana\/web3\.js-(?:v3|legacy)(?![\w-])/g;

/** `@solana/web3.js-legacy` / `-v3` -> `@solana/web3.js` (remark-web3js-specifier). */
export function rewriteWeb3jsSpecifier(code: string): string {
  return code.replace(WEB3JS_SPECIFIER, "@solana/web3.js");
}

const LEGACY_IMPORT = /["']@solana\/web3\.js-legacy(?:\/[^"']*)?["']/;
const V3_IMPORT = /["']@solana\/web3\.js-v3(?:\/[^"']*)?["']/;

/**
 * Whether a tab is `@solana/web3.js` 1.x code (it gets the legacy web3.js
 * notice): its whole source file imports the `@solana/web3.js-legacy` alias
 * (checked before the alias is rewritten, so a neutral title such as
 * "Collect and merge signatures" is caught too), or its title names web3.js
 * and says "legacy" (`Web3.js (legacy)`) and the source doesn't import
 * `@solana/web3.js-v3`. A bare "legacy" is not enough: Kit and v3 tabs can be
 * about legacy transactions or messages.
 */
export function isLegacyWeb3jsTab(title: string, source: string): boolean {
  if (LEGACY_IMPORT.test(source)) return true;
  if (V3_IMPORT.test(source)) return false;
  return /\bweb3\.?js\b/i.test(title) && /\blegacy\b/i.test(title);
}
