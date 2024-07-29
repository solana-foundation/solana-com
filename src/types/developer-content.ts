import { ContentApiNavItem } from "./content-api";

export type DocsNavSidebarProps = {
  docsNav: ContentApiNavItem[];
  className: string;
  currentPath: string;
  isExpandedDefault?: boolean;
};

export type SidebarFolderProps = {
  currentPath: string;
  folder: ContentApiNavItem;
  isExpandedDefault: boolean;
};

export type SidebarMenuProps = {
  isExpandedDefault: boolean;
  navItems?: ContentApiNavItem[];
  currentPath: string;
  nestedCount?: number;
  isOpen?: boolean;
  isInFolder?: boolean;
};

export type SidebarMenuChildrenProps = {
  isExpandedDefault: boolean;
  section: ContentApiNavItem;
  currentPath: string;
  nestedCount: number;
};
