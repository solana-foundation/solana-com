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

  return (
    <DocsLayout
      tree={docsSource.pageTree[locale]}
      locale={locale}
      sidebarEnabled={false}
    >
      {children}
      <InkeepChatButton />
    </DocsLayout>
  );
}
