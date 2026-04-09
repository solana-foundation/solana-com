import type { MetadataRoute } from "next";
import {
  accelerateRoutes,
  breakpointRoutes,
  dedupeEntries,
  docsRoutes,
  excludeRedirectSources,
  marketingRoutes,
  mediaRoutes,
  templatesRoutes,
} from "@solana-foundation/solana-com-sitemap";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routeGroups = await Promise.all([
    marketingRoutes(),
    docsRoutes(),
    mediaRoutes(),
    templatesRoutes(),
    accelerateRoutes(),
    breakpointRoutes(),
  ]);

  return excludeRedirectSources(dedupeEntries(routeGroups.flat()));
}
