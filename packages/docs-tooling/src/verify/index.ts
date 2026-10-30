/**
 * `docs-tooling verify`: every repo-side check in one command (the apps/docs
 * build then compiles every page).
 *
 *  1. counts        pages per collection and language (report)
 *  2. navigation    exact nav coverage (src/nav/verify-nav.ts)
 *  3. frontmatter   parses; `type` in the allowed enum
 *  4. assets        every /docs-assets/* reference exists; themed pairs
 *     + RPC Try it  every RPC method page's first <RequestExample> fence is
 *                   a request rpc-try-it.js can send (src/verify/rpc-try-it.ts)
 *  5. generators    every generator passes --check
 *
 * Exit code 1 when any check fails. `--skip-generators` shortens local runs.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { langOfFile, listPageFiles } from "../lib/content-paths.ts";
import { docsPublicAssets, docsRoot, toolingRoot } from "../lib/paths.ts";
import { verifyNav } from "../nav/verify-nav.ts";
import { scanRpcTryIt } from "./rpc-try-it.ts";

export const ALLOWED_TYPES = new Set([
  "conceptual",
  "reference",
  "tutorial",
  "guide",
]);

export const GENERATOR_CHECKS: [string, string[]][] = [
  ["examples:build --check", ["src/cli.ts", "examples", "--check"]],
  ["gen:surfpool --check", ["src/generators/surfpool-rpc.ts", "--check"]],
  ["gen:paths --check", ["src/generators/paths.ts", "--check"]],
  ["gen:concepts --check", ["src/generators/concepts.ts", "--check"]],
  ["gen:addresses --check", ["src/generators/addresses.ts", "--check"]],
  ["gen:tags --check", ["src/generators/tags.ts", "--check"]],
];

interface Check {
  name: string;
  ok: boolean;
  detail: string[];
}

function frontmatterOf(src: string): Record<string, unknown> | string {
  const m = /^---\n([\s\S]*?)\n---/.exec(src);
  if (!m) return {};
  try {
    return (YAML.parse(m[1]!) as Record<string, unknown>) ?? {};
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

/** Content-relative page files -> frontmatter and asset problems, counts. */
export function checkFrontmatterAndAssets(
  files = listPageFiles(docsRoot),
  root = docsRoot,
  assetsRoot = docsPublicAssets,
) {
  const fm: string[] = [];
  const assets: string[] = [];
  const counts = new Map<string, number>();
  const assetRe =
    /(?:src=["']|\]\(|href=["']|poster=["'])\/docs-assets(\/[^"')\s#?]+)/g;
  for (const f of files) {
    const k = `${f.split("/")[0]} / ${langOfFile(f)}`;
    counts.set(k, (counts.get(k) ?? 0) + 1);
    const src = readFileSync(path.join(root, f), "utf8");
    const data = frontmatterOf(src);
    if (typeof data === "string")
      fm.push(`${f}: frontmatter does not parse: ${data}`);
    else if (data.type !== undefined && !ALLOWED_TYPES.has(String(data.type)))
      fm.push(
        `${f}: type "${String(data.type)}" not in ${[...ALLOWED_TYPES].join("|")}`,
      );
    for (const m of src.matchAll(assetRe)) {
      let url = m[1]!;
      try {
        url = decodeURI(url);
      } catch {
        // keep
      }
      if (!existsSync(path.join(assetsRoot, url)))
        assets.push(`${f}: missing /docs-assets${m[1]}`);
      // Themed pair: X-light.svg needs X.svg and vice versa (themed-image).
      const light = /^(.*)-light(\.\w+)$/.exec(url);
      if (light && !existsSync(path.join(assetsRoot, `${light[1]}${light[2]}`)))
        assets.push(`${f}: themed pair /docs-assets${url} has no dark variant`);
    }
  }
  return { fm, assets, counts };
}

export function runVerify(opts: { generators?: boolean; json?: boolean } = {}) {
  const checks: Check[] = [];

  const { fm, assets, counts } = checkFrontmatterAndAssets();
  checks.push({
    name: "counts",
    ok: true,
    detail: [...counts].sort().map(([k, n]) => `${k}: ${n}`),
  });

  const nav = verifyNav();
  checks.push({
    name: "navigation coverage",
    ok: nav.errors.length === 0,
    detail: nav.errors,
  });

  checks.push({
    name: "frontmatter",
    ok: fm.length === 0,
    detail: fm.slice(0, 50),
  });
  checks.push({
    name: "assets",
    ok: assets.length === 0,
    detail: assets.slice(0, 50),
  });

  const tryIt = scanRpcTryIt();
  const enTryIt = ["http", "ws"]
    .map((k) => `${tryIt.counts.get(`en ${k}`) ?? 0} ${k}`)
    .join(" + ");
  checks.push({
    name: `RPC Try it (en: ${enTryIt}; ${tryIt.pages.length} pages in all locales)`,
    ok: tryIt.failures.length === 0,
    detail: [
      ...tryIt.failures.slice(0, 50),
      `translated pages without a sendable example (reported, not failing): ${tryIt.localeWarnings.length}`,
    ],
  });

  if (opts.generators !== false) {
    for (const [name, args] of GENERATOR_CHECKS) {
      const r = spawnSync("npx", ["tsx", ...args], {
        cwd: toolingRoot,
        encoding: "utf8",
      });
      const out = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim().split("\n");
      checks.push({
        name: `generator ${name}`,
        ok: r.status === 0,
        detail: out.slice(-5),
      });
    }
  }

  if (opts.json) console.log(JSON.stringify(checks, null, 2));
  else {
    console.log("\nverify:");
    for (const c of checks) {
      console.log(`  ${c.ok ? "PASS" : "FAIL"}  ${c.name}`);
      if (!c.ok || c.name === "counts")
        for (const d of c.detail) console.log(`        ${d}`);
    }
  }
  return checks.every((c) => c.ok) ? 0 : 1;
}
