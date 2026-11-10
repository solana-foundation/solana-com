import type { RouteGenerator } from "../types";
import { createLocalizedEntries } from "../utils";

export const breakpointRoutes: RouteGenerator = () => {
  try {
    const options = {
      lastModified: new Date(),
      changeFrequency: "daily" as const,
    };
    return [
      ...createLocalizedEntries("/breakpoint", { ...options, priority: 1 }),
      ...createLocalizedEntries("/breakpoint/mutuals", {
        ...options,
        priority: 0.7,
      }),
      ...createLocalizedEntries("/breakpoint/mutuals/add", {
        ...options,
        priority: 0.5,
      }),
    ];
  } catch (error) {
    console.error("Failed to build breakpoint sitemap routes", error);
    return [];
  }
};
