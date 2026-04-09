const fs = require("fs");
const path = require("path");
const {
  createSitemapEntry,
  dedupeEntries,
  localizedPaths,
} = require("./shared");

const APP_LOCALE_ROOT = path.join(__dirname, "../../app/[locale]");

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

function toRoutePath(filePath) {
  const relativeDir = path.relative(APP_LOCALE_ROOT, path.dirname(filePath));
  const segments = relativeDir === "" ? [] : relativeDir.split(path.sep);

  if (
    segments.some((segment) => segment.startsWith("[") && segment.endsWith("]"))
  ) {
    return null;
  }

  const routeSegments = segments.filter(
    (segment) => !(segment.startsWith("(") && segment.endsWith(")")),
  );

  return routeSegments.length === 0 ? "/" : `/${routeSegments.join("/")}`;
}

function getPriority(routePath) {
  if (routePath === "/") {
    return 1;
  }

  const depth = routePath.split("/").filter(Boolean).length;

  if (depth === 1) {
    return 0.9;
  }

  return 0.8;
}

function getAppRouteUrls() {
  if (!fs.existsSync(APP_LOCALE_ROOT)) {
    return [];
  }

  const pageFiles = walkFiles(APP_LOCALE_ROOT).filter((filePath) =>
    /\/page\.(tsx|jsx|js|mdx)$/.test(filePath),
  );

  const entries = pageFiles.flatMap((filePath) => {
    const routePath = toRoutePath(filePath);

    if (!routePath) {
      return [];
    }

    const options = {
      lastmod: fs.statSync(filePath).mtime.toISOString(),
      changefreq: "weekly",
      priority: getPriority(routePath),
    };

    return localizedPaths(routePath).map((loc) =>
      createSitemapEntry(loc, options),
    );
  });

  return dedupeEntries(entries);
}

module.exports = {
  getAppRouteUrls,
};
