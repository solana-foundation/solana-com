import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { locales } from "@workspace/i18n/config";
import { createNextIntlPlugin } from "@workspace/i18n/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const assetPrefix = "/breakpoint-assets";
const localeRoutePattern = `:locale(${locales.join("|")})`;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  assetPrefix,
  env: {
    NEXT_PUBLIC_APP_NAME: "breakpoint",
  },
  experimental: {
    externalDir: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      type: "asset",
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: "/agenda",
        destination: "/schedule",
        permanent: true,
      },
      {
        source: `/${localeRoutePattern}/agenda`,
        destination: "/:locale/schedule",
        permanent: true,
      },
      {
        source: "/breakpoint/agenda",
        destination: "/breakpoint/schedule",
        permanent: true,
      },
      {
        source: `/${localeRoutePattern}/breakpoint/agenda`,
        destination: "/:locale/breakpoint/schedule",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/breakpoint-assets/_next/:path+",
          destination: "/_next/:path+",
        },
        {
          source: "/breakpoint-assets/assets/:path+",
          destination: "/assets/:path+",
        },
        {
          source: "/breakpoint-assets/img/:path+",
          destination: "/img/:path+",
        },
        {
          source: "/breakpoint-assets/live/:path+",
          destination: "/live/:path+",
        },
        {
          source: "/breakpoint",
          destination: "/",
        },
        {
          source: "/breakpoint/:path*",
          destination: "/:path*",
        },
        {
          source: "/:locale/breakpoint",
          destination: "/:locale",
        },
        {
          source: "/:locale/breakpoint/:path*",
          destination: "/:locale/:path*",
        },
      ],
    };
  },
};

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
