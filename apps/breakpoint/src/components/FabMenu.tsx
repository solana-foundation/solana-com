"use client";

import { SolanaFabMenu } from "@solana-foundation/fab-menu";
import { usePathname } from "@workspace/i18n/routing";

export function FabMenu() {
  const pathname = usePathname();

  if (pathname === "/registration" || pathname.startsWith("/registration/")) {
    return null;
  }

  return <SolanaFabMenu position="bottom-right" logoVariant="light-mono" />;
}
