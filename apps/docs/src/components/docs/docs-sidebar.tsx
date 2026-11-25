import type { ReactNode } from "react";
import type { NavGroup, NavNode, NavTab } from "@/lib/docs/navigation";
import { SidebarGroup, SidebarScrollToCurrent } from "./docs-sidebar.client";
import { ChevronIcon, ExternalArrowIcon } from "./docs-ui-icons";
import { DocsLink } from "./docs-link";

/**
 * Sidebar of the current tab, server-rendered: sections (first-level
 * groups) with a small mono heading, pages, collapsible groups and the
 * tutorial path boxes (`tag` groups, styled by content/styles/stepper.css).
 * The markup keeps the hooks the docs CSS has always targeted:
 * #sidebar-content, #navigation-items, .sidebar-group-header,
 * li[data-group-tag] > button[data-nav-href] + ul, .nav-tag-pill and
 * a[aria-current="page"]. Indent: 1rem + 0.75rem per level (inline
 * padding-left, which the RTL rules mirror).
 */

function indent(depth: number) {
  return { paddingLeft: `${1 + depth * 0.75}rem` };
}

function containsUrl(group: NavGroup, url: string): boolean {
  if (group.root?.url === url) return true;
  return group.children.some((child) =>
    child.kind === "group"
      ? containsUrl(child, url)
      : child.kind === "page" && child.url === url,
  );
}

function Item({
  node,
  depth,
  current,
}: {
  node: NavNode;
  depth: number;
  current: string;
}) {
  // Links out of the docs (nav links, pages with a `url`) open in a new tab.
  if (
    node.kind === "link" ||
    (node.kind === "page" && /^https?:/.test(node.url))
  ) {
    return (
      <li className="sidebar-item" data-title={node.title}>
        <a
          href={node.url}
          className="sidebar-link"
          style={indent(depth)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="sidebar-link-inner">
            <div className="sidebar-link-text">
              <span>{node.title}</span>
            </div>
            <div className="sidebar-ext">
              <ExternalArrowIcon className="sidebar-ext-icon" />
            </div>
          </div>
        </a>
      </li>
    );
  }
  if (node.kind === "page") {
    const active = node.url === current;
    return (
      <li
        id={node.url}
        className="sidebar-item"
        data-title={node.title}
        data-active={active ? "true" : undefined}
        data-active-nav-item={active ? "true" : undefined}
      >
        <DocsLink
          href={node.url}
          className="sidebar-link"
          style={indent(depth)}
          aria-current={active ? "page" : undefined}
        >
          <div className="sidebar-link-inner">
            <div className="sidebar-link-text">
              <span>{node.title}</span>
            </div>
          </div>
        </DocsLink>
      </li>
    );
  }
  const open = node.expanded || containsUrl(node, current);
  const rootActive = node.root?.url === current;
  return (
    <SidebarGroup
      id={node.root?.url}
      title={node.title}
      tag={node.tag ?? ""}
      href={node.root?.url}
      defaultOpen={open}
      active={containsUrl(node, current)}
      rootActive={rootActive}
      style={indent(depth)}
      label={
        node.tag ? (
          <div className="sidebar-group-label sidebar-group-label-tag">
            <span>{node.title}</span>
            <span className="nav-tag-pill">
              <span className="nav-tag-pill-text" data-nav-tag={node.tag}>
                {node.tag}
              </span>
            </span>
          </div>
        ) : (
          <div className="sidebar-group-label">
            <span>{node.title}</span>
          </div>
        )
      }
      chevron={<ChevronIcon className="sidebar-chevron" />}
    >
      {node.children.map((child, i) => (
        <Item key={i} node={child} depth={depth + 1} current={current} />
      ))}
    </SidebarGroup>
  );
}

/**
 * The tab's sections and pages. docs-page.tsx creates this element once and
 * shows it twice, in the desktop sidebar and in the header's menu, so the
 * page's RSC payload carries the (long) nav once.
 */
export function SidebarItems({
  tab,
  current,
}: {
  tab: NavTab;
  current: string;
}) {
  const grouped = tab.items.every((n) => n.kind === "group");
  if (!grouped) {
    // Page-only tabs (Start here): each entry is its own list; a group
    // (the Quickstart path box) is set off by a section gap.
    return tab.items.map((node, i) => (
      <ul
        key={i}
        className={
          node.kind === "group"
            ? "sidebar-group sidebar-group-spaced"
            : "sidebar-group"
        }
      >
        <Item node={node} depth={0} current={current} />
      </ul>
    ));
  }
  return (tab.items as NavGroup[]).map((section, i) => (
    <div key={i} className="sidebar-section">
      {/* Not a heading: the sidebar comes before the page's H1, and the
          page's headings are its outline. */}
      <div className="sidebar-group-header">
        <p className="sidebar-title">{section.title}</p>
      </div>
      <ul className="sidebar-group">
        {section.children.map((node, j) => (
          <Item key={j} node={node} depth={0} current={current} />
        ))}
      </ul>
    </div>
  ));
}

export function SidebarNav({
  id = "navigation-items",
  children,
}: {
  /** The desktop sidebar's list is #navigation-items; the menu copy has none. */
  id?: string;
  /** A <SidebarItems> element. */
  children: ReactNode;
}) {
  return (
    <div id={id || undefined} className="navigation-items">
      {children}
    </div>
  );
}

export function DocsSidebar({
  items,
  current,
  label,
}: {
  /** A <SidebarItems> element. */
  items: ReactNode;
  current: string;
  label: string;
}) {
  return (
    <nav id="sidebar" aria-label={label}>
      <div id="sidebar-content" data-docs-sidebar-scroll="">
        <div className="sidebar-scroll" data-docs-sidebar-viewport="">
          <div className="sidebar-inner">
            <div className="sidebar-fade" aria-hidden="true" />
            <SidebarNav>{items}</SidebarNav>
          </div>
          <SidebarScrollToCurrent current={current} />
        </div>
      </div>
    </nav>
  );
}
