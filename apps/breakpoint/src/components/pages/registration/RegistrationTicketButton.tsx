"use client";

import { useState } from "react";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import { useScramble } from "@/components/Button";
import { getAnchorLinkProps } from "@/lib/links";

type TicketButtonTone = "dark" | "light" | "muted";

type RegistrationTicketButtonProps = {
  disabled?: boolean;
  href?: string;
  label: string;
  tone: TicketButtonTone;
};

const toneClasses: Record<TicketButtonTone, string> = {
  dark: "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white focus-visible:outline-black",
  light:
    "border-stroke-tertiary text-white hover:bg-neutral-700 focus-visible:outline-white",
  muted:
    "border-neutral-300 bg-neutral-600 text-neutral-200 focus-visible:outline-neutral-200",
};

export default function RegistrationTicketButton({
  disabled = false,
  href,
  label,
  tone,
}: RegistrationTicketButtonProps) {
  const [runKey, setRunKey] = useState(0);
  const isDisabled = disabled || !href;
  const displayLabel = useScramble(label, 400, runKey);
  const className = `inline-flex h-10 w-full items-center justify-center gap-3 overflow-hidden border px-5 font-mono text-button uppercase transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 ${toneClasses[tone]} ${
    isDisabled ? "pointer-events-none" : ""
  }`;

  const content = (
    <>
      <span aria-hidden="true">{isDisabled ? label : displayLabel}</span>
      {!isDisabled && (
        <span
          aria-hidden="true"
          className="inline-flex size-3 items-center justify-center"
        >
          <ArrowUpRightIcon />
        </span>
      )}
    </>
  );

  if (isDisabled) {
    return (
      <span aria-disabled="true" aria-label={label} className={className}>
        {content}
      </span>
    );
  }

  const activeHref = href ?? "";

  return (
    <a
      href={activeHref}
      aria-label={label}
      className={className}
      onFocus={() => setRunKey((key) => key + 1)}
      onMouseEnter={() => setRunKey((key) => key + 1)}
      {...getAnchorLinkProps({ href: activeHref })}
    >
      {content}
    </a>
  );
}
