import fs from "node:fs";
import path from "node:path";
import { DEFAULT_LOCALE, LOCALES, repoRoot } from "./constants";
import type { SitemapEntry } from "./types";
import { normalizePath, toAbsoluteUrl } from "./utils";

const rewritesRedirectsPath = path.join(
  repoRoot,
  "apps",
  "web",
  "rewrites-redirects.mjs",
);

function getRedirectBlockSource() {
  const fileContents = fs.readFileSync(rewritesRedirectsPath, "utf8");
  const start = fileContents.indexOf("redirects: withLocaleRedirects([");
  const end = fileContents.lastIndexOf("]),");

  if (start === -1 || end === -1 || end <= start) {
    return fileContents;
  }

  return fileContents.slice(start, end);
}

export function getRedirectSourceUrls() {
  const redirectBlock = getRedirectBlockSource();
  const matches = [...redirectBlock.matchAll(/source:\s*"([^"]+)"/g)];
  const localizedSources = new Set<string>();

  for (const match of matches) {
    const source = match[1];

    if (!source) {
      continue;
    }

    if (source.includes(":") || source.includes("(") || source.includes("*")) {
      continue;
    }

    const normalizedSource = normalizePath(source);
    localizedSources.add(toAbsoluteUrl(normalizedSource));

    if (normalizedSource === "/") {
      continue;
    }

    for (const locale of LOCALES) {
      if (locale === DEFAULT_LOCALE) {
        continue;
      }

      localizedSources.add(toAbsoluteUrl(`/${locale}${normalizedSource}`));
    }
  }

  return localizedSources;
}

export function excludeRedirectSources(entries: SitemapEntry[]) {
  const redirectSources = getRedirectSourceUrls();

  return entries.filter((entry) => !redirectSources.has(entry.url));
}
