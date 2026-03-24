import { createSeoResolver } from "@workspace/seo";
import { config } from "@/lib/config";

export const mediaSeo = createSeoResolver({
  siteName: config.siteMetadata.title,
  siteUrl: config.publicUrl,
  defaultTitle: config.siteMetadata.title,
  titleTemplate: `%s | ${config.siteMetadata.title}`,
  description: config.siteMetadata.shortDescription,
  author: config.siteMetadata.author,
  twitterHandle: config.social.twitter.name,
  defaultImage: {
    url: config.siteMetadata.socialShare,
    width: 1200,
    height: 630,
    alt: config.siteMetadata.title,
  },
  keywords: config.siteMetadata.keywords,
  manifest: "/site.webmanifest",
  icons: {
    ico: "/favicon.ico",
    png: config.siteIcon,
    svg: "/favicon.svg",
    appleTouchIcon: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
});
