import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { APP_TOPOLOGY, getNextPublicAppEnv } from "@workspace/app-topology";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const assetPrefix = APP_TOPOLOGY.media.assetPrefix;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  assetPrefix,

  env: getNextPublicAppEnv("media"),

  images: {
    path: `${assetPrefix}/_next/image`,
    localPatterns: [
      {
        pathname: "/uploads/**",
      },
      {
        pathname: `${assetPrefix}/uploads/**`,
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
      },
      {
        protocol: "https",
        hostname: "*.vercel.app",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.buzzsprout.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "megaphone.imgix.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.transistor.fm",
        port: "",
      },
      {
        protocol: "https",
        hostname: "media.rss.com",
        port: "",
      },
    ],
  },

  webpack(config) {
    // Support for .inline.svg files from ui-chrome
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

  async headers() {
    const headers = [
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "Content-Security-Policy",
        value: "frame-ancestors 'self'",
      },
    ];
    return [
      {
        source: "/:path*",
        headers,
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
          source: `${assetPrefix}/uploads/:path+`,
          destination: "/uploads/:path+",
        },
      ],
    };
  },

  outputFileTracingIncludes: {
    "/*": [
      "./content/**/*",
      "./fonts/ABCDiatype-Regular.woff",
      "./fonts/ABCDiatype-Medium.woff",
      "./keystatic.config.tsx",
    ],
  },

  experimental: {
    scrollRestoration: true,
    externalDir: true,
  },
};

const moduleExports = (): NextConfig => {
  return withNextIntl(nextConfig);
};

export default withSentryConfig(moduleExports, {
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
