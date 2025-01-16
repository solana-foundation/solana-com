import { coursesSource } from "@/app/sources/courses";
import type { ReactNode } from "react";
import { DocsLayout } from "@/app/components/docs-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={coursesSource.pageTree} sidebarEnabled={false}>
      {children}
    </DocsLayout>
  );
}
