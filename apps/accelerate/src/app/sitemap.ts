import { MetadataRoute } from "next";
import { config } from "@@/src/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: config.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${config.siteUrl}/hong-kong`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${config.siteUrl}/hong-kong/agenda`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
