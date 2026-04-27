"use client";

import { SolanaFabMenu } from "@solana-foundation/fab-menu";
import { usePathname } from "@workspace/i18n/routing";

export function FabMenu() {
  const pathname = usePathname();

  if (
    pathname === "/agenda" ||
    pathname.startsWith("/agenda/") ||
    pathname === "/registration" ||
    pathname.startsWith("/registration/") ||
    pathname === "/speakers" ||
    pathname.startsWith("/speakers/") ||
    pathname === "/sponsors" ||
    pathname.startsWith("/sponsors/")
  ) {
    return null;
  }

  return <SolanaFabMenu position="bottom-right" logoVariant="light-mono" />;
}
