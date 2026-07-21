import type { Metadata } from "next";
import faviconPng from "@solana-com/ui-chrome/assets/favicon.png";
import faviconSvg from "@solana-com/ui-chrome/assets/favicon.svg";
import appleTouchIcon from "@solana-com/ui-chrome/assets/apple-touch-icon.png";
import { locales, defaultLocale } from "@workspace/i18n/config";
import { getTranslations } from "@workspace/i18n/server";
import { config, publicLocalizedRouteUrl } from "@/config";

const socialImageAlt =
  "Breakpoint 2026 social card with the Breakpoint logo over a purple London skyline";

function createBreakpointSocialImage() {
  const url = config.siteMetadata.socialShare;

  return {
    url,
    secureUrl: url,
    width: 1200,
    height: 630,
    alt: socialImageAlt,
    type: "image/jpeg",
  };
}

type PageMetadataConfig = {
  description: string;
  path: string;
  title: string;
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
      images: [createBreakpointSocialImage()],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${social.twitter.name}`,
      title: ogTitle,
      description: ogDescription,
      images: [createBreakpointSocialImage()],
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
  { description, path, title }: PageMetadataConfig,
): Promise<Metadata> {
  const base = await getBaseMetadata(locale, path);
  const t = await getTranslations({ locale, namespace: "breakpoint.metadata" });
  const siteName = t("siteName");
  const socialTitle = `${title} | ${siteName}`;
  const openGraph = base.openGraph ?? {};
  const twitter = base.twitter ?? {};

  return {
    ...base,
    title,
    description,
    openGraph: {
      ...openGraph,
      title: socialTitle,
      description,
    },
    twitter: {
      ...twitter,
      title: socialTitle,
      description,
    },
  };
}
