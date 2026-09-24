import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const assetPrefix = "/templates-assets";

// The docs search bar calls the origin-relative /api/ask/*, which only the web
// app implements. Behind solana.com that resolves for free, but this app is
// also runnable on its own origin (local port, per-project preview), where the
// call would 404 and search would read as permanently unavailable. Forward it
// when a web origin is known; in proxy-only production leave the var unset and
// the same-origin call stands.
const WEB_APP_URL =
  process.env.NEXT_PUBLIC_WEB_APP_URL ??
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");

const askProxyRewrites = WEB_APP_URL
  ? [
      {
        source: "/api/ask/:path*",
        destination: `${WEB_APP_URL}/api/ask/:path*`,
      },
    ]
  : [];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  assetPrefix,

  env: {
    NEXT_PUBLIC_APP_NAME: "templates",
  },

  webpack(config) {
    // Handle inline SVGs
    config.module.rules.push({
      test: /\.inline\.svg$/,
      use: {
        loader: "@svgr/webpack",
        options: {
          svgoConfig: {
            plugins: [
              {
                name: "preset-default",
                params: {
                  overrides: {
                    removeViewBox: false,
                    removeUselessStrokeAndFill: false,
                    cleanupIds: false,
                  },
                },
              },
            ],
          },
        },
      },
    });

    // Handle regular SVGs as assets
    config.module.rules.push({
      test: /(?<!inline)\.svg$/,
      type: "asset",
    });

    return config;
  },

  images: {
    path: `${assetPrefix}/_next/image`,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/solana-foundation/templates/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },

  experimental: {
    // Allow importing/transpiling code from workspace packages
    externalDir: true,
  },

  compiler: {
    styledComponents: true,
  },

  async rewrites() {
    return {
      beforeFiles: [
        ...askProxyRewrites,
        {
          source: "/templates-assets/_next/:path+",
          destination: "/_next/:path+",
        },
      ],
    };
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withSentryConfig(withNextIntl(nextConfig), {
  org: "solana-fndn",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  sourcemaps: {
    disable:
      process.env.VERCEL_ENV !== "production" || !process.env.SENTRY_AUTH_TOKEN,
  },
});
