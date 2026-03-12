import { guidesSource } from "@@/src/app/sources/guides";
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
  const tree = guidesSource.pageTree[locale];
  return (
    <DocsLayout tree={tree} sidebarEnabled={false} locale={locale}>
      {children}
      <InkeepChatButton />
    </DocsLayout>
  );
}
