import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getStoredConversationId,
  storeConversationId,
} from "../ask-solana/conversation-store";
import {
  clearAskSession,
  streamChat,
  type AskChatHandlers,
} from "../ask-solana/api";

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

type ChatBody = { conversation_id?: unknown; message: string };

function sse(events: string[]): Response {
  return new Response(`${events.join("\n\n")}\n\n`, {
    headers: { "content-type": "text/event-stream" },
  });
}

function stubFetch(chatResponses: Array<() => Response>) {
  const chatBodies: ChatBody[] = [];
  let sessions = 0;
  const fetchMock = vi.fn(async (...args: Parameters<typeof fetch>) => {
    const [input, init] = args;
    const url = typeof input === "string" ? input : String(input);
    if (url.endsWith("/session")) {
      sessions += 1;
      return Response.json({ session_token: `token-${sessions}` });
    }
    if (url.endsWith("/chat")) {
      chatBodies.push(JSON.parse(String(init?.body)) as ChatBody);
      const next = chatResponses.shift();
      if (!next) throw new Error("unexpected /chat request");
      return next();
    }
    return new Response(null, { status: 404 });
  });
  vi.stubGlobal("fetch", fetchMock);
  return { chatBodies, sessionCount: () => sessions };
}

/** Mirrors how the widget drives the client: id in via the store, out via onDone. */
function sendLikeWidget(message: string, overrides: Partial<AskChatHandlers>) {
  const onError = vi.fn();
  return {
    onError,
    promise: streamChat({
      message,
      conversationId: getStoredConversationId(),
      signal: new AbortController().signal,
      handlers: {
        onDelta: () => {},
        onDone: ({ conversationId }) => {
          if (conversationId) storeConversationId(conversationId);
        },
        onError,
        onConversationReset: () => storeConversationId(null),
        ...overrides,
      },
    }),
  };
}

const doneEvent = (conversationId: unknown) =>
  `event: done\ndata: ${JSON.stringify({
    run_id: "run_1",
    conversation_id: conversationId,
    citations: [],
    generative_ui: null,
  })}`;

beforeEach(() => {
  vi.stubGlobal("window", {
    localStorage: createMemoryStorage(),
    sessionStorage: createMemoryStorage(),
  });
  storeConversationId(null);
  clearAskSession();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Ask Solana conversation continuity", () => {
  it("sends the integer id from the done event on the next request", async () => {
    const { chatBodies } = stubFetch([
      () => sse(['event: delta\ndata: {"text":"Hi Sam."}', doneEvent(123)]),
      () => sse([doneEvent(123)]),
    ]);

    await sendLikeWidget("My name is Sam", {}).promise;
    expect(getStoredConversationId()).toBe("123");
    await sendLikeWidget("What's my name?", {}).promise;

    expect(chatBodies[0]).not.toHaveProperty("conversation_id");
    expect(chatBodies[1]?.conversation_id).toBe(123);
  });

  it("reads the id from a non-streaming 202 body", async () => {
    const { chatBodies } = stubFetch([
      () =>
        Response.json({ conversation_id: 7, response: "ok" }, { status: 202 }),
      () => sse([doneEvent(7)]),
    ]);

    await sendLikeWidget("First message", {}).promise;
    await sendLikeWidget("Second message", {}).promise;

    expect(chatBodies[1]?.conversation_id).toBe(7);
  });

  it("fetches one session token for the whole browser session", async () => {
    const { sessionCount } = stubFetch([
      () => sse([doneEvent(1)]),
      () => sse([doneEvent(1)]),
      () => sse([doneEvent(1)]),
    ]);

    await sendLikeWidget("one", {}).promise;
    await sendLikeWidget("two", {}).promise;
    await sendLikeWidget("three", {}).promise;

    expect(sessionCount()).toBe(1);
  });

  it("clears a stale id on 404 and does not retry", async () => {
    storeConversationId("999");
    const { chatBodies } = stubFetch([
      () =>
        Response.json({ message: "Conversation not found" }, { status: 404 }),
      () => sse([doneEvent(1000)]),
    ]);

    const first = sendLikeWidget("stale", {});
    await first.promise;

    expect(first.onError).toHaveBeenCalledWith("conversation_not_found");
    expect(getStoredConversationId()).toBeNull();
    expect(chatBodies).toHaveLength(1);

    await sendLikeWidget("fresh", {}).promise;
    expect(chatBodies[1]).not.toHaveProperty("conversation_id");
    expect(getStoredConversationId()).toBe("1000");
  });

  it("surfaces conversation_full on 409 so the caller can clear the id", async () => {
    storeConversationId("55");
    stubFetch([
      () =>
        Response.json(
          { code: "conversation_full", message: "full" },
          { status: 409 },
        ),
    ]);

    const run = sendLikeWidget("one more", {
      onError: (code) => {
        if (code === "conversation_full") storeConversationId(null);
      },
    });
    await run.promise;

    expect(getStoredConversationId()).toBeNull();
  });

  it("reports conversation_full to the handler", async () => {
    storeConversationId("55");
    stubFetch([
      () => Response.json({ code: "conversation_full" }, { status: 409 }),
    ]);
    const onError = vi.fn();

    await sendLikeWidget("one more", { onError }).promise;

    expect(onError).toHaveBeenCalledWith("conversation_full");
  });

  it("drops the id and resends once when the session token is rejected", async () => {
    storeConversationId("12");
    const { chatBodies, sessionCount } = stubFetch([
      () => new Response(null, { status: 401 }),
      () => sse([doneEvent(13)]),
    ]);
    const onConversationReset = vi.fn(() => storeConversationId(null));

    await sendLikeWidget("after expiry", { onConversationReset }).promise;

    expect(sessionCount()).toBe(2);
    expect(chatBodies[0]?.conversation_id).toBe(12);
    expect(chatBodies[1]).not.toHaveProperty("conversation_id");
    expect(onConversationReset).toHaveBeenCalledTimes(1);
    expect(getStoredConversationId()).toBe("13");
  });
});
