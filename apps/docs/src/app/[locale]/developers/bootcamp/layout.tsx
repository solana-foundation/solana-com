import { developersLearnSource } from "@@/src/app/sources/developers-learn";
import type { ReactNode } from "react";
import { DocsLayout } from "@@/src/app/components/docs-layout";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <DocsLayout tree={developersLearnSource.pageTree[locale]} locale={locale}>
      {children}
    </DocsLayout>
  );
}
