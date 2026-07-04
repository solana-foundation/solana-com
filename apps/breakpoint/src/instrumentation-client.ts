// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { sentryOptions } from "@workspace/sentry";

const initSentry = () => {
  Sentry.init(sentryOptions);
};

if (typeof window !== "undefined") {
  const idle = (
    window as Window & {
      requestIdleCallback?: (
        _cb: () => void,
        _opts?: { timeout: number },
      ) => number;
    }
  ).requestIdleCallback;

  const schedule = () => {
    if (idle) idle(initSentry, { timeout: 3000 });
    else window.setTimeout(initSentry, 1000);
  };

  if (document.readyState === "complete") {
    schedule();
  } else {
    window.addEventListener("load", schedule, { once: true });
  }
} else {
  initSentry();
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
