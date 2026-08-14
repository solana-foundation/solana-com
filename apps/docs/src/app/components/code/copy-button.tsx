"use client";

import { Copy } from "@boxicons/react/Copy";
import { Check } from "@boxicons/react/Check";
import { cn } from "@@/src/app/components/utils";
import { useState } from "react";

export function CopyButton({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className={cn(
        `hover:text-fd-foreground -mx-1 p-1 rounded hidden sm:block`,
        className,
      )}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check width={16} height={16} className="block" />
      ) : (
        <Copy width={16} height={16} className="block" />
      )}
    </button>
  );
}
