import { MetadataRoute } from "next";
import { config } from "@@/src/config";
import sitemapRoutes from "./sitemap-routes.json";
export default function sitemap(): MetadataRoute.Sitemap {
  return (
    sitemapRoutes as {
      path: string;
      changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
      priority?: number;
    }[]
  ).map(({ path, changeFrequency, priority }) => ({
    url: `${config.siteUrl}${path}`,
    changeFrequency,
    priority,
  }));
}
