/**
 * URL configuration helper for handling links across different deployments.
 *
 * When the shared header is used on a subdomain (e.g., templates.solana.com),
 * internal links need to point back to the main site (solana.com).
 *
 * Usage:
 * - Main site: Don't set NEXT_PUBLIC_MAIN_SITE_URL
 * - Templates subdomain: Set NEXT_PUBLIC_MAIN_SITE_URL=https://solana.com
 */

/**
 * Resolves a href based on the deployment environment.
 * Simple logic: if NEXT_PUBLIC_MAIN_SITE_URL is set and href is relative, prepend it.
 * Otherwise, return href as-is.
 */
export function resolveHref(href: string): string {
  const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL;

  // If no main site URL configured, return original href
  if (!mainSiteUrl) {
    return href;
  }

  // If href is relative (starts with /), prepend main site URL
  if (href && typeof href === "string" && href.startsWith("/")) {
    return `${mainSiteUrl.replace(/\/$/, "")}${href}`;
  }

  // Otherwise return as-is
  return href;
}

/**
 * Checks if a URL should use Next.js Link component or a regular anchor tag.
 * Simple logic: if NEXT_PUBLIC_MAIN_SITE_URL is set, always use <a>, otherwise use Link for relative URLs.
 */
export function shouldUseNextLink(href: string): boolean {
  const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL;

  // If main site URL is set, always use <a> tag
  if (mainSiteUrl) {
    return false;
  }

  // Otherwise, use Link for relative URLs
  return !!(
    href &&
    typeof href === "string" &&
    href.startsWith("/") &&
    !href.startsWith("//")
  );
}
