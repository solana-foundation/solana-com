"use client";

import { Copy, Check } from "lucide-react";
import { cn } from "@/app/components/utils";
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
        <Check size={16} className="block" />
      ) : (
        <Copy size={16} className="block" />
      )}
    </button>
  );
}
