import { docsSource } from "@@/src/app/sources/docs";
import type { ReactNode } from "react";
import { DocsLayout } from "@@/src/app/components/docs-layout";
import { InkeepChatButton } from "@@/src/app/components/inkeep/inkeep-chat-button";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tree = docsSource.pageTree[locale];
  const rpcFolder = tree.children.find(
    (child) =>
      typeof child.name === "string" &&
      child.name.startsWith("Solana RPC Methods"),
  );
  const pageTree = { ...tree, children: [rpcFolder] };
  return (
    <DocsLayout tree={pageTree} locale={locale}>
      {children}
      <InkeepChatButton />
    </DocsLayout>
  );
}
