/**
 * The one Ask AI store: panel state (open, layout, width) and the single
 * conversation every entry point shares. Plain TypeScript with a
 * subscribe/getState pair for `useSyncExternalStore` (see ./use-ask.ts).
 * Answers come from Bri's client (@solana-com/ui-chrome/ask-solana/api);
 * ./adapters.ts maps its errors and citations.
 *
 * - Nothing touches `window` at import. The store starts on its first
 *   subscriber or action; on a prerendered page it waits for
 *   `prerenderingchange` before reading storage or touching <html>.
 * - The conversation lives in sessionStorage (it survives reloads and
 *   full-page loads); open/full screen in sessionStorage; the docked width
 *   in localStorage. Its id is the agent's (an integer, kept as a string;
 *   Bri's client sends it back as a number). When her client drops it (an
 *   expired session, an id the agent no longer has) or the agent says the
 *   conversation is full, the next question starts a new one; until one
 *   has, an answer sent without it says so (pendingReset), unless the
 *   reader was told already (an id the agent no longer has). A question
 *   sent without a conversation clears Bri's answer cache first
 *   (forgetCachedAnswers), so it reaches the agent and starts one.
 * - Layout is derived: full screen when asked for, else docked from 1280px
 *   and an overlay below. While open, <html> carries data-ask="<layout>"
 *   and --ask-w (the docked width), which the docs layouts use to make
 *   room for the panel; ./config.ts DOCS_ASK_PREPAINT_SCRIPT sets the same
 *   before paint. Only while an Ask AI root is mounted (connectAskHtml):
 *   a client-side move to a route without Ask AI (the cookbook) clears
 *   them.
 * - A question that arrives while an answer is streaming is queued, not
 *   dropped.
 * - A question goes out as the reader's words. Bri's client sends only the
 *   message, so the page it is about goes in it, as a line with the page's
 *   title (agentMessage). Text selected on the page ("Ask AI about this")
 *   waits in the composer as a quote and goes ahead of the words
 *   (./quote.ts), its page as above.
 * - "Expand to full screen" is also a link that opens the thread full
 *   screen in a new tab (./handoff.ts): the store leaves the thread for it
 *   in localStorage and, in the new tab, takes it back on load. An answer
 *   still arriving then is finished here and passed on (passOnAnswer); the
 *   new tab waits for it (followAnswer).
 * - Bri's analytics events (`trackAskSolana`) go out as the panel opens, a
 *   question is sent and timed, and an answer is rated; ./analytics.ts
 *   sends them to GA4. `surface` is the panel's layout.
 */
import {
  isAskGenerativeUi,
  prewarmAskSession,
  sendFeedback,
  streamChat,
  type AskCitation,
  type AskGenerativeUi,
  type CodeFollowups,
} from "@solana-com/ui-chrome/ask-solana/api";
import { trackAskSolana } from "@solana-com/ui-chrome/ask-solana/analytics";
import {
  subscribeToAskSolanaWidget,
  takeAskSolanaWidgetSeed,
} from "@solana-com/ui-chrome/ask-solana/widget-store";
import {
  DOCS_ASK_OPEN_ATTR,
  DOCS_ASK_OPEN_EVENT,
  type AskAiOpenOptions,
} from "../ask-ai";
import { askErrorKindFor, toAskCitations } from "./adapters";
import {
  ASK_DOCK_MIN_VIEWPORT,
  ASK_MAX_CODE_CHARS,
  ASK_MAX_MESSAGE_CHARS,
  ASK_MAX_STORED_MESSAGES,
  ASK_PANEL_WIDTH,
  ASK_SOLANA_ANSWER_CACHE_KEY,
  ASK_STORAGE_KEYS,
  isPrerendering,
} from "./config";
import {
  ASK_HANDOFF_TTL_MS,
  discardHandoff,
  handoffKey,
  isThreadId,
  newThreadId,
  parseHandoff,
  pruneHandoffs,
  readFullscreenLink,
  readHandoff,
  withoutFullscreenParams,
  writeHandoff,
} from "./handoff";
import {
  currentLocale,
  currentPageTitle,
  isAskPageContext,
  readPageContext,
  type AskPageContext,
} from "./page-context";
import {
  fenceLanguage,
  quotedQuestion,
  restoreQuote,
  toQuote,
  type AskComposerQuote,
  type AskQuote,
} from "./quote";
import {
  advanceAskStatus,
  askStatusForStage,
  isRecord,
  normalizeCodeFollowups,
  toConversationReset,
  toNonEmptyString,
  type AskConversationReset,
  type AskErrorKind,
  type AskStatus,
} from "./protocol";

export type {
  AskCitation,
  AskGenerativeUi,
  CodeFollowups,
} from "@solana-com/ui-chrome/ask-solana/api";
export type { AskPageContext } from "./page-context";
export type { AskComposerQuote, AskQuote } from "./quote";
export type { AskConversationReset, AskErrorKind, AskStatus } from "./protocol";

export type AskLayout = "docked" | "overlay" | "fullscreen";
export type AskRating = "up" | "down";

export type AskUserMessage = {
  id: string;
  role: "user";
  /** What the panel shows: the reader's words, or a code block's prompt and code. */
  text: string;
  /** The page attached with "Ask about this page", shown above the message. */
  pageContext?: AskPageContext;
  /**
   * The question as sent, when it differs from `text`: a code block's Ask
   * shows "Explain this code from {title}:" but sends the code without the
   * title, which the agent's router would answer with a canned template;
   * a quoted question sends the quote ahead of the words.
   */
  sent?: string;
  /** Text selected on the page that the question is about, shown above it. */
  quote?: AskQuote;
};

