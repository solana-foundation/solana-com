"use client";

import { type ReactNode } from "react";
import { cx } from "./base";
import styles from "./vector.module.css";

/* Brand-gradient action button with a built-in running spinner. */
export function ExecuteButton({
  busy,
  disabled,
  variant = "primary",
  onClick,
  children = "Execute",
  busyLabel = "Running…",
  className,
}: {
  busy?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  children?: ReactNode;
  busyLabel?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cx(
        styles.execute,
        variant === "secondary" && styles.executeSecondary,
        busy && styles.executeRunning,
        className,
      )}
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
