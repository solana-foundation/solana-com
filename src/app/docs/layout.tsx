import { source } from "@/app/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sidebar } from "fumadocs-ui/layouts/docs/sidebar";
import { SidebarItems } from "fumadocs-ui/layouts/docs.client";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header containerClassName="container-docs" />
      <div className="container-xl container-docs fumadocs">
        {/* @ts-ignore */}
        <DocsLayout
          tree={source.pageTree}
          nav={{ enabled: false }}
          sidebar={{ component: <CustomSidebar /> }}
        >
          {children}
        </DocsLayout>
      </div>
      <Footer />
    </>
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
