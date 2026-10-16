"use client";

import { type ReactNode } from "react";
import { cx, vectorRoot } from "./base";
import { CopyButton } from "./copy-button";
import { jetbrainsMono } from "./fonts";
import { useCopyFeedback } from "./hooks";
import styles from "./vector.module.css";

/* Compact terminal strip used by active flow steps: command text, optional
   nudge/copy control, and the primary action attached to the same row. */
export function CommandTerminal({
  copyText,
  hint,
  action,
  className,
  children,
}: {
  copyText?: string;
  hint?: boolean;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const { copied, copy } = useCopyFeedback();

  return (
    <div className={vectorRoot(styles.terminal, className)}>
      <code className={cx(styles.termCmd, jetbrainsMono.className)}>
        <span className={styles.termPrompt} aria-hidden="true">
          ${" "}
        </span>
        {children}
      </code>
      {hint ? (
        <span className={styles.execHint} aria-hidden="true">
          <svg
            width="26"
            height="16"
            viewBox="0 0 26 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 8h18" />
            <path d="M15 2l7 6-7 6" />
          </svg>
        </span>
      ) : null}
      {copyText ? (
        <CopyButton
          variant="icon"
          copied={copied}
          onCopy={() => copy(copyText)}
        />
      ) : null}
      {action}
    </div>
  );
}
