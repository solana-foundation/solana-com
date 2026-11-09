/** Navigation paths and helpers shared by `nav verify`. */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { docsRoot as defaultDocsRoot } from "../lib/paths.ts";
import type { NavFile } from "./types.ts";

export interface NavPaths {
  docsRoot: string;
  navDir: string;
}

export function navPaths(docsRoot: string = defaultDocsRoot): NavPaths {
  return {
    docsRoot,
    navDir: path.join(docsRoot, "navigation"),
  };
}

/** Origins whose paths are served by the docs. */
export const SITE_ORIGINS = ["https://solana.com"];

/** Path part of an href served by this project, or undefined. */
export function internalPath(href: string): string | undefined {
  if (href.startsWith("/")) return href;
  for (const o of SITE_ORIGINS)
    if (href === o || href.startsWith(`${o}/`))
      return href.slice(o.length) || "/";
  return undefined;
}

export function readJson<T>(file: string): T | undefined {
  return existsSync(file)
    ? (JSON.parse(readFileSync(file, "utf8")) as T)
    : undefined;
}

export function readEnNav(paths: NavPaths): NavFile {
  const nav = readJson<NavFile>(path.join(paths.navDir, "en.json"));
  if (!nav) throw new Error(`${path.join(paths.navDir, "en.json")} is missing`);
  return nav;
}
