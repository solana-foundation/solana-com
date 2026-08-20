// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { initBotId } from "botid/client/core";
import { sentryOptions } from "@workspace/sentry";

Sentry.init(sentryOptions);

initBotId({
  protect: [
    {
      path: "/api/university-ambassador",
      method: "POST",
    },
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
