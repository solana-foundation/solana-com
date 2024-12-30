import { cookbookSource } from "@/app/source";
import type { ReactNode } from "react";
import { DocsLayout } from "@/app/components/docs-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsLayout tree={cookbookSource.pageTree}>{children}</DocsLayout>;
}
