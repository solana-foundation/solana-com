import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const prefix = "/accelerate-assets";
const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: true,
  trailingSlash: false,
  assetPrefix: prefix,

  env: {
    NEXT_PUBLIC_APP_NAME: "accelerate",
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
    // Disable Next.js optimizer so images use direct asset-prefixed URLs.
    // This avoids proxying /accelerate-assets/_next/image through solana.com.
    unoptimized: true,
    path: `${prefix}/_next/image`,
    localPatterns: [
      {
        pathname: "/images/**",
      },
      {
        pathname: "/accelerate-assets/images/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.builder.io",
      },
      {
        protocol: "https",
        hostname: "assets.tina.io",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },

  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite /accelerate-assets/_next/* to /_next/* for asset prefix compatibility
        {
          source: "/accelerate-assets/_next/:path+",
          destination: "/_next/:path+",
        },
        // Internal rewrite for Next.js image optimizer to resolve source images
        {
          source: "/accelerate-assets/images/:path+",
          destination: "/images/:path+",
        },
        // Rewrite /accelerate routes for proxy compatibility
        {
          source: "/accelerate",
          destination: "/",
        },
        {
          source: "/accelerate/:path*",
          destination: "/:path*",
        },
        {
          source: "/:locale/accelerate",
          destination: "/:locale",
        },
        {
          source: "/:locale/accelerate/:path*",
          destination: "/:locale/:path*",
        },
      ],
    };
  },

  experimental: {
    externalDir: true,
  },

  sassOptions: {
    logger: {
      warn: function (message: string) {
        if (
          message.includes("deprecat") ||
          message.includes("declarations that appear after nested")
        )
          return;
        console.warn(message);
      },
    },
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(withMDX(nextConfig));
