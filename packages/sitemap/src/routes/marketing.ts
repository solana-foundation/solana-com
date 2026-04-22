import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "../constants";
import type { RouteGenerator } from "../types";
import {
  createLocalizedEntries,
  dedupeEntries,
  getFileLastModified,
  walkFiles,
} from "../utils";

const appLocaleRoot = path.join(
  repoRoot,
  "apps",
  "web",
  "src",
  "app",
  "[locale]",
);

function toRoutePath(filePath: string) {
  const relativeDir = path.relative(appLocaleRoot, path.dirname(filePath));
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

function getPriority(routePath: string) {
  if (routePath === "/") {
    return 1;
  }

  const depth = routePath.split("/").filter(Boolean).length;

  if (depth === 1) {
    return 0.9;
  }

  return 0.8;
}

export const marketingRoutes: RouteGenerator = () => {
  try {
    if (!fs.existsSync(appLocaleRoot)) {
      return [];
    }

    const pageFiles = walkFiles(appLocaleRoot).filter((filePath) =>
      /\/page\.(tsx|jsx|js|mdx)$/.test(filePath),
    );

    const entries = pageFiles.flatMap((filePath) => {
      const routePath = toRoutePath(filePath);

      if (!routePath) {
        return [];
      }

      return createLocalizedEntries(routePath, {
        lastModified: getFileLastModified(filePath),
        changeFrequency: "weekly",
        priority: getPriority(routePath),
      });
    });

    return dedupeEntries(entries);
  } catch (error) {
    console.error("Failed to build marketing sitemap routes", error);
    return [];
  }
};
