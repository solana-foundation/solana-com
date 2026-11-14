import type { ReactNode } from "react";

/**
 * Outbound call-to-action. While its URL is still unset in content/links.ts it
 * keeps its place and styling but is inert, so previews look final. A live
 * link cuts its lower-right corner at 45 degrees on hover; its colour changes
 * at once, with no fade.
 */
export function CtaLink({
  href,
  pendingLabel,
  className,
  hoverClassName,
  children,
}: {
  href: string | null;
  pendingLabel: string;
  className?: string;
  /** Hover colours; applied only while the link is live. */
  hoverClassName?: string;
  children: ReactNode;
}) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-current";

  if (!href) {
    return (
      <span
        role="link"
        aria-disabled="true"
        title={pendingLabel}
        className={`${base} cursor-not-allowed ${className ?? ""}`}
      >
        {children}
      </span>
    );
  }

  const external = /^https?:/.test(href);

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${base} btn-cut ${className ?? ""} ${hoverClassName ?? ""}`}
    >
      {children}
    </a>
  );
}
