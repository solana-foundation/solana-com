// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
//
// Sentry is about a fifth of the script a page loads, so it is fetched and
// started once the page has loaded instead of with the page's own script;
// an error before then is not reported.

import type * as SentryModule from "@sentry/nextjs";
import { initBotId } from "botid/client/core";
import { sentryOptions } from "@workspace/sentry";

const sentry = new Promise<void>((resolve) => {
  if (document.readyState === "complete") resolve();
  else window.addEventListener("load", () => resolve(), { once: true });
})
  .then(() => import("@sentry/nextjs"))
  .then((Sentry) => {
    Sentry.init(sentryOptions);
    return Sentry;
  });

// The devnet transactions behind the demos on "Solana in action".
initBotId({
  protect: [
    { path: "/api/demo/checkout", method: "POST" },
    { path: "/api/demo/create-token", method: "POST" },
  ],
});

export function onRouterTransitionStart(
  ...args: Parameters<typeof SentryModule.captureRouterTransitionStart>
) {
  void sentry.then((Sentry) => Sentry.captureRouterTransitionStart(...args));
}
