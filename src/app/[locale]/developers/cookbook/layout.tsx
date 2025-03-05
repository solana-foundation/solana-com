import { cookbookSource } from "@/app/sources/cookbook";
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
  return (
    <DocsLayout tree={cookbookSource.pageTree[locale]} locale={locale}>
      {children}
      <InkeepScript />
    </DocsLayout>
  );
}
