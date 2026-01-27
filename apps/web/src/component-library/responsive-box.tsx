"use client";

import { CSSProperties, ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export interface ResponsiveStyles {
  large?: CSSProperties;
  medium?: CSSProperties;
  small?: CSSProperties;
}

interface ResponsiveBoxProps {
  responsiveStyles: ResponsiveStyles;
  children?: ReactNode;
}

export function ResponsiveBox({
  responsiveStyles,
  children,
}: ResponsiveBoxProps) {
  const isSmall = useMediaQuery("(max-width: 767px)");
  const isMedium = useMediaQuery("(min-width: 768px) and (max-width: 1279px)");
  const isLarge = useMediaQuery("(min-width: 1280px)");

  // Merge styles from smallest to largest breakpoint
  // Large includes medium and small base styles
  // Medium includes small base styles
  const getStyles = (): CSSProperties => {
    if (isLarge) {
      return {
        ...responsiveStyles.large,
      };
    }
    if (isMedium) {
      return {
        ...responsiveStyles.large,
        ...responsiveStyles.medium,
      };
    }
    if (isSmall) {
      return {
        ...responsiveStyles.large,
        ...responsiveStyles.medium,
        ...responsiveStyles.small,
      };
    }
    // Default to large styles for SSR
    return {
      ...responsiveStyles.small,
      ...responsiveStyles.medium,
      ...responsiveStyles.large,
    };
  };

  return <div style={getStyles()}>{children}</div>;
}
