"use client";

import { type ReactNode, useState } from "react";
import { vectorRoot } from "./base";
import { CodeChevronsIcon } from "./icons";
import styles from "./vector.module.css";

/* Code-snippets section: a small icon tile in the gutter, a prose lead-in
   line, and an optional compact disclosure for long generated samples. */
export function CodeDisclosure({
  summary,
  icon,
  collapsible = false,
  defaultOpen = true,
  collapsedLabel = "Show",
  expandedLabel = "Hide",
  meta,
  className,
  children,
}: {
  summary: ReactNode;
  icon?: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  collapsedLabel?: ReactNode;
  expandedLabel?: ReactNode;
  meta?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={vectorRoot(styles.codeRow, className)}>
      <span className={styles.codeIcon} aria-hidden="true">
        {icon ?? <CodeChevronsIcon />}
      </span>
      <div className={styles.codeDetails}>
        <div className={styles.codeSummary}>
          <span className={styles.codeSummaryText}>{summary}</span>
          {meta ? <span className={styles.codeMeta}>{meta}</span> : null}
          {collapsible ? (
            <button
              type="button"
              className={styles.codeToggle}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? expandedLabel : collapsedLabel}
            </button>
          ) : null}
        </div>
        {open ? <div className={styles.codeBody}>{children}</div> : null}
      </div>
    </div>
  );
}
