import { guidesSource } from "@/app/sources/guides";
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
  const tree = guidesSource.pageTree[locale];
  return (
    <DocsLayout tree={tree} sidebarEnabled={false} locale={locale}>
      {children}
    </DocsLayout>
  );
}
