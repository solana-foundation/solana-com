import "server-only";

import { checkRateLimit } from "@vercel/firewall";

const INKEEP_AI_API_BASE_URL = "https://api.inkeep.com";
const INKEEP_ANALYTICS_API_BASE_URL = "https://api.io.inkeep.com";
const REQUEST_HEADERS_TIMEOUT_MS = 25_000;
const MAX_BODY_BYTES = 128 * 1024;
const MAX_MESSAGES = 24;
const MAX_MESSAGE_CONTENT_LENGTH = 8_000;
const MAX_TOTAL_MESSAGE_CONTENT_LENGTH = 48_000;
const MAX_SEARCH_QUERY_LENGTH = 500;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
} as const;

const ENDPOINTS = {
  chat: {
    upstreamUrl: `${INKEEP_AI_API_BASE_URL}/v1/chat/completions`,
  },
  search: {
    upstreamUrl: `${INKEEP_AI_API_BASE_URL}/graphql`,
  },
} as const;

const RATE_LIMIT_IDS: Record<InkeepEndpoint, string> = {
  analytics: "inkeep-analytics",
  chat: "inkeep-chat",
  search: "inkeep-search",
};

const SEARCH_QUERY = `query GetSearchResults($searchInput: SearchInput!) {
  search(searchInput: $searchInput) {
    searchHits {
      id
      hitOnRoot
      url
      title
      preview
      ... on DocumentationHit {
        rootRecord {
          __typename
          id
          title
          url
          preview
          ... on DocumentationRecord {
            pathBreadcrumbs
            contentType
            topLevelHeadings { anchor url content }
          }
        }
        pathHeadings { anchor content }
        content { anchor content }
      }
      ... on StackOverflowHit {
        rootRecord {
          __typename
          id
          title
          url
          preview
          ... on StackOverflowRecord {
            body
            createdAt
            markedAsCorrectAnswer { url score content }
          }
        }
      }
      ... on GitHubIssueHit {
        rootRecord {
          __typename
          id
          title
          url
          preview
          ... on GitHubIssueRecord { createdAt body state }
        }
      }
      ... on DiscourseHit {
        rootRecord {
          __typename
          id
          title
          url
          preview
          ... on DiscourseRecord { createdAt body }
        }
      }
    }
    searchQuery
  }
}`;

type InkeepEndpoint = keyof typeof ENDPOINTS | "analytics";

type ProxyOptions =
  | { endpoint: "chat" }
  | { endpoint: "search" }
  | { endpoint: "analytics"; path: string[] };

export async function proxyInkeepRequest(
  request: Request,
  options: ProxyOptions,
): Promise<Response> {
  const startedAt = Date.now();
  const endpoint = options.endpoint;
  let status = 500;
  let failureClass: string | undefined;

  try {
    const apiKey = process.env.INKEEP_API_KEY?.trim();
    if (!apiKey) {
      status = 503;
      failureClass = "missing_configuration";
      return errorResponse(
        status,
        "inkeep_not_configured",
        "Search and chat are temporarily unavailable.",
      );
    }

    if (!isSameOriginBrowserRequest(request)) {
      status = 403;
      failureClass = "invalid_origin";
      return errorResponse(
        status,
        "invalid_origin",
        "This request is not allowed.",
      );
    }

    const rateLimit = await checkDistributedRateLimit(request, endpoint);
    if (!rateLimit.ok) {
      status = rateLimit.status;
      failureClass = rateLimit.failureClass;
      return rateLimit.response;
    }
    if (rateLimit.rateLimited) {
      status = 429;
      failureClass = "rate_limited";
      return errorResponse(
        status,
        "rate_limited",
        "Too many requests. Please try again shortly.",
        { "Retry-After": "60" },
      );
    }

    const preparedRequest = await prepareUpstreamRequest(request, options);
    if (!preparedRequest.ok) {
      status = preparedRequest.response.status;
      failureClass = "invalid_request";
      return preparedRequest.response;
    }

    const abort = createUpstreamAbortSignal(request.signal);
    const siteOrigin = new URL(request.url).origin;

    try {
      const upstreamResponse = await fetch(preparedRequest.url, {
        method: request.method,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: request.headers.get("accept") ?? "application/json",
          // Inkeep web integrations can restrict credentials to an allowed
          // domain. Preserve that signal without forwarding caller-controlled
          // Origin or Referer values.
          Origin: siteOrigin,
          Referer: `${siteOrigin}/`,
        },
        body: preparedRequest.body,
        cache: "no-store",
        signal: abort.signal,
      });

      status = upstreamResponse.status;

      if (!upstreamResponse.ok) {
        failureClass = classifyUpstreamFailure(upstreamResponse.status);
        abort.cleanup();
        await upstreamResponse.body?.cancel().catch(() => undefined);
        return mapUpstreamError(upstreamResponse.status);
      }

      abort.headersReceived();
      const response = streamUpstreamResponse(upstreamResponse, abort.cleanup);
      return response;
    } catch (error) {
      abort.cleanup();

      if (abort.timedOut()) {
        status = 504;
        failureClass = "timeout";
        return errorResponse(
          status,
          "inkeep_timeout",
          "Search and chat took too long to respond.",
        );
      }

      if (request.signal.aborted || isAbortError(error)) {
        status = 499;
        failureClass = "client_abort";
        return new Response(null, { status });
      }

      status = 502;
      failureClass = "network";
      return errorResponse(
        status,
        "inkeep_unavailable",
        "Search and chat are temporarily unavailable.",
      );
    }
  } finally {
    logMetric({
      endpoint,
      status,
      durationMs: Date.now() - startedAt,
      failureClass,
    });
  }
}

