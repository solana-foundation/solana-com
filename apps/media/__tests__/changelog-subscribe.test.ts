import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/changelog/subscribe/route";
import { CHANGELOG_SUBSCRIBE_URL } from "@/lib/changelog";

function subscribeRequest(body: unknown) {
  return new Request("https://solana.com/api/changelog/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("changelog subscribe route", () => {
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
});
