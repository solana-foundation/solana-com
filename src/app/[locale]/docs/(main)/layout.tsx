import { docsSource } from "@/app/sources/docs";
import type { ReactNode } from "react";
import { DocsLayout } from "@/app/components/docs-layout";

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
        !child.name.startsWith("Solana RPC Methods"),
    ),
  };
  return (
    <DocsLayout tree={pageTree} locale={locale}>
      {children}
    </DocsLayout>
  );
}
