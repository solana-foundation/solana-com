import React from "react";
import { cn } from "@/app/components/utils";

export type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
  dotClassName?: string;
};

/**
 * Small "kicker" label used at the top of tokenization page sections:
 * a colored dot followed by muted, tight-tracked text.
 */
export const Eyebrow = ({
  children,
  className,
  dotClassName,
}: EyebrowProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-2 text-[13px] md:text-sm font-medium text-[#ABABBA] tracking-[-0.14px]",
      className,
    )}
  >
    <span
      className={cn(
        "inline-block size-[6px] rounded-full bg-[#CA9FF5]",
        dotClassName,
      )}
      aria-hidden
    />
    {children}
  </span>
);
