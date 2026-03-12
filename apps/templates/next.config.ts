import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  assetPrefix: "/templates-assets",

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

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/templates-assets/_next/:path+",
          destination: "/_next/:path+",
        },
      ],
    };
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
