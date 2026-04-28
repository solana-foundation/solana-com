"use client";

import { SolanaFabMenu } from "@solana-foundation/fab-menu";
import { usePathname } from "@workspace/i18n/routing";

const HIDDEN_ROUTES = [
  "/agenda",
  "/faq",
  "/registration",
  "/speakers",
  "/sponsors",
] as const;

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function FabMenu() {
  const pathname = usePathname();
  const breakpointPathname = pathname.startsWith("/breakpoint/")
    ? pathname.replace("/breakpoint", "")
    : pathname;

  if (HIDDEN_ROUTES.some((route) => matchesRoute(breakpointPathname, route))) {
    return null;
  }

  return <SolanaFabMenu position="bottom-right" logoVariant="light-mono" />;
}
