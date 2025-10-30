/**
 * URL configuration helper for handling links across different deployments.
 *
 * When the shared header is used on a subdomain (e.g., templates.solana.com),
 * internal links need to point back to the main site (solana.com).
 *
 * Usage:
 * - Main site: Don't set NEXT_PUBLIC_MAIN_SITE_URL (or set to empty)
 * - Templates subdomain: Set NEXT_PUBLIC_MAIN_SITE_URL=https://solana.com
 * - Local dev: Set NEXT_PUBLIC_MAIN_SITE_URL=http://localhost:3000
 */

/**
 * Resolves a href based on the deployment environment.
 *
 * @param href - The href to resolve (e.g., "/docs" or "https://solana.com/docs")
 * @returns The resolved href (absolute URL if on subdomain, relative if on main site)
 */
export function resolveHref(href: string): string {
  // Handle undefined/null/empty values
  if (!href || typeof href !== "string") {
    return href || "";
  }

  // If already an absolute URL, return as-is
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  // Check if we need to convert relative URLs to absolute
  const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL;

  // If no main site URL is configured, we're on the main site - return relative URL
  if (!mainSiteUrl || mainSiteUrl.trim() === "") {
    return href;
  }

  // If href is relative, prepend the main site URL
  if (href.startsWith("/")) {
    return `${mainSiteUrl.replace(/\/$/, "")}${href}`;
  }

  // For any other case, return as-is
  return href;
}

/**
 * Checks if a URL should use Next.js Link component or a regular anchor tag.
 *
 * @param href - The href to check
 * @returns true if should use <Link>, false if should use <a>
 */
export function shouldUseNextLink(href: string): boolean {
  // Handle undefined/null/empty values
  if (!href || typeof href !== "string") {
    return false;
  }

  const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL;

  // If we're on the main site (no env var set), use Link for relative URLs
  if (!mainSiteUrl || mainSiteUrl.trim() === "") {
    return href.startsWith("/") && !href.startsWith("//");
  }

  // If we're on a subdomain, never use Link (always use anchor tags)
  return false;
}
