import * as Sentry from "@sentry/nextjs";
import {
  sentryBeforeSend,
  sentryBeforeSendTransaction,
  sentryDenyUrls,
  sentryIgnoreErrors,
  sentryTracesSampler,
} from "@workspace/sentry";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampler: sentryTracesSampler,
  beforeSendTransaction: sentryBeforeSendTransaction,
  beforeSend: sentryBeforeSend,
  ignoreErrors: sentryIgnoreErrors,
  denyUrls: sentryDenyUrls,
});
