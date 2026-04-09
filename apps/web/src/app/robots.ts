import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://solana.com/sitemap.xml",
  };
}
