import { askApiBase } from "./config";

/**
 * Client for the solana-docs-agent public API (proxied same-origin at
 * /api/ask by apps/web). Contract per AI_BOT_PLAN.md §3:
 *
 *   POST /session               -> { session_token }
 *   POST /chat                  -> SSE (status / delta / done / error) or a
 *                                  plain JSON answer (non-streaming fallback)
 *   POST /feedback              -> 2xx, with the anonymous session token
 *   GET  /search?q=             -> { results: [...] }
 */

export type AskCitation = { title: string; url: string };

export type AskGenerativeUiComponentType =
  | "answer_intro"
  | "callout"
  | "cards"
  | "code_tabs"
  | "command_list"
  | "comparison"
  | "concept_model"
  | "definition_grid"
  | "source_links"
  | "step_flow";

export type AskGenerativeUiComponent = {
  type: AskGenerativeUiComponentType | (string & {});
  [key: string]: unknown;
};

export type AskGenerativeUi = {
  version: "solana-docs-ui/v1";
  kind: "answer";
  components: AskGenerativeUiComponent[];
};

export type AskSearchResult = {
  title: string;
  url: string;
  snippet?: string;
  breadcrumbs?: string[];
};

export type CodeFollowupButton = {
  type: "show_code" | (string & {});
  label: string;
  language: string;
  message: string;
};

export type CodeFollowups = {
  prompt: string;
  buttons: CodeFollowupButton[];
};

type AskChatDonePayload = {
  response: string | null;
  runId: string | null;
  conversationId: string | null;
  citations: AskCitation[];
  generativeUi: AskGenerativeUi | null;
  codeFollowups: CodeFollowups | null;
};

export type AskChatTiming = {
  phase:
    | "cache_hit"
    | "session_start"
    | "session_ready"
    | "chat_request_start"
    | "chat_response_start"
    | "session_retry"
    | "first_status"
    | "first_delta"
    | "first_ui"
    | "done"
    | "error";
  elapsedMs: number;
  detail?: string | number | null;
};

export type AskChatHandlers = {
  onStatus?: (stage: string) => void;
  onDelta: (text: string) => void;
  onUiStatus?: (stage: string) => void;
  onGenerativeUi?: (ui: AskGenerativeUi) => void;
  onDone: (payload: AskChatDonePayload) => void;
  onError: (message: string) => void;
  onTiming?: (timing: AskChatTiming) => void;
};

const SESSION_STORAGE_KEY = "ask-solana:session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const ANSWER_CACHE_STORAGE_KEY = "ask-solana:answer-cache:v1";
const ANSWER_CACHE_TTL_MS = 15 * 60 * 1000;
const ANSWER_CACHE_MAX_ENTRIES = 12;
const CLIENT_CAPABILITIES =
  "early-status,ui-done,deferred-generative-ui,fast-path,code-followups";

type StoredSession = { token: string; createdAt: number };
type CachedAnswer = {
  message: string;
  createdAt: number;
  content: string;
  citations: AskCitation[];
  generativeUi: AskGenerativeUi | null;
  codeFollowups: CodeFollowups | null;
};
let sessionInFlight: Promise<string> | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeSearchBreadcrumbs(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const breadcrumbs = value.flatMap((item) => {
      if (typeof item === "string") {
        const text = toNonEmptyString(item);
        return text ? [text] : [];
      }

      if (isRecord(item)) {
        const text =
          toNonEmptyString(item.title) ??
          toNonEmptyString(item.label) ??
          toNonEmptyString(item.name);
        return text ? [text] : [];
      }

      return [];
    });

    return breadcrumbs.length > 0 ? breadcrumbs : undefined;
  }

  const breadcrumb = toNonEmptyString(value);
  return breadcrumb ? [breadcrumb] : undefined;
}

