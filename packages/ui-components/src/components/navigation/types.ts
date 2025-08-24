import { ReactNode } from 'react';

export interface NavigationItem {
  label: string;
  href?: string;
  children?: NavigationSubItem[];
  icon?: ReactNode;
  color?: string;
  isActive?: boolean | ((pathname: string) => boolean);
}

export interface NavigationSubItem {
  title?: string;
  icon?: ReactNode;
  items: NavigationLink[];
  divider?: boolean;
  columnWidth?: 'auto' | 'compact' | 'normal' | 'wide';
}

export interface NavigationLink {
  label: string;
  href: string;
  description?: string;
  image?: ReactNode;
  isExternal?: boolean;
  isActive?: boolean | ((pathname: string) => boolean);
}

export interface NavigationProps {
  items: NavigationItem[];
  logo?: ReactNode;
  logoHref?: string;
  searchBar?: ReactNode;
  themeToggle?: ReactNode;
  currentPath?: string;
  className?: string;
  containerClassName?: string;
  darkMode?: boolean;
}