import type { ReactNode } from "react";

/**
 * <Tooltip>: the docs' inline term explanation. The trigger is the dotted-
 * underlined term; the popup (headline, tip, and a "Learn more" link) opens
 * on hover, on keyboard focus, and on tap (a tap focuses the trigger), with
 * CSS only (docs.css, "Tooltip"). Concept chips (gen:concepts) wrap it in
 * `.sol-chip`. Shared by the MDX components and client widgets like the live
 * feed, so it stays free of server-only imports.
 */
export function Tooltip({
  tip,
  headline,
  cta,
  href,
  children,
}: {
  tip: string;
  headline?: string;
  cta?: string;
  href?: string;
  children?: ReactNode;
}) {
  return (
    <span className="tooltip" tabIndex={0} data-tooltip="">
      {children}
      <span className="tooltip-popup" role="tooltip">
        {headline ? <span className="tooltip-headline">{headline}</span> : null}
        <span className="tooltip-tip">{tip}</span>
        {cta && href ? (
          <a href={href} className="tooltip-cta">
            {cta}
          </a>
        ) : null}
      </span>
    </span>
  );
}
