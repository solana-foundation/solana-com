import { docsSource } from "@@/src/app/sources/docs";
import { DocsLayout } from "@@/src/app/components/docs-layout";
import { InkeepChatButton } from "@solana-com/ui-chrome";
import type { ReactNode } from "react";
import { getToolsSidebarTree } from "../../../tools/tools-page-tree";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const sidebarTree = getToolsSidebarTree(docsSource.pageTree[locale]);

  // Detail guides keep their stable installation URLs, but they are indexed
  // as local-development resources and should retain that navigation context.
  return (
    <DocsLayout tree={sidebarTree} locale={locale}>
      {children}
      <InkeepChatButton />
    </DocsLayout>
  );
}
