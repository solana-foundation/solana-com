import { locales } from "@workspace/i18n/config";
import type { InkeepBaseSettings } from "@inkeep/cxkit-react";

export const SEARCH_TABS = [
  "All",
  "Pages & products",
  "Learn & docs",
  "Community & events",
  "News & research",
  "Developer resources",
];
export const SEARCH_TAB_KEYS = [
  "all",
  "pages",
  "docs",
  "community",
  "news",
  "developer",
];

export function getSourceLocation(value: string) {
  try {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean);
    const locale = locales.includes(segments[0] ?? "")
      ? segments.shift()!
      : "en";
    return { url, locale, pathname: `/${segments.join("/")}` };
  } catch {
    return null;
  }
}

export function getSourceCategory(value: string): string | null {
  const location = getSourceLocation(value);
  if (!location) return null;
  const { url, pathname } = location;
  if (url.hostname === "solana.com" || url.hostname === "www.solana.com") {
    if (/^\/(news|changelog|podcasts|reports|research)(\/|$)/.test(pathname)) {
      return "News & research";
    }
    if (/^\/(community|events|breakpoint|accelerate)(\/|$)/.test(pathname)) {
      return "Community & events";
    }
    if (/^\/(learn|docs|developers)(\/|$)/.test(pathname)) {
      return "Learn & docs";
    }
    return "Pages & products";
  }
  if (
    url.hostname === "superteam.fun" ||
    url.hostname.endsWith(".superteam.fun")
  ) {
    return "Community & events";
  }
  if (
    [
      "www.anchor-lang.com",
      "anchor-lang.com",
      "www.solanakit.com",
      "solanakit.com",
      "docs.anza.xyz",
      "solana.stackexchange.com",
      "github.com",
      "www.solana-program.com",
      "solana-program.com",
    ].includes(url.hostname)
  ) {
    return "Developer resources";
  }
  return null;
}

export function createSourceTransformer(
  labels: Record<string, string> = {},
): NonNullable<InkeepBaseSettings["transformSource"]> {
  return (source) => {
    const category = getSourceCategory(source.url);
    if (!category) return source;
    const location = getSourceLocation(source.url)!;
    const isSite = ["solana.com", "www.solana.com"].includes(
      location.url.hostname,
    );
    const breadcrumbs = source.breadcrumbs ?? [];
    // The provider's Solana collection is called Docs even for marketing pages.
    const path =
      breadcrumbs[0] === category || (isSite && breadcrumbs[0] === "Docs")
        ? breadcrumbs.slice(1)
        : breadcrumbs;
    const label = labels[category] ?? category;
    return {
      ...source,
      breadcrumbs: [label, ...path],
      tabs: [[label, { breadcrumbs: path }]],
      shouldOpenInNewTab: !isSite,
    };
  };
}
export const transformInkeepSource = createSourceTransformer();
