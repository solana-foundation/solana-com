import type { PageTree } from "fumadocs-core/server";
import { SECTION_GROUP_MARKER } from "../(main)/main-page-tree";

const DEPIN_SLUGS = ["building-depin-projects"];
const PRIVACY_SLUGS = ["confidential-balances"];
const PAYMENTS_SLUGS = ["agent-payments", "pay-sh-video-tutorials"];

// Wrap each group in the same collapsible header ("Documentation" in the
// Start here tab) so the sidebar looks consistent across tabs.
function sectionGroup(
  name: string,
  children: PageTree.Node[],
): PageTree.Folder {
  return {
    $id: SECTION_GROUP_MARKER,
    type: "folder",
    name,
    defaultOpen: true,
    children,
  };
}

function inSlugs(node: PageTree.Node, slugs: string[]): boolean {
  const url =
    node.type === "folder" ? node.index?.url : (node as PageTree.Item).url;
  return slugs.some((slug) => url?.endsWith(`/docs/video-guides/${slug}`));
}

export function getVideoGuidesPageTree(tree: PageTree.Root): PageTree.Root {
  const folder = tree.children.find(
    (child): child is PageTree.Folder =>
      child.type === "folder" &&
      Boolean(child.index?.url.endsWith("/docs/video-guides")),
  );

  if (!folder) return { ...tree, children: [] };

  const depin = folder.children.filter((c) => inSlugs(c, DEPIN_SLUGS));
  const payments = folder.children.filter((c) => inSlugs(c, PAYMENTS_SLUGS));
  const privacy = folder.children.filter((c) => inSlugs(c, PRIVACY_SLUGS));
  const rest = folder.children.filter(
    (c) =>
      ![DEPIN_SLUGS, PAYMENTS_SLUGS, PRIVACY_SLUGS].some((s) => inSlugs(c, s)),
  );

  return {
    ...tree,
    // Breadcrumbs on course pages start at "Video Tutorials" (see rootHref).
    name: "Video Tutorials",
    children: [
      sectionGroup("Foundations", rest),
      sectionGroup("Payments", payments),
      sectionGroup("Privacy", privacy),
      sectionGroup("Hardware & DePIN", depin),
    ],
  };
}
