// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  beforeSend(event, _) {
    const exception = event.exception?.values?.[0];

    // Filter out browser extension errors by checking stack traces
    const stackTrace = exception?.stacktrace?.frames;

    const isExtensionError = stackTrace?.some(
      (frame) =>
        frame.filename?.includes("extensionServiceWorker.js") ||
        frame.filename?.includes("chrome-extension://") ||
        frame.filename?.includes("moz-extension://") ||
        frame.filename?.includes("safari-extension://") ||
        frame.filename?.includes("extension://") ||
        frame.filename?.startsWith("app:///"),
    );

    if (isExtensionError) {
      return null;
    }

    // Filter out wallet extension JSON-RPC errors (e.g. TronLink, MetaMask).
    // These surface as synthetic UnhandledRejections with no stack trace.
    if (
      exception?.mechanism?.synthetic &&
      exception?.type === "UnhandledRejection" &&
      typeof event.extra?.__serialized__ === "object" &&
      event.extra.__serialized__ !== null &&
      "code" in event.extra.__serialized__ &&
      "message" in event.extra.__serialized__
    ) {
      return null;
    }

    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
