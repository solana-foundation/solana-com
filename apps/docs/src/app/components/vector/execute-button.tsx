"use client";

import { type ReactNode } from "react";
import { cx } from "./base";
import styles from "./vector.module.css";

/* Brand-gradient action button with a built-in running spinner. */
export function ExecuteButton({
  busy,
  disabled,
  onClick,
  children = "Execute",
  busyLabel = "Running…",
  className,
}: {
  busy?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  busyLabel?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cx(styles.execute, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {busy ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          {busyLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
