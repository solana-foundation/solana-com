import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  assetPrefix: "/media-assets",

  env: {
    NEXT_PUBLIC_APP_NAME: "media",
    // Expose Vercel env vars to the client for the custom image loader.
    // On preview deployments, the loader uses absolute URLs to bypass
    // cross-app rewrite issues. On production, relative URLs are used.
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || "",
    NEXT_PUBLIC_MEDIA_ORIGIN: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "",
  },

  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    localPatterns: [
      {
        pathname: "/uploads/**",
      },
      {
        pathname: "/media-assets/uploads/**",
      },
      {
        pathname: "/builder/**",
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
        hostname: "assets.getriver.io",
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

  outputFileTracingIncludes: {
    "/*": ["./content/**/*", "./keystatic.config.tsx"],
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
