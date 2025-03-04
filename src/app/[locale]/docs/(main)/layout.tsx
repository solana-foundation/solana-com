import { docsSource } from "@/app/sources/docs";
import type { ReactNode } from "react";
import { DocsLayout } from "@/app/components/docs-layout";
import { InkeepScript } from "@/app/components/inkeep/inkeep-script";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tree = docsSource.pageTree[locale];
  const pageTree = {
    ...tree,
    children: tree.children.filter(
      (child) =>
        typeof child.name !== "string" ||
        (!child.name.startsWith("Solana RPC Methods") &&
          !child.name.startsWith("The Solana Toolkit")),
    ),
  };
  return (
    <DocsLayout tree={pageTree} locale={locale}>
      {children}
      <InkeepScript />
    </DocsLayout>
  );
}
