import type React from "react";

export type NavItemVariant = "medium" | "large";
export type NavTopLevelSectionId =
  | "use_solana"
  | "build"
  | "enterprise"
  | "products"
  | "ecosystem";

export interface NavItemDefinition {
  id: string;
  titleKey: string;
  descriptionKey?: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  variant?: NavItemVariant;
  external?: boolean;
  partiallyActive?: boolean;
  partiallyActiveIgnore?: string[];
}

export interface NavMatchRule {
  type: "includes" | "equals";
  value: string;
}

export interface NavTopLevelSectionMetadata {
  id: NavTopLevelSectionId;
  titleKey: string;
  matchRules: NavMatchRule[];
  mobileIcon: React.ComponentType<{
    className?: string;
  }>;
  contentAlign?: "left" | "center" | "right";
  contentClassName?: string;
  Content: React.ComponentType<{ isMobile?: boolean }>;
}

export interface NavTopLevelSection extends Omit<
  NavTopLevelSectionMetadata,
  "mobileIcon" | "Content"
> {
  mobileIcon: React.ComponentType<{
    className?: string;
  }>;
  Content: React.ComponentType<{ isMobile?: boolean }>;
}

export interface NavPromoDefinition {
  id: string;
  translationKey: string;
  href: string;
  expiresAt?: string;
  className?: string;
  backgroundClassName?: string;
  Logo?: React.ComponentType<{
    className?: string;
    width?: number;
    height?: number;
  }>;
  logoWidth?: number;
  logoHeight?: number;
}
