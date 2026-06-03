import type { RouteGenerator } from "../types";
import { createLocalizedEntries } from "../utils";

export const breakpointRoutes: RouteGenerator = () => {
  try {
    return createLocalizedEntries("/breakpoint", {
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });
  } catch (error) {
    console.error("Failed to build breakpoint sitemap routes", error);
    return [];
  }
};
