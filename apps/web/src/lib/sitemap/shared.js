const DEFAULT_LOCALE = "en";
const LOCALES = [
  "en",
  "ar",
  "de",
  "el",
  "es",
  "fi",
  "fr",
  "id",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt",
  "ru",
  "tr",
  "uk",
  "vi",
  "zh",
];

function normalizePath(routePath) {
  if (!routePath || routePath === "/") {
    return "/";
  }

  const withLeadingSlash = routePath.startsWith("/")
    ? routePath
    : `/${routePath}`;

  return withLeadingSlash.replace(/\/+$/, "") || "/";
}

function localizedPaths(routePath) {
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

function createSitemapEntry(loc, options = {}) {
  return {
    loc: normalizePath(loc),
    ...(options.lastmod ? { lastmod: options.lastmod } : {}),
    ...(options.changefreq ? { changefreq: options.changefreq } : {}),
    ...(options.priority !== undefined ? { priority: options.priority } : {}),
  };
}

function dedupeEntries(entries) {
  const seen = new Set();

  return entries.filter((entry) => {
    if (seen.has(entry.loc)) {
      return false;
    }

    seen.add(entry.loc);
    return true;
  });
}

module.exports = {
  DEFAULT_LOCALE,
  LOCALES,
  createSitemapEntry,
  dedupeEntries,
  localizedPaths,
  normalizePath,
};
