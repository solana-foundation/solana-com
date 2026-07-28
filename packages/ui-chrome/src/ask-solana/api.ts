import { askApiBase } from "./flags";

/**
 * Client for the solana-docs-agent public API (proxied same-origin at
 * /api/ask by apps/web). Contract per AI_BOT_PLAN.md §3:
 *
 *   POST /session               -> { session_token }
 *   POST /chat                  -> SSE (status / delta / done / error) or a
 *                                  plain JSON answer (non-streaming fallback)
 *   POST /feedback              -> 2xx
 *   GET  /search?q=             -> { results: [...] }
 */

export type AskCitation = { title: string; url: string };

export type AskSearchResult = {
  title: string;
  url: string;
  snippet?: string;
  breadcrumbs?: string[];
};

export type AskChatHandlers = {
  onStatus?: (stage: string) => void;
  onDelta: (text: string) => void;
  onDone: (payload: {
    runId: string | null;
    conversationId: string | null;
    citations: AskCitation[];
  }) => void;
  onError: (message: string) => void;
};

const SESSION_STORAGE_KEY = "ask-solana:session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type StoredSession = { token: string; createdAt: number };

function readStoredSession(): string | null {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed.token || Date.now() - parsed.createdAt > SESSION_TTL_MS) {
      return null;
    }
    return parsed.token;
  } catch {
    return null;
  }
}

function storeSession(token: string) {
  try {
    window.localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ token, createdAt: Date.now() } satisfies StoredSession),
    );
  } catch {
    // Private mode / blocked storage: fall back to per-page sessions.
  }
}

export function clearAskSession() {
  try {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

async function createSession(): Promise<string> {
  const res = await fetch(`${askApiBase()}/session`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  if (!res.ok) {
    throw new Error(`session request failed (${res.status})`);
  }
  const data = (await res.json()) as { session_token?: string };
  if (!data.session_token) {
    throw new Error("session response missing session_token");
  }
  storeSession(data.session_token);
  return data.session_token;
}

export async function getSessionToken(): Promise<string> {
  return readStoredSession() ?? createSession();
}

type DonePayload = {
  run_id?: string;
  conversation_id?: string;
  citations?: AskCitation[];
};

function parseSseBlock(block: string): { event: string; data: string } | null {
  let event = "message";
  const dataLines: string[] = [];
  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trimStart());
    }
  }
  if (dataLines.length === 0) return null;
  return { event, data: dataLines.join("\n") };
}

async function consumeSse(res: Response, handlers: AskChatHandlers) {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let sawDone = false;

  const dispatch = (event: string, data: string) => {
    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(data) as Record<string, unknown>;
    } catch {
      // Tolerate plain-text data payloads.
      payload = { text: data, message: data };
    }
    switch (event) {
      case "status":
        handlers.onStatus?.(String(payload.stage ?? ""));
        break;
      case "delta":
        if (typeof payload.text === "string") handlers.onDelta(payload.text);
        break;
      case "done": {
        sawDone = true;
        const done = payload as DonePayload;
        handlers.onDone({
          runId: done.run_id ?? null,
          conversationId: done.conversation_id ?? null,
          citations: Array.isArray(done.citations) ? done.citations : [],
        });
        break;
      }
      case "error":
        sawDone = true;
        handlers.onError(String(payload.message ?? "stream error"));
        break;
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";
    for (const block of blocks) {
      const parsed = parseSseBlock(block);
      if (parsed) dispatch(parsed.event, parsed.data);
    }
  }

  if (!sawDone) {
    // Stream ended without a terminal event; treat what we have as the answer.
    handlers.onDone({ runId: null, conversationId: null, citations: [] });
  }
}

export async function streamChat(options: {
  message: string;
  conversationId: string | null;
  signal: AbortSignal;
  handlers: AskChatHandlers;
}) {
  const { message, conversationId, signal, handlers } = options;

  const send = async (sessionToken: string) =>
    fetch(`${askApiBase()}/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        session_token: sessionToken,
        conversation_id: conversationId ?? undefined,
        message,
      }),
      signal,
    });

  try {
    let res = await send(await getSessionToken());

    // Expired/invalid session: mint a fresh one and retry once.
    if (res.status === 401 || res.status === 419) {
      clearAskSession();
      res = await send(await getSessionToken());
    }

    if (res.status === 429) {
      handlers.onError("rate_limited");
      return;
    }
    if (!res.ok || !res.body) {
      handlers.onError(`request failed (${res.status})`);
      return;
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("text/event-stream")) {
      await consumeSse(res, handlers);
      return;
    }

    // Non-streaming fallback: a single JSON answer.
    const data = (await res.json()) as DonePayload & {
      text?: string;
      answer?: string;
    };
    const text = data.text ?? data.answer ?? "";
    if (text) handlers.onDelta(text);
    handlers.onDone({
      runId: data.run_id ?? null,
      conversationId: data.conversation_id ?? null,
      citations: Array.isArray(data.citations) ? data.citations : [],
    });
  } catch (error) {
    if (signal.aborted) return;
    handlers.onError(error instanceof Error ? error.message : "network error");
  }
}

export async function searchDocs(
  query: string,
  signal: AbortSignal,
): Promise<AskSearchResult[]> {
  const res = await fetch(
    `${askApiBase()}/search?q=${encodeURIComponent(query)}`,
    { signal },
  );
  if (!res.ok) {
    throw new Error(`search failed (${res.status})`);
  }
  const data = (await res.json()) as
    | AskSearchResult[]
    | { results?: AskSearchResult[] };
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function sendFeedback(options: {
  runId: string;
  rating: "up" | "down";
  comment?: string;
}) {
  try {
    await fetch(`${askApiBase()}/feedback`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        run_id: options.runId,
        rating: options.rating,
        comment: options.comment,
      }),
    });
  } catch {
    // Feedback is fire-and-forget.
  }
}
