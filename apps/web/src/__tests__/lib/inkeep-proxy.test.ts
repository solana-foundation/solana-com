import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit } from "@vercel/firewall";

import { proxyInkeepRequest } from "@solana-com/ui-chrome/inkeep-proxy";

vi.mock("@vercel/firewall", () => ({
  checkRateLimit: vi.fn(),
}));

const checkRateLimitMock = vi.mocked(checkRateLimit);

const TEST_ORIGIN = "https://solana.com";
const TEST_API_KEY = "test-server-key";

describe("Inkeep API proxy", () => {
  beforeEach(() => {
    checkRateLimitMock.mockResolvedValue({ rateLimited: false });
    vi.stubEnv("INKEEP_API_KEY", TEST_API_KEY);
    vi.spyOn(console, "info").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("streams chat responses without changing citation metadata", async () => {
    const streamChunk =
      'data: {"choices":[{"delta":{"content":"Use web3.js"}}],"citations":[{"url":"https://solana.com/docs"}]}\n\n';
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(streamChunk, {
        headers: { "Content-Type": "text/event-stream" },
      }),
    );

    const response = await proxyInkeepRequest(chatRequest(), {
      endpoint: "chat",
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/event-stream");
    expect(await response.text()).toBe(streamChunk);

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://api.inkeep.com/v1/chat/completions");
    expect(new Headers(init?.headers).get("authorization")).toBe(
      `Bearer ${TEST_API_KEY}`,
    );
    expect(JSON.parse(String(init?.body))).toMatchObject({
      model: "inkeep-qa-expert",
      messages: [{ role: "user", content: "How do I get started?" }],
    });
  });

  it("passes document search results and source URLs through", async () => {
    const searchResult = {
      data: {
        search: {
          searchHits: [
            {
              id: "doc-1",
              title: "Transactions",
              url: "https://solana.com/docs/core/transactions",
            },
          ],
          searchQuery: "transactions",
        },
      },
    };
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json(searchResult));

    const response = await proxyInkeepRequest(searchRequest("transactions"), {
      endpoint: "search",
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(searchResult);
    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://api.inkeep.com/graphql");
  });

  it("replaces the caller's GraphQL document with the supported search operation", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json({ data: { search: {} } }));
    const request = searchRequest("transactions");
    const body = (await request.json()) as Record<string, unknown>;
    const response = await proxyInkeepRequest(
      new Request(request.url, {
        method: "POST",
        headers: request.headers,
        body: JSON.stringify({
          ...body,
          query: `${String(body.query)} mutation Unexpected { deleteAll }`,
        }),
      }),
      { endpoint: "search" },
    );

    expect(response.status).toBe(200);
    const upstreamBody = JSON.parse(
      String(fetchMock.mock.calls[0]?.[1]?.body),
    ) as { query: string };
    expect(upstreamBody.query).toContain("query GetSearchResults");
    expect(upstreamBody.query).not.toContain("mutation Unexpected");
  });

  it("rejects invalid and oversized requests before calling Inkeep", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    const invalidResponse = await proxyInkeepRequest(
      chatRequest({ messages: [] }),
      { endpoint: "chat" },
    );
    const oversizedResponse = await proxyInkeepRequest(
      chatRequest(undefined, {
        "content-length": String(128 * 1024 + 1),
        "x-forwarded-for": "192.0.2.2",
      }),
      { endpoint: "chat" },
    );

    expect(invalidResponse.status).toBe(400);
    expect(await errorCode(invalidResponse)).toBe("invalid_request");
    expect(oversizedResponse.status).toBe(413);
    expect(await errorCode(oversizedResponse)).toBe("invalid_request");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rate limits repeated requests from the same client", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    checkRateLimitMock.mockResolvedValueOnce({ rateLimited: true });

    const response = await proxyInkeepRequest(chatRequest(), {
      endpoint: "chat",
    });
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("60");
    expect(await errorCode(response)).toBe("rate_limited");
    expect(checkRateLimitMock).toHaveBeenCalledWith(
      "inkeep-chat",
      expect.objectContaining({ rateLimitKey: "192.0.2.1" }),
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    [401, 502, "inkeep_authentication_failed"],
    [403, 502, "inkeep_authentication_failed"],
    [429, 429, "inkeep_throttled"],
    [500, 502, "inkeep_unavailable"],
    [503, 502, "inkeep_unavailable"],
  ])(
    "maps upstream %i responses to a safe %i response",
    async (upstreamStatus, expectedStatus, expectedCode) => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response("sensitive upstream details", { status: upstreamStatus }),
      );

      const response = await proxyInkeepRequest(chatRequest(), {
        endpoint: "chat",
      });

      expect(response.status).toBe(expectedStatus);
      expect(await errorCode(response)).toBe(expectedCode);
    },
  );

  it("returns a stable error when server configuration is missing", async () => {
    vi.stubEnv("INKEEP_API_KEY", "");
    const fetchMock = vi.spyOn(globalThis, "fetch");

    const response = await proxyInkeepRequest(chatRequest(), {
      endpoint: "chat",
    });

    expect(response.status).toBe(503);
    expect(await errorCode(response)).toBe("inkeep_not_configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("times out stalled upstream requests", async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, "fetch").mockImplementation((_url, init) =>
      rejectWhenAborted(init?.signal),
    );

    const responsePromise = proxyInkeepRequest(chatRequest(), {
      endpoint: "chat",
    });
    await vi.advanceTimersByTimeAsync(25_000);
    const response = await responsePromise;

    expect(response.status).toBe(504);
    expect(await errorCode(response)).toBe("inkeep_timeout");
  });

  it("does not abort an active stream after response headers arrive", async () => {
    vi.useFakeTimers();
    let upstreamSignal: AbortSignal | null | undefined;
    const cancel = vi.fn();
    vi.spyOn(globalThis, "fetch").mockImplementation((_url, init) => {
      upstreamSignal = init?.signal;
      return Promise.resolve(
        new Response(
          new ReadableStream({
            start(controller) {
              controller.enqueue(new TextEncoder().encode("data: first\n\n"));
            },
            cancel,
          }),
          { headers: { "Content-Type": "text/event-stream" } },
        ),
      );
    });

    const response = await proxyInkeepRequest(chatRequest(), {
      endpoint: "chat",
    });
    const reader = response.body!.getReader();
    await reader.read();
    await vi.advanceTimersByTimeAsync(25_000);

    expect(upstreamSignal?.aborted).toBe(false);
    await reader.cancel();
    expect(cancel).toHaveBeenCalledOnce();
  });

  it("propagates a client disconnect to the upstream request", async () => {
    const controller = new AbortController();
    let upstreamSignal: AbortSignal | null | undefined;
    vi.spyOn(globalThis, "fetch").mockImplementation((_url, init) => {
      upstreamSignal = init?.signal;
      return rejectWhenAborted(init?.signal);
    });

    const responsePromise = proxyInkeepRequest(
      chatRequest(undefined, undefined, controller.signal),
      { endpoint: "chat" },
    );
    controller.abort();
    const response = await responsePromise;

    expect(response.status).toBe(499);
    expect(upstreamSignal?.aborted).toBe(true);
  });

  it("rejects cross-origin browser requests", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const request = chatRequest(undefined, {
      origin: "https://example.com",
      "sec-fetch-site": "cross-site",
    });

    const response = await proxyInkeepRequest(request, { endpoint: "chat" });

    expect(response.status).toBe(403);
    expect(await errorCode(response)).toBe("invalid_origin");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

function chatRequest(
  body: unknown = {
    model: "client-controlled-model",
    messages: [{ role: "user", content: "How do I get started?" }],
    stream: true,
  },
  extraHeaders: HeadersInit = {},
  signal?: AbortSignal,
) {
  return new Request(`${TEST_ORIGIN}/api/inkeep/v1/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: TEST_ORIGIN,
      "sec-fetch-site": "same-origin",
      "x-forwarded-for": "192.0.2.1",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
    signal,
  });
}

function searchRequest(query: string) {
  return new Request(`${TEST_ORIGIN}/api/inkeep/search/graphql`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: TEST_ORIGIN,
      "sec-fetch-site": "same-origin",
      "x-forwarded-for": "192.0.2.10",
    },
    body: JSON.stringify({
      query:
        "query GetSearchResults($searchInput: SearchInput!) { search(searchInput: $searchInput) { searchHits { id url title } searchQuery } }",
      variables: {
        searchInput: {
          searchQuery: query,
          filters: { limit: 40 },
        },
      },
    }),
  });
}

async function errorCode(response: Response) {
  const body = (await response.json()) as { error: { code: string } };
  return body.error.code;
}

function rejectWhenAborted(signal: AbortSignal | null | undefined) {
  return new Promise<Response>((_resolve, reject) => {
    const rejectWithAbort = () =>
      reject(new DOMException("The operation was aborted", "AbortError"));

    if (signal?.aborted) {
      rejectWithAbort();
      return;
    }
    signal?.addEventListener("abort", rejectWithAbort, { once: true });
  });
}
