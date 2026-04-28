"use client";

import { SolanaFabMenu } from "@solana-foundation/fab-menu";
import { locales } from "@workspace/i18n/config";
import { usePathname } from "@workspace/i18n/routing";

const HIDDEN_ROUTES = [
  "/agenda",
  "/faq",
  "/registration",
  "/speakers",
  "/sponsors",
] as const;

const localeSet = new Set<string>(locales);

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function normalizeBreakpointPathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] && localeSet.has(segments[0])) {
    segments.shift();
  }

  if (segments[0] === "breakpoint") {
    segments.shift();
  }

  return `/${segments.join("/")}`;
}

export function FabMenu() {
  const pathname = usePathname();
  const breakpointPathname = normalizeBreakpointPathname(pathname);

  if (HIDDEN_ROUTES.some((route) => matchesRoute(breakpointPathname, route))) {
    return null;
  }

  return <SolanaFabMenu position="bottom-right" logoVariant="light-mono" />;
}
