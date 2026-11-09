import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** Monorepo root (packages/docs-tooling/src/lib -> ../../../..). */
export const repoRoot = path.resolve(here, "..", "..", "..", "..");

/** The docs content root (rendered by apps/docs). */
export const docsRoot = path.join(repoRoot, "apps", "docs", "content");

/** Static assets served at /docs-assets/* by apps/docs. */
export const docsPublicAssets = path.join(
  repoRoot,
  "apps",
  "docs",
  "public",
  "docs-assets",
);

/** This package's root. */
export const toolingRoot = path.resolve(here, "..", "..");

export function toPosix(p: string) {
  return p.split(path.sep).join("/");
}
