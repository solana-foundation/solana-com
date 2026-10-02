import type { PageTree } from "fumadocs-core/server";

// fumadocs' meta.json only supports "---Label---" as a plain, non-collapsible
// text divider — there's no built-in way to make a group of sidebar items
// expand/collapse under a shared header. groupIntoSections below converts
// each divider (and everything under it) into a real, collapsible Folder
// node instead, and docs-sidebar-page-tree.tsx's Folder override renders
// folders carrying this marker as a section header (small, uppercase,
// muted label) rather than a normal nested folder link. This is scoped to
// the "Start here" tree built by getMainDocsPageTree — other tabs
// (Resources, RPC, etc.) still get fumadocs' plain divider as-is.
//
// If you're adding a new top-level group to this tree, add a
// "---Label---" entry to content/docs/en/meta.json — no code changes
// needed here.
//
// A "---:Label---" (leading colon) entry instead adds a plain, NON-
// collapsible sub-divider inside the currently-open top-level group,
// rendered with fumadocs' default separator look — use this to visually
// cluster a few items inside one group (e.g. "Full Learning Paths" /
// "Hardware & DePIN" inside a single "Video Guides" group) without giving
// each cluster its own independent collapse/expand toggle.
export const SECTION_GROUP_MARKER = "section-group";
const NESTED_DIVIDER_PREFIX = ":";

// Collapses each "---Label---" separator and the nodes that follow it
// (up to the next separator) into a single collapsible folder, so section
// headers can be expanded/collapsed like the rest of the sidebar tree.
// "---:Label---" separators are nested as a plain divider inside the
// current group instead of starting a new top-level one.
function groupIntoSections(nodes: PageTree.Node[]): PageTree.Node[] {
  const result: PageTree.Node[] = [];
  let currentGroup: PageTree.Folder | null = null;

  for (const node of nodes) {
    if (node.type === "separator") {
      const rawName = typeof node.name === "string" ? node.name : "";
      const isNestedDivider = rawName.startsWith(NESTED_DIVIDER_PREFIX);
      const name = isNestedDivider
        ? rawName.slice(NESTED_DIVIDER_PREFIX.length)
        : node.name;

      if (isNestedDivider && currentGroup) {
        currentGroup.children.push({ type: "separator", name });
        continue;
      }

      currentGroup = {
        $id: SECTION_GROUP_MARKER,
        type: "folder",
        name,
        defaultOpen: true,
        children: [],
      };
      result.push(currentGroup);
      continue;
    }

    if (currentGroup) {
      currentGroup.children.push(node);
    } else {
      result.push(node);
    }
  }

  return result;
}

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
    children: groupIntoSections(
      (tree.children ?? [])
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
    ),
  };
}
