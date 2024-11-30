import {
  DocsLayoutProps,
  DocsLayout as FumaDocsLayout,
} from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { Sidebar } from "fumadocs-ui/layouts/docs/sidebar";
import { NavbarSidebarTrigger } from "fumadocs-ui/layouts/docs/navbar";
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
    <>
      <Sidebar
        className="md:bg-transparent"
        style={{ maxHeight: "calc(100vh - 76px)" }}
      >
        <SidebarItems />
      </Sidebar>
      <div
        className="fixed bottom-0 left-0 z-50 p-7 md:hidden"
        id="fd-sidebar-toggle"
      >
        <NavbarSidebarTrigger />
      </div>
    </>
  );
}
