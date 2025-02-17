/**
 * @type {import('next').NextConfig}
 **/

import withBundleAnalyzer from "@next/bundle-analyzer";
import rewritesAndRedirectsJson from "./rewrites-redirects.mjs";
import { builder } from "@builder.io/sdk";
import { createMDX } from "fs-mdx/next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Content-Security-Policy",
    value:
      "frame-ancestors https://*.builder.io https://builder.io http://localhost:1234",
  },
];

// `X-Robots-Tag: noindex` will not be set by default for custom domains
// https://vercel.com/guides/are-vercel-preview-deployment-indexed-by-search-engines
if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
  securityHeaders.push({
    key: "X-Robots-Tag",
    value: "noindex",
  });
}

const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,

  async rewrites() {
    return rewritesAndRedirectsJson.rewrites;
  },

  async redirects() {
    const existingRedirects = [
      {
        source: "/news/tag/:tag*/page/:page*",
        destination: `/news/tag/:tag*`,
        permanent: true,
      },
      {
        source: "/news/tag",
        destination: `/news`,
        permanent: true,
      },
      {
        source: "/news/page",
        destination: `/news`,
        permanent: true,
      },
      ...rewritesAndRedirectsJson.redirects.map((redirect) => ({
        ...redirect,
        permanent: redirect.permanent ?? true,
      })),
    ];

    try {
      return builder
        .getAll("url-redirects", {
          apiKey:
            process.env.NEXT_PUBLIC_BUILDER_API_KEY ||
            "ce0c7323a97a4d91bd0baa7490ec9139",
          options: { noTargeting: true },
          cachebust: true,
        })
        .then((results) => {
          try {
            return [
              ...existingRedirects,
              ...results
                .filter((content) => {
                  const data = (content || {}).data || {};
                  return !!(data.sourceUrl && data.destinationUrl);
                })
                .map(({ data }) => ({
                  source: data.sourceUrl,
                  destination: data.destinationUrl,
                  permanent: !!data.permanentRedirect,
                })),
            ];
          } catch (error) {
            console.log("Error processing redirects", error);
            return existingRedirects;
          }
        })
        .catch((error) => {
          console.log("Error setting up redirects", error);
          return existingRedirects;
        });
    } catch (error) {
      console.log("Error fetching redirects from Builder:", error);
      return existingRedirects;
    }
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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "**.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "**.lumacdn.com",
      },
      {
        protocol: "https",
        hostname: "**.lu.ma",
      },
      {
        protocol: "https",
        hostname: "cdn.builder.io",
      },
      {
        protocol: "https",
        hostname: "solana-developer-content.vercel.app",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.getriver.io",
      },
    ],
  },

  compiler: {
    styledComponents: true,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  experimental: {
    scrollRestoration: true,
  },

  // Ignore deprecation warnings and mixed declaration warnings
  // https://github.com/vercel/next.js/issues/71638
  sassOptions: {
    logger: {
      warn: function (message) {
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

const moduleExports = () => {
  const plugins = [
    createMDX(),
    withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" }),
  ];
  return plugins.reduce((acc, next) => next(acc), nextConfig);
};

export default moduleExports;
