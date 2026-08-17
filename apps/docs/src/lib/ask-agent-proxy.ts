const DEFAULT_ASK_AGENT_URL =
  "https://web-prd-492045163003.us-central1.run.app";
const ASK_PROXY_SECRET_HEADER = "X-Ask-Proxy-Secret";

const REQUEST_HEADER_ALLOWLIST = [
  "accept",
  "accept-language",
  "content-type",
  "user-agent",
  "x-ask-client-capabilities",
  "x-forwarded-for",
  "x-real-ip",
  "x-vercel-forwarded-for",
  "x-vercel-ip-city",
  "x-vercel-ip-country",
  "x-vercel-ip-country-region",
] as const;

const RESPONSE_HEADER_ALLOWLIST = [
  "content-type",
  "cache-control",
  "retry-after",
  "server-timing",
  "x-ratelimit-limit",
  "x-ratelimit-remaining",
  "x-ratelimit-reset",
] as const;

function askAgentBaseUrl(): string {
  return (process.env.ASK_AGENT_URL || DEFAULT_ASK_AGENT_URL).replace(
    /\/+$/,
    "",
  );
}

function askProxySecret(): string | null {
  const secret = process.env.ASK_PROXY_SECRET?.trim();
  return secret ? secret : null;
}

function askAgentUrl(pathSegments: string[], requestUrl: string): URL {
  const upstreamUrl = new URL(
    `/api/ask/${pathSegments.map(encodeURIComponent).join("/")}`,
    askAgentBaseUrl(),
  );
  upstreamUrl.search = new URL(requestUrl).search;
  return upstreamUrl;
}

function requestHeaders(request: Request, proxySecret: string): Headers {
  const headers = new Headers();

  for (const key of REQUEST_HEADER_ALLOWLIST) {
    const value = request.headers.get(key);
    if (value) headers.set(key, value);
  }

  headers.set(ASK_PROXY_SECRET_HEADER, proxySecret);
  return headers;
}

function responseHeaders(upstream: Response): Headers {
  const headers = new Headers();

  for (const key of RESPONSE_HEADER_ALLOWLIST) {
    const value = upstream.headers.get(key);
    if (value) headers.set(key, value);
  }

  return headers;
}

function nowMs(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function formatDuration(durationMs: number): string {
  return Math.max(0, Math.round(durationMs * 10) / 10).toFixed(1);
}

function appendServerTiming(headers: Headers, entries: string[]) {
  const existing = headers.get("server-timing");
  headers.set(
    "server-timing",
    [existing, ...entries].filter(Boolean).join(", "),
  );
}

export async function proxyAskRequest(
  request: Request,
  pathSegments: string[],
): Promise<Response> {
  const startedAt = nowMs();
  const proxySecret = askProxySecret();
  if (!proxySecret) {
    const response = Response.json(
      { error: "ASK_PROXY_SECRET is not configured" },
      { status: 503 },
    );
    appendServerTiming(response.headers, [
      `ask_proxy;dur=${formatDuration(nowMs() - startedAt)}`,
    ]);
    return response;
  }

  const method = request.method.toUpperCase();
  const bodyStartedAt = nowMs();
  const body =
    method === "GET" || method === "HEAD" ? undefined : await request.blob();
  const bodyReadMs = nowMs() - bodyStartedAt;
  const upstreamUrl = askAgentUrl(pathSegments, request.url);
  const upstreamStartedAt = nowMs();

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      method,
      headers: requestHeaders(request, proxySecret),
      body,
      cache: "no-store",
      redirect: "manual",
      signal: request.signal,
    });
  } catch (error) {
    if (request.signal.aborted) {
      return new Response(null, { status: 499 });
    }
    console.error("[ask/proxy] upstream request failed:", error);
    const response = Response.json(
      { error: "Ask Solana service is unavailable" },
      { status: 503 },
    );
    appendServerTiming(response.headers, [
      `ask_body;dur=${formatDuration(bodyReadMs)}`,
      `ask_upstream;dur=${formatDuration(nowMs() - upstreamStartedAt)}`,
      `ask_proxy;dur=${formatDuration(nowMs() - startedAt)}`,
    ]);
    return response;
  }
  const upstreamHeaderMs = nowMs() - upstreamStartedAt;
  const totalHeaderMs = nowMs() - startedAt;
  const headers = responseHeaders(upstream);
  appendServerTiming(headers, [
    `ask_body;dur=${formatDuration(bodyReadMs)}`,
    `ask_upstream;dur=${formatDuration(upstreamHeaderMs)}`,
    `ask_proxy;dur=${formatDuration(totalHeaderMs)}`,
  ]);

  console.info("[ask/proxy] upstream response", {
    method,
    path: `/api/ask/${pathSegments.join("/")}`,
    status: upstream.status,
    upstreamHeaderMs: Math.round(upstreamHeaderMs),
    proxyHeaderMs: Math.round(totalHeaderMs),
    contentType: upstream.headers.get("content-type"),
  });

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
