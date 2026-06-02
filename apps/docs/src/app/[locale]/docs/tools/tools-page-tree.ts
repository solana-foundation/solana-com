import type { PageTree } from "fumadocs-core/server";

type Root = PageTree.Root;
type Node = PageTree.Node;
type Folder = PageTree.Folder;
type Item = PageTree.Item;

export function getToolsSidebarTree(tree: Root, activeTool?: string): Root {
  const toolsFolder = findToolsFolder(tree);
  if (!toolsFolder || !activeTool) {
    return withChildren(
      tree,
      toolsFolder ? getToolLandingPages(toolsFolder) : [],
    );
  }

  const activeNode = findToolNode(toolsFolder, activeTool);
  if (!activeNode) {
    return withChildren(tree, [toolsFolder]);
  }

  const otherTools = getOtherToolsFolder(toolsFolder, activeNode);
  return withChildren(tree, [
    ...getToolNavigationChildren(activeNode),
    ...(otherTools ? [otherTools] : []),
  ]);
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

function getOtherToolsFolder(
  toolsFolder: Folder,
  activeNode: Node,
): Folder | undefined {
  const otherTools = toolsFolder.children
    .filter((child) => child !== activeNode)
    .map((child) => getLandingPage(child))
    .filter((child): child is Item => Boolean(child));

  if (otherTools.length === 0) return undefined;

  return {
    $id: `${toolsFolder.$id ?? "tools"}#other-tools`,
    type: "folder",
    name: "Other Tools",
    defaultOpen: false,
    children: otherTools,
  };
}

function getToolLandingPages(toolsFolder: Folder): Item[] {
  return toolsFolder.children
    .map((child) => getLandingPage(child))
    .filter((child): child is Item => Boolean(child));
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
