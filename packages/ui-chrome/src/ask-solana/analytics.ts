/**
 * Analytics bridge for Ask Solana.
 *
 * ui-chrome has no PostHog dependency, so components dispatch a DOM
 * CustomEvent and each app's PostHogProvider forwards it to posthog.capture
 * (mirroring the COOKIE_CONSENT_EVENT pattern). Apps without PostHog simply
 * ignore the events.
 */
export const ASK_SOLANA_ANALYTICS_EVENT = "ask-solana:analytics";

export type AskSolanaAnalyticsDetail = {
  event: string;
  properties?: Record<string, unknown>;
};

export function trackAskSolana(
  event: string,
  properties?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<AskSolanaAnalyticsDetail>(ASK_SOLANA_ANALYTICS_EVENT, {
      detail: { event, properties },
    }),
  );
}
