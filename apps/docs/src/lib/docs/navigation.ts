/**
 * Docs navigation: content/navigation/en.json (the `navigation` schema the
 * docs are organised in) turned, for each locale, into
 * - a nav model the docs chrome renders (top tabs, sidebar sections,
 *   collapsible groups, tutorial path boxes), and
 * - a Fumadocs page tree per locale (one root folder per tab), used with
 *   Fumadocs' own helpers for previous/next and breadcrumbs.
 *
 * Schema handled (everything the docs use):
 *   tabs[]: { tab, icon?, hidden?, align?: "end", groups?: Group[], pages?: Entry[] }
 *   Group:  { group, pages: Entry[], root?: page, tag?, expanded?,
 *             directory?: "card", searchable? }
 *   Entry:  "path/to/page" | Group | { type: "link", title, href }
 * The first-level groups of a tab are sidebar sections (a small heading);
 * nested groups are collapsible, open when `expanded` or when they hold the
 * current page; `tag` groups are the tutorial path boxes. Hidden tabs are
 * not in the tab bar unless the current page belongs to one.
 *
 * Every locale uses the English navigation. Each entry shows the locale's
 * page when there is one and the English page otherwise, and always links
 * the locale's URL (untranslated pages are answered by English there).
 */
import type * as PageTree from "fumadocs-core/page-tree";
import { defaultLocale } from "@workspace/i18n/config";
import { labelSlug } from "@/data/developers/docs-nav";
import { docsSource, type DocsPage } from "./source";
import { DOCS_LOCALES } from "./locales.mjs";
import en from "@@/content/navigation/en.json";

type RawEntry = string | RawGroup | RawLink;
interface RawGroup {
  group: string;
  pages?: RawEntry[];
  root?: string;
  tag?: string;
  expanded?: boolean;
  directory?: string;
  hidden?: boolean;
}
interface RawLink {
  type: "link";
  title: string;
  href: string;
}
interface RawTab {
  tab: string;
  icon?: string;
  hidden?: boolean;
  align?: string;
  groups?: RawGroup[];
  pages?: RawEntry[];
}

const RAW = en as { tabs: RawTab[] };

export interface NavPage {
  kind: "page";
  /** Nav path as written, e.g. "developers/docs/payments/index". */
  path: string;
  url: string;
  title: string;
  page: DocsPage;
}
export interface NavLink {
  kind: "link";
  title: string;
  url: string;
}
export interface NavGroup {
  kind: "group";
  id: string;
  title: string;
  root?: NavPage;
  tag?: string;
  expanded: boolean;
  directory?: string;
  children: NavNode[];
}
export type NavNode = NavPage | NavLink | NavGroup;

export interface NavTab {
  /** Slug of the English tab name ("start-here", "payments", ...). */
  key: string;
  title: string;
  icon?: string;
  hidden: boolean;
  alignEnd: boolean;
  /** First page of the tab, the tab link. */
  url: string;
  /** Sidebar sections (first-level groups) or, for page-only tabs, pages. */
  items: NavNode[];
  tree: PageTree.Folder;
}

export interface DocsNavigation {
  locale: string;
  tabs: NavTab[];
  tree: PageTree.Root;
  /** Page URL -> location in the nav. */
  byUrl: Map<string, PageLocation>;
}

export interface PageLocation {
  tab: NavTab;
  /** Groups from the section down to the page's own group. */
  groups: NavGroup[];
  item: NavPage;
}

/** A page's URL in `locale` (English pages answer at every locale's URL). */
export function localizedPageUrl(locale: string, page: DocsPage): string {
  return locale === defaultLocale || page.locale === locale
    ? page.url
    : `/${locale}${page.url}`;
}

function findPage(path: string, locale: string): DocsPage | undefined {
  const segments = path.split("/");
  const slugs =
    segments[segments.length - 1] === "index"
      ? segments.slice(0, -1)
      : segments;
  const page = docsSource.getPage(slugs, locale);
  if (page && (page.locale ?? defaultLocale) === locale) return page;
  // Fall back to a direct path match (e.g. a file named like its folder).
  return docsSource
    .getPages(locale)
    .find((p) => p.path.replace(/\.mdx?$/, "") === `${locale}/${path}`);
}

