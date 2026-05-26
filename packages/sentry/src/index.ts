const BOT_USER_AGENT_PATTERN =
  /\b(bot|crawler|spider|crawling|headless|lighthouse|pagespeed|slurp|bingpreview)\b/i;
const DEBUG_TRANSACTION_MARKERS = ["sentry-debug", "__sentry_debug__"];
const HEALTH_ROUTE_MARKERS = [
  "/api/health",
  "/api/ping",
  "/health",
  "/healthz",
  "/readyz",
];
const STATIC_ROUTE_MARKERS = [
  "/_next/",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap",
  "/manifest",
  "/images/",
  "/fonts/",
];
const STATIC_ASSET_EXTENSIONS = [
  ".js",
  ".css",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".ico",
  ".map",
  ".txt",
  ".xml",
  ".woff",
  ".woff2",
  ".ttf",
];
const EXTENSION_FRAME_MARKERS = [
  "extensionServiceWorker.js",
  "chrome-extension://",
  "moz-extension://",
  "safari-extension://",
  "extension://",
];
const EXTENSION_REJECTION_PATTERNS = [
  /Object Not Found Matching Id:\d+, MethodName:\w+, ParamCount:\d+/,
];

type SentryEventLike = {
  exception?: {
    values?: Array<{
      type?: string;
      value?: string;
      mechanism?: {
        synthetic?: boolean;
      };
      stacktrace?: {
        frames?: Array<{
          filename?: string;
        }>;
      };
    }>;
  };
  extra?: Record<string, unknown>;
  tags?: Record<string, unknown>;
  request?: {
    method?: string;
    url?: string;
    headers?: Record<string, string | string[] | undefined>;
  };
  transaction?: string;
  spans?: unknown[];
};

type SentrySamplingContextLike = {
  transactionContext?: {
    name?: string;
  };
  name?: string;
  normalizedRequest?: {
    method?: string;
    headers?: Record<string, string | string[] | undefined>;
    url?: string;
  };
  request?: {
    method?: string;
    headers?: Record<string, string | string[] | undefined>;
    url?: string;
  };
};

export const sentryIgnoreErrors = [
  /^ResizeObserver loop/,
  /^Non-Error promise rejection captured/,
  /^TypeError: Failed to fetch/,
  /^TypeError: NetworkError/,
  /^TypeError: Load failed/,
  /^AbortError/,
  /Hydration failed/,
  /There was an error while hydrating/,
  /Text content does not match/,
];

export const sentryDenyUrls = [
  /extensions\//i,
  /^chrome:\/\//i,
  /^chrome-extension:\/\//i,
  /^moz-extension:\/\//i,
  /^safari-extension:\/\//i,
  /googletagmanager\.com/i,
  /google-analytics\.com/i,
  /connect\.facebook\.net/i,
];

function getHeaderValue(
  headers: Record<string, string | string[] | undefined> | undefined,
  key: string,
): string {
  const value = headers?.[key] ?? headers?.[key.toLowerCase()];

  if (Array.isArray(value)) {
    return value.join(" ");
  }

  return typeof value === "string" ? value : "";
}

function getSamplingContextName(context: SentrySamplingContextLike): string {
  return (
    context.transactionContext?.name ??
    context.normalizedRequest?.url ??
    context.request?.url ??
    context.name ??
    ""
  );
}

function hasMarker(value: string, markers: string[]): boolean {
  const normalizedValue = value.toLowerCase();
  return markers.some((marker) => normalizedValue.includes(marker));
}

function isStaticAssetRequest(name: string): boolean {
  return (
    hasMarker(name, STATIC_ROUTE_MARKERS) ||
    STATIC_ASSET_EXTENSIONS.some((extension) => name.includes(extension))
  );
}

function isBotUserAgent(userAgent: string): boolean {
  return BOT_USER_AGENT_PATTERN.test(userAgent);
}

function isExtensionStackFrame(filename: string): boolean {
  return (
    filename.startsWith("app:///") ||
    EXTENSION_FRAME_MARKERS.some((marker) => filename.includes(marker))
  );
}

function isAppFrame(filename: string): boolean {
  return filename.startsWith("app://") || filename.startsWith("/_next/");
}

function isThirdPartyFrame(filename: string): boolean {
  return (
    filename.startsWith("http://") ||
    filename.startsWith("https://") ||
    filename.startsWith("webpack-internal://")
  );
}

function isSerializedWalletExtensionRejection(
  serialized: unknown,
  exceptionType: string | undefined,
  isSynthetic: boolean | undefined,
): boolean {
  return Boolean(
    isSynthetic &&
    exceptionType === "UnhandledRejection" &&
    serialized &&
    typeof serialized === "object" &&
    "code" in serialized &&
    "message" in serialized,
  );
}

function isKnownExtensionRejectionMessage(
  value: string | undefined,
  exceptionType: string | undefined,
): boolean {
  return Boolean(
    exceptionType === "UnhandledRejection" &&
    value &&
    EXTENSION_REJECTION_PATTERNS.some((pattern) => pattern.test(value)),
  );
}

function isWalletExtensionError(event: SentryEventLike): boolean {
  const exception = event.exception?.values?.[0];
  const serialized = event.extra?.__serialized__;

  return (
    isSerializedWalletExtensionRejection(
      serialized,
      exception?.type,
      exception?.mechanism?.synthetic,
    ) || isKnownExtensionRejectionMessage(exception?.value, exception?.type)
  );
}

export function sentryTracesSampler(
  context: SentrySamplingContextLike,
): number {
  const name = getSamplingContextName(context).toLowerCase();
  const userAgent = getHeaderValue(
    context.normalizedRequest?.headers ?? context.request?.headers,
    "user-agent",
  );

  if (hasMarker(name, DEBUG_TRANSACTION_MARKERS)) {
    return 1;
  }

  if (isBotUserAgent(userAgent)) {
    return 0;
  }

  if (hasMarker(name, HEALTH_ROUTE_MARKERS) || isStaticAssetRequest(name)) {
    return 0;
  }

  if (name.startsWith("/api/")) {
    return 0.01;
  }

  return 0.1;
}

export function sentryBeforeSendTransaction<T extends SentryEventLike>(
  event: T,
): T | null {
  const method = event.request?.method?.toUpperCase();
  const transactionName = (
    event.transaction ??
    event.request?.url ??
    ""
  ).toLowerCase();

  if (event.spans && event.spans.length > 100) {
    return null;
  }

  if (method === "OPTIONS" || method === "HEAD") {
    return null;
  }

  if (
    hasMarker(transactionName, HEALTH_ROUTE_MARKERS) ||
    isStaticAssetRequest(transactionName)
  ) {
    return null;
  }

  return event;
}

export function sentryBeforeSend<T extends SentryEventLike>(
  event: T,
): T | null {
  const exception = event.exception?.values?.[0];
  const stackTrace = exception?.stacktrace?.frames ?? [];
  const filenames = stackTrace
    .map((frame) => frame.filename ?? "")
    .filter(Boolean);

  if (filenames.some((filename) => isExtensionStackFrame(filename))) {
    return null;
  }

  if (isWalletExtensionError(event)) {
    return null;
  }

  const hasAppFrame = filenames.some((filename) => isAppFrame(filename));
  const hasThirdPartyFrame = filenames.some((filename) =>
    isThirdPartyFrame(filename),
  );

  if (hasThirdPartyFrame && !hasAppFrame) {
    event.tags = {
      ...event.tags,
      third_party_code: "true",
    };
  }

  return event;
}
