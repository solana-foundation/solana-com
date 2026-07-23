import type { PageTree } from "fumadocs-core/server";

type Root = PageTree.Root;
type Node = PageTree.Node;
type Folder = PageTree.Folder;
type Item = PageTree.Item;

export function getToolsSidebarTree(tree: Root, activeTool?: string): Root {
  const toolsFolder = findToolsFolder(tree);
  void activeTool;
  if (!toolsFolder) return withChildren(tree, []);

  // Keep the complete Resources tree in the sidebar on every tool page. The
  // active tool expands in place instead of replacing the sidebar.
  return withChildren(tree, [
    ...(toolsFolder.index ? [toolsFolder.index] : []),
    ...toolsFolder.children,
  ]);
}

export function getToolBreadcrumbTree(tree: Root, activeTool?: string): Root {
  const toolsFolder = findToolsFolder(tree);
  if (!toolsFolder || !activeTool) {
    return withChildren(tree, []);
  }

  const activeNode = findToolNode(toolsFolder, activeTool);
  return withChildren(tree, activeNode ? [activeNode] : []);
}

export function getToolsNavigationTree(tree: Root, activeTool?: string): Root {
  const toolsFolder = findToolsFolder(tree);
  if (!toolsFolder || !activeTool) {
    return withChildren(tree, toolsFolder ? [toolsFolder] : []);
  }

  const activeNode = findToolNode(toolsFolder, activeTool);
  if (!activeNode) {
    return withChildren(tree, [toolsFolder]);
  }

  return withChildren(tree, getToolNavigationChildren(activeNode));
}

function findToolsFolder(tree: Root): Folder | undefined {
  return tree.children.find(
    (child): child is Folder =>
      child.type === "folder" &&
      Boolean(child.index?.url.endsWith("/docs/tools")),
  );
}

function findToolNode(
  toolsFolder: Folder,
  activeTool: string,
): Node | undefined {
  return toolsFolder.children.find(
    (child) => getToolSlug(getLandingPage(child)?.url) === activeTool,
  );
}

function getToolNavigationChildren(node: Node): Node[] {
  if (node.type !== "folder") return [node];
  return [...(node.index ? [node.index] : []), ...node.children];
}

function getLandingPage(node: Node): Item | undefined {
  if (node.type === "page") return node;
  if (node.type === "folder") return node.index;
}

function getToolSlug(url?: string): string | undefined {
  if (!url) return undefined;
  const toolsPath = "/docs/tools/";
  const start = url.indexOf(toolsPath);
  if (start < 0) return undefined;
  return url.slice(start + toolsPath.length).split(/[/?#]/, 1)[0];
}

function withChildren(tree: Root, children: Node[]): Root {
  return {
    ...tree,
    children,
  };
}
