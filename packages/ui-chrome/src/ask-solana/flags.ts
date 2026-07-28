/**
 * Feature flag + API base for the Ask Solana assistant.
 *
 * `NEXT_PUBLIC_ASK_SOLANA_ENABLED` is inlined at build time per app. While it
 * is unset (or not "true"), the AskSolana components render their Inkeep
 * equivalents, so shipping the swap is behavior-neutral until rollout.
 */
export function isAskSolanaEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ASK_SOLANA_ENABLED === "true";
}

/**
 * Same-origin by default: apps/web rewrites /api/ask/* to the docs-agent
 * service. Apps served off-domain (or local dev against a local agent) can
 * point elsewhere with NEXT_PUBLIC_ASK_API_URL.
 */
export function askApiBase(): string {
  return process.env.NEXT_PUBLIC_ASK_API_URL || "/api/ask";
}
