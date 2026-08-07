"use client";

import { type ReactNode } from "react";
import { cx, vectorRoot } from "./base";
import { jetbrainsMono } from "./fonts";
import { CopyButton } from "./copy-button";
import { useCopyFeedback } from "./hooks";
import styles from "./vector.module.css";

/* Uppercase "Prerequisites" label over a bordered checklist of PrereqRows. */
export function PrereqList({
  label = "Prerequisites",
  className,
  children,
}: {
  label?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={vectorRoot(className)}>
      <div className={cx(styles.prereqLabel, jetbrainsMono.className)}>
        {label}
      </div>
      <div className={styles.prereqSection}>{children}</div>
    </div>
  );
}

/* One prerequisite: number, prose title, copyable command chip. Children
   are the highlighted command markup; `copyText` is what the clipboard
   gets. */
export function PrereqRow({
  num,
  title,
  copyText,
  children,
}: {
  num: ReactNode;
  title: ReactNode;
  copyText: string;
  children: ReactNode;
}) {
  const { copied, copy } = useCopyFeedback();
  return (
    <div className={styles.prereqRow}>
      <span className={cx(styles.prereqNum, jetbrainsMono.className)}>
        {num}
      </span>
      <span className={styles.prereqTitle}>{title}</span>
      <code className={cx(styles.prereqCode, jetbrainsMono.className)}>
        {children}
      </code>
      <CopyButton
        variant="icon"
        copied={copied}
        onCopy={() => copy(copyText)}
      />
    </div>
  );
}
