import * as Sentry from "@sentry/nextjs";
import {
  sentryBeforeSend,
  sentryBeforeSendTransaction,
  sentryDenyUrls,
  sentryIgnoreErrors,
  sentryTracesSampler,
} from "./src/lib/sentry";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampler: sentryTracesSampler,
  beforeSendTransaction: sentryBeforeSendTransaction,
  beforeSend: sentryBeforeSend,
  ignoreErrors: sentryIgnoreErrors,
  denyUrls: sentryDenyUrls,
});
