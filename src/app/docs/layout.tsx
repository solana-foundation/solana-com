import { source } from "@/app/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header containerClassName="container-docs" />
      <div className="max-w-[1141px] mx-auto px-4">
        <DocsLayout tree={source.pageTree}>{children}</DocsLayout>
      </div>
      <Footer />
    </>
  );
}
