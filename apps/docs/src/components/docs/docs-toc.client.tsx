"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import {
  AnchorProvider,
  ScrollProvider,
  TOCItem,
  useActiveAnchor,
  type TOCItemType,
} from "fumadocs-core/toc";

/**
 * "On this page", in the right column from 1280px: h1/h2 entries with their
 * h3 and h4 entries nested, the heading in view highlighted (Fumadocs' anchor
 * observer, one active item), as the docs have shown it. Markup keeps the
 * #table-of-contents ids the docs CSS targets.
 */
interface Node {
  item: TOCItemType;
  children: Node[];
}

/** Level in the list: h1 and h2 at the top, then h3, then h4. */
const level = (item: TOCItemType) => Math.max(item.depth, 2) - 2;

function nest(items: TOCItemType[]): Node[] {
  const roots: Node[] = [];
  const stack: { level: number; node: Node }[] = [];
  for (const item of items) {
    const node: Node = { item, children: [] };
    const l = level(item);
    while (stack.length && stack[stack.length - 1].level >= l) stack.pop();
    const parent = stack[stack.length - 1];
    if (parent) parent.node.children.push(node);
    else roots.push(node);
    stack.push({ level: l, node });
  }
  return roots;
}

function List({ nodes, depth }: { nodes: Node[]; depth: number }) {
  const active = useActiveAnchor();
  return (
    <ul
      id={depth === 0 ? "table-of-contents-content" : undefined}
      className={depth === 0 ? "toc" : "toc-sub"}
    >
      {nodes.map(({ item, children }) => {
        const id = item.url.slice(1);
        const isActive = active === id;
        return (
          <li
            key={item.url}
            className="toc-item"
            data-depth={depth}
            data-active={isActive ? "true" : undefined}
          >
            <TOCItem
              href={item.url}
              className="toc-link"
              aria-current={isActive ? "location" : undefined}
            >
              {item.title}
            </TOCItem>
            {children.length ? (
              <List nodes={children} depth={depth + 1} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function DocsToc({
  toc,
  label,
  icon,
}: {
  toc: TOCItemType[];
  label: string;
  icon: ReactNode;
}) {
  const scroll = useRef<HTMLDivElement>(null);
  const items = toc.filter((i) => i.depth <= 4);
  if (!items.length) return null;
  return (
    <AnchorProvider toc={items} single>
      <div id="table-of-contents-layout">
        <div id="table-of-contents">
          <div className="toc-scroll" ref={scroll}>
            <ScrollProvider containerRef={scroll}>
              <nav aria-label={label}>
                <h2 className="toc-heading">
                  <span className="toc-heading-button">
                    {icon}
                    <span>{label}</span>
                  </span>
                </h2>
                <div>
                  <List nodes={nest(items)} depth={0} />
                </div>
              </nav>
            </ScrollProvider>
          </div>
        </div>
      </div>
    </AnchorProvider>
  );
}
