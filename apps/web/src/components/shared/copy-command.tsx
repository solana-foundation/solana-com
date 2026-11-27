"use client";

import { useEffect, useState } from "react";
import { Check } from "@boxicons/react/Check";
import { Copy } from "@boxicons/react/Copy";

/**
 * A terminal-style block with a copy button. `prompt` sets the leading glyph
 * (`$` for shell commands, `null` for prose such as agent prompts); `onCopy`
 * runs after a successful copy, for analytics.
 */
export function CopyCommand({
  command,
  label,
  copyLabel,
  copiedLabel,
  prompt = "$",
  wrap = false,
  onCopy,
}: {
  command: string;
  label: string;
  copyLabel: string;
  copiedLabel: string;
  prompt?: string | null;
  wrap?: boolean;
  onCopy?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      onCopy?.();
    } catch {
      // Clipboard access can be denied; the command stays selectable.
    }
  };

  return (
    <figure className="m-0 min-w-0 overflow-hidden rounded-2xl border border-nd-border-light !bg-black/70 backdrop-blur-md">
      <figcaption className="flex items-center justify-between gap-4 border-b border-nd-border-light px-4 py-3 md:px-5">
        <span className="flex min-w-0 items-center gap-3 font-brand-mono text-[11px] uppercase leading-snug tracking-[0.12em] text-nd-mid-em-text md:text-xs">
          <span aria-hidden className="hidden shrink-0 gap-1.5 sm:flex">
            <span className="size-2.5 rounded-full bg-white/20" />
            <span className="size-2.5 rounded-full bg-white/20" />
            <span className="size-2.5 rounded-full bg-white/20" />
          </span>
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-nd-border-prominent !bg-transparent px-3 py-1 text-xs text-white transition-colors hover:border-nd-border-hovered focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nd-highlight-green"
        >
          {copied ? (
            <Check aria-hidden className="!size-3.5 text-nd-highlight-green" />
          ) : (
            <Copy aria-hidden className="!size-3.5" />
          )}
          <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
        </button>
      </figcaption>
      <pre
        className={`m-0 p-4 font-mono text-[13px] leading-6 text-white md:p-5 md:text-sm ${wrap ? "whitespace-pre-wrap break-words" : "overflow-x-auto"}`}
      >
        <code>
          {prompt && (
            <span aria-hidden className="select-none text-nd-highlight-green">
              {prompt}{" "}
            </span>
          )}
          {command}
        </code>
      </pre>
    </figure>
  );
}
