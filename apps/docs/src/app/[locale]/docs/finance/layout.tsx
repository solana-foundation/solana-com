import { docsSource } from "@@/src/app/sources/docs";
import type { ReactNode } from "react";
import { DocsLayout } from "@@/src/app/components/docs-layout";
import { AskSolanaButton } from "@solana-com/ui-chrome";
import { getFinancePageTree } from "./finance-page-tree";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pageTree = getFinancePageTree(docsSource.pageTree[locale]);

  return (
    <DocsLayout tree={pageTree} locale={locale}>
      {children}
      <AskSolanaButton />
    </DocsLayout>
  );
}
