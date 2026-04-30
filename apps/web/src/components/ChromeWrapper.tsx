"use client";

import { usePathname } from "next/navigation";

const CUSTOM_LAYOUT_PATTERNS = ["/playgg", "/sdp"];

export function ChromeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCustomLayout = CUSTOM_LAYOUT_PATTERNS.some((p) =>
    pathname.includes(p),
  );
  if (isCustomLayout) return null;
  return <>{children}</>;
}
