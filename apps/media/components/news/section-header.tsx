import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  /** Section title, e.g. "Latest". */
  title: string;
  /** Optional "view all" destination shown on the right. */
  href?: string;
  /** Label for the optional link. */
  linkLabel?: string;
  /** id for aria-labelledby wiring on the parent section. */
  id?: string;
  className?: string;
}

/**
 * Editorial section header: a bold title anchored by a short accent bar with a
 * hairline rule beneath, and an optional "view all" link.
 *
 * Intentionally restrained (one title, no redundant eyebrow) so section fronts
 * read like a news publisher rather than a marketing page.
 */
export function SectionHeader({
  title,
  href,
  linkLabel = "View all",
  id,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex items-end justify-between gap-4 border-b border-border pb-3",
        className,
      )}
    >
      <h2
        id={id}
        className="relative pl-3 text-xl font-bold tracking-tight md:text-2xl before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:rounded-full before:bg-primary before:content-['']"
      >
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground hover:no-underline"
        >
          <span>{linkLabel}</span>
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </div>
  );
}
