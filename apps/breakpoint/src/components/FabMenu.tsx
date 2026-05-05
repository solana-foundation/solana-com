"use client";

import { SolanaFabMenu } from "@solana-foundation/fab-menu";
import { usePathname } from "@workspace/i18n/routing";
import { normalizeBreakpointPathname } from "@/lib/links";

const HIDDEN_ROUTES = [
  "/faq",
  "/registration",
  "/schedule",
  "/speakers",
  "/sponsors",
] as const;

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function FabMenu() {
  const pathname = usePathname();
  const breakpointPathname = normalizeBreakpointPathname(pathname);

  if (HIDDEN_ROUTES.some((route) => matchesRoute(breakpointPathname, route))) {
    return null;
  }

  return <SolanaFabMenu position="bottom-right" logoVariant="light-mono" />;
}
