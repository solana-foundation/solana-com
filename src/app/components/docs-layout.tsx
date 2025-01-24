import {
  DocsLayoutProps,
  DocsLayout as FumaDocsLayout,
} from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { Sidebar, SidebarViewport } from "fumadocs-ui/layouts/docs/sidebar";
import { NavbarSidebarTrigger } from "fumadocs-ui/layouts/docs.client";
import { SidebarPageTree } from "fumadocs-ui/layouts/docs/sidebar";
import { RootProvider } from "fumadocs-ui/provider";
import { I18nProvider } from "fumadocs-ui/i18n";
import { serverTranslation } from "@/i18n/translation";

export async function DocsLayout({
  children,
  tree,
  sidebarEnabled = true,
  locale,
}: {
  children: ReactNode;
  tree: DocsLayoutProps["tree"];
  sidebarEnabled?: boolean;
  locale?: string;
}) {
  const { t } = await serverTranslation(locale);
  const translations = {
    toc: t("shared.general.toc"),
    editOnGithub: t("shared.general.edit-page"),
    nextPage: t("developers.nav.next"),
    previousPage: t("developers.nav.prev"),
  };

  return (
    <I18nProvider locale={locale} locales={[]} translations={translations}>
      <RootProvider
        search={{ enabled: false }}
        theme={{ disableTransitionOnChange: true }}
      >
        <div className="container-xl fumadocs">
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
      </RootProvider>
    </I18nProvider>
  );
}

function CustomSidebar() {
  return (
    <>
      <Sidebar
        className="md:bg-transparent text-base"
        style={{ maxHeight: "calc(100vh - 76px)" }}
      >
        <SidebarViewport>
          <div className="mt-1">
            <SidebarPageTree />
          </div>
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
