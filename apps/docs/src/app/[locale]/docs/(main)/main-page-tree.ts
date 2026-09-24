import type { PageTree } from "fumadocs-core/server";

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
