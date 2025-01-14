import { docsSource } from "@/app/source";
import type { ReactNode } from "react";
import { DocsLayout } from "@/app/components/docs-layout";

export default function Layout({ children }: { children: ReactNode }) {
  const rpcFolder = docsSource.pageTree.children.find(
    (child) =>
      typeof child.name === "string" &&
      child.name.startsWith("Solana RPC Methods"),
  );
  const pageTree = { ...docsSource.pageTree, children: [rpcFolder] };
  return <DocsLayout tree={pageTree}>{children}</DocsLayout>;
}