export type AskAssistantMessage = {
  id: string;
  role: "assistant";
  /**
   * pending: nothing received yet; streaming: text or a visual arriving;
   * done; error (see `error`); stopped: the reader pressed Stop.
   */
  state: "pending" | "streaming" | "done" | "error" | "stopped";
  /** Markdown, including the Summary / Indepth headings (see splitAnswerSections). */
  text: string;
  /** Status row while pending or streaming. */
  status?: AskStatus;
  /** Visual; may arrive before the text is finished. */
  ui?: AskGenerativeUi;
  citations: AskCitation[];
  codeFollowups: CodeFollowups | null;
  /** Null hides the rating buttons. */
  runId: string | null;
  error?: AskErrorKind;
  rating?: AskRating;
  /**
   * This answer went out without the conversation above it (see
   * AskConversationReset), so the agent answered without the earlier
   * messages; the answer says so (docsAsk.conversationReset.<kind>). Only
   * on an answer: a turn that fails or is stopped drops it, and the next
   * one sent without the conversation carries it (Core.pendingReset).
   */
  conversationReset?: AskConversationReset;
  /**
   * The refused question went back in the composer (AskError): kept with
   * the thread, so it goes back once, not on every load.
   */
  questionRestored?: true;
};

export type AskMessage = AskUserMessage | AskAssistantMessage;

export type AskState = {
  /** False until stored state is read (server render, prerendering). */
  hydrated: boolean;
  open: boolean;
  /** Current layout; "fullscreen" only while open. */
  layout: AskLayout;
  /** Layout to return to from full screen (by viewport width). */
  prevLayout: "docked" | "overlay";
  /** Docked width in px, clamped to [widthMin, widthMax]. */
  width: number;
  widthMin: number;
  /** min(720, half the viewport); changes with the window. */
  widthMax: number;
  messages: AskMessage[];
  conversationId: string | null;
  /** An answer is streaming (the composer shows Stop). */
  busy: boolean;
  /** Questions waiting for the current answer to finish. */
  queued: number;
  /** Page attached to the next question (composer chip). */
  pageContext: AskPageContext | null;
  composerDraft: string;
  /** Selected text attached to the next question (composer quote card). */
  composerQuote: AskComposerQuote | null;
  /** Increments whenever the composer should take focus. */
  focusRequest: number;
  /**
   * This tab's thread in the full-screen link (`askThread`, ./handoff.ts);
   * a new one with New chat. Empty until hydrated.
   */
  threadId: string;
};

export type AskOpenOptions = {
  /** Code from a code block: asks the explainCode prompt about it. */
  code?: string;
  /** The code block's language, kept on the fence. */
  language?: string;
  /** A question to send at once (e.g. from the search hand-off). */
  question?: string;
  /** Attach this page (or the given page) to the composer; does not send. */
  aboutPage?: boolean | AskPageContext;
  /**
   * Text selected on this page: attached to the composer as a quote (in
   * place of any earlier one, keeping the draft), which takes focus. Does
   * not send.
   */
  selection?: AskQuote;
};

export type AskSendOptions = {
  /**
   * Page to ask about. Defaults to the attached page (`pageContext`), which
   * is then cleared; pass null to send without one.
   */
  pageContext?: AskPageContext | null;
};

export type AskSendResult =
  | { ok: true; queued: boolean }
  | { ok: false; reason: "empty" | "tooLong" };

/** Localized prompt builders; the UI root sets them from `docsAsk.prompts`. */
export type AskPrompts = {
  /** Shown above a code block's code (the question's heading). */
  explainCode: (title: string) => string;
  /** Sent with a code block's code: no page title (see AskUserMessage.sent). */
  explainCodeSent: () => string;
  /** The question for a quote sent without one. */
  explainSelection: () => string;
};

const DEFAULT_PROMPTS: AskPrompts = {
  explainCode: (title) => `Explain this code from ${title}:`,
  explainCodeSent: () => "Explain this code:",
  explainSelection: () => "Explain this",
};

type Core = {
  hydrated: boolean;
  open: boolean;
  fullscreen: boolean;
  /** Width the reader chose; `width` is this clamped to the viewport. */
  preferredWidth: number;
  wide: boolean;
  viewportWidth: number;
  messages: AskMessage[];
  conversationId: string | null;
  /**
   * The conversation was dropped (an expired session, a full one) and no
   * new one has started: the next answer sent without one says so. Cleared
   * when an answer brings a conversation id, and by New chat.
   */
  pendingReset: AskConversationReset | null;
  busy: boolean;
  pageContext: AskPageContext | null;
  composerDraft: string;
  composerQuote: AskComposerQuote | null;
  focusRequest: number;
  threadId: string;
};

type QueuedQuestion = {
  text: string;
  pageContext: AskPageContext | null;
  sent?: string;
  quote?: AskQuote;
};

function initialCore(): Core {
  return {
    hydrated: false,
    open: false,
    fullscreen: false,
    preferredWidth: ASK_PANEL_WIDTH.default,
    wide: false,
    viewportWidth: 0,
    messages: [],
    conversationId: null,
    pendingReset: null,
    busy: false,
    pageContext: null,
    composerDraft: "",
    composerQuote: null,
    focusRequest: 0,
    threadId: "",
  };
}

let core = initialCore();
let queue: QueuedQuestion[] = [];
let prompts = DEFAULT_PROMPTS;
let started = false;
let controller: AbortController | null = null;
let activeId: string | null = null;
let threadSaveTimer: ReturnType<typeof setTimeout> | null = null;
let widthSaveTimer: ReturnType<typeof setTimeout> | null = null;
let handoffTimer: ReturnType<typeof setTimeout> | null = null;
/** The last handoff this tab wrote (see releaseHandoff). */
let lastHandoff: { threadId: string; savedAt: number } | null = null;
/**
 * The answer that was still arriving when this tab last handed the thread
 * over; passOnAnswer hands it over again once it ends. `released`: by a
 * plain click (see releaseHandoff).
 */
let sharedAnswer: {
  threadId: string;
  answerId: string;
  until: number;
  released: boolean;
} | null = null;
/**
 * How long a handoff stays after it was read, or after a plain click left
 * it: other tabs opened from the same link may not have read it yet.
 */
const HANDOFF_RELEASE_MS = 15_000;
let appliedHtml: string | null = null;
/** No Ask AI root is mounted: <html> is left alone (see connectAskHtml). */
let htmlReleased = false;
let teardown: Array<() => void> = [];
const listeners = new Set<() => void>();

