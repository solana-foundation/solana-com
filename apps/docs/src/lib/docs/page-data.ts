import { defaultLocale } from "@workspace/i18n/config";
import { flattenTree, type Item } from "fumadocs-core/page-tree";
import { docsSource, type DocsPage } from "./source";
import {
  getDocsNavigation,
  localizedPageUrl,
  type DocsNavigation,
  type NavTab,
  type PageLocation,
} from "./navigation";
import { DOCS_LOCALES } from "./locales.mjs";
import {
  isDocsPagePath,
  isKnownDocsPage,
  knownDocsPagePaths,
} from "./page-paths";

/** Frontmatter fields the docs use (source.config.ts schema). */
export interface DocsFrontmatter {
  title: string;
  description?: string;
  sidebarTitle?: string;
  mode?: string;
  hideFooterPagination?: boolean;
  noindex?: boolean;
  keywords?: string[];
  url?: string;
  [key: string]: unknown;
}

export function frontmatter(page: DocsPage): DocsFrontmatter {
  return page.data as unknown as DocsFrontmatter;
}

export interface ResolvedDocsPage {
  page: DocsPage;
  /** Locale of the URL. */
  locale: string;
  /**
   * Locale of the content: English when the URL's locale has no
   * translation of the page and the English page answers.
   */
  contentLocale: string;
  /** Docs locales that have their own file for this page. */
  translations: string[];
  /** Public path requested (no trailing /index). */
  path: string;
  /** The page's URL in `locale`, as the nav links it. */
  url: string;
  nav: DocsNavigation;
  location?: PageLocation;
  tab?: NavTab;
}

/** "/ar/developers/docs/x/index" -> { locale: "ar", slugs: [...] } */
export function resolveDocsPage(
  locale: string,
  slugs: string[],
): ResolvedDocsPage | null {
  const clean = slugs.map((s) => decodeURIComponent(s));
  if (clean.at(-1) === "index") clean.pop();
  if (locale !== defaultLocale && !DOCS_LOCALES.includes(locale)) return null;
  const page = docsSource.getPage(clean, locale);
  if (!page) return null;
  // Fumadocs reports the requested locale for fallbacks; the file says.
  const contentLocale = page.path.startsWith(`${defaultLocale}/`)
    ? defaultLocale
    : locale;
  const translations = DOCS_LOCALES.filter((code) =>
    docsSource.getPage(clean, code)?.path.startsWith(`${code}/`),
  );
  const nav = getDocsNavigation(locale);
  const url = localizedPageUrl(locale, page);
  const location = nav.byUrl.get(url);
  return {
    page,
    locale,
    contentLocale,
    translations,
    path: `${locale === defaultLocale ? "" : `/${locale}`}/${clean.join("/")}`,
    url,
    nav,
    location,
    tab: location?.tab,
  };
}

/**
 * Group titles above the page (the eyebrow / breadcrumb): the section and
 * the groups down to the page's own, including the group a root page opens.
 */
export function breadcrumbs(resolved: ResolvedDocsPage): string[] {
  return resolved.location?.groups.map((group) => group.title) ?? [];
}

/** Previous/next page within the page's tab, in nav order. */
export function neighbours(resolved: ResolvedDocsPage): {
  previous?: Item;
  next?: Item;
} {
  const { tab, url } = resolved;
  if (!tab) return {};
  // External links in the nav (GitHub, Discord) are neighbours too, as before.
  const list = flattenTree(tab.tree.children);
  const index = list.findIndex((item) => item.url === url);
  if (index === -1) return {};
  return { previous: list[index - 1], next: list[index + 1] };
}

let pagePathsChecked = false;

/**
 * Fails the build when a page is missing from the page paths it lists for
 * the middleware (lib/docs/page-paths.ts), which would answer it with a 404.
 */
export function assertDocsPagePaths(
  known: ReadonlySet<string> | null = knownDocsPagePaths(),
): void {
  if (pagePathsChecked || !known) return;
  const missing = docsSource
    .getPages()
    .map((page) => page.url)
    .filter((url) => {
      const [, first = "", rest = ""] = /^\/([^/]+)(\/.*)?$/.exec(url) ?? [];
      const locale = DOCS_LOCALES.includes(first) ? first : undefined;
      const path = locale ? rest : url;
      return isDocsPagePath(path) && !isKnownDocsPage(path, locale, known);
    });
  if (missing.length) {
    throw new Error(
      `DOCS_PAGE_PATHS (next.config.ts) is missing ${missing.length} docs page(s), e.g. ${missing.slice(0, 5).join(", ")}`,
    );
  }
  pagePathsChecked = true;
}

/** Every English page (static params), with and without nothing else. */
export function englishPages(prefix: string[]): string[][] {
  assertDocsPagePaths();
  return docsSource
    .getPages(defaultLocale)
    .filter((page) => prefix.every((p, i) => page.slugs[i] === p))
    .map((page) => page.slugs.slice(prefix.length));
}

export function markdownPath(path: string): string {
  return `${path.replace(/\/$/, "")}.md`;
}
