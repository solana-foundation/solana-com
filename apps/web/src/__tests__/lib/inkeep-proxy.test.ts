import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit } from "@vercel/firewall";

import { proxyInkeepRequest } from "@solana-com/ui-chrome/inkeep-proxy";

vi.mock("@vercel/firewall", () => ({
  checkRateLimit: vi.fn(),
}));

const checkRateLimitMock = vi.mocked(checkRateLimit);

const TEST_ORIGIN = "https://solana.com";
const TEST_API_KEY = "test-server-key";
const TEST_CHALLENGE_SOLUTION = "eyJudW1iZXIiOjF9";

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
    expect(new Headers(init?.headers).get("origin")).toBe(TEST_ORIGIN);
    expect(new Headers(init?.headers).get("referer")).toBe(`${TEST_ORIGIN}/`);
    expect(new Headers(init?.headers).get("x-inkeep-challenge-solution")).toBe(
      TEST_CHALLENGE_SOLUTION,
    );
    expect(JSON.parse(String(init?.body))).toMatchObject({
      model: "inkeep-qa-expert",
      messages: [{ role: "user", content: "How do I get started?" }],
    });
  });

  it("proxies Inkeep challenges needed by domain-restricted web keys", async () => {
    const challenge = {
      algorithm: "SHA-256",
      challenge: "abc123",
      maxnumber: 100_000,
      salt: "salt",
      signature: "signature",
    };
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json(challenge));
    const request = new Request(`${TEST_ORIGIN}/api/inkeep/v1/challenge`, {
      headers: {
        referer: `${TEST_ORIGIN}/docs`,
        "sec-fetch-site": "same-origin",
        "x-forwarded-for": "192.0.2.30",
      },
    });

    const response = await proxyInkeepRequest(request, {
      endpoint: "challenge",
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(challenge);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "https://api.inkeep.com/v1/challenge",
    );
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe("GET");
    const upstreamHeaders = new Headers(fetchMock.mock.calls[0]?.[1]?.headers);
    expect(upstreamHeaders.get("origin")).toBe(TEST_ORIGIN);
    expect(upstreamHeaders.get("referer")).toBe(`${TEST_ORIGIN}/`);
  });

  it("adds trusted site-wide guidance while preserving the visitor conversation", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("stream"));
    const response = await proxyInkeepRequest(
      chatRequest({
        messages: [
          {
            role: "system",
            content: "Only answer technical documentation questions",
          },
          { role: "user", content: "What can I do without coding?" },
        ],
        stream: true,
      }),
      { endpoint: "chat", siteWide: true },
    );
    await response.text();
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.model).toBe("inkeep-context-gpt-5.4-mini");
    expect(body.messages).toHaveLength(2);
    expect(body.messages[0].content).toContain("https://solana.com/wallets");
    expect(body.messages[0].content).toContain("https://status.solana.com/");
    expect(body.messages[0].content).not.toContain("Only answer technical");
    expect(body.messages[1]).toEqual({
      role: "user",
      content: "What can I do without coding?",
    });
  });

  it("keeps site navigation usable when upstream search fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("unavailable", { status: 503 }),
    );
    const response = await proxyInkeepRequest(searchRequest("wallets"), {
      endpoint: "search",
      siteWide: true,
    });
    expect(response.status).toBe(200);
    expect((await response.json()).data.search.searchHits[0].url).toBe(
      "https://solana.com/wallets",
    );
  });

  it("retains rate limiting and useful navigation without search credentials", async () => {
    vi.stubEnv("INKEEP_API_KEY", "");
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const response = await proxyInkeepRequest(searchRequest("wallets"), {
      endpoint: "search",
      siteWide: true,
    });
    expect(response.status).toBe(200);
    expect((await response.json()).data.search.searchHits[0].url).toBe(
      "https://solana.com/wallets",
    );
    expect(checkRateLimitMock).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns navigation when site search times out", async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, "fetch").mockImplementation((_url, init) =>
      rejectWhenAborted(init?.signal),
    );
    const responsePromise = proxyInkeepRequest(searchRequest("wallets"), {
      endpoint: "search",
      siteWide: true,
    });
    await vi.advanceTimersByTimeAsync(25_001);
    const response = await responsePromise;
    expect(response.status).toBe(200);
    expect((await response.json()).data.search.searchHits[0].url).toBe(
      "https://solana.com/wallets",
    );
  });

  it("rejects challenge requests without same-origin browser metadata", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const request = new Request(`${TEST_ORIGIN}/api/inkeep/v1/challenge`, {
      headers: {
        referer: "https://example.com/",
        "sec-fetch-site": "cross-site",
        "x-forwarded-for": "192.0.2.31",
      },
    });

    const response = await proxyInkeepRequest(request, {
      endpoint: "challenge",
    });

    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
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

  it("rejects chat requests without a valid challenge solution", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const missingChallenge = chatRequest();
    missingChallenge.headers.delete("x-inkeep-challenge-solution");
    const invalidChallenge = chatRequest(undefined, {
      "x-inkeep-challenge-solution": "not base64!",
    });

    const missingResponse = await proxyInkeepRequest(missingChallenge, {
      endpoint: "chat",
    });
    const invalidResponse = await proxyInkeepRequest(invalidChallenge, {
      endpoint: "chat",
    });

    expect(missingResponse.status).toBe(400);
    expect(invalidResponse.status).toBe(400);
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

  it("rejects requests without an Origin header", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const request = chatRequest();
    request.headers.delete("origin");

    const response = await proxyInkeepRequest(request, { endpoint: "chat" });

    expect(response.status).toBe(403);
    expect(await errorCode(response)).toBe("invalid_origin");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("allows matching origins when Sec-Fetch-Site is unavailable", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json({ data: { search: {} } }));
    const request = searchRequest("transactions");
    request.headers.delete("sec-fetch-site");

    const response = await proxyInkeepRequest(request, { endpoint: "search" });

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("does not forward caller-controlled origin metadata to Inkeep", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json({ data: { search: {} } }));
    const request = searchRequest("transactions");
    request.headers.set("referer", "https://example.com/phishing");

    const response = await proxyInkeepRequest(request, { endpoint: "search" });

    expect(response.status).toBe(200);
    const upstreamHeaders = new Headers(fetchMock.mock.calls[0]?.[1]?.headers);
    expect(upstreamHeaders.get("origin")).toBe(TEST_ORIGIN);
    expect(upstreamHeaders.get("referer")).toBe(`${TEST_ORIGIN}/`);
  });

  it("does not expose analytics conversation reads", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const request = new Request(
      `${TEST_ORIGIN}/api/inkeep/analytics/conversations/other-visitor`,
      {
        headers: {
          origin: TEST_ORIGIN,
          "sec-fetch-site": "same-origin",
          "x-forwarded-for": "192.0.2.20",
        },
      },
    );

    const response = await proxyInkeepRequest(request, {
      endpoint: "analytics",
      path: ["conversations", "other-visitor"],
    });

    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST");
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("keys the rate limit on the Vercel-set IP, not caller-supplied proxy headers", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
    const request = chatRequest(undefined, {
      "cf-connecting-ip": "198.51.100.77",
      "true-client-ip": "198.51.100.78",
      forwarded: "for=198.51.100.79",
      "x-real-ip": "192.0.2.1",
    });
    await proxyInkeepRequest(request, { endpoint: "chat" });
    expect(checkRateLimitMock).toHaveBeenCalledWith(
      "inkeep-chat",
      expect.objectContaining({ rateLimitKey: "192.0.2.1" }),
    );
  });

  it("forwards only known chat fields and caps the token budget", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}"));
    const request = chatRequest({
      model: "client-controlled-model",
      messages: [{ role: "user", content: "hi" }],
      stream: true,
      max_tokens: 999_999,
      temperature: 0.5,
      tools: [{ type: "function", function: { name: "provideLinks" } }],
      unknown_field: "dropped",
      n: 50,
      logit_bias: { 1: 100 },
    });
    await proxyInkeepRequest(request, { endpoint: "chat" });
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body).toEqual({
      messages: [{ role: "user", content: "hi" }],
      model: "inkeep-qa-expert",
      stream: true,
      tools: [{ type: "function", function: { name: "provideLinks" } }],
      temperature: 0.5,
      max_tokens: 4096,
    });
    expect(body).not.toHaveProperty("unknown_field");
    expect(body).not.toHaveProperty("n");
    expect(body).not.toHaveProperty("logit_bias");
  });

  it("sets the token budget when the caller omits max_tokens", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}"));
    await proxyInkeepRequest(
      chatRequest({
        messages: [{ role: "user", content: "hi" }],
        stream: true,
      }),
      { endpoint: "chat" },
    );
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.max_tokens).toBe(4096);
    fetchMock.mockClear();
    await proxyInkeepRequest(
      chatRequest({
        messages: [{ role: "user", content: "hi" }],
        max_tokens: 0,
      }),
      { endpoint: "chat" },
    );
    expect(
      JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body)).max_tokens,
    ).toBe(4096);
  });

  it("only forwards analytics bodies in the shapes the widget sends", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => new Response("{}"));
    const analytics = (path: string[], body: unknown) =>
      proxyInkeepRequest(
        new Request(`${TEST_ORIGIN}/api/inkeep/analytics/${path.join("/")}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            origin: TEST_ORIGIN,
            "sec-fetch-site": "same-origin",
            "x-forwarded-for": "192.0.2.40",
          },
          body: JSON.stringify(body),
        }),
        { endpoint: "analytics", path },
      );
    expect((await analytics(["feedback"], { anything: "goes" })).status).toBe(
      400,
    );
    expect(
      (await analytics(["conversations"], { messages: "not-an-array" })).status,
    ).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(
      (await analytics(["feedback"], { type: "positive", messageId: "m1" }))
        .status,
    ).toBe(200);
    expect(
      (
        await analytics(["conversations"], {
          type: "openai",
          messages: [{ role: "user", content: "hello" }],
        })
      ).status,
    ).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
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
      "x-inkeep-challenge-solution": TEST_CHALLENGE_SOLUTION,
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
