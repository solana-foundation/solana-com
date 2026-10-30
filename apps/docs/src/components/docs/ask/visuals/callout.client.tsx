"use client";

import { useTranslations } from "next-intl";
import { cn } from "../cn";
import type { VisualCallout } from "@/lib/docs/ask/generative-ui/schema";
import { bodyText } from "./frame";
import { InfoIcon, WarningIcon } from "./icons";

/** callout: the docs' note (blue) and warning (yellow) callout palette. */
export function VisualCalloutBlock({ callout }: { callout: VisualCallout }) {
  const t = useTranslations("docsAsk.visuals");
  const warning = callout.tone === "warning";
  const Icon = warning ? WarningIcon : InfoIcon;
  return (
    <div
      role="note"
      aria-label={t(warning ? "warning" : "note")}
      className={cn(
        "my-4 flex gap-2.5 rounded-xl border px-3.5 py-3 text-[14px] leading-[1.6] first:mt-0 last:mb-0",
        warning
          ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-600/20"
          : "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-600/20",
      )}
    >
      <Icon
        className={cn(
          "mt-[3px] size-4 shrink-0",
          warning
            ? "text-yellow-800 dark:text-yellow-300"
            : "text-blue-800 dark:text-blue-300",
        )}
      />
      <div className="min-w-0">
        {callout.title ? (
          <p className="m-0 font-medium text-[var(--sol-text)]">
            {callout.title}
          </p>
        ) : null}
        {callout.body ? (
          <p className={cn(bodyText, "m-0", callout.title && "mt-0.5")}>
            {callout.body}
          </p>
        ) : null}
      </div>
    </div>
  );
}
