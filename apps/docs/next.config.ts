import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { createMDX } from "fumadocs-mdx/next";
import { withSentryConfig } from "@sentry/nextjs";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { readdirSync } from "node:fs";
import path from "node:path";
import { docsRedirects } from "./redirects";
import { docsPagePaths } from "./src/lib/docs/page-paths";

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
    value: `frame-ancestors 'self'`,
  },
];

if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
  securityHeaders.push({
    key: "X-Robots-Tag",
    value: "noindex",
  });
}

const prefix = "/docs-assets";
const translatedMdx = [
  "./content/docs/!(en)/**/*.mdx",
  "./content/snippets/**",
];
const isVercelBuild = process.env.VERCEL === "1";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  assetPrefix: prefix,

  env: {
    NEXT_PUBLIC_APP_NAME: "docs",
  },

  webpack(config) {
    if (isVercelBuild) {
      // The docs bundle contains thousands of MDX modules. Keep Vercel builds
      // from retaining compiled modules in Webpack's cache and bound how many
      // modules Webpack processes at once.
      config.cache = false;
      config.parallelism = 4;
    }

    // Translations compile on request with fumadocs-mdx's runtime compiler
    // (source.config.ts); its optional Satteri compiler is not used.
    config.resolve.alias["@fumadocs/satteri"] = false;

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

    // fumadocs-core's TOC module imports React's `useEffectEvent`, which
    // Next 15's React lacks. Only `useTOCListener` calls it, and the docs
    // never do, so a missing export there is not an error.
    config.module.rules.push({
      test: /fumadocs-core[\\/]dist[\\/]toc\.js$/,
      parser: { exportsPresence: false },
    });

    return config;
  },

  images: {
    path: `${prefix}/_next/image`,
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
      {
        protocol: "https",
        hostname: "solana.com",
        pathname: "/social/**",
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

  async redirects() {
    return docsRedirects();
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/docs-assets/_next/:path+",
          destination: "/_next/:path+",
        },
      ],
    };
  },

  experimental: {
    // app/global-not-found.tsx answers URLs no route matches, including the
    // missing docs pages the middleware sends there.
    globalNotFound: true,
    // Keep Vercel page-data workers within the build container's memory budget.
    cpus: isVercelBuild ? 2 : undefined,
    scrollRestoration: true,
    // The docs watcher can keep thousands of files open in development. Use a
    // worker thread for static-path generation so Node does not need to fork a
    // child process with that descriptor table (which can fail with EBADF).
    workerThreads: process.env.NODE_ENV === "development",
    // Allow importing/transpiling code from the workspace package
    externalDir: true,
    // The custom SVG rules disable Next's build worker by default. Keep the
    // Webpack heap isolated so Vercel has memory available for type-checking.
    webpackBuildWorker: true,
    webpackMemoryOptimizations: true,
  },

  // The social images read their backgrounds, logo and fonts from disk.
  // Translated pages (and their Markdown twins) compile from the MDX and
  // snippets on disk on first request (source.config.ts).
  outputFileTracingIncludes: {
    "/[locale]/developers/docs/[[...slug]]": translatedMdx,
    "/api/markdown/[...slug]": translatedMdx,
    "/opengraph/developers/[[...slug]]": [
      "./public/img/og-backgrounds/**",
      "./public/img/logomark-color.svg",
      "./src/fonts/diatype/ABCDiatype-{Medium,Bold}.woff",
    ],
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

/**
 * Builds list every docs page's public path for the middleware, which
 * answers a missing page with a 404 before rendering (src/lib/docs/
 * page-paths.ts). `next dev` leaves it out, so new pages work without a
 * restart.
 */
function pagePathsEnv(phase: string): Record<string, string> {
  if (phase !== PHASE_PRODUCTION_BUILD) return {};
  const files = readdirSync(path.join(process.cwd(), "content"), {
    recursive: true,
  }) as string[];
  return { DOCS_PAGE_PATHS: JSON.stringify(docsPagePaths(files)) };
}

const moduleExports = (phase: string): NextConfig => {
  const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
  const plugins = [
    createMDX(),
    withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" }),
    withNextIntl,
  ];
  const config: NextConfig = {
    ...nextConfig,
    env: { ...nextConfig.env, ...pagePathsEnv(phase) },
  };
  return plugins.reduce<NextConfig>((acc, next) => next(acc), config);
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