function widthMaxFor(viewportWidth: number): number {
  if (viewportWidth <= 0) return ASK_PANEL_WIDTH.max;
  return Math.max(
    ASK_PANEL_WIDTH.min,
    Math.min(ASK_PANEL_WIDTH.max, Math.floor(viewportWidth / 2)),
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function derive(c: Core): AskState {
  const base = c.wide ? "docked" : "overlay";
  const widthMax = widthMaxFor(c.viewportWidth);
  return {
    hydrated: c.hydrated,
    open: c.open,
    layout: c.open && c.fullscreen ? "fullscreen" : base,
    prevLayout: base,
    width: clamp(Math.round(c.preferredWidth), ASK_PANEL_WIDTH.min, widthMax),
    widthMin: ASK_PANEL_WIDTH.min,
    widthMax,
    messages: c.messages,
    conversationId: c.conversationId,
    busy: c.busy,
    queued: queue.length,
    pageContext: c.pageContext,
    composerDraft: c.composerDraft,
    composerQuote: c.composerQuote,
    focusRequest: c.focusRequest,
    threadId: c.threadId,
  };
}

const SERVER_STATE = derive(initialCore());
let snapshot = SERVER_STATE;

/** Applies `patch`, publishes a new snapshot, and syncs <html> and storage. */
function commit(
  patch: Partial<Core> = {},
  options: { saveThread?: "now" | "soon" } = {},
) {
  const prevOpen = core.open;
  const prevFullscreen = core.fullscreen;
  core = { ...core, ...patch };
  snapshot = derive(core);
  syncHtml();
  if (core.hydrated) {
    if (prevOpen !== core.open || prevFullscreen !== core.fullscreen) saveUi();
    if (options.saveThread) saveThread(options.saveThread === "now");
  }
  for (const listener of listeners) listener();
}

function updateMessage(
  id: string,
  update: (message: AskAssistantMessage) => AskAssistantMessage,
  options?: { saveThread?: "now" | "soon" },
) {
  let changed = false;
  const messages = core.messages.map((message) => {
    if (message.id !== id || message.role !== "assistant") return message;
    const next = update(message);
    changed ||= next !== message;
    return next;
  });
  if (changed)
    commit({ messages }, { saveThread: options?.saveThread ?? "soon" });
}

// --- <html> sync -----------------------------------------------------------

function syncHtml() {
  // Before hydration the prepaint script's attributes stand.
  if (!core.hydrated || htmlReleased || typeof document === "undefined") return;
  const key = core.open ? `${snapshot.layout}:${snapshot.width}` : "";
  if (key === appliedHtml) return;
  appliedHtml = key;
  const root = document.documentElement;
  if (core.open) {
    root.setAttribute("data-ask", snapshot.layout);
    root.style.setProperty("--ask-w", `${snapshot.width}px`);
  } else {
    root.removeAttribute("data-ask");
    root.style.removeProperty("--ask-w");
  }
}

// --- Storage ---------------------------------------------------------------

function session(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function local(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readJson(storage: Storage | null, key: string): unknown {
  try {
    const raw = storage?.getItem(key);
    return raw ? (JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
}

function writeJson(storage: Storage | null, key: string, value: unknown) {
  try {
    storage?.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the panel still works for this page.
  }
}

function saveUi() {
  writeJson(session(), ASK_STORAGE_KEYS.ui, {
    open: core.open,
    fullscreen: core.fullscreen,
  });
}

function saveThread(now: boolean) {
  if (threadSaveTimer) clearTimeout(threadSaveTimer);
  threadSaveTimer = null;
  const write = () => {
    threadSaveTimer = null;
    writeJson(session(), ASK_STORAGE_KEYS.thread, {
      messages: core.messages.slice(-ASK_MAX_STORED_MESSAGES),
      conversationId: core.conversationId,
      pendingReset: core.pendingReset,
      threadId: core.threadId,
    });
  };
  // Streaming changes the thread many times a second; batch those writes.
  if (now) write();
  else threadSaveTimer = setTimeout(write, 300);
}

function flushThread() {
  if (threadSaveTimer) saveThread(true);
}

function onPageHide() {
  flushThread();
  // The answer ends with this page: a tab waiting for it stops waiting.
  if (activeId)
    passOnAnswer(
      activeId,
      withAnswer(activeId, {
        state: "error",
        status: undefined,
        error: "incomplete",
      }),
    );
}

function restoreMessage(value: unknown): AskMessage | null {
  if (!isRecord(value)) return null;
  const id = typeof value.id === "string" && value.id ? value.id : null;
  if (!id) return null;
  if (value.role === "user") {
    if (typeof value.text !== "string" || !value.text.trim()) return null;
    // Threads saved before quotes existed simply have none.
    const quote = restoreQuote(value.quote);
    return {
      id,
      role: "user",
      text: value.text,
      ...(isAskPageContext(value.pageContext)
        ? { pageContext: value.pageContext }
        : {}),
      ...(typeof value.sent === "string" && value.sent.trim()
        ? { sent: value.sent }
        : {}),
      ...(quote ? { quote } : {}),
    };
  }
  if (value.role !== "assistant") return null;
  const states = ["pending", "streaming", "done", "error", "stopped"] as const;
  const saved = states.find((state) => state === value.state) ?? "error";
  // An answer that was still arriving when the page unloaded did not finish.
  const interrupted = saved === "pending" || saved === "streaming";
  const errors: AskErrorKind[] = [
    "generic",
    "rateLimited",
    "unavailable",
    "incomplete",
    "tooLong",
    "conversationFull",
    "conversationNotFound",
    "offline",
  ];
  const error = interrupted
    ? "incomplete"
    : (errors.find((kind) => kind === value.error) ??
      (saved === "error" ? "generic" : undefined));
  // Only an answer says it went without the conversation (see
  // AskAssistantMessage.conversationReset); restoreInFlight keeps it on
  // one still arriving.
  const reset =
    saved === "done" ? toConversationReset(value.conversationReset) : null;
  return {
    id,
    role: "assistant",
    state: interrupted ? "error" : saved,
    text: typeof value.text === "string" ? value.text : "",
    ...(isAskGenerativeUi(value.ui) ? { ui: value.ui } : {}),
    citations: toAskCitations(value.citations),
    codeFollowups: normalizeCodeFollowups(value.codeFollowups),
    runId: toNonEmptyString(value.runId),
    ...(error ? { error } : {}),
    ...(value.rating === "up" || value.rating === "down"
      ? { rating: value.rating }
      : {}),
    ...(reset ? { conversationReset: reset } : {}),
    ...(value.questionRestored === true ? { questionRestored: true } : {}),
  };
}

const STATUSES: readonly AskStatus[] = [
  "preparing",
  "searching",
  "writing",
  "visual",
];

function isInFlight(
  value: unknown,
): value is Record<string, unknown> & { state: "pending" | "streaming" } {
  return (
    isRecord(value) &&
    (value.state === "pending" || value.state === "streaming")
  );
}

/** An answer another tab is still writing, as it stood (see followAnswer). */
function restoreInFlight(value: unknown): AskAssistantMessage | null {
  if (!isInFlight(value)) return null;
  const message = restoreMessage(value);
  if (message?.role !== "assistant") return null;
  const { error: _incomplete, ...rest } = message;
  const reset = toConversationReset(value.conversationReset);
  return {
    ...rest,
    state: value.state,
    status: STATUSES.find((status) => status === value.status) ?? "preparing",
    ...(reset ? { conversationReset: reset } : {}),
  };
}

function hydrate() {
  if (core.hydrated) return;
  // Opened from the full-screen link: full screen, with the thread the
  // link's tab left (if it is still there) in place of this tab's own.
  const link = readFullscreenLink(window.location.search);
  const handoff = link?.threadId ? readHandoff(local(), link.threadId) : null;
  pruneHandoffs(local());
  const stored = readJson(session(), ASK_STORAGE_KEYS.thread);
  const thread: unknown = handoff ?? stored;
  const ui = readJson(session(), ASK_STORAGE_KEYS.ui);
  const width = Number.parseInt(
    local()?.getItem(ASK_STORAGE_KEYS.width) ?? "",
    10,
  );
  const messages =
    isRecord(thread) && Array.isArray(thread.messages)
      ? thread.messages.flatMap((item) => {
          const message = restoreMessage(item);
          return message ? [message] : [];
        })
      : [];
  // An answer the link's tab was still writing: it finishes there, and this
  // tab waits for it rather than calling it broken. Not behind questions
  // asked here before hydration (while prerendering).
  const last =
    handoff && link?.threadId && core.messages.length === 0
      ? restoreInFlight(handoff.messages.at(-1))
      : null;
  const inFlight = last && messages.at(-1)?.id === last.id ? last : null;
  if (inFlight) messages[messages.length - 1] = inFlight;
  appliedHtml = null;
  commit(
    {
      hydrated: true,
      // Actions taken before hydration (an early openAskAi) win over storage.
      open: core.open || !!link || (isRecord(ui) && ui.open === true),
      fullscreen:
        core.fullscreen || !!link || (isRecord(ui) && ui.fullscreen === true),
      preferredWidth: width > 0 ? width : core.preferredWidth,
      messages: [...messages, ...core.messages],
      conversationId:
        core.conversationId ??
        (isRecord(thread) ? toNonEmptyString(thread.conversationId) : null),
      pendingReset:
        core.pendingReset ??
        (isRecord(thread) ? toConversationReset(thread.pendingReset) : null),
      // A handed-off thread is this tab's own copy from now on.
      threadId:
        !handoff && isRecord(stored) && isThreadId(stored.threadId)
          ? stored.threadId
          : newThreadId(),
      ...(handoff
        ? {
            pageContext: core.pageContext ?? handoff.pageContext,
            composerDraft: core.composerDraft || handoff.composerDraft,
            composerQuote: core.composerQuote ?? handoff.composerQuote,
          }
        : {}),
      ...(inFlight ? { busy: true } : {}),
    },
    // Kept in this tab's session from the start, so a reload keeps it.
    handoff ? { saveThread: "now" } : {},
  );
  if (handoff && link?.threadId) {
    discardLater(link.threadId, handoff.savedAt);
    if (inFlight)
      followAnswer(
        link.threadId,
        inFlight.id,
        handoff.savedAt + ASK_HANDOFF_TTL_MS,
      );
  }
  if (link) clearFullscreenLink();
}

/** Deletes a handoff this tab read, once other tabs had time to read it. */
function discardLater(threadId: string, savedAt: number) {
  const timer = setTimeout(
    () => discardHandoff(local(), threadId, savedAt),
    HANDOFF_RELEASE_MS,
  );
  teardown.push(() => clearTimeout(timer));
}

/**
 * Waits for the answer `id` that the link's tab was still writing: it shows
 * here as still arriving, with new questions queued behind it, until that
 * tab hands the thread over again with it ended (passOnAnswer); then this
 * tab takes it and the conversation id. Stop or New chat here stop waiting;
 * a tab that never says (it crashed) leaves it incomplete at `until`.
 */
function followAnswer(threadId: string, id: string, until: number) {
  const abort = new AbortController();
  controller = abort;
  activeId = id;
  const live = () => activeId === id;
  const onStorage = (event: StorageEvent) => {
    if (event.key !== handoffKey(threadId) || !live()) return;
    const next = parseHandoff(event.newValue);
    const raw = next?.messages.find((m) => isRecord(m) && m.id === id);
    if (!next || !raw || isInFlight(raw)) return;
    const message = restoreMessage(raw);
    if (message?.role !== "assistant") return;
    abort.abort();
    finishTurn(id, () => message, next.conversationId);
    discardLater(threadId, next.savedAt);
  };
  const timer = setTimeout(
    () => {
      if (!live()) return;
      abort.abort();
      finishTurn(id, (m) => ({
        ...m,
        state: "error",
        status: undefined,
        error: "incomplete",
      }));
    },
    Math.max(0, until - Date.now()),
  );
  const stopFollowing = () => {
    clearTimeout(timer);
    window.removeEventListener("storage", onStorage);
  };
  window.addEventListener("storage", onStorage);
  abort.signal.addEventListener("abort", stopFollowing, { once: true });
  teardown.push(stopFollowing);
}

/**
 * Drops ?ask=full&askThread from the address bar (the rest of the query and
 * the hash stay), so a reload or a shared URL is the plain page. A task
 * later: Next's router patches history.replaceState in an effect that runs
 * after this one (parents after children), and syncs its own URL from
 * calls whose state lacks its marker, hence `null`.
 */
function clearFullscreenLink() {
  setTimeout(() => {
    try {
      const { pathname, search, hash } = window.location;
      const url = withoutFullscreenParams({ pathname, search, hash });
      if (url !== `${pathname}${search}${hash}`)
        window.history.replaceState(null, "", url);
    } catch {
      // A sandboxed frame may refuse; the panel is open either way.
    }
  }, 0);
}

// --- Start -----------------------------------------------------------------

function readViewport() {
  const viewportWidth = window.innerWidth;
  const wide =
    typeof window.matchMedia === "function"
      ? window.matchMedia(`(min-width: ${ASK_DOCK_MIN_VIEWPORT}px)`).matches
      : viewportWidth >= ASK_DOCK_MIN_VIEWPORT;
  if (wide !== core.wide || viewportWidth !== core.viewportWidth) {
    commit({ wide, viewportWidth });
  }
}

function listen(
  target: EventTarget,
  type: string,
  handler: () => void,
  options?: AddEventListenerOptions,
) {
  target.addEventListener(type, handler, options);
  teardown.push(() => target.removeEventListener(type, handler, options));
}

/** Starts the store in the browser (idempotent). */
function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  readViewport();
  listen(window, "resize", readViewport);
  listen(window, "pagehide", onPageHide);
  if (isPrerendering()) {
    listen(document, "prerenderingchange", hydrate, { once: true });
  } else {
    hydrate();
  }
}

// --- Conversation ------------------------------------------------------------

let idCounter = 0;
function newId(): string {
  idCounter += 1;
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${Date.now().toString(36)}-${idCounter}-${random}`;
}

/** A question as the agent gets it, before any page line (agentMessage). */
function sentText(user: { text: string; sent?: string }): string {
  return user.sent ?? user.text;
}

/**
 * The message as the agent gets it. Bri's client sends only the message,
 * so an attached page goes in it: the page's title on a line after the
 * question. The agent's workflow router runs its patterns over the whole
 * message (a match can't span lines) and answers a match with a canned
 * template, so the title gets its own line and the URL never goes in.
 * Skipped when the message would pass the agent's 4,000 characters (it
 * counts code points).
 */
function agentMessage(text: string, page: AskPageContext | null): string {
  const title = page?.title.replace(/\s+/g, " ").trim().slice(0, 200) ?? "";
  if (!title) return text;
  const message = `${text}\n\n(Asked on the docs page “${title}”.)`;
  return [...message].length <= ASK_MAX_MESSAGE_CHARS ? message : text;
}

/**
 * Bri's client answers a question sent without a conversation from its
 * answer cache when the same words were asked that way before (after New
 * chat, a suggestion or a code block's Ask again): no conversation, no
 * run id, and the next question has nothing to follow on. Cleared as each
 * question goes out without one, so it reaches the agent and starts one.
 */
function forgetCachedAnswers() {
  try {
    session()?.removeItem(ASK_SOLANA_ANSWER_CACHE_KEY);
  } catch {
    // Blocked storage: Bri's client can't cache either.
  }
}

function startTurn(question: QueuedQuestion) {
  const { text, pageContext, sent, quote } = question;
  const conversationId = core.conversationId;
  // Sent without the dropped conversation: the answer says so.
  const carried = conversationId === null ? core.pendingReset : null;
  if (conversationId === null) forgetCachedAnswers();
  const user: AskUserMessage = {
    id: newId(),
    role: "user",
    text,
    ...(pageContext ? { pageContext } : {}),
    ...(sent !== undefined && sent !== text ? { sent } : {}),
    ...(quote ? { quote } : {}),
  };
  const assistant: AskAssistantMessage = {
    id: newId(),
    role: "assistant",
    state: "pending",
    status: "preparing",
    text: "",
    citations: [],
    codeFollowups: null,
    runId: null,
    ...(carried ? { conversationReset: carried } : {}),
  };
  const abort = new AbortController();
  controller = abort;
  activeId = assistant.id;
  commit(
    { messages: [...core.messages, user, assistant], busy: true },
    { saveThread: "now" },
  );
  const id = assistant.id;
  const live = () => activeId === id;

  const message = agentMessage(sentText(user), pageContext);
  const surface = snapshot.layout;
  /**
   * Drops the conversation this turn went out in, unless it already moved
   * on; the next answer sent without it says why (`reason`).
   */
  const dropConversation = (reason: AskConversationReset) => {
    if (conversationId === null || core.conversationId !== conversationId)
      return false;
    commit(
      { conversationId: null, pendingReset: reason },
      { saveThread: "now" },
    );
    return true;
  };
  trackAskSolana("docs_ai_message_sent", {
    conversation_id: core.conversationId,
    message_length: message.length,
    surface,
  });

  void streamChat({
    message,
    conversationId,
    // Stop aborts the request; the client then returns without a callback.
    signal: abort.signal,
    handlers: {
      onTiming: (timing) => {
        trackAskSolana("docs_ai_timing", {
          phase: timing.phase,
          elapsed_ms: timing.elapsedMs,
          detail: timing.detail ?? undefined,
          conversation_id: core.conversationId,
          surface,
        });
      },
      onStatus: (stage) => {
        if (!live()) return;
        updateMessage(id, (m) => {
          // Forward only: reading a page after searching, or a late stage
          // once text shows, does not send the row back.
          const status = advanceAskStatus(m.status, askStatusForStage(stage));
          return status === m.status ? m : { ...m, status };
        });
      },
      onDelta: (delta) => {
        if (!live()) return;
        updateMessage(id, (m) => ({
          ...m,
          state: "streaming",
          text: m.text + delta,
          status: m.status === "visual" && !m.ui ? "visual" : "writing",
        }));
      },
      onUiStatus: () => {
        if (!live()) return;
        updateMessage(id, (m) =>
          m.ui ? m : { ...m, state: "streaming", status: "visual" },
        );
      },
      onGenerativeUi: (ui) => {
        if (!live()) return;
        updateMessage(id, (m) => ({
          ...m,
          state: "streaming",
          ui,
          status: "writing",
        }));
      },
      onDone: (payload) => {
        if (!live()) return;
        finishTurn(
          id,
          (m) => ({
            ...m,
            state: "done",
            status: undefined,
            text: payload.response ?? m.text,
            ...(payload.generativeUi ? { ui: payload.generativeUi } : {}),
            citations: toAskCitations(payload.citations, currentLocale()),
            codeFollowups: payload.codeFollowups,
            runId: payload.runId,
          }),
          payload.conversationId,
        );
      },
      // Bri's client dropped the conversation: its session was rejected
      // (the question went again, without it), or the agent no longer has
      // it (conversation_not_found follows, which says so itself).
      onConversationReset: () => {
        if (dropConversation("session") && live())
          updateMessage(id, (m) => ({ ...m, conversationReset: "session" }));
      },
      onError: (message) => {
        if (!live()) return;
        const error = askErrorKindFor(message);
        // A full conversation takes no more questions: the next starts a
        // new one (or New chat does), and says so if asked here.
        if (error === "conversationFull") dropConversation("full");
        // Its line says the chat expired: the next answer needn't.
        if (error === "conversationNotFound" && core.conversationId === null)
          commit({ pendingReset: null }, { saveThread: "now" });
        finishTurn(id, (m) => ({
          ...withoutReset(m),
          state: "error",
          status: undefined,
          error,
        }));
      },
    },
  }).finally(() => {
    // streamChat always ends in onDone or onError unless aborted; this is a backstop.
    if (live()) {
      finishTurn(id, (m) => ({
        ...withoutReset(m),
        state: "error",
        status: undefined,
        error: "generic",
      }));
    }
  });
}

/**
 * A turn that failed or was stopped answered nothing, so it doesn't say it
 * answered without the conversation: the next turn does (pendingReset).
 */
function withoutReset({
  conversationReset: _reset,
  ...message
}: AskAssistantMessage): AskAssistantMessage {
  return message;
}

function finishTurn(
  id: string,
  update: (message: AskAssistantMessage) => AskAssistantMessage,
  conversationId?: string | null,
) {
  activeId = null;
  controller = null;
  const messages = core.messages.map((message) =>
    message.id === id && message.role === "assistant"
      ? update(message)
      : message,
  );
  commit(
    {
      messages,
      busy: false,
      conversationId: conversationId ?? core.conversationId,
      // A new conversation: nothing left to say about the dropped one.
      ...(conversationId ? { pendingReset: null } : {}),
    },
    { saveThread: "now" },
  );
  passOnAnswer(id, core.messages);
  drainQueue();
}

/** The thread with answer `id` changed by `patch`. */
function withAnswer(id: string, patch: Partial<AskAssistantMessage>) {
  return core.messages.map((message) =>
    message.id === id && message.role === "assistant"
      ? { ...message, ...patch }
      : message,
  );
}

function drainQueue() {
  const next = queue.shift();
  if (next) startTurn(next);
}

// --- Actions -----------------------------------------------------------------

function open(options: AskOpenOptions = {}) {
  start();
  const page =
    options.aboutPage === true
      ? readPageContext()
      : isAskPageContext(options.aboutPage)
        ? options.aboutPage
        : null;
  const opening = !core.open;
  const quote = options.selection ? toQuote(options.selection) : null;
  // The quote keeps the page it was selected on, sent as an about-page
  // question sends its page, even if the reader moves on before sending.
  const quotePage = quote ? readPageContext() : null;
  commit({
    open: true,
    ...(page ? { pageContext: page } : {}),
    ...(quote
      ? {
          composerQuote: quotePage
            ? { ...quote, pageContext: quotePage }
            : quote,
        }
      : {}),
  });
  if (opening) trackAskSolana("docs_ai_chat_opened", { view: "chat" });
  prewarmAskSession();

  const code = options.code?.trim();
  const question = options.question?.trim();
  if (code) {
    const language = fenceLanguage(options.language);
    const fenced = `\`\`\`${language}\n${code.slice(0, ASK_MAX_CODE_CHARS)}\n\`\`\``;
    // Shown with the page's title; sent without it, and without the page.
    ask(`${prompts.explainCode(currentPageTitle())}\n\n${fenced}`, null, {
      sent: `${prompts.explainCodeSent()}\n\n${fenced}`,
    });
  } else if (question) {
    send(question, { pageContext: null });
  } else {
    focusComposer();
  }
}

function close() {
  commit({ open: false, fullscreen: false });
}

function toggle() {
  if (core.open) close();
  else open();
}

function setFullscreen(fullscreen: boolean) {
  start();
  commit({ fullscreen, ...(fullscreen ? { open: true } : {}) });
}

function toggleFullscreen() {
  setFullscreen(!(core.open && core.fullscreen));
}

/**
 * Leaves this thread in localStorage for a tab the full-screen link may
 * open (./handoff.ts). Called as the browser may open it: pointer down,
 * middle click, context menu, a modified click or Enter, a drag.
 */
function prepareHandoff() {
  if (!core.hydrated || isPrerendering()) return;
  const savedAt = handOver(core.threadId, core.messages);
  if (savedAt === null) return;
  sharedAnswer = activeId
    ? {
        threadId: core.threadId,
        answerId: activeId,
        until: savedAt + ASK_HANDOFF_TTL_MS,
        released: false,
      }
    : null;
}

/** Writes the handoff for `threadId`; returns its `savedAt`, or null. */
function handOver(threadId: string, messages: AskMessage[]): number | null {
  if (handoffTimer) clearTimeout(handoffTimer);
  handoffTimer = null;
  const savedAt = writeHandoff(local(), threadId, {
    messages: messages.slice(-ASK_MAX_STORED_MESSAGES),
    conversationId: core.conversationId,
    pendingReset: core.pendingReset,
    pageContext: core.pageContext,
    composerDraft: core.composerDraft,
    composerQuote: core.composerQuote,
  });
  lastHandoff = savedAt === null ? null : { threadId, savedAt };
  return savedAt;
}

/**
 * The shared answer `id` ended (in `messages`): hands the thread over again,
 * so a new tab waiting for it (followAnswer) takes the end, and a tab still
 * loading gets it whole. Released as the first was after a plain click.
 */
function passOnAnswer(id: string, messages: AskMessage[]) {
  const shared = sharedAnswer;
  if (shared?.answerId !== id) return;
  sharedAnswer = null;
  if (Date.now() > shared.until) return;
  if (handOver(shared.threadId, messages) !== null && shared.released)
    releaseHandoff();
}

/**
 * A plain click expands in place, so the handoff its pointer down left is
 * not needed. Removed after a grace period rather than at once: a middle
 * click just before may have opened a tab that has not read it yet. A
 * newer handoff is left alone. The one passOnAnswer writes as a streaming
 * answer ends goes the same way.
 */
function releaseHandoff() {
  const left = lastHandoff;
  if (!left) return;
  if (sharedAnswer) sharedAnswer = { ...sharedAnswer, released: true };
  if (handoffTimer) clearTimeout(handoffTimer);
  handoffTimer = setTimeout(() => {
    handoffTimer = null;
    discardHandoff(local(), left.threadId, left.savedAt);
  }, HANDOFF_RELEASE_MS);
}

function saveWidthSoon() {
  if (widthSaveTimer) clearTimeout(widthSaveTimer);
  widthSaveTimer = setTimeout(() => {
    widthSaveTimer = null;
    try {
      local()?.setItem(ASK_STORAGE_KEYS.width, String(snapshot.width));
    } catch {
      // ignore
    }
  }, 200);
}

/** Sets the docked width (clamped). Saved for later visits. */
function setWidth(px: number) {
  if (!Number.isFinite(px)) return;
  start();
  const preferredWidth = clamp(
    Math.round(px),
    ASK_PANEL_WIDTH.min,
    widthMaxFor(core.viewportWidth),
  );
  if (preferredWidth === core.preferredWidth) return;
  commit({ preferredWidth });
  saveWidthSoon();
}

/** Back to the default width (double-click on the resize handle). */
function resetWidth() {
  start();
  if (widthSaveTimer) clearTimeout(widthSaveTimer);
  widthSaveTimer = null;
  try {
    local()?.removeItem(ASK_STORAGE_KEYS.width);
  } catch {
    // ignore
  }
  commit({ preferredWidth: ASK_PANEL_WIDTH.default });
}

/**
 * Sends (or queues) a question. Uses and clears the attached page unless
 * `options.pageContext` says otherwise. Queued while an answer streams.
 */
function send(text: string, options: AskSendOptions = {}): AskSendResult {
  start();
  const usesAttached = options.pageContext === undefined;
  const pageContext = usesAttached
    ? core.pageContext
    : (options.pageContext ?? null);
  return ask(text, pageContext, { clearAttached: usesAttached });
}

/**
 * Sends (or queues) one question. `sent` is what goes out when it isn't
 * `text`; `clearAttached` drops the composer's page chip once accepted.
 */
function ask(
  text: string,
  pageContext: AskPageContext | null,
  options: { sent?: string; quote?: AskQuote; clearAttached?: boolean } = {},
): AskSendResult {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, reason: "empty" };
  const question: QueuedQuestion = {
    text: trimmed,
    pageContext,
    ...(options.sent ? { sent: options.sent } : {}),
    ...(options.quote ? { quote: options.quote } : {}),
  };
  // The limit applies to what is sent; the page's line is left out when it
  // doesn't fit (agentMessage).
  if (sentText(question).length > ASK_MAX_MESSAGE_CHARS) {
    return { ok: false, reason: "tooLong" };
  }
  if (options.clearAttached && core.pageContext) commit({ pageContext: null });
  if (core.busy) {
    queue.push(question);
    commit();
    return { ok: true, queued: true };
  }
  startTurn(question);
  return { ok: true, queued: false };
}

/**
 * Sends the composer's draft, and its quote if there is one, and clears
 * them when accepted. A quote without a draft asks explainSelection.
 */
function submitComposer(): AskSendResult {
  const quote = core.composerQuote;
  const result = quote ? sendQuote(quote) : send(core.composerDraft);
  if (result.ok) commit({ composerDraft: "", composerQuote: null });
  return result;
}

/**
 * The quote ahead of the reader's words, as `sent`; the bubble shows the
 * words with the quote above them. Its page goes as an attached page does
 * (agentMessage), else the attached page's, and the page chip goes as with
 * any send.
 */
function sendQuote({ pageContext, ...quote }: AskComposerQuote) {
  start();
  const question = core.composerDraft.trim() || prompts.explainSelection();
  return ask(question, pageContext ?? core.pageContext, {
    sent: quotedQuestion(quote, question),
    quote,
    clearAttached: true,
  });
}

/** Stops the streaming answer, keeping what arrived; queued questions follow. */
function stop() {
  if (!activeId) return;
  const id = activeId;
  controller?.abort();
  finishTurn(id, (m) => ({
    ...withoutReset(m),
    state: "stopped",
    status: undefined,
  }));
}

/**
 * Asks a question again: "Ask again" on an answer, "Try again" on an error.
 * The latest answer is replaced in place; an older one gets a new turn at
 * the end.
 */
function retry(messageId: string) {
  start();
  const index = core.messages.findIndex((message) => message.id === messageId);
  if (index === -1) return;
  let userIndex = index;
  while (userIndex >= 0 && core.messages[userIndex]?.role !== "user")
    userIndex--;
  const user = core.messages[userIndex];
  if (!user || user.role !== "user") return;
  const question: QueuedQuestion = {
    text: user.text,
    pageContext: user.pageContext ?? null,
    ...(user.sent ? { sent: user.sent } : {}),
    ...(user.quote ? { quote: user.quote } : {}),
  };

  if (core.busy) {
    queue.push(question);
    commit();
    return;
  }
  const answerIndex =
    core.messages[index]?.role === "assistant" ? index : index + 1;
  if (answerIndex >= core.messages.length - 1) {
    // The conversation stays, even for the only question: the questions
    // after it follow on from it.
    commit({ messages: core.messages.slice(0, userIndex) });
  }
  startTurn(question);
}

/** New chat: stops any answer and clears the conversation. */
function reset() {
  start();
  if (activeId)
    passOnAnswer(
      activeId,
      withAnswer(activeId, { state: "stopped", status: undefined }),
    );
  controller?.abort();
  controller = null;
  activeId = null;
  queue = [];
  commit(
    {
      messages: [],
      conversationId: null,
      pendingReset: null,
      busy: false,
      pageContext: null,
      composerDraft: "",
      composerQuote: null,
      focusRequest: core.focusRequest + 1,
      // A new thread, so a new full-screen link.
      threadId: newThreadId(),
    },
    { saveThread: "now" },
  );
}

/**
 * Records that answer `messageId`'s refused question went back in the
 * composer, so it does so once (AskError), across reloads too.
 */
function markQuestionRestored(messageId: string) {
  updateMessage(
    messageId,
    (m) => (m.questionRestored ? m : { ...m, questionRestored: true }),
    { saveThread: "now" },
  );
}

/** Rates an answer once per choice; the panel thanks the reader either way. */
function rate(messageId: string, rating: AskRating) {
  const message = core.messages.find((m) => m.id === messageId);
  if (!message || message.role !== "assistant" || !message.runId) return;
  if (message.rating === rating) return;
  const runId = message.runId;
  updateMessage(messageId, (m) => ({ ...m, rating }), { saveThread: "now" });
  trackAskSolana("docs_ai_feedback", { run_id: runId, rating });
  void sendFeedback({ runId, rating });
}

/** Attaches a page to the next question (null removes the chip). */
function setPageContext(pageContext: AskPageContext | null) {
  start();
  commit({ pageContext });
}

/** Attaches the current docs page; false off docs pages. */
function attachCurrentPage(): boolean {
  start();
  const page = readPageContext();
  if (!page) return false;
  commit({
    open: true,
    pageContext: page,
    focusRequest: core.focusRequest + 1,
  });
  return true;
}

function setComposerDraft(composerDraft: string) {
  if (composerDraft !== core.composerDraft) commit({ composerDraft });
}

/** Attaches a quote to the next question as it is (null removes the card). */
function setComposerQuote(composerQuote: AskComposerQuote | null) {
  start();
  commit({ composerQuote });
}

function focusComposer() {
  commit({ focusRequest: core.focusRequest + 1 });
}

function setPrompts(next: Partial<AskPrompts>) {
  prompts = { ...prompts, ...next };
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  start();
  return () => {
    listeners.delete(listener);
  };
}

export const askStore = {
  getState: (): AskState => snapshot,
  /** For useSyncExternalStore's server snapshot: closed, empty. */
  getServerState: (): AskState => SERVER_STATE,
  subscribe,
  open,
  close,
  toggle,
  setFullscreen,
  toggleFullscreen,
  prepareHandoff,
  releaseHandoff,
  setWidth,
  resetWidth,
  send,
  submitComposer,
  stop,
  retry,
  reset,
  rate,
  markQuestionRestored,
  setPageContext,
  attachCurrentPage,
  setComposerDraft,
  setComposerQuote,
  focusComposer,
  setPrompts,
  /** Mint a session ahead of the first question (launcher hover/focus). */
  warm: prewarmAskSession,
};

/**
 * Gives <html> to the store while an Ask AI root is mounted: the panel's
 * attributes (data-ask, --ask-w) are set at once, and removed when it
 * unmounts. A client-side move from the docs to a route without Ask AI
 * (the cookbook) would otherwise keep room for a panel that isn't there.
 * Call from the root island, before paint; returns the cleanup.
 */
export function connectAskHtml(): () => void {
  htmlReleased = false;
  appliedHtml = null;
  syncHtml();
  return () => {
    htmlReleased = true;
    appliedHtml = null;
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.removeAttribute("data-ask");
    root.style.removeProperty("--ask-w");
  };
}

/**
 * Routes the page's openers to the store: `openAskAi()` events (code
 * blocks, page actions, the search hand-off), clicks on
 * `[data-docs-ask-open]` (`="page"` attaches this page), and
 * `openAskSolanaWidget(question)` from @solana-com/ui-chrome (a request
 * made before this mounted is taken once, on connect). Call once from the
 * root island; returns the cleanup.
 */
export function connectAskAiEvents(): () => void {
  if (typeof window === "undefined") return () => undefined;
  const onOpen = (event: Event) =>
    open((event as CustomEvent<AskAiOpenOptions | undefined>).detail ?? {});
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const opener = (event.target as Element | null)?.closest?.(
      `[${DOCS_ASK_OPEN_ATTR}]`,
    );
    if (!opener) return;
    event.preventDefault();
    open({ aboutPage: opener.getAttribute(DOCS_ASK_OPEN_ATTR) === "page" });
  };
  const onWidgetSeed = () => {
    const seed = takeAskSolanaWidgetSeed();
    if (seed) open({ question: seed.query });
  };
  window.addEventListener(DOCS_ASK_OPEN_EVENT, onOpen);
  document.addEventListener("click", onClick);
  const unsubscribe = subscribeToAskSolanaWidget(onWidgetSeed);
  onWidgetSeed();
  return () => {
    window.removeEventListener(DOCS_ASK_OPEN_EVENT, onOpen);
    document.removeEventListener("click", onClick);
    unsubscribe();
  };
}

/** Tests only: drop all state and listeners. */
export function resetAskStoreForTests() {
  controller?.abort();
  for (const off of teardown) off();
  teardown = [];
  if (threadSaveTimer) clearTimeout(threadSaveTimer);
  if (widthSaveTimer) clearTimeout(widthSaveTimer);
  if (handoffTimer) clearTimeout(handoffTimer);
  threadSaveTimer = null;
  widthSaveTimer = null;
  handoffTimer = null;
  lastHandoff = null;
  sharedAnswer = null;
  controller = null;
  activeId = null;
  queue = [];
  prompts = DEFAULT_PROMPTS;
  started = false;
  appliedHtml = null;
  htmlReleased = false;
  listeners.clear();
  core = initialCore();
  snapshot = SERVER_STATE;
}
