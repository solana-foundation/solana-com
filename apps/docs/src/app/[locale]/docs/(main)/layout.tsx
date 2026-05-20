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
  const standaloneDocsRoutes = [
    "/docs/rpc",
    "/docs/payments",
    "/docs/products",
  ];
  const pageTree = {
    ...tree,
    children: tree.children?.filter(
      (child) =>
        child.type !== "folder" ||
        !standaloneDocsRoutes.some((route) =>
          child.index?.url?.includes(route),
        ),
    ),
  };
  return (
    <DocsLayout tree={pageTree} locale={locale}>
      {children}
      <InkeepChatButton />
    </DocsLayout>
  );
}
