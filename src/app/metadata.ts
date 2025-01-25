import { config } from "@/config";
import { getUrlWithoutLocale } from "@/app/sources/utils";
import { getAlternates } from "@/i18n/routing";
import { serverTranslation } from "@/i18n/translation";

export function getBaseMetadata(locale: string) {
  const { siteMetadata, siteUrl } = config;
  return {
    other: {
      "docsearch:language": locale,
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
}) {
  const { t } = await serverTranslation(locale);
  return {
    title: t(titleKey),
    description: t(descriptionKey),
    alternates: getAlternates(path, locale),
  };
}

export function getMdxMetadata(page) {
  const url = getUrlWithoutLocale(page);
  const title = page.data.seoTitle || page.data.h1 || page.data.title;
  const description = page.data.description;
  const { openGraph } = getBaseMetadata(page.locale);

  const imagePrefix = url?.startsWith("/docs")
    ? "/opengraph/developers"
    : "/opengraph";

  return {
    title,
    description,
    alternates: getAlternates(url, page.locale),
    openGraph: {
      ...openGraph,
      images: [imagePrefix + url],
      title,
      description,
    },
  };
}
