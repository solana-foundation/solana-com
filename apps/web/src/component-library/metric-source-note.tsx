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
};

export type MetricSourcesFootnoteItem = {
  /** The stat label the source belongs to. */
  label: string;
  /** Items without a source (unverified figures) are left out. */
  source?: MetricSourceNoteProps;
};

const SITE_ORIGIN = "https://solana.com";

const LINK_CLASS_NAME =
  "!text-zinc-50 underline decoration-current/40 underline-offset-2 hover:decoration-current";

function SourceLink({
  name,
  href,
}: Pick<MetricSourceNoteProps, "name" | "href">) {
  const internalHref = href.startsWith(`${SITE_ORIGIN}/`)
    ? href.slice(SITE_ORIGIN.length)
    : href.startsWith("/")
      ? href
      : undefined;

  if (internalHref) {
    return (
      <Link href={internalHref} className={LINK_CLASS_NAME}>
        {name}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={LINK_CLASS_NAME}
      target="_blank"
      rel="noopener noreferrer"
    >
      {name}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

/**
 * One "Sources" footnote for a group of stats. The popover lists each stat's
 * source link and reporting period.
 */
export function MetricSourcesFootnote({
  items,
  className,
}: {
  items: MetricSourcesFootnoteItem[];
  className?: string;
}) {
  const t = useTranslations("metrics");
  const sourced = items.flatMap(({ label, source }) =>
    source ? [{ label, source }] : [],
  );
  if (sourced.length === 0) return null;

  return (
    <Popover.Root>
      <Popover.Trigger
        className={cn(
          "inline-flex items-center gap-1 p-0 border-0 bg-transparent text-inherit cursor-pointer",
          "text-[12px] md:text-[13px] leading-[1.4] font-normal normal-case opacity-60",
          "hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100",
          className,
        )}
      >
        {t("sources")}
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
          side="top"
          align="start"
          sideOffset={6}
          collisionPadding={16}
          className="z-50 w-[320px] max-w-[calc(100vw-32px)] rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3 text-[13px] leading-[1.4] text-zinc-50 shadow-md"
        >
          <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
            {sourced.map(({ label, source }) => (
              <li key={label} data-metric-status={source.status}>
                <p className="m-0 font-medium">{label}</p>
                <p className="m-0 text-zinc-400">
                  <SourceLink name={source.name} href={source.href} />
                  <span aria-hidden="true"> · </span>
                  {source.period}
                </p>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
