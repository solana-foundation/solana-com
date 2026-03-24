import { config } from "@@/src/config";
import { getUrlWithoutLocale } from "@@/src/app/sources/utils";
import { getAlternates } from "@workspace/i18n/routing";
import { createSeoResolver } from "@workspace/seo";
import { getTranslations } from "next-intl/server";

const seo = createSeoResolver({
  siteName: config.siteMetadata.title,
  siteUrl: config.siteUrl,
  defaultTitle: config.siteMetadata.title,
  titleTemplate: "%s | Solana",
  description: config.siteMetadata.description,
  author: config.siteMetadata.author,
  defaultImage: config.siteMetadata.socialShare,
  icons: {
    ico: "/favicon.ico",
    png: "/favicon.png",
    svg: "/favicon.svg",
    appleTouchIcon: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
});

export function getBaseMetadata(locale: string) {
  return seo.getBaseMetadata({ locale });
}

export async function getIndexMetadata({
  titleKey,
  descriptionKey,
  locale,
  path,
}) {
  const t = await getTranslations();
  return seo.getPageMetadata({
    locale,
    path,
    title: t(titleKey),
    description: t(descriptionKey),
    alternates: getAlternates(path, locale),
  });
}

export function getMdxMetadata(page) {
  const url = getUrlWithoutLocale(page);
  const title = page.data.seoTitle || page.data.h1 || page.data.title;
  const description = page.data.description;

  const imagePrefix = url?.startsWith("/docs")
    ? "/opengraph/developers"
    : "/opengraph";

  return seo.getPageMetadata({
    locale: page.locale,
    path: url,
    title,
    description,
    image: page.data.seoImage || `${imagePrefix}${url}`,
    canonical: page.data.canonical,
    noindex: page.data.noindex,
    alternates: getAlternates(url, page.locale),
  });
}
