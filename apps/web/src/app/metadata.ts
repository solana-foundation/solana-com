import { Metadata } from "next";
import { config } from "@@/src/config";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

export function getBaseMetadata(locale: string) {
  const { siteMetadata, siteUrl } = config;
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
      images: [siteMetadata.socialShare],
      locale,
    },
    twitter: {
      card: "summary_large_image",
      creator: siteMetadata.author,
    },
    robots: "index, follow",
    manifest: "/site.webmanifest",
    metadataBase: new URL(siteUrl),
    icons: [
      {
        url: "/favicon.png",
        rel: "icon",
        type: "image/png",
      },
      {
        url: "/favicon.svg",
        rel: "icon",
        type: "image/svg+xml",
      },
      {
        url: "/apple-touch-icon.png",
        rel: "apple-touch-icon",
        sizes: "180x180",
      },
    ],
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
}): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t(titleKey),
    description: t(descriptionKey),
    alternates: getAlternates(path, locale),
  };
}
