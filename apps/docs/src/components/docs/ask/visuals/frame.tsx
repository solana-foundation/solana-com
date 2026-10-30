/**
 * Shared pieces of the Ask AI visuals: the hairline frame with its mono
 * label, disclosures, links, and the class recipes they repeat. Colours are
 * docs tokens only; `--ask-*` come from the panel root and fall back to the
 * nearest docs token so a visual reads anywhere.
 */
import type { ReactNode } from "react";
import { cn } from "../cn";
import { ArrowUpRightIcon } from "../../docs-ui-icons";
import { DocsLink } from "../../docs-link";
import type { VisualLink } from "@/lib/docs/ask/generative-ui/schema";
import { focusRing, mono, signatureLabel } from "../ui";
import { DisclosureIcon } from "./icons";

export { focusRing, mono, signatureLabel };

export const bodyText = "text-[var(--ask-body,var(--sol-muted))]";

export const codeSurface = "bg-[var(--ask-code-bg,var(--sol-surface-2))]";

const linkStyle =
  "text-[var(--sol-link)] underline decoration-[var(--sol-link-underline)] decoration-1 underline-offset-[3px] transition-colors duration-150 hover:text-[var(--sol-link-hover)] hover:decoration-current motion-reduce:transition-none";

/** A bordered block with a label row: "DIAGRAM  Lifecycle flow". */
export function VisualFrame({
  label,
  title,
  children,
}: {
  label: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title ? `${label}: ${title}` : label}
      className="my-4 overflow-hidden rounded-xl border border-[var(--sol-line)] bg-[var(--sol-page)] first:mt-0 last:mb-0"
    >
      <div className="flex min-w-0 items-baseline gap-2.5 border-b border-[var(--sol-line)] px-3.5 py-2">
        <span className={cn(signatureLabel, "shrink-0")}>{label}</span>
        {title ? (
          <span className="min-w-0 truncate text-[13px] font-medium text-[var(--sol-text)]">
            {title}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/** A native disclosure with a 12px chevron, closed by default. */
export function Disclosure({
  summary,
  children,
  className,
  summaryClassName,
}: {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
  summaryClassName?: string;
}) {
  return (
    <details className={cn("group/disclosure", className)}>
      <summary
        className={cn(
          "inline-flex cursor-pointer list-none items-center gap-1.5 rounded-md text-[12px] text-[var(--sol-muted)] transition-colors duration-150 hover:text-[var(--sol-text)] motion-reduce:transition-none [&::-webkit-details-marker]:hidden",
          focusRing,
          summaryClassName,
        )}
      >
        <DisclosureIcon className="shrink-0 -rotate-90 text-[var(--sol-dim)] transition-transform duration-150 group-open/disclosure:!rotate-0 motion-reduce:transition-none group-data-[dir=rtl]/visual:rotate-90" />
        {summary}
      </summary>
      {children}
    </details>
  );
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

/**
 * Docs links navigate in place (a docked panel stays open; an overlay gets
 * out of the way, see ask-panel); others open a tab.
 */
export function VisualLinkItem({ link }: { link: VisualLink }) {
  if (isExternal(link.href)) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noreferrer"
        className={cn(linkStyle, focusRing, "rounded-sm")}
      >
        {link.title}
        <ArrowUpRightIcon className="ms-0.5 inline size-3 align-[-1px] group-data-[dir=rtl]/visual:-scale-x-100" />
      </a>
    );
  }
  return (
    <DocsLink
      href={link.href}
      data-ask-internal=""
      className={cn(linkStyle, focusRing, "rounded-sm")}
    >
      {link.title}
    </DocsLink>
  );
}

/**
 * Docs links in a row: "DOCS  Token quickstart  Create token account" in a
 * frame's footer, or bare (no `label`) in a step's meta row.
 */
export function VisualLinks({
  label,
  links,
  className,
}: {
  label?: string;
  links: VisualLink[];
  className?: string;
}) {
  if (links.length === 0) return null;
  const items = links.map((link) => (
    <VisualLinkItem key={link.href} link={link} />
  ));
  if (!label) return <>{items}</>;
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[12px]",
        className,
      )}
    >
      <span className={signatureLabel}>{label}</span>
      {items}
    </div>
  );
}

/**
 * A paragraph under a frame's label row: the model's or the flow's (shown
 * only when the answer has no summary to say it already), or a command
 * list's.
 */
export function FrameProse({ text }: { text: string }) {
  return (
    <p
      className={cn(
        bodyText,
        "m-0 border-b border-[var(--sol-line)] px-3.5 py-2.5 text-[13px] leading-[1.6]",
      )}
    >
      {text}
    </p>
  );
}