async function prepareUpstreamRequest(
  request: Request,
  options: ProxyOptions,
): Promise<
  | { ok: true; url: string; body: string | undefined }
  | { ok: false; response: Response }
> {
  if (request.method !== "POST") {
    return {
      ok: false,
      response: errorResponse(
        405,
        "method_not_allowed",
        "This request method is not allowed.",
        { Allow: "POST" },
      ),
    };
  }

  const parsedBody = await readJsonBody(request);
  if (!parsedBody.ok) return parsedBody;

  if (options.endpoint === "chat") {
    const body = validateChatBody(parsedBody.value);
    return body
      ? {
          ok: true,
          url: ENDPOINTS.chat.upstreamUrl,
          body: JSON.stringify(body),
        }
      : invalidRequest("The chat request is invalid.");
  }

  if (options.endpoint === "search") {
    return validateSearchBody(parsedBody.value)
      ? {
          ok: true,
          url: ENDPOINTS.search.upstreamUrl,
          body: JSON.stringify(buildSearchBody(parsedBody.value)),
        }
      : invalidRequest("The search request is invalid.");
  }

  const upstreamUrl = getAnalyticsUrl(options.path);
  return upstreamUrl && isRecord(parsedBody.value)
    ? {
        ok: true,
        url: upstreamUrl,
        body: JSON.stringify(parsedBody.value),
      }
    : invalidRequest("The analytics request is invalid.");
}

async function readJsonBody(
  request: Request,
): Promise<{ ok: true; value: unknown } | { ok: false; response: Response }> {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return invalidRequest("The request is too large.", 413);
  }

  const reader = request.body?.getReader();
  if (!reader) return invalidRequest("The request body is required.");

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel();
        return invalidRequest("The request is too large.", 413);
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    return { ok: true, value: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return invalidRequest("The request body must be valid JSON.");
  }
}

function validateChatBody(value: unknown): Record<string, unknown> | null {
  if (!isRecord(value) || !Array.isArray(value.messages)) return null;
  if (value.messages.length < 1 || value.messages.length > MAX_MESSAGES) {
    return null;
  }

  let totalContentLength = 0;
  for (const message of value.messages) {
    if (!isRecord(message)) return null;
    if (
      !["assistant", "system", "tool", "user"].includes(
        typeof message.role === "string" ? message.role : "",
      )
    ) {
      return null;
    }

    const contentLength = getStringContentLength(message.content);
    if (contentLength === null || contentLength > MAX_MESSAGE_CONTENT_LENGTH) {
      return null;
    }
    totalContentLength += contentLength;
  }

  if (totalContentLength > MAX_TOTAL_MESSAGE_CONTENT_LENGTH) return null;

  return {
    ...value,
    model: "inkeep-qa-expert",
  };
}

function getStringContentLength(value: unknown): number | null {
  if (value === null) return 0;
  if (typeof value === "string") return value.length;
  if (!Array.isArray(value)) return null;

  let length = 0;
  for (const part of value) {
    if (!isRecord(part)) return null;
    if (typeof part.text === "string") length += part.text.length;
  }
  return length;
}

function validateSearchBody(value: unknown): boolean {
  if (!isRecord(value) || !isRecord(value.variables)) return false;
  const searchInput = value.variables.searchInput;
  if (!isRecord(searchInput)) return false;

  const searchQuery = searchInput.searchQuery;
  if (
    typeof searchQuery !== "string" ||
    searchQuery.trim().length < 1 ||
    searchQuery.length > MAX_SEARCH_QUERY_LENGTH
  ) {
    return false;
  }

  if (typeof value.query !== "string") return false;

  const filters = searchInput.filters;
  if (filters !== undefined && !isRecord(filters)) return false;
  if (
    isRecord(filters) &&
    filters.limit !== undefined &&
    (typeof filters.limit !== "number" ||
      !Number.isInteger(filters.limit) ||
      filters.limit < 1 ||
      filters.limit > 40)
  ) {
    return false;
  }

  return true;
}

function buildSearchBody(value: unknown): Record<string, unknown> {
  const searchInput = (value as { variables: { searchInput: object } })
    .variables.searchInput;

  return {
    query: SEARCH_QUERY,
    variables: { searchInput },
  };
}

function getAnalyticsUrl(path: string[]): string | null {
  const joinedPath = path.join("/");
  if (
    joinedPath === "conversations" ||
    joinedPath === "events" ||
    joinedPath === "feedback"
  ) {
    return `${INKEEP_ANALYTICS_API_BASE_URL}/${joinedPath}`;
  }
  return null;
}

