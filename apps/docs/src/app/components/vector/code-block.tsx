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
  kw: styles.tokPurple,
  fn: styles.tokGreen,
  str: styles.codeGreen,
  cm: styles.tokComment,
};

export function codeText(lines: CodeLine[]) {
  return lines
    .map((line) =>
      line.map((tok) => (typeof tok === "string" ? tok : tok.text)).join(""),
    )
    .join("\n");
}

/* Inline tone span for hand-written command markup (the colored words in
   prerequisite chips and command rows). */
export function Tok({
  tone,
  children,
}: {
  tone: "green" | "mint" | "purple" | "comment" | "str";
  children: ReactNode;
}) {
  const cls = {
    green: styles.tokGreen,
    mint: styles.tokMint,
    purple: styles.tokPurple,
    comment: styles.tokComment,
    str: styles.codeGreen,
  }[tone];
  return <span className={cls}>{children}</span>;
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
export function CodeSnippet({ lines }: { lines: CodeLine[] }) {
  return (
    <div className={styles.preWrap}>
      <CopyTextButton variant="float" text={codeText(lines)} />
      <TokenizedCode lines={lines} className={styles.codePre} />
    </div>
  );
}
