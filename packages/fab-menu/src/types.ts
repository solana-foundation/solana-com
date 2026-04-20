export interface FabMenuConfig {
  /** API endpoint URL to fetch menu data */
  apiUrl?: string;

  /** FAB screen position */
  position?:
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left"
    | {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
      };

  /** Z-index for the FAB and overlay (default: 999999) */
  zIndex?: number;

  /** Logo variant for the FAB button */
  logoVariant?: "dark-mono" | "light-mono" | "color";

  /** Theme overrides — maps to CSS custom properties */
  theme?: Partial<{
    bg: string;
    cta: string;
    primary: string;
    inverse: string;
    highEmText: string;
    midEmText: string;
    midEmTextAlpha: string;
    borderLight: string;
    borderProminent: string;
    borderHovered: string;
  }>;

  /** Callbacks */
  onOpen?: () => void;
  onClose?: () => void;
  onLinkClick?: (href: string, tabId: string) => void;
}

export type TabIcon = "builder" | "business" | "consumer";

export interface TabData {
  id: string;
  title: string;
  icon: TabIcon;
}

export interface LinkData {
  title: string;
  href: string;
  icon?: string;
}

export interface FeaturedData {
  label: string;
  title: string;
  ctaText: string;
  ctaHref: string;
}

export interface StatData {
  value: string;
  label: string;
}

export interface PromoData {
  badge: string;
  text: string;
  href: string;
}

export interface MenuData {
  title: string;
  tabs: TabData[];
  featured: Record<string, FeaturedData>;
  stats: Record<string, StatData>;
  links: Record<string, LinkData[]>;
  promo?: PromoData;
  searchUrl?: string;
}
