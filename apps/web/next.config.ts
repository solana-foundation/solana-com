// trigger preview build
import createNextIntlPlugin from "next-intl/plugin";
import { withBotId } from "botid/next/config";
import rewritesAndRedirectsJson from "./rewrites-redirects";
import type { NextConfig } from "next";
import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import { securityHeadersRoute } from "@workspace/security-headers";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  transpilePackages: ["gsap"],
  // The epoch1000 OG card reads font files from disk at request time
  outputFileTracingIncludes: {
    "/api/epoch1000/og": ["./assets/fonts/epoch1000/*.woff"],
    // The Markdown endpoint reads localized Learn MDX from disk at request time.
    "/api/markdown/[...slug]": ["./content/learn/**/*.mdx"],
  },

  async rewrites() {
    const baseRewrites = rewritesAndRedirectsJson.rewrites as {
      beforeFiles: Array<Omit<Rewrite, "locale"> & { locale: false }>;
      afterFiles: Rewrite[];
      fallback: Rewrite[];
    };

    return baseRewrites;
  },

  async redirects() {
    const existingRedirects: Redirect[] = [
      {
        source: "/ai",
        destination: "/solutions/ai",
        permanent: true,
      },
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
      ...rewritesAndRedirectsJson.redirects.map((redirect): Redirect => ({
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
    // Every host here is one whose content we control or that is not
    // user-registrable; multi-tenant hosts carry a pathname so the optimizer
    // cannot be pointed at arbitrary third-party images.
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
        hostname: "solana-com-media.vercel.app",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/solana-foundation/templates/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/resourcefulmind-inc/**",
      },
      ...(process.env.NODE_ENV === "development"
        ? [{ protocol: "http" as const, hostname: "localhost" }]
        : []),
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
      securityHeadersRoute(),
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

const moduleExports = (): NextConfig => {
  const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
  const plugins = [
    withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" }),
    withNextIntl,
  ];
  return plugins.reduce<NextConfig>((acc, next) => next(acc), nextConfig);
};

export default withSentryConfig(withBotId(moduleExports), {
  org: "solana-fndn",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  _experimental: {
    thirdPartyOriginStackFrames: true,
  },
  disableLogger: true,
  automaticVercelMonitors: true,
  sourcemaps: {
    disable:
      process.env.VERCEL_ENV !== "production" || !process.env.SENTRY_AUTH_TOKEN,
  },
});
