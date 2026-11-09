import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { proxyAskRequest } from "@/lib/ask-agent-proxy";

/** The headers the proxy sent upstream on its (only) fetch call. */
function upstreamHeaders(fetchMock: ReturnType<typeof vi.fn>): Headers {
  const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
  return new Headers(init.headers);
}

function askRequest(headers: Record<string, string>): Request {
  return new Request("https://solana.com/api/ask/session", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: "{}",
  });
}

describe("ask agent proxy: visitor IP", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubEnv("ASK_SOLANA_PROXY_SECRET", "test-secret");
    vi.stubEnv("ASK_AGENT_URL", "https://agent.example");
    fetchMock = vi.fn(async () => Response.json({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sends the visitor IP that Vercel sets (x-real-ip) as x-ask-client-ip", async () => {
    await proxyAskRequest(
      askRequest({
        "x-real-ip": "203.0.113.7",
        "x-forwarded-for": "192.0.2.9, 10.0.0.1",
        "x-vercel-forwarded-for": "198.51.100.1",
      }),
      ["session"],
    );
    expect(upstreamHeaders(fetchMock).get("x-ask-client-ip")).toBe(
      "203.0.113.7",
    );
  });

  it("falls back to the first x-forwarded-for entry", async () => {
    await proxyAskRequest(
      askRequest({ "x-forwarded-for": "192.0.2.9, 10.0.0.1" }),
      ["session"],
    );
    expect(upstreamHeaders(fetchMock).get("x-ask-client-ip")).toBe("192.0.2.9");
  });

  it("ignores proxy headers Vercel does not rewrite (shared client-ip rule)", async () => {
    await proxyAskRequest(
      askRequest({
        "cf-connecting-ip": "1.1.1.1",
        "true-client-ip": "2.2.2.2",
        forwarded: "for=3.3.3.3",
        "x-real-ip": "203.0.113.7",
      }),
      ["session"],
    );
    expect(upstreamHeaders(fetchMock).get("x-ask-client-ip")).toBe(
      "203.0.113.7",
    );

    fetchMock.mockClear();
    await proxyAskRequest(
      askRequest({ "cf-connecting-ip": "1.1.1.1", forwarded: "for=3.3.3.3" }),
      ["session"],
    );
    expect(upstreamHeaders(fetchMock).has("x-ask-client-ip")).toBe(false);
  });

  it("never forwards a client-supplied x-ask-client-ip", async () => {
    await proxyAskRequest(
      askRequest({
        "x-ask-client-ip": "6.6.6.6",
        "x-real-ip": "203.0.113.7",
      }),
      ["session"],
    );
    expect(upstreamHeaders(fetchMock).get("x-ask-client-ip")).toBe(
      "203.0.113.7",
    );

    fetchMock.mockClear();
    await proxyAskRequest(askRequest({ "x-ask-client-ip": "6.6.6.6" }), [
      "session",
    ]);
    expect(upstreamHeaders(fetchMock).has("x-ask-client-ip")).toBe(false);
  });

  it("still sends the proxy secret", async () => {
    await proxyAskRequest(askRequest({ "x-real-ip": "198.51.100.1" }), [
      "session",
    ]);
    expect(upstreamHeaders(fetchMock).get("x-ask-proxy-secret")).toBe(
      "test-secret",
    );
  });
});
