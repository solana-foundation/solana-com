import { developersLearnSource } from "@@/src/app/sources/developers-learn";
import { notFound } from "next/navigation";
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
  const tree = developersLearnSource.pageTree[locale];
  if (!tree) notFound();
  return (
    <DocsLayout tree={tree} locale={locale}>
      {children}
      <InkeepChatButton />
    </DocsLayout>
  );
}
