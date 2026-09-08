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
import type { PageTree } from "fumadocs-core/server";

function flattenChildlessFolders(nodes: PageTree.Node[]): PageTree.Node[] {
  return nodes.map((node) => {
    if (node.type !== "folder") return node;

    const children = flattenChildlessFolders(node.children);

    if (node.index && children.length === 0) {
      return {
        ...node.index,
        icon: node.index.icon ?? node.icon,
      } satisfies PageTree.Item;
    }

    return { ...node, children };
  });
}

export async function DocsLayout({
  children,
  tree,
  sidebarEnabled = true,
  locale = "en",
}: {
  children: ReactNode;
  tree: PageTree.Root;
  sidebarEnabled?: boolean;
  locale?: string;
}) {
  const t = await getTranslations();
  const sidebarTree: PageTree.Root = {
    ...tree,
    children: flattenChildlessFolders(tree.children),
  };
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
            tree={sidebarTree}
            nav={{ enabled: false }}
            sidebar={{
              enabled: sidebarEnabled,
              collapsible: sidebarEnabled,
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
        style={{ maxHeight: "calc(100vh - var(--fd-nav-height))" }}
      >
        <SidebarViewport>
          <div className="mt-1">
            <SidebarPageTree />
          </div>
        </SidebarViewport>
      </CollapsibleSidebar>
      <div
        className="fixed bottom-0 left-0 z-50 p-10 md:hidden"
        id="fd-sidebar-toggle"
      >
        <NavbarSidebarTrigger />
      </div>
    </>
  );
}
