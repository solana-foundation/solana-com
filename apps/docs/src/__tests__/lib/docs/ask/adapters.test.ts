import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAskSession,
  streamChat,
} from "@solana-com/ui-chrome/ask-solana/api";
import { askErrorKindFor, toAskCitations } from "@/lib/docs/ask/adapters";

/** The message Bri's streamChat passes to onError for a chat reply or a failed fetch. */
async function onErrorMessage(chat: () => Promise<Response>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) =>
      String(input).endsWith("/session")
        ? Response.json({ session_token: "t" })
        : chat(),
    ),
  );
  let message: string | null = null;
  await streamChat({
    message: "What is a PDA?",
    // Not a first turn, so the answer cache stays out of it.
    conversationId: "7",
    signal: new AbortController().signal,
    handlers: {
      onDelta: () => {},
      onDone: () => {},
      onError: (text) => {
        message = text;
      },
    },
  });
  return message;
}

const reply = (status: number) => async () =>
  new Response("{}", { status, headers: { "content-type": "text/plain" } });

beforeEach(() => {
  clearAskSession();
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("askErrorKindFor", () => {
  it("maps the messages streamChat sends for the agent's statuses", async () => {
    const kinds: Record<number, string> = {};
    for (const status of [429, 502, 503, 504, 413, 409, 401, 422, 500]) {
      clearAskSession();
      kinds[status] = askErrorKindFor((await onErrorMessage(reply(status)))!);
    }
    expect(kinds).toEqual({
      429: "rateLimited",
      502: "unavailable",
      503: "unavailable",
      504: "unavailable",
      413: "tooLong",
      409: "conversationFull",
      401: "generic",
      422: "generic",
      500: "generic",
    });
  });

  it("maps the conversation's own errors: gone (404) and full (409)", async () => {
    expect(
      askErrorKindFor(
        (await onErrorMessage(async () =>
          Response.json({ message: "Conversation not found" }, { status: 404 }),
        ))!,
      ),
    ).toBe("conversationNotFound");
    clearAskSession();
    expect(
      askErrorKindFor(
        (await onErrorMessage(async () =>
          Response.json({ code: "conversation_full" }, { status: 409 }),
        ))!,
      ),
    ).toBe("conversationFull");
  });

  it("maps a refused session the same way", () => {
    expect(askErrorKindFor("session request failed (503)")).toBe("unavailable");
    expect(askErrorKindFor("session request failed (500)")).toBe("generic");
  });

  it("calls a request that never went out offline", async () => {
    const message = await onErrorMessage(async () => {
      throw new TypeError("Failed to fetch");
    });
    expect(askErrorKindFor(message!)).toBe("offline");
    expect(
      askErrorKindFor("NetworkError when attempting to fetch resource."),
    ).toBe("offline");
    expect(askErrorKindFor("Load failed")).toBe("offline");
  });

  it("calls anything offline while the browser is", () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    expect(askErrorKindFor("network error")).toBe("offline");
    vi.restoreAllMocks();
    expect(askErrorKindFor("network error")).toBe("generic");
    expect(askErrorKindFor("stream error")).toBe("generic");
  });
});

describe("toAskCitations", () => {
  it("normalizes docs links for the reader's locale and drops repeats", () => {
    expect(
      toAskCitations(
        [
          { title: "PDA", url: "/docs/core/pda" },
          {
            title: "Again",
            url: "https://solana.com/developers/docs/core/pda",
          },
          { title: "No URL" },
          { title: "  ", url: "https://github.com/anza-xyz/agave" },
          "nope",
        ],
        "ja",
      ),
    ).toEqual([
      { title: "PDA", url: "/ja/developers/docs/core/pda" },
      { title: "", url: "https://github.com/anza-xyz/agave" },
    ]);
  });

  it("returns nothing for anything but a list", () => {
    expect(toAskCitations(null)).toEqual([]);
    expect(toAskCitations({ url: "/docs" })).toEqual([]);
  });
});
