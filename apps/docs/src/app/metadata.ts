import { config } from "@@/src/config";
import { getUrlWithoutLocale } from "@@/src/app/sources/utils";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import faviconPng from "@solana-com/ui-chrome/assets/favicon.png";
import faviconSvg from "@solana-com/ui-chrome/assets/favicon.svg";
import appleTouchIcon from "@solana-com/ui-chrome/assets/apple-touch-icon.png";
import { Page } from "fumadocs-core/source";

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

type DocPage = Page<{
  title: string;
  seoTitle?: string;
  h1?: string;
  description?: string;
}>;

export function getMdxMetadata(page: DocPage) {
  const url = getUrlWithoutLocale(page);
  const title = page.data.seoTitle || page.data.h1 || page.data.title;
  const description = page.data.description;
  const { openGraph } = getBaseMetadata(page.locale ?? "en");

  const imagePrefix = url?.startsWith("/docs")
    ? "/opengraph/developers"
    : "/opengraph";

  return {
    title,
    description,
    alternates: getAlternates(url, page.locale ?? "en"),
    openGraph: {
      ...openGraph,
      images: [imagePrefix + url],
      title,
      description,
    },
  };
}
