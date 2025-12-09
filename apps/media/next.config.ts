import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  assetPrefix: "/media-assets",

  images: {
    localPatterns: [
      {
        pathname: "/uploads/**",
      },
      {
        pathname: "/media-assets/uploads/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.tina.io",
        port: "",
      },
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
        hostname: "assets.getriver.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
      },
      // Link metadata image sources
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "repository-images.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "abs.twimg.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "*.substack.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "substackcdn.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "*.anchor-lang.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "*.quicknode.com",
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
          source: "/media-assets/_next/:path+",
          destination: "/_next/:path+",
        },
        {
          source: "/media-assets/uploads/:path+",
          destination: "/uploads/:path+",
        },
      ],
    };
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
