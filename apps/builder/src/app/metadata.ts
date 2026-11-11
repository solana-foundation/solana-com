import type { Metadata } from "next";
import faviconSvg from "@solana-com/ui-chrome/assets/favicon.svg";
import appleTouchIcon from "@solana-com/ui-chrome/assets/apple-touch-icon.png";
import { config } from "@@/src/config";

export function getBaseMetadata(
  locale: string,
  { title, description }: { title: string; description: string },
): Metadata {
  const image = {
    url: config.socialShare,
    secureUrl: config.socialShare,
    width: 1200,
    height: 630,
    alt: title,
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
    },
    alternates: {
      canonical: config.publicUrl,
    },
  };
}