function normalizeSearchResult(value: unknown): AskSearchResult | null {
  if (!isRecord(value)) return null;

  const title = toNonEmptyString(value.title);
  const url = toNonEmptyString(value.url) ?? toNonEmptyString(value.href);

  if (!title || !url) return null;

  return {
    title,
    url,
    snippet:
      toNonEmptyString(value.snippet) ??
      toNonEmptyString(value.description) ??
      undefined,
    breadcrumbs: normalizeSearchBreadcrumbs(value.breadcrumbs),
  };
}

function normalizeSearchResults(value: unknown): AskSearchResult[] {
  const results = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.results)
      ? value.results
      : [];

  return results.flatMap((item) => {
    const result = normalizeSearchResult(item);
    return result ? [result] : [];
  });
}

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
  sessionInFlight = null;
}

async function requestSession(): Promise<string> {
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

function createSession(): Promise<string> {
  sessionInFlight ??= requestSession().finally(() => {
    sessionInFlight = null;
  });
  return sessionInFlight;
}

export async function getSessionToken(): Promise<string> {
  return readStoredSession() ?? createSession();
}

export function prewarmAskSession(): void {
  if (typeof window === "undefined" || readStoredSession()) return;
  void getSessionToken().catch(() => {
    // The send path will surface errors. Prewarm should never block the UI.
  });
}

function nowMs(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function normalizedCacheMessage(message: string): string | null {
  const normalized = message.trim().toLowerCase().replace(/\s+/g, " ");
  return normalized.length > 0 ? normalized : null;
}

function normalizeCitations(value: unknown): AskCitation[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const title = toNonEmptyString(item.title) ?? "";
    const url = toNonEmptyString(item.url);
    return url ? [{ title, url }] : [];
  });
}

function normalizeCodeFollowupButton(
  value: unknown,
): CodeFollowupButton | null {
  if (!isRecord(value)) return null;

  const label = toNonEmptyString(value.label);
  const language = toNonEmptyString(value.language);
  const message = toNonEmptyString(value.message);

  if (!label || !language || !message) return null;

  return {
    type: toNonEmptyString(value.type) ?? "show_code",
    label,
    language,
    message,
  };
}

function normalizeCodeFollowups(value: unknown): CodeFollowups | null {
  if (!isRecord(value)) return null;

  const prompt = toNonEmptyString(value.prompt);
  const rawButtons = Array.isArray(value.buttons) ? value.buttons : [];
  const buttons = rawButtons.flatMap((item) => {
    const button = normalizeCodeFollowupButton(item);
    return button ? [button] : [];
  });

  if (!prompt || buttons.length === 0) return null;

  return { prompt, buttons };
}

function normalizeCachedAnswer(value: unknown): CachedAnswer | null {
  if (!isRecord(value)) return null;
  const message = toNonEmptyString(value.message);
  const content = typeof value.content === "string" ? value.content : "";
  const createdAt =
    typeof value.createdAt === "number" && Number.isFinite(value.createdAt)
      ? value.createdAt
      : null;
  const generativeUi = isAskGenerativeUi(value.generativeUi)
    ? value.generativeUi
    : null;

  if (!message || !createdAt || (!content && !generativeUi)) return null;

  return {
    message,
    content,
    createdAt,
    citations: normalizeCitations(value.citations),
    generativeUi,
    codeFollowups: normalizeCodeFollowups(value.codeFollowups),
  };
}

function answerCacheStorage(): Storage | null {
  try {
    return window.sessionStorage ?? null;
  } catch {
    return null;
  }
}

function readAnswerCacheEntries(): CachedAnswer[] {
  const storage = answerCacheStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(ANSWER_CACHE_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    const now = Date.now();
    return parsed
      .flatMap((item) => {
        const entry = normalizeCachedAnswer(item);
        return entry && now - entry.createdAt <= ANSWER_CACHE_TTL_MS
          ? [entry]
          : [];
      })
      .slice(0, ANSWER_CACHE_MAX_ENTRIES);
  } catch {
    return [];
  }
}

