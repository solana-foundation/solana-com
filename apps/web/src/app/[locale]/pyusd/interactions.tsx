"use client";

import { useEffect, useState } from "react";
import { Check } from "@boxicons/react/Check";
import { Copy } from "@boxicons/react/Copy";
import { SelectionColor } from "@/component-library/selection-color";

export function PageSelectionColor() {
  return (
    <SelectionColor selectionColor="#55E9AB" selectionTextColor="#000000" />
  );
}

export function CopyButton({
  value,
  copyLabel,
  copiedLabel,
}: {
  value: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard access can be denied; the value stays selectable.
    }
  };

  return (
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
  );
}
