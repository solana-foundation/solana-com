import {
  DocsLayoutProps,
  DocsLayout as FumaDocsLayout,
} from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { Sidebar } from "fumadocs-ui/layouts/docs/sidebar";
import { SidebarItems } from "fumadocs-ui/layouts/docs.client";

export function DocsLayout({
  children,
  tree,
}: {
  children: ReactNode;
  tree: DocsLayoutProps["tree"];
}) {
  return (
    <div className="container-xl container-docs fumadocs">
      {/* @ts-ignore */}
      <FumaDocsLayout
        tree={tree}
        nav={{ enabled: false }}
        sidebar={{ component: <CustomSidebar /> }}
      >
        {children}
      </FumaDocsLayout>
    </div>
  );
}

function CustomSidebar() {
  return (
    <Sidebar
      className="bg-transparent sticky overflow-auto overflow-x-hidden w-0 md:min-w-[var(--fd-sidebar-width)] scrollbar-thin"
      style={{ top: 76, maxHeight: "calc(100vh - 76px)" }}
    >
      <SidebarItems />
    </Sidebar>
  );
}
