import {
  DocsLayoutProps,
  DocsLayout as FumaDocsLayout,
} from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { Sidebar, SidebarViewport } from "fumadocs-ui/layouts/docs/sidebar";
import { NavbarSidebarTrigger } from "fumadocs-ui/layouts/docs.client";
import { SidebarPageTree } from "fumadocs-ui/layouts/docs/sidebar";

export function DocsLayout({
  children,
  tree,
  sidebarEnabled = true,
}: {
  children: ReactNode;
  tree: DocsLayoutProps["tree"];
  sidebarEnabled?: boolean;
}) {
  return (
    <div className="container-xl container-docs fumadocs">
      <FumaDocsLayout
        tree={tree}
        nav={{ enabled: false }}
        sidebar={{
          enabled: sidebarEnabled,
          component: <CustomSidebar />,
        }}
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
        <SidebarViewport>
          <SidebarPageTree />
        </SidebarViewport>
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
