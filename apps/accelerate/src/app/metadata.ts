import { config } from "@@/src/config";
import type { Metadata } from "next";
import { defaultLocale, locales } from "@workspace/i18n/config";
import faviconSvg from "@solana-com/ui-chrome/assets/favicon.svg";
import appleTouchIcon from "@solana-com/ui-chrome/assets/apple-touch-icon.png";

type MetadataOverrides = {
  title?: string;
  description?: string;
  keywords?: string[];
};

function createAccelerateSocialImage(alt: string) {
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

export function getBaseMetadata(
  locale: string = "en",
  overrides: MetadataOverrides = {},
): Metadata {
  const { siteMetadata, publicUrl, siteIcon, social } = config;
  const title = overrides.title ?? siteMetadata.title;
  const description = overrides.description ?? siteMetadata.description;
  const keywords = overrides.keywords ?? siteMetadata.keywords;

  return {
    metadataBase: new URL(publicUrl),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords,
    authors: [{ name: siteMetadata.author }],
    creator: siteMetadata.author,
    publisher: title,
    openGraph: {
      type: "website",
      locale,
      url: publicUrl,
      siteName: title,
      title,
      description,
      images: [createAccelerateSocialImage(title)],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${social.twitter.name}`,
      creator: siteMetadata.author,
      title,
      description,
      images: [createAccelerateSocialImage(title)],
    },
    icons: {
      icon: [
        { url: siteIcon, type: "image/png" },
        { url: faviconSvg, type: "image/svg+xml" },
      ],
      shortcut: siteIcon,
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
    alternates: {
      canonical: publicUrl,
    },
    other: {
      language: locale,
    },
  };
}

function getCanonicalUrl(path: string = "/") {
  const siteUrl = new URL(config.publicUrl);
  const normalizedPath = path === "/" ? "" : path;

  return `${siteUrl.origin}${siteUrl.pathname}${normalizedPath}`;
}

function getLocalizedUrl(path: string, locale: string) {
  const siteUrl = new URL(config.publicUrl);
  const normalizedPath = path === "/" ? "" : path;

  return `${siteUrl.origin}/${locale}${siteUrl.pathname}${normalizedPath}`;
}

function getAlternates(path: string, locale: string): Metadata["alternates"] {
  const localizedPath = path === "/" ? "" : path;

  const languages = Object.fromEntries(
    locales.map((value) => [
      value,
      value === defaultLocale
        ? getCanonicalUrl(localizedPath)
        : getLocalizedUrl(localizedPath, value),
    ]),
  );

  return {
    canonical:
      locale === defaultLocale
        ? getCanonicalUrl(localizedPath)
        : getLocalizedUrl(localizedPath, locale),
    languages: {
      "x-default": getCanonicalUrl(localizedPath),
      ...languages,
    },
  };
}

export function getPageMetadata({
  locale = "en",
  path = "/",
  title,
  description,
  keywords,
  siteTitle,
  siteDescription,
  siteKeywords,
  type = "website",
}: {
  locale?: string;
  path?: string;
  title: string;
  description: string;
  keywords?: string[];
  siteTitle?: string;
  siteDescription?: string;
  siteKeywords?: string[];
  type?: "website" | "article";
}): Metadata {
  const canonicalUrl = getCanonicalUrl(path);
  const resolvedSiteTitle = siteTitle ?? config.siteMetadata.title;

  return {
    ...getBaseMetadata(locale, {
      title: siteTitle,
      description: siteDescription,
      keywords: siteKeywords,
    }),
    title,
    description,
    keywords,
    alternates: getAlternates(path, locale),
    openGraph: {
      type,
      locale,
      url: canonicalUrl,
      siteName: resolvedSiteTitle,
      title,
      description,
      images: [createAccelerateSocialImage(title)],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${config.social.twitter.name}`,
      creator: config.siteMetadata.author,
      title,
      description,
      images: [createAccelerateSocialImage(title)],
    },
  };
}
