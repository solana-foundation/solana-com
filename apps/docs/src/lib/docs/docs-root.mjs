/**
 * Absolute path of the docs content (apps/docs/content), from apps/docs
 * (the cwd of `next dev`, `next build` and vitest) or the repo root
 * (scripts).
 */
import { existsSync } from "node:fs";
import path from "node:path";

let cached;

export function findDocsRoot() {
  if (cached) return cached;
  const fromApp = path.join(process.cwd(), "content");
  const fromRoot = path.join(process.cwd(), "apps/docs/content");
  cached = existsSync(path.join(fromRoot, "docs.json")) ? fromRoot : fromApp;
  return cached;
}
