"use client";

import { type ReactNode } from "react";
import { vectorRoot } from "./base";
import styles from "./vector.module.css";

/* Standalone wrapper for Vector components used outside the answer card
   (e.g. directly in an MDX article). Provides the family typeface, base
   text color and the size container the responsive rules query against. */
export function VectorSurface({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={vectorRoot(styles.surface, className)}>{children}</div>
  );
}
