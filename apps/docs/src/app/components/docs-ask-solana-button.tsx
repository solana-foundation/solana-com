"use client";

import { usePathname } from "next/navigation";
import { AskSolanaButton } from "@solana-com/ui-chrome";

/**
 * Vector launcher for the main docs pages. Hidden on the docs landing page —
 * the full-size hero Vector owns the ask experience there — and shown on
 * every other page.
 */
export function DocsAskSolanaButton() {
  const pathname = usePathname();
  // Docs root, with or without a locale prefix: /docs, /de/docs, /pt-BR/docs…
  const isDocsRoot = /^(?:\/[a-z]{2}(?:-[A-Z]{2})?)?\/docs\/?$/.test(pathname);
  if (isDocsRoot) return null;
  return <AskSolanaButton />;
}
