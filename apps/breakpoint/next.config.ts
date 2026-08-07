import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { locales } from "@workspace/i18n/config";
import { createNextIntlPlugin } from "@workspace/i18n/plugin";
import { APP_TOPOLOGY, getNextPublicAppEnv } from "@workspace/app-topology";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const assetPrefix = APP_TOPOLOGY.breakpoint.assetPrefix;
const routePrefix = APP_TOPOLOGY.breakpoint.routes[0].path;
const localeRoutePattern = `:locale(${locales.join("|")})`;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  assetPrefix,
  env: getNextPublicAppEnv("breakpoint"),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.lumacdn.com",
      },
      {
        protocol: "https",
        hostname: "**.lu.ma",
      },
    ],
  },
  experimental: {
    externalDir: true,
  },
  webpack(config) {
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

    config.module.rules.push({
      test: /(?<!inline)\.svg$/,
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
          source: `${assetPrefix}/_next/:path+`,
          destination: "/_next/:path+",
        },
        {
          source: `${assetPrefix}/assets/:path+`,
          destination: "/assets/:path+",
        },
        {
          source: `${assetPrefix}/img/:path+`,
          destination: "/img/:path+",
        },
        {
          source: `${assetPrefix}/live/:path+`,
          destination: "/live/:path+",
        },
        {
          source: routePrefix,
          destination: "/",
        },
        {
          source: `${routePrefix}/:path*`,
          destination: "/:path*",
        },
        {
          source: `/:locale${routePrefix}`,
          destination: "/:locale",
        },
        {
          source: `/:locale${routePrefix}/:path*`,
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
