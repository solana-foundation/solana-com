import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/changelog/subscribe/route";
import {
  CHANGELOG_SUBSCRIBE_LIMITS,
  resetChangelogSubscribeRateLimitForTests,
} from "@/lib/changelog-subscribe-rate-limit";
import { CHANGELOG_SUBSCRIBE_URL } from "@/lib/changelog";

function subscribeRequest(body: unknown, ip = "203.0.113.10") {
  return new Request("https://solana.com/api/changelog/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-real-ip": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("changelog subscribe route", () => {
  beforeEach(() => {
    resetChangelogSubscribeRateLimitForTests();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("forwards a valid email to Iterable from the server", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(subscribeRequest({ email: "dev@solana.com" }));

    expect(response.status).toBe(204);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(CHANGELOG_SUBSCRIBE_URL);
    expect(init.method).toBe("POST");
    expect(init.body).toBeInstanceOf(FormData);
    expect((init.body as FormData).get("email")).toBe("dev@solana.com");
  });

  it("rejects an invalid email without contacting Iterable", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(subscribeRequest({ email: "not-an-email" }));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns a gateway error when Iterable rejects the request", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    );

    const response = await POST(subscribeRequest({ email: "dev@solana.com" }));

    expect(response.status).toBe(502);
  });

  it("rate limits repeated requests from the same client", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal("fetch", fetchMock);

    for (let index = 0; index < CHANGELOG_SUBSCRIBE_LIMITS.ip.max; index += 1) {
      const response = await POST(
        subscribeRequest({ email: `dev-${index}@solana.com` }),
      );
      expect(response.status).toBe(204);
    }

    const response = await POST(
      subscribeRequest({ email: "blocked@solana.com" }),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
    expect(fetchMock).toHaveBeenCalledTimes(CHANGELOG_SUBSCRIBE_LIMITS.ip.max);
  });

  it("rate limits repeated attempts for one email across client addresses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal("fetch", fetchMock);

    for (
      let index = 0;
      index < CHANGELOG_SUBSCRIBE_LIMITS.email.max;
      index += 1
    ) {
      const response = await POST(
        subscribeRequest({ email: "same@solana.com" }, `203.0.113.${index}`),
      );
      expect(response.status).toBe(204);
    }

    const response = await POST(
      subscribeRequest({ email: "same@solana.com" }, "198.51.100.20"),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("3600");
    expect(fetchMock).toHaveBeenCalledTimes(
      CHANGELOG_SUBSCRIBE_LIMITS.email.max,
    );
  });

  it("caps concurrent upstream requests from one client", async () => {
    let resolveUpstream: (() => void) | undefined;
    const upstreamResponse = new Promise<Response>((resolve) => {
      resolveUpstream = () => resolve(new Response(null));
    });
    const fetchMock = vi.fn().mockReturnValue(upstreamResponse);
    vi.stubGlobal("fetch", fetchMock);

    const activeRequests = Array.from(
      { length: CHANGELOG_SUBSCRIBE_LIMITS.concurrentPerIp },
      (_, index) =>
        POST(subscribeRequest({ email: `active-${index}@solana.com` })),
    );

    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(
        CHANGELOG_SUBSCRIBE_LIMITS.concurrentPerIp,
      );
    });

    const rejected = await POST(
      subscribeRequest({ email: "one-too-many@solana.com" }),
    );
    expect(rejected.status).toBe(429);
    expect(fetchMock).toHaveBeenCalledTimes(
      CHANGELOG_SUBSCRIBE_LIMITS.concurrentPerIp,
    );

    resolveUpstream?.();
    await Promise.all(activeRequests);
  });
});
