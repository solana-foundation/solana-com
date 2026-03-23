import type { Metadata } from "next";
import faviconSvg from "@solana-com/ui-chrome/assets/favicon.svg";
import appleTouchIcon from "@solana-com/ui-chrome/assets/apple-touch-icon.png";
import { config } from "@/config";

export function getBaseMetadata(locale = "en"): Metadata {
  const { siteMetadata, siteUrl, social } = config;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteMetadata.title,
      template: `%s | ${siteMetadata.title}`,
    },
    description: siteMetadata.description,
    keywords: siteMetadata.keywords,
    authors: [{ name: siteMetadata.author }],
    openGraph: {
      type: "website",
      locale,
      url: siteUrl,
      siteName: siteMetadata.title,
      title: siteMetadata.title,
      description: siteMetadata.description,
      images: [{ url: siteMetadata.socialShare, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${social.twitter.name}`,
      title: siteMetadata.title,
      description: siteMetadata.description,
      images: [siteMetadata.socialShare],
    },
    icons: {
      icon: [{ url: faviconSvg, type: "image/svg+xml" }],
      apple: appleTouchIcon.src,
    },
  };
}
