/**
 * Small, shared GA4 event contract for Solana.com properties.
 *
 * Do not pass email addresses, form field values, full search terms, or URL
 * query strings. GA4 prohibits sending personally identifiable information.
 */
export type AnalyticsAppName =
  | "web"
  | "docs"
  | "media"
  | "templates"
  | "accelerate"
  | "breakpoint";

export type AnalyticsEventName =
  | "generate_lead"
  | "select_content"
  | "view_item"
  | "podcast_play"
  | "podcast_subscribe";

type AnalyticsValue = string | number | boolean | undefined;
type AnalyticsParameters = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

const MAX_VALUE_LENGTH = 100;

function sanitizeValue(value: AnalyticsValue) {
  if (typeof value !== "string") return value;
  return value.trim().slice(0, MAX_VALUE_LENGTH);
}

function sanitizeParameters(parameters: AnalyticsParameters) {
  return Object.fromEntries(
    Object.entries(parameters)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, sanitizeValue(value)]),
  ) as Record<string, string | number | boolean>;
}

/** Emits a GA4 event only after the site's consent-aware gtag bootstrap exists. */
export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  parameters: AnalyticsParameters & { app_name: AnalyticsAppName },
) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", eventName, sanitizeParameters(parameters));
}

export function trackLead({
  appName,
  leadType,
  formId,
  placement,
}: {
  appName: AnalyticsAppName;
  leadType: "newsletter" | "contact" | "application" | "registration";
  formId: string;
  placement?: string;
}) {
  trackAnalyticsEvent("generate_lead", {
    app_name: appName,
    lead_type: leadType,
    form_id: formId,
    placement,
  });
}

export function trackContentSelection({
  appName,
  contentType,
  contentId,
  contentName,
  placement,
  linkUrl,
}: {
  appName: AnalyticsAppName;
  contentType: string;
  contentId?: string;
  contentName?: string;
  placement?: string;
  linkUrl?: string;
}) {
  trackAnalyticsEvent("select_content", {
    app_name: appName,
    content_type: contentType,
    content_id: contentId,
    content_name: contentName,
    placement,
    link_url: linkUrl ? linkUrl.split("?")[0] : undefined,
  });
}
