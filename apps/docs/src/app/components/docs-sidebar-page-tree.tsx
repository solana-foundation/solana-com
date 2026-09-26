"use client";

import type { PageTree } from "fumadocs-core/server";
import { useTreePath } from "fumadocs-ui/provider";
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
} from "fumadocs-ui/layouts/docs/sidebar";
import { SECTION_GROUP_MARKER } from "@@/src/app/[locale]/docs/(main)/main-page-tree";

// Renders every folder in the sidebar. Folders tagged SECTION_GROUP_MARKER
// are synthetic top-level groups (see main-page-tree.ts's groupIntoSections
// for why they exist) and get the small uppercase section-header look;
// every other folder — including nested ones inside a section group —
// falls through to the normal folder rendering below, unchanged.
export function DocsSidebarFolder({
  item,
  children,
}: {
  item: PageTree.Folder;
  level: number;
  children: React.ReactNode;
}) {
  const path = useTreePath();
  const defaultOpen = item.defaultOpen ?? path.includes(item);

  if (item.$id === SECTION_GROUP_MARKER) {
    return (
      <SidebarFolder defaultOpen={defaultOpen} className="mt-8 first:mt-0">
        <SidebarFolderTrigger>
          <span className="text-xs font-medium tracking-wide text-fd-muted-foreground uppercase">
            {item.name}
          </span>
        </SidebarFolderTrigger>
        <SidebarFolderContent>{children}</SidebarFolderContent>
      </SidebarFolder>
    );
  }

  return (
    <SidebarFolder defaultOpen={defaultOpen}>
      {item.index ? (
        <SidebarFolderLink href={item.index.url} external={item.index.external}>
          {item.icon}
          {item.name}
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger>
          {item.icon}
          {item.name}
        </SidebarFolderTrigger>
      )}
      <SidebarFolderContent>{children}</SidebarFolderContent>
    </SidebarFolder>
  );
}
