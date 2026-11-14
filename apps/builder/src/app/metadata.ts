import type { Metadata } from "next";
import faviconSvg from "@solana-com/ui-chrome/assets/favicon.svg";
import appleTouchIcon from "@solana-com/ui-chrome/assets/apple-touch-icon.png";
import { config } from "@@/src/config";

export function getBaseMetadata(
  locale: string,
  {
    title,
    description,
    imageAlt,
  }: { title: string; description: string; imageAlt: string },
): Metadata {
  const image = {
    url: config.socialShare,
    secureUrl: config.socialShare,
    width: 1200,
    height: 630,
    alt: imageAlt,
    type: "image/jpeg",
  };

  return {
    metadataBase: new URL(config.publicUrl),
    title,
    description,
    openGraph: {
      type: "website",
      locale,
      url: config.publicUrl,
      siteName: config.event.name,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${config.twitterHandle}`,
      title,
      description,
      images: [image],
    },
    icons: {
      icon: [
        { url: config.siteIcon, type: "image/png" },
        { url: faviconSvg, type: "image/svg+xml" },
      ],
      shortcut: config.siteIcon,
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
    // Every locale canonicalizes to the English URL and there is no hreflang:
    // the copy is English only, so localized URLs would be duplicates. Add
    // per-locale canonicals and `languages` once translations ship.
    alternates: {
      canonical: config.publicUrl,
    },
  };
}
