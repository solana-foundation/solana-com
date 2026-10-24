"use client";

import { type ReactNode } from "react";
import { cx } from "./base";
import { jetbrainsMono } from "./fonts";
import styles from "./vector.module.css";

/* Pulsing cluster badge pinned to the top-right of the containing
   LabeledPanel (any positioned ancestor works). */
export function NetworkBadge({
  name = "devnet",
  className,
}: {
  name?: ReactNode;
  className?: string;
}) {
  return (
    <span className={cx(styles.devnet, jetbrainsMono.className, className)}>
      <span className={styles.devnetDot} aria-hidden="true" />
      <span className={styles.devnetName}>{name}</span>
    </span>
  );
}
