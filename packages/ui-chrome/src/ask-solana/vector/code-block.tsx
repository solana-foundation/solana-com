"use client";

import { type ReactNode } from "react";
import { cx } from "./base";
import { jetbrainsMono } from "./fonts";
import { CopyTextButton } from "./copy-button";
import styles from "./vector.module.css";

/* Code samples as token lines — a single source for both the highlighted
   rendering and the clipboard text, without pulling in a highlighter. */

export type CodeTone = "kw" | "fn" | "str" | "cm";
export type CodeToken = string | { text: string; tone: CodeTone };
export type CodeLine = CodeToken[];

const TONE_CLASS: Record<CodeTone, string> = {
  kw: styles.tokPurple ?? "",
  fn: styles.tokGreen ?? "",
  str: styles.codeGreen ?? "",
  cm: styles.tokComment ?? "",
};

export function codeText(lines: CodeLine[]) {
  return lines
    .map((line) =>
      line.map((tok) => (typeof tok === "string" ? tok : tok.text)).join(""),
    )
    .join("\n");
}

/* Inline tone span for hand-written command markup (the colored words in
   prerequisite chips, command rows and CommandTerminal commands). "mint" and
   "account" are the flow's address tints; `flowTarget` names the token so
   FlowArrows can point the matching UseChip's provenance arrow at it. */
export function Tok({
  tone,
  flowTarget,
  children,
}: {
  tone: "green" | "mint" | "account" | "purple" | "comment" | "str";
  flowTarget?: string;
  children: ReactNode;
}) {
  const cls = {
    green: styles.tokGreen,
    mint: styles.tokMint,
    account: styles.tokAccount,
    purple: styles.tokPurple,
    comment: styles.tokComment,
    str: styles.codeGreen,
  }[tone];
  return (
    <span className={cls} data-flow-target={flowTarget}>
      {children}
    </span>
  );
}

export function TokenizedCode({
  lines,
  className,
}: {
  lines: CodeLine[];
  className?: string;
}) {
  return (
    <pre className={cx(className, jetbrainsMono.className)}>
      {lines.map((line, i) => (
        <span key={i}>
          {line.map((tok, j) =>
            typeof tok === "string" ? (
              tok
            ) : (
              <span key={j} className={TONE_CLASS[tok.tone]}>
                {tok.text}
              </span>
            ),
          )}
          {"\n"}
        </span>
      ))}
    </pre>
  );
}

/* Scrolling code panel with a floating copy button; the clipboard gets the
   plain text of the same lines. */
export function CodeSnippet({
  lines,
  compact,
}: {
  lines: CodeLine[];
  compact?: boolean;
}) {
  return (
    <div className={styles.preWrap}>
      <CopyTextButton variant="float" text={codeText(lines)} />
      <TokenizedCode
        lines={lines}
        className={cx(styles.codePre, compact && styles.codePreCompact)}
      />
    </div>
  );
}
