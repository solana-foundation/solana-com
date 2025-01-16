import { guidesSource } from "@/app/sources/guides";
import type { ReactNode } from "react";
import { DocsLayout } from "@/app/components/docs-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={guidesSource.pageTree} sidebarEnabled={false}>
      {children}
    </DocsLayout>
  );
}
