import { docsSource } from "@@/src/app/sources/docs";
import type { ReactNode } from "react";
import { DocsLayout } from "@@/src/app/components/docs-layout";
import { InkeepChatButton } from "@solana-com/ui-chrome";

const SIDEBAR_ROUTES = ["/docs/core", "/docs/tokens"];

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
    children: (tree.children ?? [])
      .filter(
        (child) =>
          child.type === "folder" &&
          SIDEBAR_ROUTES.some((route) => child.index?.url?.includes(route)),
      )
      // The nav item is already "Concepts", so hoist Core Concepts' pages to
      // the top level instead of repeating the same idea as a folder header.
      .flatMap((child) =>
        child.type === "folder" && child.index?.url?.includes("/docs/core")
          ? child.children
          : [child],
      ),
  };
  return (
    <DocsLayout tree={pageTree} locale={locale}>
      {children}
      <InkeepChatButton />
    </DocsLayout>
  );
}
