/**
 * The docs header and footer, as shown on the /developers landing
 * (src/app/(docs)/[locale]/developers/docs-header.tsx, docs-footer.tsx).
 *
 * Everything here is read at build time from the docs content
 * (apps/docs/content), so the landing cannot drift from the docs:
 * - tabs, their order, icons and first pages: navigation/en.json
 *   (hidden tabs are skipped, as in the docs);
 * - tab labels: the English tab names (English in every locale);
 * - the search prompt and the footer columns and socials: docs.json.
 * Hrefs are localized with `localizedHref`, like the rest of the landing.
 */
import docsConfig from "@@/content/docs.json";
import enNav from "@@/content/navigation/en.json";
import { localizedHref } from "./hub";

/** Lucide icon names used by the docs tabs (navigation/en.json `icon`). */
export type DocsTabIcon =
  | "house"
  | "credit-card"
  | "layers"
  | "chart-line"
  | "box"
  | "wrench"
  | "book"
  | "play";

export type DocsTab = {
  /** Label key, e.g. "payments" (slug of the English tab name). */
  key: string;
  label: string;
  href: string;
  icon: DocsTabIcon;
  /** Pushed to the far end of the bar (navigation `align: "end"`). */
  alignEnd: boolean;
};

type NavNode = {
  tab?: string;
  icon?: string;
  hidden?: boolean;
  align?: string;
  href?: string;
  pages?: unknown[];
  groups?: unknown[];
  group?: string;
};

/** Slug of an English tab name, e.g. "Video tutorials" -> "video-tutorials". */
export function labelSlug(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "x"
  );
}

/**
 * First page of a tab, as the docs tab bar links it
 * ("developers/docs/payments/index" -> "/developers/docs/payments").
 */
function firstPage(node: unknown): string | null {
  if (typeof node === "string") return node;
  if (!node || typeof node !== "object") return null;
  const n = node as NavNode;
  if (n.href) return n.href;
  for (const list of [n.groups, n.pages]) {
    for (const child of list ?? []) {
      const page = firstPage(child);
      if (page) return page;
    }
  }
  return null;
}

function pageToHref(page: string): string {
  if (/^https?:\/\//.test(page)) return page;
  const path = `/${page.replace(/^\/+/, "")}`.replace(/\/index$/, "");
  return path || "/";
}

const EN_TABS = (enNav.tabs as NavNode[])
  .filter((tab) => !tab.hidden && tab.tab)
  .map((tab) => {
    const page = firstPage(tab);
    if (!page) throw new Error(`docs tab "${tab.tab}" has no pages`);
    return {
      key: labelSlug(tab.tab!),
      english: tab.tab!,
      href: pageToHref(page),
      icon: (tab.icon ?? "book") as DocsTabIcon,
      alignEnd: tab.align === "end",
    };
  });

/**
 * Tabs after which the docs header draws a hairline divider (apps/docs
 * styles/theme.css section 5: after the 4th tab, Markets).
 */
export const DOCS_TAB_DIVIDER_AFTER = 3;

export function getDocsTabs(locale: string): DocsTab[] {
  return EN_TABS.map(({ english, ...tab }) => ({
    ...tab,
    label: english,
    href: localizedHref(locale, tab.href),
  }));
}

/** Placeholder of the docs search field (docs.json `search.prompt`). */
export const DOCS_SEARCH_PROMPT: string = docsConfig.search.prompt;

/**
 * Where the /developers search field sends readers. The docs search
 * (components/docs) opens on arrival and types `query`.
 */
export function docsSearchHref(locale: string, query = ""): string {
  const docs = localizedHref(locale, "/developers/docs");
  const q = query.trim();
  return `${docs}?q=${encodeURIComponent(q)}`;
}

const SITE_ORIGIN = /^https:\/\/solana\.com(?=\/|$)/;

export type FooterColumn = {
  header: string;
  items: { label: string; href: string }[];
};

/** Footer link columns from docs.json, with solana.com links made relative. */
export function getDocsFooterColumns(locale: string): FooterColumn[] {
  return docsConfig.footer.links.map((column) => ({
    header: column.header,
    items: column.items.map((item) => {
      const relative = item.href.replace(SITE_ORIGIN, "") || "/";
      return {
        label: item.label,
        href: relative.startsWith("/")
          ? localizedHref(locale, relative)
          : item.href,
      };
    }),
  }));
}

export type FooterSocial = { id: string; href: string };

/** Footer social links from docs.json, in docs order. */
export const DOCS_FOOTER_SOCIALS: FooterSocial[] = Object.entries(
  docsConfig.footer.socials,
).map(([id, href]) => ({ id, href }));
