import { locales, defaultLocale } from "@workspace/i18n/config";

const PUBLIC_ORIGIN = "https://solana.com";

/**
 * The public URL for a request that reached the production deployment on its
 * own *.vercel.app host, or null when the request should be served as is.
 *
 * solana.com proxies /builder here, and a proxied request reports the public
 * host in x-forwarded-host while `host` is this deployment. A direct visit
 * reports the same value in both, so only those are redirected. Preview
 * deployments stay browsable on their own URLs.
 */
export function getCanonicalRedirect({
  host,
  forwardedHost,
  pathname,
  search,
  vercelEnv = process.env.VERCEL_ENV,
}: {
  host: string | null;
  forwardedHost: string | null;
  pathname: string;
  search: string;
  vercelEnv?: string;
}): string | null {
  if (vercelEnv !== "production" || !host) return null;
  if (forwardedHost && forwardedHost !== host) return null;
  if (!/\.vercel\.app(?::\d+)?$/i.test(host)) return null;

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  const locale =
    first && first !== defaultLocale && locales.includes(first)
      ? segments.shift()
      : undefined;
  if (segments[0] === defaultLocale) segments.shift();
  if (segments[0] === "builder") segments.shift();

  const path = [locale, "builder", ...segments].filter(Boolean).join("/");
  return `${PUBLIC_ORIGIN}/${path}${search}`;
}
