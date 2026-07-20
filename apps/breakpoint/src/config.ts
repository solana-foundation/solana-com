import { defaultLocale } from "@workspace/i18n/config";
import { DEFAULT_SOCIAL_IMAGE_URL } from "@solana-com/ui-chrome/social-image";

const routePrefix = "/breakpoint";
const assetPrefix = "/breakpoint-assets";
const PUBLIC_SITE_ORIGIN = "https://solana.com";
const publicAssetDirectories = [
  "/_next/",
  "/assets/",
  "/img/",
  "/live/",
] as const;

const hasProtocol = (path: string) => /^[a-z][a-z\d+.-]*:/i.test(path);

function getSiteOrigin() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3005";
  }

  if (process.env.VERCEL_ENV !== "production" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return PUBLIC_SITE_ORIGIN;
}

const siteOrigin = getSiteOrigin();

export const routePath = (path: string) => {
  if (
    path.startsWith("#") ||
    path.startsWith("?") ||
    path.startsWith("//") ||
    hasProtocol(path)
  ) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (
    normalizedPath === routePrefix ||
    normalizedPath.startsWith(`${routePrefix}/`) ||
    normalizedPath.startsWith(`${assetPrefix}/`)
  ) {
    return normalizedPath;
  }

  return normalizedPath === "/"
    ? routePrefix
    : `${routePrefix}${normalizedPath}`;
};

export const localizedRoutePath = (
  locale: string = defaultLocale,
  path: string = "/",
) =>
  locale === defaultLocale ? routePath(path) : `/${locale}${routePath(path)}`;

export const localizedRouteUrl = (
  locale: string = defaultLocale,
  path: string = "/",
) => `${siteOrigin}${localizedRoutePath(locale, path)}`;

export const publicLocalizedRouteUrl = (
  locale: string = defaultLocale,
  path: string = "/",
) => `${PUBLIC_SITE_ORIGIN}${localizedRoutePath(locale, path)}`;

export function publicAssetPath(path: string) {
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.startsWith(`${assetPrefix}/`) ||
    hasProtocol(path)
  ) {
    return path;
  }

  return publicAssetDirectories.some((directory) => path.startsWith(directory))
    ? `${assetPrefix}${path}`
    : path;
}

export const config = {
  assetPrefix,
  siteOrigin,
  publicSiteOrigin: PUBLIC_SITE_ORIGIN,
  siteUrl: localizedRouteUrl(defaultLocale),
  publicUrl: publicLocalizedRouteUrl(defaultLocale),
  siteMetadata: {
    title: "Breakpoint 2026",
    description:
      "Breakpoint 2026 is Solana's flagship gathering in London, November 15-17 at Olympia London.",
    keywords: [
      "Breakpoint",
      "Solana",
      "Solana conference",
      "London",
      "Web3 event",
    ],
    author: "Solana Foundation",
    socialShare: DEFAULT_SOCIAL_IMAGE_URL,
    googleAnalytics: {
      trackingId: "G-94WS0LRZRS",
      adWordsId: "AW-302884864",
    },
    googleTagManagerID: "GTM-TNX63HZ",
  },
  social: {
    twitter: {
      name: "solana",
    },
  },
  event: {
    name: "Breakpoint 2026",
    description:
      "Three days of product launches, ecosystem strategy, builders, capital, and culture for the Solana community.",
    startDate: "2026-11-15",
    endDate: "2026-11-17",
    venue: "Olympia London",
    city: "London",
    country: "United Kingdom",
  },
};
