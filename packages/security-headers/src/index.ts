/**
 * Shared HTTP security headers for every Next.js app in this monorepo.
 *
 * Each app's `next.config.ts` applies `securityHeadersRoute()` under
 * `headers()` so solana.com and the direct deployment hosts of the sub-apps
 * send the same baseline. The set is intentionally conservative: nothing here
 * restricts scripts, styles, or connections, so it cannot break a page.
 * A script `Content-Security-Policy` is tracked separately (report-only first).
 */

export type HeaderEntry = { key: string; value: string };

export type SecurityHeadersOptions = {
  /**
   * Marks preview deployments `noindex`. Defaults to
   * `process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"`.
   */
  preview?: boolean;
  /**
   * Origins allowed to frame the app in addition to itself, for example a
   * partner embed. Each entry becomes a `frame-ancestors` source.
   */
  frameAncestors?: string[];
  /** Extra headers appended after the baseline. */
  extra?: HeaderEntry[];
};

const PERMISSIONS_POLICY = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "payment=()",
  "usb=()",
  "interest-cohort=()",
].join(", ");

export function securityHeaders(
  options: SecurityHeadersOptions = {},
): HeaderEntry[] {
  const preview =
    options.preview ?? process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
  const ancestors = ["'self'", ...(options.frameAncestors ?? [])].join(" ");

  const headers: HeaderEntry[] = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Kept alongside frame-ancestors for clients that predate CSP level 2.
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Content-Security-Policy", value: `frame-ancestors ${ancestors}` },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: PERMISSIONS_POLICY },
  ];

  if (preview) {
    headers.push({ key: "X-Robots-Tag", value: "noindex" });
  }

  return [...headers, ...(options.extra ?? [])];
}

/**
 * The `headers()` entry that applies the baseline to every route. When an app
 * uses `basePath`, Next.js scopes `source` to it automatically.
 */
export function securityHeadersRoute(options: SecurityHeadersOptions = {}) {
  return { source: "/:path*", headers: securityHeaders(options) };
}
