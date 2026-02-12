import { DocsLayout as FumaDocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import {
  CollapsibleSidebar,
  SidebarPageTree,
  SidebarViewport,
} from "fumadocs-ui/layouts/docs/sidebar";
import { NavbarSidebarTrigger } from "fumadocs-ui/layouts/docs.client";
import { RootProvider } from "fumadocs-ui/provider";
import { I18nProvider } from "fumadocs-ui/i18n";
import { getTranslations } from "next-intl/server";
import { DocsSidebarTogglePortal } from "./docs-sidebar-toggle-portal";

export async function DocsLayout({
  children,
  tree,
  sidebarEnabled = true,
  locale,
}: {
  children: ReactNode;
  tree: any; // TODO: fix after updating to fumadocs-ui@15
  sidebarEnabled?: boolean;
  locale?: string;
}) {
  const t = await getTranslations();
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
          <DocsSidebarTogglePortal enabled={sidebarEnabled} />
        </div>
      </RootProvider>
    </I18nProvider>
  );
}

function CustomSidebar() {
  return (
    <>
      <CollapsibleSidebar
        className="md:bg-transparent text-base data-[collapsed=true]:pointer-events-none"
        style={{ maxHeight: "calc(100vh - 65px)" }}
      >
        <SidebarViewport>
          <div className="mt-1">
            <SidebarPageTree />
          </div>
        </SidebarViewport>
      </CollapsibleSidebar>
      <div
        className="fixed bottom-0 left-0 z-50 p-7 md:hidden"
        id="fd-sidebar-toggle"
      >
        <NavbarSidebarTrigger />
      </div>
    </>
  );
}
