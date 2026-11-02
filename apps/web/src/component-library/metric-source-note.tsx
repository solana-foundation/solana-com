"use client";

import * as Popover from "@radix-ui/react-popover";
import { useTranslations } from "next-intl";
import { Link } from "@workspace/i18n/routing";
import { cn } from "@/app/components/utils";

export type MetricSourceNoteProps = {
  name: string;
  href: string;
  period: string;
  /** Registry resolution status, exposed for QA (live, stale, fallback, snapshot). */
  status?: string;
  className?: string;
};

const SITE_ORIGIN = "https://solana.com";

/**
 * One-line "Source" control beneath a published metric. The popover holds the
 * reporting period and a link to the source.
 */
export function MetricSourceNote({
  name,
  href,
  period,
  status,
  className,
}: MetricSourceNoteProps) {
  const t = useTranslations("metrics");
  const internalHref = href.startsWith(`${SITE_ORIGIN}/`)
    ? href.slice(SITE_ORIGIN.length)
    : href.startsWith("/")
      ? href
      : undefined;
  const linkClassName =
    "font-medium !text-zinc-50 underline decoration-current/40 underline-offset-2 hover:decoration-current";

  return (
    <Popover.Root>
      <Popover.Trigger
        data-metric-status={status}
        aria-label={`${t("source")}: ${name}, ${period}`}
        className={cn(
          "mt-2 inline-flex items-center gap-1 p-0 border-0 bg-transparent text-inherit cursor-pointer",
          "text-[12px] md:text-[13px] leading-[1.4] font-normal normal-case opacity-60",
          "hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100",
          className,
        )}
      >
        {t("source")}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-3.5 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="8" cy="8" r="6.25" />
          <path d="M8 7.25v4M8 4.75v.01" strokeLinecap="round" />
        </svg>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={6}
          collisionPadding={16}
          className="z-50 max-w-[calc(100vw-32px)] rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-[13px] leading-[1.4] text-zinc-50 shadow-md"
        >
          <p className="m-0">
            {internalHref ? (
              <Link href={internalHref} className={linkClassName}>
                {name}
              </Link>
            ) : (
              <a
                href={href}
                className={linkClassName}
                target="_blank"
                rel="noopener noreferrer"
              >
                {name}
                <span aria-hidden="true"> ↗</span>
              </a>
            )}
          </p>
          <p className="m-0 mt-0.5 text-zinc-400">{period}</p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
