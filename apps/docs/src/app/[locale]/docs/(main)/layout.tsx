import { docsSource } from "@@/src/app/sources/docs";
import type { ReactNode } from "react";
import type { PageTree } from "fumadocs-core/server";
import { DocsLayout } from "@@/src/app/components/docs-layout";
import { InkeepChatButton } from "@solana-com/ui-chrome";

function folderContainsRoute(node: PageTree.Node, route: string): boolean {
  if (node.type === "page") return node.url?.includes(route) ?? false;
  if (node.type === "folder") {
    if (node.index?.url?.includes(route)) return true;
    return node.children.some((child) => folderContainsRoute(child, route));
  }
  return false;
}

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tree = docsSource.pageTree[locale];
  const standaloneDocsRoutes = [
    "/docs/core",
    "/docs/tokens",
    "/docs/references",
    "/docs/rpc",
    "/docs/payments",
    "/docs/tokenization",
    "/docs/defi",
    "/docs/tools",
  ];
  const pageTree = {
    ...tree,
    children: (tree.children ?? [])
      .filter(
        (child) =>
          child.type !== "folder" ||
          !standaloneDocsRoutes.some((route) =>
            child.index?.url?.includes(route),
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
  return (
    <DocsLayout tree={pageTree} locale={locale}>
      {children}
      <InkeepChatButton />
    </DocsLayout>
  );
}
