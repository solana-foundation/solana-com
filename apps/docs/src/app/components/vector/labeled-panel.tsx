"use client";

import { type ReactNode } from "react";
import { cx, vectorRoot } from "./base";
import { jetbrainsMono } from "./fonts";
import styles from "./vector.module.css";

/* Stacks LabeledPanels column-reverse: the LAST child renders on top, so an
   always-visible summary (like the live model) can sit above a long flow
   while staying after it in the DOM/reading order. */
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
   FLOW). `sticky` pins the panel below the site header while its siblings
   scroll — used for the live model so it stays in view as steps execute. */
export function LabeledPanel({
  label,
  sticky,
  className,
  children,
}: {
  label: ReactNode;
  sticky?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={vectorRoot(
        styles.panelGroup,
        sticky && styles.panelGroupSticky,
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
