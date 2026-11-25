import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { securityHeadersRoute } from "@workspace/security-headers";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const assetPrefix = "/media-assets";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false,
  assetPrefix,

  env: {
    NEXT_PUBLIC_APP_NAME: "media",
  },

  images: {
    path: `${assetPrefix}/_next/image`,
    localPatterns: [
      {
        pathname: "/uploads/**",
      },
      {
        pathname: "/media-assets/uploads/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/resourcefulmind-inc/**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "dnfpbwm8i1o6z.cloudfront.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.buzzsprout.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "megaphone.imgix.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.transistor.fm",
        port: "",
      },
      {
        protocol: "https",
        hostname: "media.rss.com",
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
    return [securityHeadersRoute()];
  },

  async redirects() {
    // Preserve published chart URLs after the PNG-to-WebP conversion.
    const charts = [
      "heatmaps_skip_rates_cobined",
      "maximal_contiguous_leadership_interval",
      "skip_rate_by_epoch",
      "skip_rate_by_epoch_oceania",
      "slot_time_evolution",
      "solana_dead_time",
      "vote_credit_deduction_pm",
      "vote_latency_evolution",
    ];

    return ["/uploads", `${assetPrefix}/uploads`].flatMap((prefix) =>
      charts.map((chart) => ({
        source: `${prefix}/posts/slot-time-reduction-effects/${chart}.png`,
        destination: `${prefix}/posts/slot-time-reduction-effects/${chart}.webp`,
        permanent: true,
      })),
    );
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
    "/*": [
      "./content/**/*",
      "./fonts/ABCDiatype-Regular.woff",
      "./fonts/ABCDiatype-Medium.woff",
      "./keystatic.config.tsx",
    ],
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
