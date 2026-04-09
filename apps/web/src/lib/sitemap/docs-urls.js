const fs = require("fs");
const path = require("path");
const {
  createSitemapEntry,
  dedupeEntries,
  localizedPaths,
  normalizePath,
} = require("./shared");

const DOCS_CONTENT_ROOT = path.join(__dirname, "../../../../docs/content");

function walkFiles(dirPath) {
  const entries = [];

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

function toRoutePath(baseRoute, relativePath) {
  const withoutExtension = relativePath.replace(/\.mdx$/, "");
  const routeSuffix =
    withoutExtension === "index"
      ? ""
      : withoutExtension.replace(/\/index$/, "").replace(/\\/g, "/");

  return normalizePath(
    routeSuffix ? `${normalizePath(baseRoute)}/${routeSuffix}` : baseRoute,
  );
}

function getLocalizedContentEntries({ contentDir, baseRoute }) {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const entries = [];

  for (const locale of fs.readdirSync(contentDir)) {
    const localeDir = path.join(contentDir, locale);

    if (!fs.statSync(localeDir).isDirectory()) {
      continue;
    }

    for (const filePath of walkFiles(localeDir)) {
      if (!filePath.endsWith(".mdx") || filePath.endsWith("meta.json")) {
        continue;
      }

      const relativePath = path.relative(localeDir, filePath);
      const routePath = toRoutePath(baseRoute, relativePath);
      const localizedPath =
        locale === "en" ? routePath : `/${locale}${routePath}`;

      entries.push(
        createSitemapEntry(localizedPath, {
          lastmod: fs.statSync(filePath).mtime.toISOString(),
          changefreq: "weekly",
          priority: routePath === baseRoute ? 0.8 : 0.7,
        }),
      );
    }
  }

  return entries;
}

function getDefaultLocaleContentEntries({ contentDir, baseRoute }) {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return walkFiles(contentDir)
    .filter((filePath) => filePath.endsWith(".mdx"))
    .map((filePath) => {
      const relativePath = path.relative(contentDir, filePath);
      const routePath = toRoutePath(baseRoute, relativePath);

      return createSitemapEntry(routePath, {
        lastmod: fs.statSync(filePath).mtime.toISOString(),
        changefreq: "weekly",
        priority: routePath === baseRoute ? 0.8 : 0.7,
      });
    });
}

function getDocsUrls() {
  const rootEntries = [
    ...localizedPaths("/developers").map((loc) =>
      createSitemapEntry(loc, {
        changefreq: "weekly",
        priority: loc === "/developers" ? 0.8 : 0.7,
      }),
    ),
    ...localizedPaths("/learn").map((loc) =>
      createSitemapEntry(loc, {
        changefreq: "weekly",
        priority: loc === "/learn" ? 0.8 : 0.7,
      }),
    ),
    ...localizedPaths("/developers/cookbook").map((loc) =>
      createSitemapEntry(loc, {
        changefreq: "weekly",
        priority: loc === "/developers/cookbook" ? 0.8 : 0.7,
      }),
    ),
    ...localizedPaths("/developers/guides").map((loc) =>
      createSitemapEntry(loc, {
        changefreq: "weekly",
        priority: loc === "/developers/guides" ? 0.8 : 0.7,
      }),
    ),
  ];

  return dedupeEntries([
    ...rootEntries,
    ...getLocalizedContentEntries({
      contentDir: path.join(DOCS_CONTENT_ROOT, "docs"),
      baseRoute: "/docs",
    }),
    ...getLocalizedContentEntries({
      contentDir: path.join(DOCS_CONTENT_ROOT, "learn"),
      baseRoute: "/learn",
    }),
    ...getDefaultLocaleContentEntries({
      contentDir: path.join(DOCS_CONTENT_ROOT, "cookbook"),
      baseRoute: "/developers/cookbook",
    }),
    ...getDefaultLocaleContentEntries({
      contentDir: path.join(DOCS_CONTENT_ROOT, "guides"),
      baseRoute: "/developers/guides",
    }),
  ]);
}

module.exports = {
  getDocsUrls,
};
