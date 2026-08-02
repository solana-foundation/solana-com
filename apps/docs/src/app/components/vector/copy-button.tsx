"use client";

import { cx } from "./base";
import { jetbrainsMono } from "./fonts";
import { useCopyFeedback } from "./hooks";
import { CheckIcon, CopyIcon } from "./icons";
import styles from "./vector.module.css";

/* Controlled copy affordance: "float" sits over a code block, "icon" inlines
   at the end of a row. Pair with useCopyFeedback, or reach for
   CopyTextButton when nothing else needs the copied state. */
export function CopyButton({
  copied,
  onCopy,
  variant,
}: {
  copied: boolean;
  onCopy: () => void;
  variant: "float" | "icon";
}) {
  const cls = variant === "float" ? styles.copyFloat : styles.copyIconBtn;
  const size = variant === "icon" ? 14 : 12;
  return (
    <button
      type="button"
      className={cx(cls, variant !== "icon" && jetbrainsMono.className)}
      onClick={onCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      {copied ? <CheckIcon size={size} /> : <CopyIcon size={size} />}
      {variant !== "icon" && <span>{copied ? "Copied" : "Copy"}</span>}
    </button>
  );
}

/* Self-contained variant: copies `text` and manages its own label flip. */
export function CopyTextButton({
  text,
  variant = "icon",
}: {
  text: string;
  variant?: "float" | "icon";
}) {
  const { copied, copy } = useCopyFeedback();
  return (
    <CopyButton variant={variant} copied={copied} onCopy={() => copy(text)} />
  );
}
