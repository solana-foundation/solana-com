"use client";

import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { cn } from "./cn";
import { isDocsHref } from "@/lib/docs/docs-href";
import type { AskCitation } from "@/lib/docs/ask/store";
import { DocsLink } from "../docs-link";
import { ArrowUpRightIcon, Lucide } from "../docs-ui-icons";
import { entranceClass, useEntrance } from "./ask-actions.client";
import { focusRing, iconTile, signatureLabel } from "./ui";
import { Disclosure } from "./visuals/frame";

/** Lucide file-text (ISC): a docs page. */
export function FileTextIcon({ className }: { className?: string }) {
  return (
    <Lucide className={className}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </Lucide>
  );
}

const rowClass = cn(
  "group -mx-2 flex min-w-0 items-center gap-2.5 rounded-lg px-2 py-1.5 no-underline transition-colors duration-150 hover:bg-[var(--sol-soft)] motion-reduce:transition-none",
  focusRing,
);

function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Where a source sits: another site's host; none for a docs page, or when
 * the title already says it. The title goes in a tooltip.
 */
function place(citation: AskCitation, external: boolean) {
  const section = external ? host(citation.url) : "";
  const repeats =
    !!citation.title &&
    citation.title.toLowerCase().includes(section.toLowerCase());
  return {
    section: repeats ? "" : section,
    trail: citation.title || citation.url,
  };
}

function SourceRow({ citation }: { citation: AskCitation }) {
  const external = /^https?:\/\//i.test(citation.url);
  const { section, trail } = place(citation, external);
  const content = (
    <>
      <span aria-hidden="true" className={cn(iconTile, "size-5")}>
        <FileTextIcon className="size-3" />
      </span>
      {/* One line: a section that doesn't fit whole wraps out of sight,
          rather than both ending in "…"; a long title truncates. */}
      <span className="flex h-5 min-w-0 flex-1 flex-wrap items-baseline gap-x-2 overflow-hidden">
        <span className="min-w-0 max-w-full truncate text-[13px] font-medium leading-5 text-[var(--sol-text)] transition-colors duration-150 group-hover:text-[var(--sol-purple-text)] motion-reduce:transition-none">
          {citation.title || citation.url}
        </span>
        {section ? (
          <span className="whitespace-nowrap text-[12px] leading-5 text-[var(--sol-dim)]">
            {section}
          </span>
        ) : null}
      </span>
      {external ? (
        <ArrowUpRightIcon className="size-3 shrink-0 text-[var(--sol-dim)] group-data-[dir=rtl]/answer:-scale-x-100" />
      ) : null}
    </>
  );
  if (isDocsHref(citation.url)) {
    return (
      <DocsLink
        href={citation.url}
        title={trail}
        data-ask-internal=""
        className={rowClass}
      >
        {content}
      </DocsLink>
    );
  }
  return (
    <a
      href={citation.url}
      title={trail}
      className={rowClass}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {content}
    </a>
  );
}

function SourceList({
  citations,
  enter,
  className,
}: {
  citations: AskCitation[];
  enter: boolean;
  className?: string;
}) {
  return (
    <ul className={cn("m-0 list-none p-0", className)}>
      {citations.map((citation, index) => (
        <li
          key={citation.url}
          style={
            enter ? ({ "--ask-enter": index } as CSSProperties) : undefined
          }
          className={cn(
            enter &&
              cn(
                entranceClass,
                "[animation-delay:calc(min(var(--ask-enter),5)*40ms)]",
              ),
          )}
        >
          <SourceRow citation={citation} />
        </li>
      ))}
    </ul>
  );
}

/**
 * The docs pages an answer drew on, under the docs' mono label. Unnumbered:
 * answers carry no inline citation markers. Older answers fold them into
 * "Sources (n)" so a long thread isn't a column of link lists.
 */
export function AskSources({
  citations,
  latest = true,
  animate = true,
  className,
}: {
  citations: AskCitation[];
  /** The thread's last answer: listed open (and fading in once). */
  latest?: boolean;
  /** Fade in once (false: an answer restored as it was, on reload). */
  animate?: boolean;
  /** Replaces the top margin when it shares a row (older turns). */
  className?: string;
}) {
  const t = useTranslations("docsAsk");
  // The citations array is set once per finished answer.
  const enter = useEntrance(
    citations,
    latest && animate && citations.length > 0,
  );
  if (citations.length === 0) return null;
  if (!latest) {
    return (
      <nav aria-label={t("sources")} className={cn("mt-5", className)}>
        {/* min-h-7: centred on the 28px actions it shares a row with. */}
        <Disclosure
          summary={t("sourcesCount", { count: citations.length })}
          summaryClassName={cn(signatureLabel, "min-h-7")}
        >
          <SourceList citations={citations} enter={false} className="mt-1.5" />
        </Disclosure>
      </nav>
    );
  }
  return (
    <nav aria-label={t("sources")} className={cn("mt-6", className)}>
      <p className={cn(signatureLabel, "m-0")}>{t("sources")}</p>
      <SourceList citations={citations} enter={enter} className="mt-1.5" />
    </nav>
  );
}
