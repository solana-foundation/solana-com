import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "../constants";
import type { RouteGenerator } from "../types";
import {
  createEntry,
  createLocalizedEntries,
  dedupeEntries,
  getFileLastModified,
  normalizePath,
  walkFiles,
} from "../utils";

const docsContentRoot = path.join(repoRoot, "apps", "docs", "content");

function toRoutePath(baseRoute: string, relativePath: string) {
  const withoutExtension = relativePath.replace(/\.mdx$/, "");
  const routeSuffix =
    withoutExtension === "index"
      ? ""
      : withoutExtension.replace(/\/index$/, "").replace(/\\/g, "/");

  return normalizePath(
    routeSuffix ? `${normalizePath(baseRoute)}/${routeSuffix}` : baseRoute,
  );
}

function getLocalizedContentEntries(contentDir: string, baseRoute: string) {
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
      if (!filePath.endsWith(".mdx")) {
        continue;
      }

      const relativePath = path.relative(localeDir, filePath);
      const routePath = toRoutePath(baseRoute, relativePath);
      const localizedPath =
        locale === "en" ? routePath : `/${locale}${routePath}`;

      entries.push(
        createEntry(localizedPath, {
          lastModified: getFileLastModified(filePath),
          changeFrequency: "weekly",
          priority: routePath === baseRoute ? 0.8 : 0.7,
        }),
      );
    }
  }

  return entries;
}

function getDefaultLocaleContentEntries(contentDir: string, baseRoute: string) {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return walkFiles(contentDir)
    .filter((filePath) => filePath.endsWith(".mdx"))
    .map((filePath) => {
      const relativePath = path.relative(contentDir, filePath);
      const routePath = toRoutePath(baseRoute, relativePath);

      return createEntry(routePath, {
        lastModified: getFileLastModified(filePath),
        changeFrequency: "weekly",
        priority: routePath === baseRoute ? 0.8 : 0.7,
      });
    });
}

export const docsRoutes: RouteGenerator = () => {
  try {
    const rootEntries = [
      ...createLocalizedEntries("/developers", {
        changeFrequency: "weekly",
        priority: 0.8,
      }),
      ...createLocalizedEntries("/learn", {
        changeFrequency: "weekly",
        priority: 0.8,
      }),
      ...createLocalizedEntries("/developers/cookbook", {
        changeFrequency: "weekly",
        priority: 0.8,
      }),
      ...createLocalizedEntries("/developers/guides", {
        changeFrequency: "weekly",
        priority: 0.8,
      }),
      ...createLocalizedEntries("/developers/bootcamp", {
        changeFrequency: "weekly",
        priority: 0.8,
      }),
    ];

    return dedupeEntries([
      ...rootEntries,
      ...getLocalizedContentEntries(
        path.join(docsContentRoot, "docs"),
        "/docs",
      ),
      ...getLocalizedContentEntries(
        path.join(docsContentRoot, "learn"),
        "/learn",
      ),
      ...getDefaultLocaleContentEntries(
        path.join(docsContentRoot, "cookbook"),
        "/developers/cookbook",
      ),
      ...getDefaultLocaleContentEntries(
        path.join(docsContentRoot, "guides"),
        "/developers/guides",
      ),
      ...getLocalizedContentEntries(
        path.join(docsContentRoot, "developers-learn"),
        "/developers/bootcamp",
      ),
    ]);
  } catch (error) {
    console.error("Failed to build docs sitemap routes", error);
    return [];
  }
};
