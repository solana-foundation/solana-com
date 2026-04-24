import type { Metadata } from "next";
import faviconPng from "@solana-com/ui-chrome/assets/favicon.png";
import faviconSvg from "@solana-com/ui-chrome/assets/favicon.svg";
import appleTouchIcon from "@solana-com/ui-chrome/assets/apple-touch-icon.png";
import { locales, defaultLocale } from "@workspace/i18n/config";
import { getTranslations } from "@workspace/i18n/server";
import { config } from "@/config";

const localePath = (locale: string) =>
  locale === defaultLocale ? "" : `/${locale}`;

export async function getBaseMetadata(
  locale: string = defaultLocale,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "breakpoint.metadata" });
  const { siteUrl, siteMetadata, social } = config;

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

  const canonical = `${siteUrl}${localePath(locale)}`;
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, `${siteUrl}${localePath(l)}`]),
  );
  languages["x-default"] = siteUrl;

  return {
    metadataBase: new URL(siteUrl),
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
      images: [{ url: siteMetadata.socialShare, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${social.twitter.name}`,
      title: ogTitle,
      description: ogDescription,
      images: [siteMetadata.socialShare],
    },
    icons: [
      { url: faviconPng.src, rel: "icon", type: "image/png" },
      { url: faviconSvg, rel: "icon", type: "image/svg+xml" },
      { url: appleTouchIcon.src, rel: "apple-touch-icon", sizes: "180x180" },
    ],
  };
}
