// This file configures Sentry initialization in the browser.

import * as Sentry from "@sentry/nextjs";
import { sentryOptions } from "@workspace/sentry";

Sentry.init(sentryOptions);

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
