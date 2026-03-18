import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const assetPrefix = "/breakpoint-assets";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  assetPrefix,
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

export default withNextIntl(nextConfig);
