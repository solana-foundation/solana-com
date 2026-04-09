import fs from "node:fs";
import path from "node:path";
import { DEFAULT_LOCALE, LOCALES, SITE_URL } from "./constants";
import type { SitemapEntry } from "./types";

export function normalizePath(routePath: string) {
  if (!routePath || routePath === "/") {
    return "/";
  }

  const withLeadingSlash = routePath.startsWith("/")
    ? routePath
    : `/${routePath}`;

  return withLeadingSlash.replace(/\/+$/, "") || "/";
}

export function toAbsoluteUrl(routePath: string) {
  return `${SITE_URL}${normalizePath(routePath)}`;
}

export function localizedPaths(routePath: string) {
  const normalizedPath = normalizePath(routePath);
  const localized = [normalizedPath];

  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) {
      continue;
    }

    localized.push(
      normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`,
    );
  }

  return localized;
}

export function createEntry(
  routePath: string,
  options: Omit<SitemapEntry, "url"> = {},
): SitemapEntry {
  return {
    url: toAbsoluteUrl(routePath),
    ...options,
  };
}

export function createLocalizedEntries(
  routePath: string,
  options: Omit<SitemapEntry, "url"> = {},
) {
  return localizedPaths(routePath).map((localizedPath) =>
    createEntry(localizedPath, options),
  );
}

export function dedupeEntries(entries: SitemapEntry[]) {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    if (seen.has(entry.url)) {
      return false;
    }

    seen.add(entry.url);
    return true;
  });
}

export function walkFiles(dirPath: string): string[] {
  const entries: string[] = [];

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      entries.push(...walkFiles(entryPath));
      continue;
    }

    entries.push(entryPath);
  }

  return entries;
}

export function getFileLastModified(filePath: string) {
  return fs.statSync(filePath).mtime.toISOString();
}
