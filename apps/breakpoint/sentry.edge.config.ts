import * as Sentry from "@sentry/nextjs";
import {
  sentryBeforeSend,
  sentryBeforeSendTransaction,
  sentryDenyUrls,
  sentryEnabled,
  sentryIgnoreErrors,
  sentryTracesSampler,
} from "@workspace/sentry";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: sentryEnabled,
  tracesSampler: sentryTracesSampler,
  beforeSendTransaction: sentryBeforeSendTransaction,
  beforeSend: sentryBeforeSend,
  ignoreErrors: sentryIgnoreErrors,
  denyUrls: sentryDenyUrls,
});
