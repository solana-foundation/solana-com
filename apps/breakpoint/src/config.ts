const routePrefix = "/breakpoint";
const assetPrefix = "/breakpoint-assets";
const siteOrigin =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3005"
    : "https://solana.com";
const publicAssetDirectories = [
  "/_next/",
  "/assets/",
  "/img/",
  "/live/",
] as const;

const hasProtocol = (path: string) => /^[a-z][a-z\d+.-]*:/i.test(path);

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
  siteUrl: `${siteOrigin}${routePrefix}`,
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
    socialShare: `${siteOrigin}${routePath("/social-card.webp")}`,
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
