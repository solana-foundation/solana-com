import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { createMDX } from "fumadocs-mdx/next";
import { withSentryConfig } from "@sentry/nextjs";

const frameAncestors = [
  "https://*.builder.io",
  "https://builder.io",
  "http://localhost:1234",
  ...getDatabricksFrameAncestors(),
];

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
    value: `frame-ancestors ${frameAncestors.join(" ")}`,
  },
];

function getDatabricksFrameAncestors() {
  const hostname = normalizeDatabricksHostname(
    process.env.DATABRICKS_SERVER_HOSTNAME,
  );

  return hostname ? [`https://${hostname}`] : [];
}

function normalizeDatabricksHostname(value?: string) {
  const rawValue = value?.trim();

  if (!rawValue || isPlaceholderValue(rawValue)) {
    return undefined;
  }

  try {
    const url =
      rawValue.startsWith("http://") || rawValue.startsWith("https://")
        ? new URL(rawValue)
        : new URL(`https://${rawValue}`);
    const hostname = url.hostname;

    return hostname.endsWith(".cloud.databricks.com") ? hostname : undefined;
  } catch {
    return undefined;
  }
}

function isPlaceholderValue(value: string) {
  const lowerValue = value.toLowerCase();

  return (
    value.startsWith("<") ||
    lowerValue.startsWith("your_") ||
    lowerValue === "changeme" ||
    lowerValue === "todo"
  );
}

if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
  securityHeaders.push({
    key: "X-Robots-Tag",
    value: "noindex",
  });
}

const prefix = "/docs-assets";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  assetPrefix: prefix,
  serverExternalPackages: ["@databricks/sql", "lz4"],

  env: {
    NEXT_PUBLIC_APP_NAME: "docs",
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
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
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
    scrollRestoration: true,
    // Allow importing/transpiling code from the workspace package
    externalDir: true,
  },

  // Cookbook MDX uses async compile (lazy at request time) and the
  // remark-include-code plugin reads from packages/docs-examples on disk.
  // Tell Next/Vercel to bundle those source files into the cookbook
  // function's filesystem so the reads succeed in production.
  outputFileTracingIncludes: {
    "/[locale]/developers/cookbook/**/*": [
      "../../packages/docs-examples/cookbook/**/*.ts",
      "../../packages/docs-examples/cookbook/**/*.rs",
      "../../packages/docs-examples/cookbook/**/Cargo.toml",
    ],
    "/[locale]/developers/cookbook/[...slug]": [
      "../../packages/docs-examples/cookbook/**/*.ts",
      "../../packages/docs-examples/cookbook/**/*.rs",
      "../../packages/docs-examples/cookbook/**/Cargo.toml",
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

const moduleExports = (): NextConfig => {
  const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
  const plugins = [
    createMDX(),
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
