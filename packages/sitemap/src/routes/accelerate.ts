import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "../constants";
import type { RouteGenerator } from "../types";
import {
  createLocalizedEntries,
  dedupeEntries,
  getFileLastModified,
} from "../utils";

type AccelerateSitemapRoute = {
  path: string;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

const accelerateRoutesPath = path.join(
  repoRoot,
  "apps",
  "accelerate",
  "src",
  "app",
  "sitemap-routes.json",
);

export const accelerateRoutes: RouteGenerator = () => {
  try {
    const routeFileLastModified = getFileLastModified(accelerateRoutesPath);
    const routes = JSON.parse(
      fs.readFileSync(accelerateRoutesPath, "utf8"),
    ) as AccelerateSitemapRoute[];

    return dedupeEntries(
      routes.flatMap((route) =>
        createLocalizedEntries(`/accelerate${route.path || ""}`, {
          lastModified: routeFileLastModified,
          changeFrequency: route.changeFrequency,
          priority: route.priority,
        }),
      ),
    );
  } catch (error) {
    console.error("Failed to build accelerate sitemap routes", error);
    return [];
  }
};
