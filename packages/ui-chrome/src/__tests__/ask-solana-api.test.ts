import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getAskConversation,
  getAskRun,
  prewarmAskSession,
  sendFeedback,
  searchDocs,
  splitCodeFollowupPrompt,
  streamChat,
  type AskChatHandlers,
  type AskGenerativeUi,
} from "../ask-solana/api";
import { createTokenGenerativeUiFixture } from "../ask-solana/create-token-generative-ui.fixture";

type DonePayload = Parameters<AskChatHandlers["onDone"]>[0];

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear: () => {
      values.clear();
    },
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

function stubLocalStorage() {
  const localStorage = createMemoryStorage();
  const sessionStorage = createMemoryStorage();

  vi.stubGlobal("window", {
    localStorage,
    sessionStorage,
  });

  return { localStorage, sessionStorage };
}

function urlFromFetchInput(input: Parameters<typeof fetch>[0]): string {
  return typeof input === "string" || input instanceof URL
    ? String(input)
    : input.url;
}

function stubChatFetch(chatResponse: Response) {
  const fetchMock = vi.fn(async (...args: Parameters<typeof fetch>) => {
    const [input] = args;
    const url = urlFromFetchInput(input);

    if (url.endsWith("/session")) {
      return Response.json({ session_token: "session-token" });
    }

    if (url.endsWith("/chat")) {
      return chatResponse;
    }

    return new Response(null, { status: 404 });
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function sseResponse(events: string[]): Response {
  return new Response(`${events.join("\n\n")}\n\n`, {
    headers: { "content-type": "text/event-stream" },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Ask Solana chat API", () => {
  it("reuses an in-flight prewarmed session for the first chat request", async () => {
    stubLocalStorage();
    let resolveSession: (response: Response) => void = () => {};
    let sessionRequests = 0;
    const fetchMock = vi.fn(async (...args: Parameters<typeof fetch>) => {
      const [input] = args;
      const url = urlFromFetchInput(input);

      if (url.endsWith("/session")) {
        sessionRequests += 1;
        return new Promise<Response>((resolve) => {
          resolveSession = resolve;
        });
      }

      if (url.endsWith("/chat")) {
        return sseResponse([
          'event: delta\ndata: {"text":"Prewarmed answer."}',
          'event: done\ndata: {"citations":[],"generative_ui":null}',
        ]);
      }

      return new Response(null, { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    prewarmAskSession();
    const done = streamChat({
      message: "What is Solana?",
      conversationId: null,
      signal: new AbortController().signal,
      handlers: {
        onDelta: () => {},
        onDone: () => {},
        onError: () => {},
      },
    });

    resolveSession(Response.json({ session_token: "prewarmed-session" }));
    await done;

    expect(sessionRequests).toBe(1);
    const chatRequest = fetchMock.mock.calls.find(([input]) =>
      urlFromFetchInput(input).endsWith("/chat"),
    );
    expect(JSON.parse(String(chatRequest?.[1]?.body))).toMatchObject({
      session_token: "prewarmed-session",
    });
  });

  it("requests streaming capabilities and reports response timings", async () => {
    stubLocalStorage();
    const timings: string[] = [];
    const fetchMock = stubChatFetch(
      sseResponse([
        'event: status\ndata: {"stage":"searching_docs"}',
        'event: delta\ndata: {"text":"Streaming answer."}',
        'event: done\ndata: {"citations":[],"generative_ui":null}',
      ]),
    );

    await streamChat({
      message: "How fast is Solana?",
      conversationId: null,
      signal: new AbortController().signal,
      handlers: {
        onDelta: () => {},
        onDone: () => {},
        onError: () => {},
        onTiming: (timing) => timings.push(timing.phase),
      },
    });

    const chatRequest = fetchMock.mock.calls.find(([input]) =>
      urlFromFetchInput(input).endsWith("/chat"),
    );
    const headers = chatRequest?.[1]?.headers as Record<string, string>;

    expect(headers.accept).toContain("text/event-stream");
    expect(headers["x-ask-client-capabilities"]).toContain("early-status");
    expect(headers["x-ask-client-capabilities"]).toContain("code-followups");
    expect(timings).toEqual(
      expect.arrayContaining([
        "session_start",
        "session_ready",
        "chat_request_start",
        "chat_response_start",
        "first_status",
        "first_delta",
        "done",
      ]),
    );
  });

  it("serves repeated first-turn questions from the short-lived answer cache", async () => {
    stubLocalStorage();
    const fetchMock = stubChatFetch(
      sseResponse([
        'event: delta\ndata: {"text":"Cached answer."}',
        `event: done\ndata: ${JSON.stringify({
          run_id: "run_cache_source",
          conversation_id: "conversation_cache_source",
          citations: [{ title: "Docs", url: "/docs" }],
          generative_ui: null,
          code_followups: {
            prompt: "Do you want to see a code example?",
            buttons: [
              {
                type: "show_code",
                label: "Rust",
                language: "rust",
                message: "Show me the code for that in Rust.",
              },
            ],
          },
        })}`,
      ]),
    );
    const cachedDeltas: string[] = [];
    let cachedDonePayload: DonePayload | null = null;

    await streamChat({
      message: "What is a PDA?",
      conversationId: null,
      signal: new AbortController().signal,
      handlers: {
        onDelta: () => {},
        onDone: () => {},
        onError: () => {},
      },
    });

    await streamChat({
      message: "  what   is a pda?  ",
      conversationId: null,
      signal: new AbortController().signal,
      handlers: {
        onDelta: (text) => cachedDeltas.push(text),
        onDone: (payload) => {
          cachedDonePayload = payload;
        },
        onError: () => {},
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(cachedDeltas.join("")).toBe("Cached answer.");
    expect(cachedDonePayload).toMatchObject({
      runId: null,
      citations: [{ title: "Docs", url: "/docs" }],
      codeFollowups: {
        prompt: "Do you want to see a code example?",
        buttons: [
          {
            type: "show_code",
            label: "Rust",
            language: "rust",
            message: "Show me the code for that in Rust.",
          },
        ],
      },
    });
  });

  it("preserves generative_ui from an SSE done event", async () => {
    stubLocalStorage();
    stubChatFetch(
      sseResponse([
        'event: delta\ndata: {"text":"Use the SPL Token CLI."}',
        `event: done\ndata: ${JSON.stringify({
          run_id: "run_1",
          conversation_id: "conversation_1",
          citations: [
            { title: "Token quickstart", url: "/docs/tokens/quickstart" },
          ],
          generative_ui: createTokenGenerativeUiFixture,
        })}`,
      ]),
    );

    const deltas: string[] = [];
    let resolveDone: (payload: DonePayload) => void = () => {};
    const done = new Promise<DonePayload>((resolve) => {
      resolveDone = resolve;
    });
    const onError = vi.fn();

    await streamChat({
      message: "How to create a token on Solana?",
      conversationId: null,
      signal: new AbortController().signal,
      handlers: {
        onDelta: (text) => deltas.push(text),
        onDone: resolveDone,
        onError,
      },
    });

    const donePayload = await done;

    expect(onError).not.toHaveBeenCalled();
    expect(deltas.join("")).toBe("Use the SPL Token CLI.");
    expect(donePayload).toMatchObject({
      runId: "run_1",
      conversationId: "conversation_1",
      citations: [
        { title: "Token quickstart", url: "/docs/tokens/quickstart" },
      ],
      generativeUi: createTokenGenerativeUiFixture,
    });
  });

  it("maps invalid generative_ui payloads to null", async () => {
    stubLocalStorage();
    stubChatFetch(
      sseResponse([
        `event: done\ndata: ${JSON.stringify({
          run_id: "run_2",
          conversation_id: "conversation_2",
          citations: [],
          generative_ui: {
            version: "unknown",
            kind: "answer",
            components: [],
          },
        })}`,
      ]),
    );

    let resolveDone: (payload: DonePayload) => void = () => {};
    const done = new Promise<DonePayload>((resolve) => {
      resolveDone = resolve;
    });

    await streamChat({
      message: "What is rent?",
      conversationId: null,
      signal: new AbortController().signal,
      handlers: {
        onDelta: () => {},
        onDone: resolveDone,
        onError: () => {},
      },
    });

    const donePayload = await done;
    expect(donePayload.generativeUi).toBeNull();
  });

  it("surfaces an early ui_done event before the terminal done event", async () => {
    stubLocalStorage();
    const minimalGenerativeUi = {
      version: "solana-docs-ui/v1",
      kind: "answer",
      components: [
        { type: "answer_intro" },
        { type: "concept_model" },
        { type: "step_flow" },
      ],
    } satisfies AskGenerativeUi;

    stubChatFetch(
      sseResponse([
        `event: ui_done\ndata: ${JSON.stringify({
          generative_ui: minimalGenerativeUi,
        })}`,
        `event: done\ndata: ${JSON.stringify({
          run_id: "run_early_ui",
          conversation_id: "conversation_early_ui",
          response: "Token flow complete.",
          citations: [],
          generative_ui: null,
        })}`,
      ]),
    );

    const visualPayloads: unknown[] = [];

    await streamChat({
      message: "How to create a token on Solana?",
      conversationId: null,
      signal: new AbortController().signal,
      handlers: {
        onDelta: () => {},
        onGenerativeUi: (ui) => visualPayloads.push(ui),
        onDone: () => {},
        onError: () => {},
      },
    });

    expect(visualPayloads).toEqual([minimalGenerativeUi]);
  });

  it("uses the done response as answer text when no deltas streamed", async () => {
    stubLocalStorage();
    stubChatFetch(
      sseResponse([
        `event: done\ndata: ${JSON.stringify({
          run_id: "run_3",
          conversation_id: "conversation_3",
          response: "This is the complete answer.",
          citations: [],
          generative_ui: null,
        })}`,
      ]),
    );

    const deltas: string[] = [];

    await streamChat({
      message: "Explain rent",
      conversationId: null,
      signal: new AbortController().signal,
      handlers: {
        onDelta: (text) => deltas.push(text),
        onDone: () => {},
        onError: () => {},
      },
    });

    expect(deltas.join("")).toBe("This is the complete answer.");
  });

  it("keeps the done response authoritative when provisional deltas streamed", async () => {
    stubLocalStorage();
    stubChatFetch(
      sseResponse([
        'event: delta\ndata: {"text":"Draft answer."}',
        `event: done\ndata: ${JSON.stringify({
          run_id: "run_final",
          conversation_id: "conversation_final",
          response: "Final authoritative answer.",
          citations: [],
          generative_ui: null,
        })}`,
      ]),
    );

    const deltas: string[] = [];
    let donePayload: DonePayload | null = null;

    await streamChat({
      message: "Explain CPI",
      conversationId: null,
      signal: new AbortController().signal,
      handlers: {
        onDelta: (text) => deltas.push(text),
        onDone: (payload) => {
          donePayload = payload;
        },
        onError: () => {},
      },
    });

    expect(deltas.join("")).toBe("Draft answer.");
    expect(donePayload).toMatchObject({
      response: "Final authoritative answer.",
      runId: "run_final",
      conversationId: "conversation_final",
    });
  });

  it("normalizes code follow-up buttons from an SSE done event", async () => {
    stubLocalStorage();
    stubChatFetch(
      sseResponse([
        `event: done\ndata: ${JSON.stringify({
          response:
            "### Summary response\nA CPI is a program call.\n\nDo you want code?",
          citations: [],
          generative_ui: null,
          code_followups: {
            prompt: "Do you want code?",
            buttons: [
              {
                type: "show_code",
                label: "Rust",
                language: "rust",
                message: "Show me the code for that in Rust.",
              },
              {
                type: "show_code",
                label: "TypeScript",
                language: "typescript",
                message: "Show me the code for that in TypeScript.",
              },
            ],
          },
        })}`,
      ]),
    );

    let donePayload: DonePayload | null = null;

    await streamChat({
      message: "What is a CPI?",
      conversationId: null,
      signal: new AbortController().signal,
      handlers: {
        onDelta: () => {},
        onDone: (payload) => {
          donePayload = payload;
        },
        onError: () => {},
      },
    });

    expect(donePayload).toMatchObject({
      codeFollowups: {
        prompt: "Do you want code?",
        buttons: [
          {
            type: "show_code",
            label: "Rust",
            language: "rust",
            message: "Show me the code for that in Rust.",
          },
          {
            type: "show_code",
            label: "TypeScript",
            language: "typescript",
            message: "Show me the code for that in TypeScript.",
          },
        ],
      },
    });
  });

  it("surfaces visual build status events separately from answer text", async () => {
    stubLocalStorage();
    stubChatFetch(
      sseResponse([
        'event: ui_status\ndata: {"stage":"building_visual"}',
        'event: delta\ndata: {"text":"Text answer."}',
        'event: done\ndata: {"citations":[],"generative_ui":null}',
      ]),
    );

    const visualStatuses: string[] = [];

    await streamChat({
      message: "Explain accounts",
      conversationId: null,
      signal: new AbortController().signal,
      handlers: {
        onDelta: () => {},
        onUiStatus: (stage) => visualStatuses.push(stage),
        onDone: () => {},
        onError: () => {},
      },
    });

    expect(visualStatuses).toEqual(["building_visual"]);
  });

  it("includes the anonymous session token when sending feedback", async () => {
    stubLocalStorage();
    const fetchMock = vi.fn(async (...args: Parameters<typeof fetch>) => {
      const [input] = args;
      const url = urlFromFetchInput(input);

      if (url.endsWith("/session")) {
        return Response.json({ session_token: "session-token" });
      }

      if (url.endsWith("/feedback")) {
        return new Response(null, { status: 204 });
      }

      return new Response(null, { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    await sendFeedback({ runId: "run_4", rating: "up" });

    const feedbackRequest = fetchMock.mock.calls.find(([input]) =>
      urlFromFetchInput(input).endsWith("/feedback"),
    );
    const feedbackInit = feedbackRequest?.[1];
    expect(feedbackRequest).toBeDefined();
    expect(JSON.parse(String(feedbackInit?.body))).toMatchObject({
      session_token: "session-token",
      run_id: "run_4",
      rating: "up",
    });
  });
});

describe("Ask Solana answer helpers", () => {
  it("splits a duplicate code follow-up prompt from the final markdown body", () => {
    const response =
      "### Summary response\nA CPI is a cross-program invocation.\n\nDo you want code?";

    expect(
      splitCodeFollowupPrompt(response, {
        prompt: "Do you want code?",
        buttons: [
          {
            type: "show_code",
            label: "Rust",
            language: "rust",
            message: "Show me the code for that in Rust.",
          },
        ],
      }),
    ).toEqual({
      body: "### Summary response\nA CPI is a cross-program invocation.",
      prompt: "Do you want code?",
    });
  });

  it("keeps the body intact when the follow-up prompt is not the final text", () => {
    const response =
      "### Summary response\nDo you want code? This sentence is explanatory.";

    expect(
      splitCodeFollowupPrompt(response, {
        prompt: "Do you want code?",
        buttons: [
          {
            type: "show_code",
            label: "Rust",
            language: "rust",
            message: "Show me the code for that in Rust.",
          },
        ],
      }),
    ).toEqual({
      body: response,
      prompt: "Do you want code?",
    });
  });
});

describe("Ask Solana polling and history API", () => {
  it("normalizes completed run payloads with code follow-ups", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          run_id: "run_poll",
          conversation_id: "conversation_poll",
          response:
            "### Summary response\nA CPI lets one program call another.",
          citations: [{ title: "CPI", url: "/docs/core/cpi" }],
          generative_ui: null,
          code_followups: {
            prompt: "Do you want code?",
            buttons: [
              {
                type: "show_code",
                label: "Rust",
                language: "rust",
                message: "Show me the code for that in Rust.",
              },
            ],
          },
        }),
      ),
    );

    const run = await getAskRun("run_poll", new AbortController().signal);

    expect(run).toMatchObject({
      response: "### Summary response\nA CPI lets one program call another.",
      runId: "run_poll",
      conversationId: "conversation_poll",
      citations: [{ title: "CPI", url: "/docs/core/cpi" }],
      generativeUi: null,
      codeFollowups: {
        prompt: "Do you want code?",
        buttons: [
          {
            type: "show_code",
            label: "Rust",
            language: "rust",
            message: "Show me the code for that in Rust.",
          },
        ],
      },
    });
  });

  it("normalizes conversation history assistant messages with code follow-ups", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          conversation_id: "conversation_history",
          messages: [
            { role: "user", content: "What is a CPI?" },
            {
              role: "assistant",
              content:
                "### Summary response\nA CPI lets one program call another.",
              citations: [{ title: "CPI", url: "/docs/core/cpi" }],
              generative_ui: null,
              code_followups: {
                prompt: "Do you want code?",
                buttons: [
                  {
                    type: "show_code",
                    label: "Rust",
                    language: "rust",
                    message: "Show me the code for that in Rust.",
                  },
                ],
              },
            },
          ],
        }),
      ),
    );

    const conversation = await getAskConversation(
      "conversation_history",
      new AbortController().signal,
    );

    expect(conversation).toEqual({
      conversationId: "conversation_history",
      messages: [
        { role: "user", content: "What is a CPI?" },
        {
          role: "assistant",
          content: "### Summary response\nA CPI lets one program call another.",
          citations: [{ title: "CPI", url: "/docs/core/cpi" }],
          generativeUi: null,
          codeFollowups: {
            prompt: "Do you want code?",
            buttons: [
              {
                type: "show_code",
                label: "Rust",
                language: "rust",
                message: "Show me the code for that in Rust.",
              },
            ],
          },
        },
      ],
    });
  });
});

describe("Ask Solana search API", () => {
  it("normalizes string breadcrumbs from search results", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          results: [
            {
              title: "Create tokens",
              url: "/docs/tokens",
              snippet: "Create a mint and token account.",
              breadcrumbs: "Docs › Tokens",
            },
          ],
        }),
      ),
    );

    const results = await searchDocs("token", new AbortController().signal);

    expect(results).toEqual([
      {
        title: "Create tokens",
        url: "/docs/tokens",
        snippet: "Create a mint and token account.",
        breadcrumbs: ["Docs › Tokens"],
      },
    ]);
  });

  it("normalizes object breadcrumb items from search results", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json([
          {
            title: "Token accounts",
            url: "/docs/tokens/accounts",
            breadcrumbs: [{ title: "Docs" }, { label: "Tokens" }],
          },
        ]),
      ),
    );

    const results = await searchDocs("token", new AbortController().signal);

    expect(results).toEqual([
      {
        title: "Token accounts",
        url: "/docs/tokens/accounts",
        breadcrumbs: ["Docs", "Tokens"],
      },
    ]);
  });
});
