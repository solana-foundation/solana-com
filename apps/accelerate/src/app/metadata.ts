import { config } from "@@/src/config";
import type { Metadata } from "next";
import faviconSvg from "@solana-com/ui-chrome/assets/favicon.svg";
import appleTouchIcon from "@solana-com/ui-chrome/assets/apple-touch-icon.png";

export function getBaseMetadata(locale: string = "en"): Metadata {
  const { siteMetadata, siteUrl, siteIcon, social } = config;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteMetadata.title,
      template: `%s | ${siteMetadata.title}`,
    },
    description: siteMetadata.description,
    keywords: siteMetadata.keywords,
    authors: [{ name: siteMetadata.author }],
    creator: siteMetadata.author,
    publisher: siteMetadata.title,
    openGraph: {
      type: "website",
      locale,
      url: siteUrl,
      siteName: siteMetadata.title,
      title: siteMetadata.title,
      description: siteMetadata.description,
      images: [
        {
          url: siteMetadata.socialShare,
          width: 1200,
          height: 630,
          alt: siteMetadata.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${social.twitter.name}`,
      creator: siteMetadata.author,
      title: siteMetadata.title,
      description: siteMetadata.description,
      images: [siteMetadata.socialShare],
    },
    icons: {
      icon: [
        { url: siteIcon, type: "image/png" },
        { url: faviconSvg, type: "image/svg+xml" },
      ],
      shortcut: siteIcon,
      apple: appleTouchIcon.src,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: siteUrl,
    },
    other: {
      language: locale,
    },
  };
}
