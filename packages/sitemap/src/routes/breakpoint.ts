import type { RouteGenerator } from "../types";
import { createLocalizedEntries } from "../utils";

export const breakpointRoutes: RouteGenerator = () => {
  try {
    return createLocalizedEntries("/breakpoint", {
      changeFrequency: "weekly",
      priority: 0.8,
    });
  } catch (error) {
    console.error("Failed to build breakpoint sitemap routes", error);
    return [];
  }
};
