"use client";

import { type ReactNode } from "react";
import { cx, vectorRoot } from "./base";
import { jetbrainsMono } from "./fonts";
import styles from "./vector.module.css";

/* Responsive side-by-side panel grid. Put the live model first and the flow
   second so the DOM order matches the visual order used by the docs preview. */
export function PanelStack({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={vectorRoot(styles.panels, className)}>{children}</div>;
}

/* Uppercase micro-label over a bordered panel (LIVE MODEL, TOKEN CREATION
   FLOW). `sticky` is kept for backwards-compatible callers, but the current
   Vector answer treatment uses a full panel grid instead of pinned cards. */
export function LabeledPanel({
  label,
  sticky,
  compact,
  className,
  children,
}: {
  label: ReactNode;
  sticky?: boolean;
  compact?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={vectorRoot(
        styles.panelGroup,
        sticky && styles.panelGroupSticky,
        compact && styles.panelGroupCompact,
        className,
      )}
    >
      <span className={cx(styles.panelLabel, jetbrainsMono.className)}>
        {label}
      </span>
      <div className={styles.panel}>{children}</div>
    </div>
  );
}
