import { DocsLayout } from "@@/src/app/components/docs-layout";
import { docsSource } from "@@/src/app/sources/docs";
import { InkeepChatButton } from "@solana-com/ui-chrome";
import type { ReactNode } from "react";
import { getMainDocsPageTree } from "../(main)/main-page-tree";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pageTree = getMainDocsPageTree(docsSource.pageTree[locale]);

  return (
    <DocsLayout tree={pageTree} locale={locale}>
      {children}
      <InkeepChatButton />
    </DocsLayout>
  );
}
