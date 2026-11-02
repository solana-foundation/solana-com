import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  // The action reads the key once at module load, so set it before import.
  process.env.INKEEP_API_KEY = "server-key";
  return {
    headers: new Headers(),
    streamText: vi.fn(),
    checkRateLimit: vi.fn(),
    fetch: vi.fn(),
  };
});
vi.mock("next/headers", () => ({ headers: async () => mocks.headers }));
vi.mock("ai", () => ({ streamText: mocks.streamText }));
vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: () => (model: string) => ({ model }),
}));
vi.mock("@vercel/firewall", () => ({ checkRateLimit: mocks.checkRateLimit }));

import { onRateAction } from "../src/app/components/inkeep/inkeep-feedback";

async function drain(stream: Awaited<ReturnType<typeof onRateAction>>) {
  const reader = stream.getReader();
  let out = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return out;
    out += value;
  }
}

describe("docs feedback server action", () => {
  beforeEach(() => {
    mocks.headers = new Headers({
      host: "solana.com",
      "x-forwarded-proto": "https",
      origin: "https://solana.com",
      "sec-fetch-site": "same-origin",
    });
    mocks.checkRateLimit.mockResolvedValue({ rateLimited: false });
    mocks.streamText.mockReturnValue({
      textStream: (async function* () {
        yield "Thank you for providing feedback.";
      })(),
    });
    vi.stubGlobal(
      "fetch",
      mocks.fetch.mockResolvedValue(
        Response.json({ id: "c1", messages: [{ id: "m0" }, { id: "m1" }] }),
      ),
    );
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  const valid = { opinion: "negative" as const, message: "Example is broken" };

  it("calls the model once with a capped reply for a valid same-origin request", async () => {
    const text = await drain(await onRateAction("/docs/core/accounts", valid));
    expect(text).toContain("Thank you");
    expect(mocks.streamText).toHaveBeenCalledTimes(1);
    expect(mocks.streamText.mock.calls[0]?.[0]).toMatchObject({
      maxTokens: 400,
    });
  });

  it("accepts locale-prefixed docs paths from localized pages", async () => {
    await drain(await onRateAction("/de/docs/core/accounts", valid));
    await drain(await onRateAction("/ja/developers/guides", valid));
    expect(mocks.streamText).toHaveBeenCalledTimes(2);
  });

  it("never calls the model for invalid input", async () => {
    await onRateAction("/docs", { opinion: "meh" as never, message: "x" });
    await onRateAction("/docs", { ...valid, message: "x".repeat(5000) });
    await onRateAction("https://evil.example/docs", valid);
    await onRateAction("/not-docs", valid);
    await onRateAction("/xx/docs", valid);
    await onRateAction("/docs/..\\evil", valid);
    expect(mocks.streamText).not.toHaveBeenCalled();
  });

  it("never calls the model for cross-origin or rate-limited callers", async () => {
    mocks.headers.set("origin", "https://evil.example");
    await onRateAction("/docs", valid);
    mocks.headers.set("origin", "https://solana.com");
    mocks.headers.set("sec-fetch-site", "cross-site");
    await onRateAction("/docs", valid);
    mocks.headers.set("sec-fetch-site", "same-origin");
    mocks.checkRateLimit.mockResolvedValueOnce({ rateLimited: true });
    await onRateAction("/docs", valid);
    expect(mocks.streamText).not.toHaveBeenCalled();
    expect(mocks.checkRateLimit).toHaveBeenCalledWith(
      "inkeep-chat",
      expect.objectContaining({ headers: mocks.headers }),
    );
  });
});
