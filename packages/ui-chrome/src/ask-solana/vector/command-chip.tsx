"use client";

import { type ReactNode } from "react";
import { cx } from "./base";
import { jetbrainsMono } from "./fonts";
import styles from "./vector.module.css";

/* Centered command pill shown in a FlowStep's actions row. */
export function CommandChip({
  wide,
  className,
  children,
}: {
  wide?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <code
      className={cx(
        styles.stepCmd,
        wide && styles.stepCmdWide,
        jetbrainsMono.className,
        className,
      )}
    >
      {children}
    </code>
  );
}

/* An argument substituted into a command once an earlier step produced it —
   glows in with the tone's brand color. */
export function CommandArg({
  tone = "mint",
  strong,
  children,
}: {
  tone?: "mint" | "account";
  strong?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={cx(
        tone === "account" ? styles.argAta : styles.argMint,
        strong && styles.argStrong,
      )}
    >
      {children}
    </span>
  );
}