function resolvePage(path: string, locale: string): DocsPage | undefined {
  const clean = path.replace(/^\/+/, "");
  return (
    (locale !== defaultLocale ? findPage(clean, locale) : undefined) ??
    findPage(clean, defaultLocale)
  );
}

function navTitle(page: DocsPage): string {
  const data = page.data as { sidebarTitle?: string; title: string };
  return data.sidebarTitle || data.title;
}

function buildNavigation(locale: string): DocsNavigation {
  const byUrl = new Map<string, PageLocation>();
  let groupCounter = 0;

  const toPage = (path: string): NavPage => {
    const page = resolvePage(path, locale);
    if (!page) throw new Error(`docs nav (${locale}): no page for "${path}"`);
    // A nav-only page with `url` frontmatter links there (e.g. /microscope).
    const target = (page.data as { url?: string }).url;
    return {
      kind: "page",
      path,
      url: target ?? localizedPageUrl(locale, page),
      title: navTitle(page),
      page,
    };
  };

  const convertEntry = (entry: RawEntry): NavNode => {
    if (typeof entry === "string") return toPage(entry);
    if ("type" in entry && entry.type === "link")
      return { kind: "link", title: entry.title, url: entry.href };
    const group = entry as RawGroup;
    return {
      kind: "group",
      id: `g${groupCounter++}`,
      title: group.group,
      root: group.root ? toPage(group.root) : undefined,
      tag: group.tag,
      expanded: group.expanded === true,
      directory: group.directory,
      children: (group.pages ?? []).map(convertEntry),
    };
  };

  const firstUrl = (nodes: NavNode[]): string | undefined => {
    for (const node of nodes) {
      if (node.kind === "page") return node.url;
      if (node.kind === "link") return node.url;
      const url = node.root?.url ?? firstUrl(node.children);
      if (url) return url;
    }
    return undefined;
  };

  const toTreeNode = (node: NavNode): PageTree.Node => {
    if (node.kind === "page")
      return {
        type: "page",
        name: node.title,
        url: node.url,
        $id: node.path,
        external: /^https?:\/\//.test(node.url) || undefined,
      };
    if (node.kind === "link")
      return { type: "page", name: node.title, url: node.url, external: true };
    return {
      type: "folder",
      $id: node.id,
      name: node.title,
      index: node.root
        ? {
            type: "page",
            name: node.root.title,
            url: node.root.url,
            $id: node.root.path,
          }
        : undefined,
      defaultOpen: node.expanded,
      children: node.children.map(toTreeNode),
    };
  };

  const tabs: NavTab[] = RAW.tabs.map((tab) => {
    const items = (tab.groups ?? tab.pages ?? []).map(convertEntry);
    const key = labelSlug(tab.tab);
    const tree: PageTree.Folder = {
      type: "folder",
      $id: `tab:${key}`,
      name: tab.tab,
      root: true,
      children: items.map(toTreeNode),
    };
    const navTab: NavTab = {
      key,
      title: tab.tab,
      icon: tab.icon,
      hidden: tab.hidden === true,
      alignEnd: tab.align === "end",
      url:
        firstUrl(items) ??
        (locale === defaultLocale ? "" : `/${locale}`) + "/developers/docs",
      items,
      tree,
    };
    const index_ = (nodes: NavNode[], groups: NavGroup[]) => {
      for (const node of nodes) {
        if (node.kind === "page") {
          if (!byUrl.has(node.url))
            byUrl.set(node.url, { tab: navTab, groups, item: node });
        } else if (node.kind === "group") {
          const chain = [...groups, node];
          if (node.root && !byUrl.has(node.root.url))
            byUrl.set(node.root.url, {
              tab: navTab,
              groups: chain,
              item: node.root,
            });
          index_(node.children, chain);
        }
      }
    };
    index_(items, []);
    return navTab;
  });

  return {
    locale,
    tabs,
    tree: {
      $id: `root:${locale}`,
      name: "Docs",
      children: tabs.map((t) => t.tree),
    },
    byUrl,
  };
}

const cache = new Map<string, DocsNavigation>();

export function getDocsNavigation(locale: string): DocsNavigation {
  const key = DOCS_LOCALES.includes(locale) ? locale : defaultLocale;
  let nav = cache.get(key);
  if (!nav) {
    nav = buildNavigation(key);
    cache.set(key, nav);
  }
  return nav;
}
