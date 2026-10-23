import * as Sentry from "@sentry/nextjs";
import { sentryOptions } from "@workspace/sentry";

export function register() {
  Sentry.init(sentryOptions);
}

export const onRequestError = Sentry.captureRequestError;
