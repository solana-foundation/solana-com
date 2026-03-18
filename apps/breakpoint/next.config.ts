import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const assetPrefix = "/breakpoint-assets";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  assetPrefix,
  env: {
    NEXT_PUBLIC_APP_NAME: "breakpoint",
  },
  experimental: {
    externalDir: true,
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
