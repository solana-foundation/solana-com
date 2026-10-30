/**
 * Docs navigation shapes (navigation/en.json, read by apps/docs
 * src/lib/docs/navigation.ts).
 */

/** A page entry: a page id (see lib/content-paths.ts). */
export type NavPage = string;

export interface NavGroup {
  group: string;
  /** Page that opens when the group label is clicked. */
  root?: NavPage;
  icon?: string;
  /** Small label next to the group name (path groups show their duration). */
  tag?: string;
  expanded?: boolean;
  hidden?: boolean;
  searchable?: boolean;
  directory?: "none" | "accordion" | "card";
  pages: NavEntry[];
}

/** An external sidebar link. */
export interface NavLink {
  type: "link";
  title: string;
  /** Absolute http(s) URL. */
  href: string;
}

export type NavEntry = NavPage | NavGroup | NavLink;

export interface NavTab {
  tab: string;
  icon?: string;
  /** External or internal link instead of a sidebar. */
  href?: string;
  align?: "start" | "end";
  hidden?: boolean;
  searchable?: boolean;
  groups?: NavGroup[];
  /**
   * Pages (and groups) listed straight in the tab, with no group header
   * above them (the Start here tab). The docs render a page here as a plain
   * sidebar entry and a group as a collapsible entry.
   */
  pages?: NavEntry[];
}

/** Contents of apps/docs/content/navigation/en.json. */
export interface NavFile {
  tabs: NavTab[];
}

export const isGroup = (e: NavEntry): e is NavGroup =>
  typeof e === "object" && "group" in e;

/** English page deliberately left out of navigation/en.json. */
export interface UnlistedPage {
  page: NavPage;
  reason: string;
}
