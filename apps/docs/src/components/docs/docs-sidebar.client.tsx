"use client";

import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

/**
 * A collapsible sidebar group. With a root page (`href`), the header is a
 * button that opens the root page and the group; on the root page itself it
 * only folds the group. Without one it only folds. Groups that hold the
 * current page, or are `expanded` in the nav, start open. Without
 * JavaScript the initial (server) state stays: open groups are open, the
 * others closed, and the root page is reachable from the tab's pages.
 */
export function SidebarGroup({
  id,
  title,
  tag,
  href,
  defaultOpen,
  active,
  rootActive,
  style,
  label,
  chevron,
  children,
}: {
  id?: string;
  title: string;
  tag: string;
  href?: string;
  defaultOpen: boolean;
  active: boolean;
  rootActive: boolean;
  style: CSSProperties;
  label: ReactNode;
  chevron: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const router = useRouter();
  const listId = useId();

  // A navigation into the group (sidebar, links, back/forward) opens it.
  useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);

  return (
    <li
      id={id}
      className="sidebar-item sidebar-item-group"
      data-title={title}
      data-group-tag={tag}
      data-active={active ? "true" : undefined}
    >
      <button
        type="button"
        className={
          rootActive
            ? "sidebar-link sidebar-group-button is-active"
            : "sidebar-link sidebar-group-button"
        }
        style={style}
        data-nav-href={rootActive ? undefined : href}
        data-active-nav-item={rootActive ? "true" : undefined}
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => {
          if (href && !rootActive) {
            setOpen(true);
            router.push(href);
          } else {
            setOpen((value) => !value);
          }
        }}
      >
        {label}
        <div className="sidebar-chevron-wrap" data-open={open ? "" : undefined}>
          {chevron}
        </div>
      </button>
      {open ? (
        <ul id={listId} className="sidebar-subgroup">
          {children}
        </ul>
      ) : null}
    </li>
  );
}

/**
 * Keeps the current page in view in the sidebar: on load and after each
 * navigation the sidebar scrolls so the current item is centred, as before.
 */
export function SidebarScrollToCurrent({ current }: { current: string }) {
  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>(
      "#sidebar-content [data-docs-sidebar-viewport]",
    );
    const item = scroller?.querySelector<HTMLElement>(
      '[aria-current="page"], [data-active-nav-item="true"]',
    );
    if (!scroller || !item) return;
    const top =
      item.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop;
    const visible =
      top >= scroller.scrollTop &&
      top + item.offsetHeight <= scroller.scrollTop + scroller.clientHeight;
    if (visible) return;
    scroller.scrollTop = Math.max(
      0,
      Math.floor(top - (scroller.clientHeight - item.offsetHeight) / 2),
    );
  }, [current]);
  return null;
}
