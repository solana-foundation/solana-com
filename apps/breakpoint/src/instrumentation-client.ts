import * as Sentry from "@sentry/nextjs";
import { initBotId } from "botid/client/core";
import { sentryOptions } from "@workspace/sentry";

Sentry.init(sentryOptions);

initBotId({
  protect: [{ path: "/breakpoint/api/nominations", method: "POST" }],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
