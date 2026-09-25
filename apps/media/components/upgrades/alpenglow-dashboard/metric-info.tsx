"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { InfoCircle } from "@boxicons/react/InfoCircle";

interface MetricInfoProps {
  readonly label: string;
  readonly description: string;
  readonly guidance?: string;
  readonly align?: "start" | "end";
}

/**
 * Shows metric context on demand without adding persistent explanatory copy.
 *
 * The popover is operable by mouse, keyboard, and touch, unlike a hover-only
 * tooltip.
 */
export function MetricInfo({
  label,
  description,
  guidance,
  align = "start",
}: MetricInfoProps) {
  return (
    <Popover className="inline-flex">
      <PopoverButton
        type="button"
        aria-label={`About ${label}`}
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-white/[0.06] hover:text-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14F195]"
      >
        <InfoCircle className="size-4" aria-hidden="true" />
      </PopoverButton>
      <PopoverPanel
        anchor={{
          to: align === "end" ? "bottom end" : "bottom start",
          gap: 8,
          padding: 12,
        }}
        portal
        className="z-20 w-72 rounded-lg border border-white/10 bg-popover p-4 text-left font-normal normal-case text-popover-foreground shadow-xl"
      >
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-2 text-pretty text-xs leading-5 text-gray-300">
          {description}
        </p>
        {guidance && (
          <p className="mt-3 border-t border-white/10 pt-3 text-pretty text-xs leading-5 text-gray-400">
            <span className="font-medium text-gray-200">How to read it: </span>
            {guidance}
          </p>
        )}
      </PopoverPanel>
    </Popover>
  );
}