function writeAnswerCacheEntries(entries: CachedAnswer[]) {
  const storage = answerCacheStorage();
  if (!storage) return;

  try {
    storage.setItem(ANSWER_CACHE_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Session storage can be unavailable or quota-limited.
  }
}

function readCachedAnswer(message: string): CachedAnswer | null {
  const normalizedMessage = normalizedCacheMessage(message);
  if (!normalizedMessage) return null;

  const entries = readAnswerCacheEntries();
  const cached =
    entries.find((entry) => entry.message === normalizedMessage) ?? null;

  if (entries.length > 0) {
    writeAnswerCacheEntries(entries);
  }

  return cached;
}

function writeCachedAnswer({
  message,
  content,
  citations,
  generativeUi,
  codeFollowups,
}: {
  message: string;
  content: string;
  citations: AskCitation[];
  generativeUi: AskGenerativeUi | null;
  codeFollowups: CodeFollowups | null;
}) {
  const normalizedMessage = normalizedCacheMessage(message);
  if (!normalizedMessage || (!content.trim() && !generativeUi)) return;

  const nextEntry: CachedAnswer = {
    message: normalizedMessage,
    content,
    citations,
    generativeUi,
    codeFollowups,
    createdAt: Date.now(),
  };
  const entries = readAnswerCacheEntries().filter(
    (entry) => entry.message !== normalizedMessage,
  );
  writeAnswerCacheEntries(
    [nextEntry, ...entries].slice(0, ANSWER_CACHE_MAX_ENTRIES),
  );
}

type DonePayload = {
  run_id?: unknown;
  runId?: unknown;
  conversation_id?: unknown;
  conversationId?: unknown;
  response?: unknown;
  content?: unknown;
  text?: unknown;
  answer?: unknown;
  citations?: unknown;
  generative_ui?: unknown;
  generativeUi?: unknown;
  code_followups?: unknown;
  codeFollowups?: unknown;
};

export function isAskGenerativeUi(value: unknown): value is AskGenerativeUi {
  return (
    !!value &&
    typeof value === "object" &&
    (value as { version?: unknown }).version === "solana-docs-ui/v1" &&
    (value as { kind?: unknown }).kind === "answer" &&
    Array.isArray((value as { components?: unknown }).components)
  );
}

function toDonePayload(done: DonePayload): AskChatDonePayload {
  const response =
    typeof done.response === "string"
      ? done.response
      : typeof done.content === "string"
        ? done.content
        : typeof done.text === "string"
          ? done.text
          : typeof done.answer === "string"
            ? done.answer
            : null;
  const generativeUiPayload = done.generative_ui ?? done.generativeUi;

  return {
    response,
    runId:
      typeof done.run_id === "string"
        ? done.run_id
        : typeof done.runId === "string"
          ? done.runId
          : null,
    conversationId:
      typeof done.conversation_id === "string"
        ? done.conversation_id
        : typeof done.conversationId === "string"
          ? done.conversationId
          : null,
    citations: normalizeCitations(done.citations),
    generativeUi: isAskGenerativeUi(generativeUiPayload)
      ? generativeUiPayload
      : null,
    codeFollowups: normalizeCodeFollowups(
      done.code_followups ?? done.codeFollowups,
    ),
  };
}

export function splitCodeFollowupPrompt(
  response: string,
  followups?: CodeFollowups | null,
): { body: string; prompt: string | null } {
  const prompt = followups?.prompt?.trim();

  if (!prompt) {
    return { body: response, prompt: null };
  }

  const trimmed = response.trimEnd();

  if (!trimmed.endsWith(prompt)) {
    return { body: response, prompt };
  }

  return {
    body: trimmed.slice(0, -prompt.length).trimEnd(),
    prompt,
  };
}

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
  let sawDelta = false;

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
      case "ui_status":
        handlers.onUiStatus?.(
          String(payload.stage ?? payload.status ?? "building_visual"),
        );
        break;
      case "delta":
        if (typeof payload.text === "string") {
          sawDelta = true;
          handlers.onDelta(payload.text);
        }
        break;
      case "ui_done": {
        const uiPayload = payload.generative_ui ?? payload.generativeUi;
        if (isAskGenerativeUi(uiPayload)) {
          handlers.onGenerativeUi?.(uiPayload);
        }
        break;
      }
      case "done": {
        sawDone = true;
        const done = payload as DonePayload;
        const donePayload = toDonePayload(done);
        if (!sawDelta && donePayload.response) {
          handlers.onDelta(donePayload.response);
        }
        handlers.onDone(donePayload);
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
    handlers.onDone({
      response: null,
      runId: null,
      conversationId: null,
      citations: [],
      generativeUi: null,
      codeFollowups: null,
    });
  }
}

