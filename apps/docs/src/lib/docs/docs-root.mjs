/**
 * Absolute path of the docs content (apps/docs/content), from apps/docs
 * (the cwd of `next dev`, `next build` and vitest) or the repo root
 * (scripts). Other working directories (docs-tooling, which runs these
 * plugins to list a page's ids) fall back to this file's own location.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

let cached;

export function findDocsRoot() {
  if (cached) return cached;
  const fromApp = path.join(process.cwd(), "content");
  const fromRoot = path.join(process.cwd(), "apps/docs/content");
  if (existsSync(path.join(fromRoot, "docs.json"))) cached = fromRoot;
  else if (existsSync(path.join(fromApp, "docs.json"))) cached = fromApp;
  else {
    let fromHere;
    try {
      fromHere = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../../../content",
      );
    } catch {
      // Bundled without a file URL: keep the app-relative default.
    }
    cached =
      fromHere && existsSync(path.join(fromHere, "docs.json"))
        ? fromHere
        : fromApp;
  }
  return cached;
}
