import { docsSource } from "@@/src/app/sources/docs";
import type { ReactNode } from "react";
import { DocsLayout } from "@@/src/app/components/docs-layout";
import { InkeepChatButton } from "@solana-com/ui-chrome";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tree = docsSource.pageTree[locale];
  const productsFolder = tree.children.find(
    (child) =>
      child.type === "folder" && child.index?.url?.includes("/docs/products"),
  );
  const pageTree = {
    ...tree,
    children: productsFolder ? [productsFolder] : [],
  };
  return (
    <DocsLayout tree={pageTree} locale={locale}>
      {children}
      <InkeepChatButton />
    </DocsLayout>
  );
}
