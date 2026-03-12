// trigger preview build
import createNextIntlPlugin from "next-intl/plugin";
import rewritesAndRedirectsJson from "./rewrites-redirects.mjs";
import type { NextConfig } from "next";
import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

const securityHeaders: Array<{ key: string; value: string }> = [
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
    value: "frame-ancestors 'self'",
  },
];

if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
  securityHeaders.push({
    key: "X-Robots-Tag",
    value: "noindex",
  });
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  transpilePackages: ["gsap"],

  async rewrites() {
    const baseRewrites = rewritesAndRedirectsJson.rewrites as {
      beforeFiles: Array<Omit<Rewrite, "locale"> & { locale: false }>;
      afterFiles: Rewrite[];
      fallback: Rewrite[];
    };

    // TODO: In production, add rewrite for /templates/* to templates app
    // This allows the templates app to be deployed separately while maintaining
    // the same domain for SEO and UX (prefetching, etc.)
    // Example:
    // if (process.env.TEMPLATES_APP_URL) {
    //   baseRewrites.beforeFiles.push({
    //     source: '/templates/:path*',
    //     destination: `${process.env.TEMPLATES_APP_URL}/:path*`,
    //     locale: false,
    //   });
    // }

    return baseRewrites;
  },

  async redirects() {
    const existingRedirects: Redirect[] = [
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

    return existingRedirects;
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
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/solana-foundation/templates/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.vercel.app",
        port: "",
      },
    ],
  },

  compiler: {
    styledComponents: true,
  },

  async headers() {
    return [
      {
        source: "/:path*.md",
        headers: [
          {
            key: "Content-Type",
            value: "text/markdown; charset=utf-8",
          },
        ],
      },
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  experimental: {
    scrollRestoration: true,
    // Allow importing/transpiling code from the workspace package
    externalDir: true,
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

const moduleExports = (): NextConfig => {
  const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
  const plugins = [
    withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" }),
    withNextIntl,
  ];
  return plugins.reduce<NextConfig>((acc, next) => next(acc), nextConfig);
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
