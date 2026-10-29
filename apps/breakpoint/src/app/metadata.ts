import type { Metadata } from "next";
import faviconPng from "@solana-com/ui-chrome/assets/favicon.png";
import faviconSvg from "@solana-com/ui-chrome/assets/favicon.svg";
import appleTouchIcon from "@solana-com/ui-chrome/assets/apple-touch-icon.png";
import { locales, defaultLocale } from "@workspace/i18n/config";
import { getTranslations } from "@workspace/i18n/server";
import { config, publicLocalizedRouteUrl } from "@/config";

function createBreakpointSocialImage(alt: string) {
  const url = config.siteMetadata.socialShare;

  return {
    url,
    secureUrl: url,
    width: 1200,
    height: 630,
    alt,
    type: "image/jpeg",
  };
}

type PageMetadataConfig = {
  description: string;
  path: string;
  title: string;
  /** Replaces the site card; must be 1200×630. */
  image?: { url: string; alt: string; type: string };
  /** Keeps the page out of search results; its links are still followed. */
  noindex?: boolean;
  /** Query for og:url when a share variant unfurls differently, e.g. "?with=x". */
  shareSearch?: string;
};

const getLanguageAlternates = (path: string) => {
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, publicLocalizedRouteUrl(l, path)]),
  );
  languages["x-default"] = publicLocalizedRouteUrl(defaultLocale, path);

  return languages;
};

export async function getBaseMetadata(
  locale: string = defaultLocale,
  path: string = "/",
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "breakpoint.metadata" });
  const { publicSiteOrigin, siteMetadata, social } = config;
  const socialImageAlt = t("socialImageAlt");

  const title = t("title");
  const titleTemplate = t("titleTemplate");
  const siteName = t("siteName");
  const description = t("description");
  const ogTitle = t("ogTitle");
  const ogDescription = t("ogDescription");
  const keywords = t("keywords")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const canonical = publicLocalizedRouteUrl(locale, path);
  const languages = getLanguageAlternates(path);

  return {
    metadataBase: new URL(publicSiteOrigin),
    alternates: { canonical, languages },
    title: { default: title, template: titleTemplate },
    description,
    keywords,
    authors: [{ name: siteMetadata.author }],
    robots: "index, follow",
    openGraph: {
      type: "website",
      locale,
      url: canonical,
      siteName,
      title: ogTitle,
      description: ogDescription,
      images: [createBreakpointSocialImage(socialImageAlt)],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${social.twitter.name}`,
      title: ogTitle,
      description: ogDescription,
      images: [createBreakpointSocialImage(socialImageAlt)],
    },
    icons: [
      { url: faviconPng.src, rel: "icon", type: "image/png" },
      { url: faviconSvg, rel: "icon", type: "image/svg+xml" },
      { url: appleTouchIcon.src, rel: "apple-touch-icon", sizes: "180x180" },
    ],
  };
}

export async function getPageMetadata(
  locale: string = defaultLocale,
  {
    description,
    path,
    title,
    image,
    noindex,
    shareSearch = "",
  }: PageMetadataConfig,
): Promise<Metadata> {
  const base = await getBaseMetadata(locale, path);
  const t = await getTranslations({ locale, namespace: "breakpoint.metadata" });
  const siteName = t("siteName");
  const socialTitle = `${title} | ${siteName}`;
  const openGraph = base.openGraph ?? {};
  const twitter = base.twitter ?? {};
  const images = image && [
    { ...image, secureUrl: image.url, width: 1200, height: 630 },
  ];

  return {
    ...base,
    title,
    description,
    ...(noindex && { robots: { index: false, follow: true } }),
    openGraph: {
      ...openGraph,
      url: `${publicLocalizedRouteUrl(locale, path)}${shareSearch}`,
      title: socialTitle,
      description,
      ...(images && { images }),
    },
    twitter: {
      ...twitter,
      title: socialTitle,
      description,
      ...(images && { images }),
    },
  };
}
