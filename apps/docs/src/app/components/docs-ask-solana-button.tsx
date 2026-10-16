"use client";

import { usePathname } from "next/navigation";
import { AskSolanaButton } from "@solana-com/ui-chrome";

/**
 * Vector launcher for the main docs pages. Hidden on the AI Assistant page —
 * the full-size hero Vector owns the ask experience there — and shown on
 * every other page.
 */
export function DocsAskSolanaButton() {
  const pathname = usePathname();
  // /docs/ai-assistant, with or without a locale prefix
  // (/de/docs/ai-assistant, /pt-BR/docs/ai-assistant…).
  const isAskLanding =
    /^(?:\/[a-z]{2}(?:-[A-Z]{2})?)?\/docs\/ai-assistant\/?$/.test(pathname);
  if (isAskLanding) return null;
  return <AskSolanaButton />;
}
