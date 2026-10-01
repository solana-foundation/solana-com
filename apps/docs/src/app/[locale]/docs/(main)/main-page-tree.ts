import type { PageTree } from "fumadocs-core/server";

// Marks folders that the sidebar renders as a collapsible section header
// (see docs-sidebar-page-tree.tsx) instead of a normal nested folder.
export const SECTION_GROUP_MARKER = "section-group";

const standaloneDocsRoutes = [
  "/docs/core",
  "/docs/tokens",
  "/docs/references",
  "/docs/rpc",
  "/docs/finance",
  "/docs/payments",
  "/docs/tokenization",
  "/docs/defi",
  "/docs/tools",
  "/docs/video-guides",
];

function folderContainsRoute(node: PageTree.Node, route: string): boolean {
  if (node.type === "page") return node.url?.includes(route) ?? false;
  if (node.type === "folder") {
    if (node.index?.url?.includes(route)) return true;
    return node.children.some((child) => folderContainsRoute(child, route));
  }
  return false;
}

export function getMainDocsPageTree(tree: PageTree.Root): PageTree.Root {
  return {
    ...tree,
    children: (tree.children ?? [])
      .filter(
        (child) =>
          child.type !== "folder" ||
          !standaloneDocsRoutes.some((route) =>
            folderContainsRoute(child, route),
          ),
      )
      // The nav item is already "Start here", so hoist Getting Started's
      // contents to the top level instead of nesting the same idea twice.
      .flatMap((child) =>
        child.type === "folder" && folderContainsRoute(child, "/docs/intro")
          ? child.children
          : [child],
      ),
  };
}
