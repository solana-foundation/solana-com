import { config } from "@@/src/config";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import faviconPng from "@solana-com/ui-chrome/assets/favicon.png";
import faviconSvg from "@solana-com/ui-chrome/assets/favicon.svg";
import appleTouchIcon from "@solana-com/ui-chrome/assets/apple-touch-icon.png";
import { createDefaultSocialImage } from "@solana-com/ui-chrome/social-image";

export function getBaseMetadata(locale: string) {
  const { siteMetadata, publicUrl } = config;
  return {
    other: {
      language: locale,
    },
    title: {
      template: "%s | Solana",
      default: siteMetadata.title,
    },
    description: siteMetadata.description,
    openGraph: {
      type: "website",
      images: [createDefaultSocialImage(siteMetadata.title)],
      locale,
    },
    twitter: {
      card: "summary_large_image",
      creator: siteMetadata.author,
      images: [createDefaultSocialImage(siteMetadata.title)],
    },
    robots: "index, follow",
    manifest: "/site.webmanifest",
    metadataBase: new URL(publicUrl),
    icons: [
      {
        url: faviconPng.src,
        rel: "icon",
        type: "image/png",
      },
      {
        url: faviconSvg,
        rel: "icon",
        type: "image/svg+xml",
      },
      {
        url: appleTouchIcon.src,
        rel: "apple-touch-icon",
        sizes: "180x180",
      },
    ],
  };
}

/**
 * The docs root layout's metadata (the /developers landing, the docs and
 * their 404): the site's, plus the Is Agentic site type
 * (https://is-agentic.com/docs#declare-site-type), a documentation site.
 */
export function getDocsBaseMetadata(locale: string) {
  const base = getBaseMetadata(locale);
  return {
    ...base,
    other: { ...base.other, "is-agentic-site-type": "content" },
  };
}

export async function getIndexMetadata({
  titleKey,
  descriptionKey,
  locale,
  path,
}: {
  titleKey: string;
  descriptionKey: string;
  locale: string;
  path: string;
}) {
  const t = await getTranslations();
  return {
    title: t(titleKey),
    description: t(descriptionKey),
    alternates: getAlternates(path, locale),
  };
}
