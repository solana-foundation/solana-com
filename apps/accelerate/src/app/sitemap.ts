import { MetadataRoute } from "next";
import { config } from "@@/src/config";
import sitemapRoutes from "./sitemap-routes.json";

type SitemapEntry = {
  path: string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
};

export default function sitemap(): MetadataRoute.Sitemap {
  return (sitemapRoutes as SitemapEntry[]).map(
    ({ path, changeFrequency, priority }) => ({
      url: `${config.siteUrl}${path}`,
      changeFrequency,
      priority,
    }),
  );
}
