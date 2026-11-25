/**
 * Ask AI's analytics in GA4. Bri's `trackAskSolana` dispatches each event
 * as a DOM CustomEvent (@solana-com/ui-chrome/ask-solana/analytics); this
 * sends her `docs_ai_*` events, with her properties as they are, through
 * the site's consent-aware GA4 helper (@solana-com/ui-chrome/analytics:
 * production only, values cut to 100 characters) as app_name "docs".
 * GA4 forbids personal data, so email addresses and phone numbers in a
 * search `query` are redacted.
 */
import {
  ASK_SOLANA_ANALYTICS_EVENT,
  type AskSolanaAnalyticsDetail,
} from "@solana-com/ui-chrome/ask-solana/analytics";
import {
  trackAnalyticsEvent,
  type AnalyticsEventName,
} from "@solana-com/ui-chrome/analytics";

const ASK_EVENTS: ReadonlySet<string> = new Set<AnalyticsEventName>([
  "docs_ai_chat_opened",
  "docs_ai_message_sent",
  "docs_ai_timing",
  "docs_ai_feedback",
  "docs_ai_code_followup_clicked",
  "docs_ai_widget_expanded",
  "docs_ai_widget_fullscreen",
  "docs_ai_view_switched",
  "docs_ai_search",
  "docs_ai_search_result_clicked",
]);

const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
// A leading + or phone-style grouping, so slots and lamport amounts stay.
const PHONE = /\+\d[\d\s().-]{6,}\d|\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g;

/** A search query without email addresses or phone numbers. */
export function redactQuery(query: string): string {
  return query.replace(EMAIL, "[email]").replace(PHONE, "[phone]");
}

/** Sends Ask AI's events to GA4 until the returned cleanup runs. */
export function connectAskAnalytics(): () => void {
  if (typeof window === "undefined") return () => undefined;
  const onEvent = (event: Event) => {
    const detail = (event as CustomEvent<AskSolanaAnalyticsDetail>).detail;
    if (!detail || !ASK_EVENTS.has(detail.event)) return;
    const parameters: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(detail.properties ?? {})) {
      if (typeof value === "string")
        parameters[key] = key === "query" ? redactQuery(value) : value;
      else if (typeof value === "number" || typeof value === "boolean")
        parameters[key] = value;
    }
    trackAnalyticsEvent(detail.event as AnalyticsEventName, {
      ...parameters,
      app_name: "docs",
    });
  };
  window.addEventListener(ASK_SOLANA_ANALYTICS_EVENT, onEvent);
  return () => window.removeEventListener(ASK_SOLANA_ANALYTICS_EVENT, onEvent);
}
