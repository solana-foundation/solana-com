// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  beforeSend(event, _) {
    // Filter out browser extension errors by checking stack traces
    const stackTrace = event.exception?.values?.[0]?.stacktrace?.frames;

    const isExtensionError = stackTrace?.some(
      (frame) =>
        frame.filename?.includes("extensionServiceWorker.js") ||
        frame.filename?.includes("chrome-extension://") ||
        frame.filename?.includes("moz-extension://") ||
        frame.filename?.includes("safari-extension://") ||
        frame.filename?.includes("extension://"),
    );

    if (isExtensionError) {
      return null; // Don't send to Sentry
    }

    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
