import { config } from "@@/src/config";
import type { Metadata } from "next";
import { defaultLocale, locales } from "@workspace/i18n/config";
import faviconSvg from "@solana-com/ui-chrome/assets/favicon.svg";
import appleTouchIcon from "@solana-com/ui-chrome/assets/apple-touch-icon.png";

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

export function getBaseMetadata(locale: string = "en"): Metadata {
  const { siteMetadata, publicUrl, siteIcon, social } = config;

  return {
    metadataBase: new URL(publicUrl),
    title: {
      default: siteMetadata.title,
      template: `%s | ${siteMetadata.title}`,
    },
    description: siteMetadata.description,
    keywords: siteMetadata.keywords,
    authors: [{ name: siteMetadata.author }],
    creator: siteMetadata.author,
    publisher: siteMetadata.title,
    openGraph: {
      type: "website",
      locale,
      url: publicUrl,
      siteName: siteMetadata.title,
      title: siteMetadata.title,
      description: siteMetadata.description,
      images: [createAccelerateSocialImage(siteMetadata.title)],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${social.twitter.name}`,
      creator: siteMetadata.author,
      title: siteMetadata.title,
      description: siteMetadata.description,
      images: [createAccelerateSocialImage(siteMetadata.title)],
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
  type = "website",
}: {
  locale?: string;
  path?: string;
  title: string;
  description: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  const canonicalUrl = getCanonicalUrl(path);

  return {
    ...getBaseMetadata(locale),
    title,
    description,
    keywords,
    alternates: getAlternates(path, locale),
    openGraph: {
      type,
      locale,
      url: canonicalUrl,
      siteName: config.siteMetadata.title,
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