function streamUpstreamResponse(
  upstreamResponse: Response,
  cleanup: () => void,
): Response {
  const headers = new Headers(NO_STORE_HEADERS);
  const contentType = upstreamResponse.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  const requestId = upstreamResponse.headers.get("x-request-id");
  if (requestId) headers.set("X-Upstream-Request-Id", requestId);

  if (!upstreamResponse.body) {
    cleanup();
    return new Response(null, { status: upstreamResponse.status, headers });
  }

  const reader = upstreamResponse.body.getReader();
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          cleanup();
          controller.close();
          return;
        }
        controller.enqueue(value);
      } catch (error) {
        cleanup();
        controller.error(error);
      }
    },
    async cancel(reason) {
      cleanup();
      await reader.cancel(reason).catch(() => undefined);
    },
  });

  return new Response(body, { status: upstreamResponse.status, headers });
}

function createUpstreamAbortSignal(requestSignal: AbortSignal) {
  const controller = new AbortController();
  let didTimeOut = false;
  const abortFromRequest = () => controller.abort(requestSignal.reason);
  if (requestSignal.aborted) {
    abortFromRequest();
  } else {
    requestSignal.addEventListener("abort", abortFromRequest, { once: true });
  }
  const timeout = setTimeout(() => {
    didTimeOut = true;
    controller.abort(
      new DOMException("Upstream request timed out", "TimeoutError"),
    );
  }, REQUEST_HEADERS_TIMEOUT_MS);

  return {
    signal: controller.signal,
    timedOut: () => didTimeOut,
    headersReceived() {
      clearTimeout(timeout);
    },
    cleanup() {
      clearTimeout(timeout);
      requestSignal.removeEventListener("abort", abortFromRequest);
    },
  };
}

function mapUpstreamError(upstreamStatus: number): Response {
  if (upstreamStatus === 401 || upstreamStatus === 403) {
    return errorResponse(
      502,
      "inkeep_authentication_failed",
      "Search and chat are temporarily unavailable.",
    );
  }
  if (upstreamStatus === 429) {
    return errorResponse(
      429,
      "inkeep_throttled",
      "Search and chat are busy. Please try again shortly.",
      { "Retry-After": "30" },
    );
  }
  return errorResponse(
    502,
    "inkeep_unavailable",
    "Search and chat are temporarily unavailable.",
  );
}

function classifyUpstreamFailure(status: number): string {
  if (status === 401 || status === 403) return "authentication";
  if (status === 429) return "throttled";
  if (status >= 500) return "upstream_5xx";
  return "upstream_4xx";
}

function invalidRequest(message: string, status = 400) {
  return {
    ok: false as const,
    response: errorResponse(status, "invalid_request", message),
  };
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  extraHeaders?: HeadersInit,
): Response {
  return Response.json(
    { error: { code, message, type: "inkeep_proxy_error" } },
    {
      status,
      headers: { ...NO_STORE_HEADERS, ...extraHeaders },
    },
  );
}

function isSameOriginBrowserRequest(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "same-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const requestUrl = new URL(request.url);
    const originUrl = new URL(origin);
    return originUrl.host === requestUrl.host;
  } catch {
    return false;
  }
}

function getClientIp(headers: Headers): string {
  const direct =
    headers.get("cf-connecting-ip") ??
    headers.get("true-client-ip") ??
    headers.get("x-real-ip");
  if (direct?.trim()) return direct.trim();

  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

async function checkDistributedRateLimit(
  request: Request,
  endpoint: InkeepEndpoint,
): Promise<
  | { ok: true; rateLimited: boolean }
  | {
      ok: false;
      status: number;
      failureClass: string;
      response: Response;
    }
> {
  try {
    const result = await checkRateLimit(RATE_LIMIT_IDS[endpoint], {
      request,
      rateLimitKey: getClientIp(request.headers),
    });

    if (result.error === "not-found" && process.env.NODE_ENV === "production") {
      console.error("Inkeep Vercel WAF rate limit is not configured", {
        endpoint,
        rateLimitId: RATE_LIMIT_IDS[endpoint],
      });
      return rateLimitUnavailable();
    }

    return {
      ok: true,
      rateLimited: result.rateLimited,
    };
  } catch (error) {
    console.error("Inkeep rate-limit check failed", {
      endpoint,
      error: error instanceof Error ? error.message : "unknown_error",
    });
    return rateLimitUnavailable();
  }
}

function rateLimitUnavailable() {
  const status = 503;
  return {
    ok: false as const,
    status,
    failureClass: "rate_limit_unavailable",
    response: errorResponse(
      status,
      "inkeep_unavailable",
      "Search and chat are temporarily unavailable.",
    ),
  };
}

function logMetric(metric: {
  endpoint: InkeepEndpoint;
  status: number;
  durationMs: number;
  failureClass?: string;
}) {
  console.info("inkeep_proxy_request", metric);
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