export async function streamChat(options: {
  message: string;
  conversationId: string | null;
  signal: AbortSignal;
  handlers: AskChatHandlers;
}) {
  const { message, conversationId, signal, handlers } = options;
  const startedAt = nowMs();
  const canUseAnswerCache = conversationId === null;
  let collectedText = "";
  let collectedGenerativeUi: AskGenerativeUi | null = null;
  let sawFirstStatus = false;
  let sawFirstDelta = false;
  let sawFirstUi = false;

  const report = (
    phase: AskChatTiming["phase"],
    detail?: AskChatTiming["detail"],
  ) => {
    handlers.onTiming?.({
      phase,
      elapsedMs: Math.max(0, Math.round(nowMs() - startedAt)),
      detail,
    });
  };

  const wrappedHandlers: AskChatHandlers = {
    onStatus: (stage) => {
      if (!sawFirstStatus) {
        sawFirstStatus = true;
        report("first_status", stage);
      }
      handlers.onStatus?.(stage);
    },
    onDelta: (text) => {
      if (!sawFirstDelta) {
        sawFirstDelta = true;
        report("first_delta");
      }
      collectedText += text;
      handlers.onDelta(text);
    },
    onUiStatus: handlers.onUiStatus,
    onGenerativeUi: (ui) => {
      if (!sawFirstUi) {
        sawFirstUi = true;
        report("first_ui");
      }
      collectedGenerativeUi = ui;
      handlers.onGenerativeUi?.(ui);
    },
    onDone: (payload) => {
      report("done");
      const generativeUi = payload.generativeUi ?? collectedGenerativeUi;
      if (canUseAnswerCache && !signal.aborted) {
        writeCachedAnswer({
          message,
          content: payload.response ?? collectedText,
          citations: payload.citations,
          generativeUi,
          codeFollowups: payload.codeFollowups,
        });
      }
      handlers.onDone(payload);
    },
    onError: (errorMessage) => {
      report("error", errorMessage);
      handlers.onError(errorMessage);
    },
    onTiming: handlers.onTiming,
  };

  const cached = canUseAnswerCache ? readCachedAnswer(message) : null;
  if (cached) {
    report("cache_hit");
    handlers.onStatus?.("cache_hit");
    if (cached.content) handlers.onDelta(cached.content);
    if (cached.generativeUi) handlers.onGenerativeUi?.(cached.generativeUi);
    handlers.onDone({
      response: cached.content,
      runId: null,
      conversationId: null,
      citations: cached.citations,
      generativeUi: cached.generativeUi,
      codeFollowups: cached.codeFollowups,
    });
    return;
  }

  const send = async (sessionToken: string) =>
    fetch(`${askApiBase()}/chat`, {
      method: "POST",
      headers: {
        accept: "text/event-stream, application/json",
        "content-type": "application/json",
        "x-ask-client-capabilities": CLIENT_CAPABILITIES,
      },
      body: JSON.stringify({
        session_token: sessionToken,
        conversation_id: conversationId ?? undefined,
        message,
      }),
      signal,
    });

  try {
    report("session_start");
    handlers.onStatus?.("session_start");
    const sessionToken = await getSessionToken();
    report("session_ready");
    handlers.onStatus?.("session_ready");
    report("chat_request_start");
    handlers.onStatus?.("chat_connecting");
    let res = await send(sessionToken);
    report("chat_response_start", res.status);

    // Expired/invalid session: mint a fresh one and retry once.
    if (res.status === 401 || res.status === 419) {
      report("session_retry", res.status);
      clearAskSession();
      handlers.onStatus?.("session_start");
      const retrySessionToken = await getSessionToken();
      report("session_ready");
      handlers.onStatus?.("session_ready");
      report("chat_request_start");
      res = await send(retrySessionToken);
      report("chat_response_start", res.status);
    }

    if (res.status === 429) {
      wrappedHandlers.onError("rate_limited");
      return;
    }
    if (!res.ok || !res.body) {
      wrappedHandlers.onError(`request failed (${res.status})`);
      return;
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("text/event-stream")) {
      await consumeSse(res, wrappedHandlers);
      return;
    }

    // Non-streaming fallback: a single JSON answer.
    const data = (await res.json()) as DonePayload;
    const donePayload = toDonePayload(data);
    const text = donePayload.response ?? "";
    if (text) wrappedHandlers.onDelta(text);
    wrappedHandlers.onDone(donePayload);
  } catch (error) {
    if (signal.aborted) return;
    wrappedHandlers.onError(
      error instanceof Error ? error.message : "network error",
    );
  }
}

