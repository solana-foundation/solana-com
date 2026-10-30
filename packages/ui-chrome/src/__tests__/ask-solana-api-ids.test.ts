import { afterEach, describe, expect, it, vi } from "vitest";
import { streamChat, type AskChatHandlers } from "../ask-solana/api";

type DonePayload = Parameters<AskChatHandlers["onDone"]>[0];

/**
 * `done` as the docs agent sends it (solana-com-agent, AskController):
 * run_id and conversation_id are JSON integers.
 */
const AGENT_DONE = {
  run_id: 4821,
  conversation_id: 1307,
  response:
    "### Summary response\nA program derived address (PDA) is an address derived from seeds and a program ID.",
  citations: [
    {
      title: "Program Derived Address",
      url: "https://solana.com/docs/core/pda",
    },
  ],
  generative_ui: null,
  code_followups: null,
};

function memoryStorage(): Storage {
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

function stubAgent(chat: () => Response) {
  vi.stubGlobal("window", {
    localStorage: memoryStorage(),
    sessionStorage: memoryStorage(),
  });
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: Parameters<typeof fetch>[0]) => {
      const url = String(input);
      if (url.endsWith("/session"))
        return Response.json({ session_token: "session-token" });
      if (url.endsWith("/chat")) return chat();
      return new Response(null, { status: 404 });
    }),
  );
}

async function done(): Promise<DonePayload | null> {
  let payload: DonePayload | null = null;
  await streamChat({
    message: "What is a PDA?",
    conversationId: null,
    signal: new AbortController().signal,
    handlers: {
      onDelta: () => {},
      onDone: (value) => {
        payload = value;
      },
      onError: () => {},
    },
  });
  return payload;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Ask Solana API: the agent's numeric ids", () => {
  it("keeps integer run and conversation ids from a streamed done", async () => {
    stubAgent(
      () =>
        new Response(`event: done\ndata: ${JSON.stringify(AGENT_DONE)}\n\n`, {
          headers: { "content-type": "text/event-stream" },
        }),
    );
    expect(await done()).toMatchObject({
      runId: "4821",
      conversationId: "1307",
    });
  });

  it("keeps them from a JSON answer", async () => {
    stubAgent(() => Response.json(AGENT_DONE));
    expect(await done()).toMatchObject({
      runId: "4821",
      conversationId: "1307",
    });
  });
});
