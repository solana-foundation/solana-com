const fs = require("fs");
const path = require("path");
const { DEFAULT_LOCALE, LOCALES, normalizePath } = require("./shared");

const REWRITES_REDIRECTS_PATH = path.join(
  __dirname,
  "../../..",
  "rewrites-redirects.mjs",
);

function getRedirectBlockSource() {
  const fileContents = fs.readFileSync(REWRITES_REDIRECTS_PATH, "utf8");
  const start = fileContents.indexOf("redirects: withLocaleRedirects([");
  const end = fileContents.lastIndexOf("]),");

  if (start === -1 || end === -1 || end <= start) {
    return fileContents;
  }

  return fileContents.slice(start, end);
}

function getLiteralRedirectSources() {
  const redirectBlock = getRedirectBlockSource();
  const matches = [...redirectBlock.matchAll(/source:\s*"([^"]+)"/g)];
  const localizedSources = new Set();

  for (const [, source] of matches) {
    if (source.includes(":") || source.includes("(") || source.includes("*")) {
      continue;
    }

    const normalizedSource = normalizePath(source);
    localizedSources.add(normalizedSource);

    if (normalizedSource === "/") {
      continue;
    }

    for (const locale of LOCALES) {
      if (locale === DEFAULT_LOCALE) {
        continue;
      }

      localizedSources.add(normalizePath(`/${locale}${normalizedSource}`));
    }
  }

  return localizedSources;
}

function excludeRedirectSources(entries) {
  const redirectSources = getLiteralRedirectSources();

  return entries.filter((entry) => !redirectSources.has(entry.loc));
}

module.exports = {
  excludeRedirectSources,
  getLiteralRedirectSources,
};