export type AskConversationUserMessage = {
  role: "user";
  content: string;
};

export type AskConversationAssistantMessage = {
  role: "assistant";
  content: string;
  citations: AskCitation[];
  generativeUi: AskGenerativeUi | null;
  codeFollowups: CodeFollowups | null;
};

export type AskConversationMessage =
  | AskConversationUserMessage
  | AskConversationAssistantMessage;

export type AskConversation = {
  conversationId: string | null;
  messages: AskConversationMessage[];
};

function normalizeConversationMessage(
  value: unknown,
): AskConversationMessage | null {
  if (!isRecord(value)) return null;

  if (value.role === "user") {
    const content = toNonEmptyString(value.content);
    return content ? { role: "user", content } : null;
  }

  if (value.role !== "assistant") return null;

  const payload = toDonePayload(value as DonePayload);
  const content = payload.response ?? "";

  return {
    role: "assistant",
    content,
    citations: payload.citations,
    generativeUi: payload.generativeUi,
    codeFollowups: payload.codeFollowups,
  };
}

export async function getAskRun(
  runId: string,
  signal: AbortSignal,
): Promise<AskChatDonePayload> {
  const res = await fetch(`${askApiBase()}/runs/${encodeURIComponent(runId)}`, {
    signal,
  });
  if (!res.ok) {
    throw new Error(`run request failed (${res.status})`);
  }

  const data = (await res.json()) as DonePayload;
  return toDonePayload(data);
}

export async function getAskConversation(
  conversationId: string,
  signal: AbortSignal,
): Promise<AskConversation> {
  const res = await fetch(
    `${askApiBase()}/conversations/${encodeURIComponent(conversationId)}`,
    { signal },
  );
  if (!res.ok) {
    throw new Error(`conversation request failed (${res.status})`);
  }

  const data = (await res.json()) as unknown;
  const record = isRecord(data) ? data : {};
  const messages = Array.isArray(record.messages)
    ? record.messages.flatMap((item) => {
        const message = normalizeConversationMessage(item);
        return message ? [message] : [];
      })
    : [];

  return {
    conversationId:
      toNonEmptyString(record.conversation_id) ??
      toNonEmptyString(record.conversationId),
    messages,
  };
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
  const data = (await res.json()) as unknown;
  return normalizeSearchResults(data);
}

export async function sendFeedback(options: {
  runId: string;
  rating: "up" | "down";
  comment?: string;
}) {
  try {
    const sessionToken = await getSessionToken();
    await fetch(`${askApiBase()}/feedback`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        session_token: sessionToken,
        run_id: options.runId,
        rating: options.rating,
        comment: options.comment,
      }),
    });
  } catch {
    // Feedback is fire-and-forget.
  }
}
