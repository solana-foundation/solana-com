import { docsSource } from "@/app/source";
import type { ReactNode } from "react";
import { DocsLayout } from "@/app/components/docs-layout";

export default function Layout({ children }: { children: ReactNode }) {
  const pageTree = {
    ...docsSource.pageTree,
    children: docsSource.pageTree.children.filter(
      (child) => child.name !== "Solana RPC Methods",
    ),
  };
  return <DocsLayout tree={pageTree}>{children}</DocsLayout>;
}