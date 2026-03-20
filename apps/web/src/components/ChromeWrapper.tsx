"use client";

import { usePathname } from "next/navigation";
import { Header, Footer } from "@solana-com/ui-chrome";

const CUSTOM_LAYOUT_PATTERNS = ["/playgg", "/sdp"];

export function ChromeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCustomLayout = CUSTOM_LAYOUT_PATTERNS.some((p) =>
    pathname.includes(p),
  );
  return (
    <>
      {!isCustomLayout && <Header />}
      {children}
      {!isCustomLayout && <Footer />}
    </>
  );
}
