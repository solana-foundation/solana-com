"use client";

import { type ReactNode } from "react";
import { cx, vectorRoot } from "./base";
import { jetbrainsMono } from "./fonts";
import { CopyButton } from "./copy-button";
import { useCopyFeedback } from "./hooks";
import styles from "./vector.module.css";

/* Stack of copyable CommandRows, with an optional muted footnote. */
export function CommandList({
  footnote,
  className,
  children,
}: {
  footnote?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={vectorRoot(styles.cmdList, className)}>
      {children}
      {footnote != null && (
        <div className={cx(styles.cmdFoot, jetbrainsMono.className)}>
          {footnote}
        </div>
      )}
    </div>
  );
}

/* One command: step marker (ties it to a FlowStep above; `ok` renders it
   green for a final verify line), highlighted command markup as children,
   a muted note, and a copy button fed by `copyText`. */
export function CommandRow({
  step,
  ok,
  note,
  copyText,
  className,
  children,
}: {
  step: ReactNode;
  ok?: boolean;
  note?: ReactNode;
  copyText: string;
  className?: string;
  children: ReactNode;
}) {
  const { copied, copy } = useCopyFeedback();
  return (
    <div className={cx(styles.cmdRow, className)}>
      <span
        className={cx(
          styles.cmdStep,
          ok && styles.cmdStepOk,
          jetbrainsMono.className,
        )}
      >
        {step}
      </span>
      <code className={cx(styles.cmdCode, jetbrainsMono.className)}>
        {children}
      </code>
      {note != null && (
        <span className={cx(styles.cmdNote, jetbrainsMono.className)}>
          {note}
        </span>
      )}
      <CopyButton
        variant="icon"
        copied={copied}
        onCopy={() => copy(copyText)}
      />
    </div>
  );
}
