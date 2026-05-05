import type { HTMLAttributeAnchorTarget } from "react";

export function isRelativeHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

export function isExternalHref(href: string) {
  return /^(https?:)?\/\//i.test(href);
}

export function getAnchorLinkProps({
  href,
  rel,
  target,
}: {
  href: string;
  rel?: string;
  target?: HTMLAttributeAnchorTarget;
}) {
  const resolvedTarget = isExternalHref(href) ? (target ?? "_blank") : target;
  const resolvedRel =
    resolvedTarget === "_blank" ? (rel ?? "noopener noreferrer") : rel;

  return {
    rel: resolvedRel,
    target: resolvedTarget,
  };
}
