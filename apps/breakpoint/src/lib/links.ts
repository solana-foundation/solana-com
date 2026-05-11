import type { HTMLAttributeAnchorTarget } from "react";
import { locales } from "@workspace/i18n/config";
import { routePath } from "@/config";

const localeSet = new Set<string>(locales);

export function isRelativeHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

export function isExternalHref(href: string) {
  return /^(https?:)?\/\//i.test(href);
}

export function breakpointHref(href: string) {
  return isRelativeHref(href) ? routePath(href) : href;
}

export function normalizeBreakpointPathname(pathname: string) {
  const [path] = pathname.split(/[?#]/);
  const segments = (path ?? "").split("/").filter(Boolean);

  if (segments[0] && localeSet.has(segments[0])) {
    segments.shift();
  }

  if (segments[0] === "breakpoint") {
    segments.shift();
  }

  return `/${segments.join("/")}`;
}

export function isCurrentBreakpointHref(pathname: string, href: string) {
  return (
    normalizeBreakpointPathname(pathname) === normalizeBreakpointPathname(href)
  );
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
