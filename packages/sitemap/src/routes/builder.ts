import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "../constants";
import type { RouteGenerator, SitemapEntry } from "../types";
import { createEntry, dedupeEntries, getFileLastModified } from "../utils";

type BuilderSitemapRoute = {
  path: string;
  changeFrequency?: SitemapEntry["changeFrequency"];
  priority?: number;
};

const builderRoutesPath = path.join(
  repoRoot,
  "apps",
  "builder",
  "src",
  "app",
  "sitemap-routes.json",
);

// English only: the builder app has no translated copy yet, so its localized
// URLs render English and canonicalize to /builder. Switch to
// createLocalizedEntries once the app is in the Lingo scopes.
export const builderRoutes: RouteGenerator = () => {
  try {
    const routeFileLastModified = getFileLastModified(builderRoutesPath);
    const routes = JSON.parse(
      fs.readFileSync(builderRoutesPath, "utf8"),
    ) as BuilderSitemapRoute[];

    return dedupeEntries(
      routes.map((route) =>
        createEntry(`/builder${route.path || ""}`, {
          lastModified: routeFileLastModified,
          changeFrequency: route.changeFrequency,
          priority: route.priority,
        }),
      ),
    );
  } catch (error) {
    console.error("Failed to build builder sitemap routes", error);
    return [];
  }
};
