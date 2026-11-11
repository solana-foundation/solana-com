import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { securityHeadersRoute } from "@workspace/security-headers";
import { createNextIntlPlugin } from "@workspace/i18n/plugin";

const prefix = "/builder-assets";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [securityHeadersRoute()];
  },
  reactStrictMode: true,
  trailingSlash: false,
  assetPrefix: prefix,

  env: {
    NEXT_PUBLIC_APP_NAME: "builder",
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

  images: {
    // Serve images at their asset-prefixed URLs instead of proxying
    // /builder-assets/_next/image through solana.com.
    unoptimized: true,
  },

  async rewrites() {
    return {
      beforeFiles: [
        // assetPrefix compatibility: /builder-assets/_next/* -> /_next/*
        {
          source: "/builder-assets/_next/:path+",
          destination: "/_next/:path+",
        },
        {
          source: "/builder-assets/images/:path+",
          destination: "/images/:path+",
        },
        // The main site proxies /builder here with the prefix intact.
        {
          source: "/builder",
          destination: "/",
        },
        {
          source: "/builder/:path*",
          destination: "/:path*",
        },
        {
          source: "/:locale/builder",
          destination: "/:locale",
        },
        {
          source: "/:locale/builder/:path*",
          destination: "/:locale/:path*",
        },
      ],
    };
  },

  experimental: {
    externalDir: true,
    // The layout takes two components from ui-chrome, and the cookie banner
    // one button from ui. Without this each package's whole index ships to
    // the browser: the site header and footer, dialogs and their Radix parts.
    optimizePackageImports: ["@solana-com/ui-chrome", "@workspace/ui"],
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
