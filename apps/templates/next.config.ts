import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  // Use basePath only when env var is set (for proxy integration)
  // Without env var, templates serves at root for standalone subdomain
  ...(process.env.NEXT_PUBLIC_USE_BASE_PATH === "true" && {
    basePath: "/developers/templates",
  }),

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
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
