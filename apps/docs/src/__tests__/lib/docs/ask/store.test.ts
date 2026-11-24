import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  sendFeedback,
  streamChat,
  type AskChatHandlers,
} from "@solana-com/ui-chrome/ask-solana/api";
import {
  ASK_SOLANA_ANALYTICS_EVENT,
  type AskSolanaAnalyticsDetail,
} from "@solana-com/ui-chrome/ask-solana/analytics";
import { openAskSolanaWidget } from "@solana-com/ui-chrome/ask-solana/widget-store";
import { DOCS_ASK_OPEN_EVENT, openAskAi } from "@/lib/docs/ask-ai";
import {
  ASK_PREPAINT_FULLSCREEN_TIMEOUT_MS,
  ASK_SOLANA_ANSWER_CACHE_KEY,
  ASK_STORAGE_KEYS,
  DOCS_ASK_PREPAINT_SCRIPT,
} from "@/lib/docs/ask/config";
import { ASK_HANDOFF_TTL_MS, isThreadId } from "@/lib/docs/ask/handoff";
import {
  askStore,
  connectAskAiEvents,
  resetAskStoreForTests,
  type AskAssistantMessage,
} from "@/lib/docs/ask/store";
import { useAskSelector, useAskState } from "@/lib/docs/ask/use-ask";

type ChatOptions = Parameters<typeof streamChat>[0];

/** Each streamChat call: what it was asked, and a way to end it. */
const chats: Array<{ options: ChatOptions; end: () => void }> = [];

vi.mock("@solana-com/ui-chrome/ask-solana/api", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("@solana-com/ui-chrome/ask-solana/api")
  >()),
  // Bri's client calls the handlers as the agent's events arrive, and
  // returns without a callback once aborted.
  streamChat: vi.fn(
    (options: ChatOptions) =>
      new Promise<void>((resolve) => {
        chats.push({ options, end: resolve });
        options.signal.addEventListener("abort", () => resolve());
      }),
  ),
  sendFeedback: vi.fn(async () => {}),
  prewarmAskSession: vi.fn(),
}));

/** The handlers of the latest (or the `index`th) chat. */
function chat(index = chats.length - 1): AskChatHandlers {
  return chats[index]!.options.handlers;
}

type DonePayload = Parameters<AskChatHandlers["onDone"]>[0];

const DONE: DonePayload = {
  response: null,
  runId: "101",
  conversationId: "7",
  citations: [],
  generativeUi: null,
  codeFollowups: null,
};

/** Answers the latest chat with `text` and ends it, as a finished stream does. */
async function answer(text: string, done: Partial<DonePayload> = {}) {
  const current = chats.at(-1)!;
  const { handlers } = current.options;
  handlers.onStatus?.("searching_docs");
  handlers.onDelta(text);
  handlers.onDone({ ...DONE, ...done });
  current.end();
  // Let the ended request settle (the store's backstop runs after it).
  await new Promise((resolve) => setTimeout(resolve, 0));
}

const html = document.documentElement;

/** A window `width` px wide, as the store reads it (resize, matchMedia). */
function setViewport(width: number) {
  Object.defineProperty(window, "innerWidth", {
    value: width,
    configurable: true,
  });
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: window.innerWidth >= Number(/(\d+)px/.exec(query)?.[1] ?? 0),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  window.dispatchEvent(new Event("resize"));
}

function lastAssistant(): AskAssistantMessage {
  const message = askStore.getState().messages.at(-1);
  if (message?.role !== "assistant") throw new Error("no assistant message");
  return message;
}

beforeEach(() => {
  resetAskStoreForTests();
  chats.length = 0;
  vi.mocked(streamChat).mockClear();
  vi.mocked(sendFeedback).mockClear();
  sessionStorage.clear();
  localStorage.clear();
  Object.defineProperty(window, "innerWidth", {
    value: 1024,
    configurable: true,
  });
  html.removeAttribute("data-ask");
  html.style.removeProperty("--ask-w");
  html.lang = "en";
});

afterEach(() => {
  resetAskStoreForTests();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("panel state", () => {
  it("serves a closed, empty snapshot to the server render", () => {
    expect(askStore.getServerState()).toMatchObject({
      hydrated: false,
      open: false,
      messages: [],
    });
  });

  it("opens, closes and toggles, asking the composer for focus on open", () => {
    const before = askStore.getState().focusRequest;
    askStore.open();
    expect(askStore.getState()).toMatchObject({
      hydrated: true,
      open: true,
      focusRequest: before + 1,
    });
    askStore.toggle();
    expect(askStore.getState().open).toBe(false);
    askStore.toggle();
    expect(askStore.getState().open).toBe(true);
    askStore.close();
    expect(askStore.getState().open).toBe(false);
  });

  it("docks from 1280px, overlays below, and mirrors the layout on <html>", () => {
    setViewport(1440);
    askStore.open();
    expect(askStore.getState()).toMatchObject({
      open: true,
      layout: "docked",
      width: 420,
    });
    expect(html.getAttribute("data-ask")).toBe("docked");
    expect(html.style.getPropertyValue("--ask-w")).toBe("420px");

    setViewport(1000);
    expect(askStore.getState().layout).toBe("overlay");
    expect(html.getAttribute("data-ask")).toBe("overlay");

    askStore.setFullscreen(true);
    expect(askStore.getState()).toMatchObject({
      layout: "fullscreen",
      prevLayout: "overlay",
    });
    expect(html.getAttribute("data-ask")).toBe("fullscreen");

    askStore.toggle();
    expect(askStore.getState()).toMatchObject({
      open: false,
      layout: "overlay",
    });
    expect(html.hasAttribute("data-ask")).toBe(false);
    expect(html.style.getPropertyValue("--ask-w")).toBe("");
    expect(JSON.parse(sessionStorage.getItem(ASK_STORAGE_KEYS.ui)!)).toEqual({
      open: false,
      fullscreen: false,
    });
  });

  it("clamps the width to 360..min(720, half the viewport) and saves it", () => {
    vi.useFakeTimers();
    setViewport(1440);
    askStore.open();
    askStore.setWidth(1000);
    expect(askStore.getState()).toMatchObject({
      width: 720,
      widthMin: 360,
      widthMax: 720,
    });
    setViewport(1300);
    expect(askStore.getState()).toMatchObject({ width: 650, widthMax: 650 });
    askStore.setWidth(100);
    expect(askStore.getState().width).toBe(360);
    askStore.setWidth(500);
    vi.advanceTimersByTime(250);
    expect(localStorage.getItem(ASK_STORAGE_KEYS.width)).toBe("500");
    expect(html.style.getPropertyValue("--ask-w")).toBe("500px");
    askStore.resetWidth();
    expect(askStore.getState().width).toBe(420);
    expect(localStorage.getItem(ASK_STORAGE_KEYS.width)).toBeNull();
  });

  it("restores the open panel and width from storage", () => {
    setViewport(1440);
    sessionStorage.setItem(ASK_STORAGE_KEYS.ui, JSON.stringify({ open: true }));
    localStorage.setItem(ASK_STORAGE_KEYS.width, "480");
    const { result } = renderHook(() => useAskState());
    expect(result.current).toMatchObject({
      hydrated: true,
      open: true,
      width: 480,
    });
    expect(html.getAttribute("data-ask")).toBe("docked");
  });
});

describe("prepaint script", () => {
  const run = () => new Function(DOCS_ASK_PREPAINT_SCRIPT)();
  const setPrerendering = (value: boolean) =>
    Object.defineProperty(document, "prerendering", {
      value,
      configurable: true,
    });

  beforeEach(() => {
    window.history.replaceState(null, "", "/developers/docs/core/accounts");
  });

  afterEach(() => {
    window.history.replaceState(null, "", "/");
    setPrerendering(false);
  });

  it("docks before paint when the panel was left open on a wide screen", () => {
    setViewport(1440);
    sessionStorage.setItem(ASK_STORAGE_KEYS.ui, JSON.stringify({ open: true }));
    localStorage.setItem(ASK_STORAGE_KEYS.width, "900");
    run();
    expect(html.getAttribute("data-ask")).toBe("docked");
    expect(html.style.getPropertyValue("--ask-w")).toBe("720px");
  });

  it("does nothing when closed or narrow", () => {
    setViewport(1440);
    run();
    window.history.replaceState(null, "", "/developers/docs?ask=docked");
    run();
    sessionStorage.setItem(ASK_STORAGE_KEYS.ui, JSON.stringify({ open: true }));
    setViewport(1200);
    run();
    expect(html.hasAttribute("data-ask")).toBe(false);
  });

  it("hides the page for a full-screen link at any width, whatever was stored", () => {
    setViewport(390);
    sessionStorage.setItem(
      ASK_STORAGE_KEYS.ui,
      JSON.stringify({ open: false }),
    );
    window.history.replaceState(
      null,
      "",
      "/developers/docs/core/accounts?x=1&ask=full&askThread=abc#rent",
    );
    run();
    expect(html.getAttribute("data-ask")).toBe("fullscreen");
    expect(html.style.getPropertyValue("--ask-w")).toBe("");
  });

  it("hides the page for a panel left full screen, except while prerendering", () => {
    setViewport(1440);
    sessionStorage.setItem(
      ASK_STORAGE_KEYS.ui,
      JSON.stringify({ open: true, fullscreen: true }),
    );
    // This tab's storage may be stale in a prerender: the store decides.
    setPrerendering(true);
    run();
    expect(html.hasAttribute("data-ask")).toBe(false);
    // The link itself is not stale.
    window.history.replaceState(null, "", "/ja/developers/docs?ask=full");
    run();
    expect(html.getAttribute("data-ask")).toBe("fullscreen");
    html.removeAttribute("data-ask");
    window.history.replaceState(null, "", "/developers/docs");
    setPrerendering(false);
    run();
    expect(html.getAttribute("data-ask")).toBe("fullscreen");
  });

  it("leaves the page alone off the docs, where Inkeep answers", () => {
    setViewport(1440);
    sessionStorage.setItem(
      ASK_STORAGE_KEYS.ui,
      JSON.stringify({ open: true, fullscreen: false }),
    );
    for (const path of [
      "/developers",
      "/developers/cookbook/transactions/send-sol?ask=full",
      "/ja/developers/cookbook",
      "/developers/docsearch",
    ]) {
      window.history.replaceState(null, "", path);
      run();
      expect(html.hasAttribute("data-ask")).toBe(false);
    }
    window.history.replaceState(null, "", "/developers/docs");
    run();
    expect(html.getAttribute("data-ask")).toBe("docked");
  });

  it("shows the page again if the full-screen panel never mounts", () => {
    vi.useFakeTimers();
    window.history.replaceState(null, "", "/developers/docs?ask=full");
    run();
    vi.advanceTimersByTime(ASK_PREPAINT_FULLSCREEN_TIMEOUT_MS - 1);
    expect(html.getAttribute("data-ask")).toBe("fullscreen");
    vi.advanceTimersByTime(1);
    expect(html.hasAttribute("data-ask")).toBe(false);

    // Mounted: the store owns the attribute from then on.
    run();
    const panel = document.createElement("div");
    panel.setAttribute("data-ask-panel", "");
    document.body.appendChild(panel);
    vi.advanceTimersByTime(ASK_PREPAINT_FULLSCREEN_TIMEOUT_MS);
    expect(html.getAttribute("data-ask")).toBe("fullscreen");
    panel.remove();
  });
});

describe("prerendering", () => {
  afterEach(() => {
    Object.defineProperty(document, "prerendering", {
      value: false,
      configurable: true,
    });
  });

  it("waits for activation before reading storage or touching <html>", () => {
    Object.defineProperty(document, "prerendering", {
      value: true,
      configurable: true,
    });
    sessionStorage.setItem(
      ASK_STORAGE_KEYS.thread,
      JSON.stringify({ messages: [{ id: "1", role: "user", text: "Kept" }] }),
    );
    sessionStorage.setItem(ASK_STORAGE_KEYS.ui, JSON.stringify({ open: true }));
    html.setAttribute("data-ask", "docked");
    const listener = vi.fn();
    const unsubscribe = askStore.subscribe(listener);
    expect(askStore.getState()).toMatchObject({
      hydrated: false,
      open: false,
      messages: [],
    });
    expect(html.getAttribute("data-ask")).toBe("docked");

    Object.defineProperty(document, "prerendering", {
      value: false,
      configurable: true,
    });
    document.dispatchEvent(new Event("prerenderingchange"));
    expect(askStore.getState()).toMatchObject({
      hydrated: true,
      open: true,
      messages: [{ id: "1", role: "user", text: "Kept" }],
    });
    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });
});

describe("conversation", () => {
  it("streams an answer through Bri's client, attaching an early visual", async () => {
    const result = askStore.send("What is a PDA?");
    expect(result).toEqual({ ok: true, queued: false });
    expect(askStore.getState().busy).toBe(true);
    expect(lastAssistant()).toMatchObject({
      state: "pending",
      status: "preparing",
    });
    expect(chats[0]!.options).toMatchObject({
      message: "What is a PDA?",
      conversationId: null,
    });

    const handlers = chat();
    handlers.onStatus?.("session_start");
    handlers.onStatus?.("chat_connecting");
    expect(lastAssistant().status).toBe("preparing");
    handlers.onStatus?.("searching_docs");
    expect(lastAssistant().status).toBe("searching");
    handlers.onDelta("### Summary response\nA PDA");
    expect(lastAssistant()).toMatchObject({
      state: "streaming",
      status: "writing",
    });
    handlers.onUiStatus?.("building_visual");
    expect(lastAssistant().status).toBe("visual");
    const ui = {
      version: "solana-docs-ui/v1" as const,
      kind: "answer" as const,
      components: [{ type: "answer_intro" }],
    };
    handlers.onGenerativeUi?.(ui);
    expect(lastAssistant()).toMatchObject({ state: "streaming", ui });

    handlers.onDone({
      ...DONE,
      citations: [
        { title: "PDA", url: "/docs/core/pda" },
        { title: "PDA again", url: "/developers/docs/core/pda" },
      ],
    });
    expect(askStore.getState().busy).toBe(false);
    expect(lastAssistant()).toMatchObject({
      state: "done",
      status: undefined,
      text: "### Summary response\nA PDA",
      runId: "101",
      citations: [{ title: "PDA", url: "/developers/docs/core/pda" }],
      ui,
    });
    expect(askStore.getState().conversationId).toBe("7");
  });

  it("takes the full response from done, and links in the reader's locale", async () => {
    document.documentElement.lang = "ja";
    askStore.send("Q?");
    chat().onDelta("Draft");
    chat().onDone({
      ...DONE,
      response: "Final.",
      citations: [{ title: "PDA", url: "/docs/core/pda" }],
    });
    expect(lastAssistant()).toMatchObject({
      text: "Final.",
      citations: [{ title: "PDA", url: "/ja/developers/docs/core/pda" }],
    });
  });

  it("sends follow-ups with the conversation id", async () => {
    askStore.send("First?");
    await answer("First.");
    askStore.send("Second?");
    expect(chats[1]!.options).toMatchObject({
      message: "Second?",
      conversationId: "7",
    });
  });

  it("queues a question that arrives while an answer streams", async () => {
    askStore.send("First?");
    expect(askStore.send("Second?")).toEqual({ ok: true, queued: true });
    expect(askStore.getState().queued).toBe(1);
    expect(chats).toHaveLength(1);

    await answer("First answer.");
    expect(askStore.getState().messages).toHaveLength(4);
    expect(chats).toHaveLength(2);
    expect(askStore.getState().queued).toBe(0);
    await answer("Second answer.");
    expect(lastAssistant()).toMatchObject({
      state: "done",
      text: "Second answer.",
    });
  });

  it("stops an answer and keeps what arrived", () => {
    askStore.send("Long question?");
    const handlers = chat();
    handlers.onDelta("Partial");
    askStore.stop();
    expect(chats[0]!.options.signal.aborted).toBe(true);
    expect(askStore.getState().busy).toBe(false);
    expect(lastAssistant()).toMatchObject({
      state: "stopped",
      text: "Partial",
    });
    handlers.onDelta(" more");
    handlers.onDone(DONE);
    expect(lastAssistant()).toMatchObject({
      state: "stopped",
      text: "Partial",
    });
  });

  it("maps the client's error messages to error kinds", () => {
    const kinds = [
      "rate_limited",
      "request failed (503)",
      "request failed (413)",
      "request failed (409)",
      "conversation_full",
      "conversation_not_found",
      "Failed to fetch",
      "stream error",
    ].map((message) => {
      askStore.send("Question?");
      chat().onError(message);
      return lastAssistant().error;
    });
    expect(kinds).toEqual([
      "rateLimited",
      "unavailable",
      "tooLong",
      "conversationFull",
      "conversationFull",
      "conversationNotFound",
      "offline",
      "generic",
    ]);
    expect(lastAssistant()).toMatchObject({
      state: "error",
      status: undefined,
    });
  });

  it("drops the conversation Bri's client resets, and marks the answer", async () => {
    askStore.send("First?");
    await answer("First.");
    askStore.send("And how much does that cost?");
    expect(chats[1]!.options.conversationId).toBe("7");
    // A rejected session: the question goes again, without the conversation.
    chat().onConversationReset?.();
    expect(askStore.getState().conversationId).toBeNull();
    expect(lastAssistant().conversationReset).toBe("session");
    await answer("About 0.0015 SOL.", { conversationId: "8" });
    expect(lastAssistant()).toMatchObject({
      state: "done",
      conversationReset: "session",
    });
    expect(askStore.getState().conversationId).toBe("8");
    // Kept with the thread.
    const saved = JSON.parse(sessionStorage.getItem(ASK_STORAGE_KEYS.thread)!);
    expect(saved.messages.at(-1).conversationReset).toBe("session");
    expect(saved.pendingReset).toBeNull();
    askStore.send("Next?");
    expect(chats[2]!.options.conversationId).toBe("8");
    expect(lastAssistant().conversationReset).toBeUndefined();
  });

  it("says a renewed session on the answer that went without it, past a failed or stopped turn", async () => {
    askStore.send("First?");
    await answer("First.");
    askStore.send("Second?");
    chat().onConversationReset?.();
    // Bri's client's second send fails: nothing was answered, so no notice.
    chat().onError("request failed (503)");
    expect(lastAssistant()).toMatchObject({
      state: "error",
      error: "unavailable",
    });
    expect(lastAssistant().conversationReset).toBeUndefined();
    // Try again goes without the dropped conversation, and says so.
    askStore.retry(lastAssistant().id);
    expect(chats[2]!.options.conversationId).toBeNull();
    expect(lastAssistant().conversationReset).toBe("session");
    // Stopped, it answered nothing either; the next question carries it.
    askStore.stop();
    expect(lastAssistant().conversationReset).toBeUndefined();
    askStore.send("Third?");
    expect(lastAssistant().conversationReset).toBe("session");
    // An answer without a conversation (Bri's cache, say) leaves it pending.
    await answer("Third.", { conversationId: null });
    expect(lastAssistant().conversationReset).toBe("session");
    askStore.send("Fourth?");
    expect(lastAssistant().conversationReset).toBe("session");
    await answer("Fourth.", { conversationId: "8" });
    askStore.send("Fifth?");
    expect(chats.at(-1)!.options.conversationId).toBe("8");
    expect(lastAssistant().conversationReset).toBeUndefined();
  });

  it("says an expired chat once, as the error, with the conversation dropped", async () => {
    askStore.send("First?");
    await answer("First.");
    askStore.send("Second?");
    chat().onConversationReset?.();
    chat().onError("conversation_not_found");
    expect(lastAssistant()).toMatchObject({
      state: "error",
      error: "conversationNotFound",
    });
    expect(lastAssistant().conversationReset).toBeUndefined();
    askStore.send("Second, again?");
    expect(chats[2]!.options.conversationId).toBeNull();
    // The error said it: the answer doesn't again.
    expect(lastAssistant().conversationReset).toBeUndefined();
  });

  it("starts a new conversation after a full one, and says so on an answer asked here", async () => {
    askStore.send("First?");
    await answer("First.");
    askStore.send("Second?");
    chat().onError("conversation_full");
    expect(lastAssistant().error).toBe("conversationFull");
    expect(lastAssistant().conversationReset).toBeUndefined();
    expect(askStore.getState().conversationId).toBeNull();
    askStore.send("Third?");
    expect(chats[2]!.options.conversationId).toBeNull();
    expect(lastAssistant().conversationReset).toBe("full");
    await answer("Third.", { conversationId: "9" });
    expect(lastAssistant()).toMatchObject({
      state: "done",
      conversationReset: "full",
    });
    askStore.send("Fourth?");
    expect(chats[3]!.options.conversationId).toBe("9");
    expect(lastAssistant().conversationReset).toBeUndefined();
  });

  it("says nothing after a full conversation once New chat starts another", async () => {
    askStore.send("First?");
    await answer("First.");
    askStore.send("Second?");
    chat().onError("conversation_full");
    askStore.reset();
    askStore.send("Fresh?");
    expect(lastAssistant().conversationReset).toBeUndefined();
  });

  it("keeps a pending notice across a reload", async () => {
    askStore.send("First?");
    await answer("First.");
    askStore.send("Second?");
    chat().onError("conversation_full");
    expect(
      JSON.parse(sessionStorage.getItem(ASK_STORAGE_KEYS.thread)!).pendingReset,
    ).toBe("full");
    resetAskStoreForTests();
    askStore.send("Third?");
    expect(chats.at(-1)!.options.conversationId).toBeNull();
    expect(lastAssistant().conversationReset).toBe("full");
  });

  it("clears Bri's answer cache before a question goes out without a conversation", async () => {
    const cached = JSON.stringify([{ message: "first?", content: "Cached." }]);
    sessionStorage.setItem(ASK_SOLANA_ANSWER_CACHE_KEY, cached);
    askStore.send("First?");
    expect(sessionStorage.getItem(ASK_SOLANA_ANSWER_CACHE_KEY)).toBeNull();
    await answer("First.");
    // A follow-up in the conversation leaves it alone.
    sessionStorage.setItem(ASK_SOLANA_ANSWER_CACHE_KEY, cached);
    askStore.send("Second?");
    expect(sessionStorage.getItem(ASK_SOLANA_ANSWER_CACHE_KEY)).toBe(cached);
    await answer("Second.");
    // New chat's first question goes to the agent, not the cache.
    askStore.reset();
    askStore.send("First?");
    expect(sessionStorage.getItem(ASK_SOLANA_ANSWER_CACHE_KEY)).toBeNull();
  });

  it("puts a refused question back once per turn, across reloads", async () => {
    askStore.send("Too soon?");
    chat().onError("rate_limited");
    const id = lastAssistant().id;
    expect(lastAssistant().questionRestored).toBeUndefined();
    askStore.markQuestionRestored(id);
    expect(lastAssistant().questionRestored).toBe(true);
    resetAskStoreForTests();
    askStore.subscribe(() => undefined);
    expect(lastAssistant()).toMatchObject({ id, questionRestored: true });
  });

  it("keeps a newer conversation when an old request resets its own", async () => {
    askStore.send("First?");
    await answer("First.");
    askStore.send("Second?");
    const stale = chat();
    askStore.stop();
    askStore.send("Third?");
    await answer("Third.", { conversationId: "9" });
    // The stopped request's client reports its reset late.
    stale.onConversationReset?.();
    expect(askStore.getState().conversationId).toBe("9");
  });

  it("fails an answer the client ends without a word", async () => {
    askStore.send("Question?");
    chat().onDelta("Half");
    chats[0]!.end();
    await vi.waitFor(() => expect(askStore.getState().busy).toBe(false));
    expect(lastAssistant()).toMatchObject({
      state: "error",
      error: "generic",
      text: "Half",
    });
  });

  it("re-asks the latest question in place", async () => {
    askStore.send("Same?");
    await answer("One.");
    askStore.retry(lastAssistant().id);
    // In the same conversation, so the agent answers again rather than
    // Bri's client replaying its cached first answer.
    expect(chats[1]!.options).toMatchObject({
      message: "Same?",
      conversationId: "7",
    });
    await answer("Two.");
    expect(askStore.getState().messages.map((m) => m.text)).toEqual([
      "Same?",
      "Two.",
    ]);
  });

  it("re-asks an older question as a new turn", async () => {
    askStore.send("Q1?");
    await answer("A1.");
    const firstAnswer = lastAssistant().id;
    askStore.send("Q2?");
    await answer("A2.");
    askStore.retry(firstAnswer);
    expect(chats[2]!.options.conversationId).toBe("7");
    await answer("A1 again.");
    expect(askStore.getState().messages.map((m) => m.text)).toEqual([
      "Q1?",
      "A1.",
      "Q2?",
      "A2.",
      "Q1?",
      "A1 again.",
    ]);
  });

  it("moves the status row forward only, through the agent's stages", () => {
    askStore.send("What is a PDA?");
    const handlers = chat();
    handlers.onStatus?.("accepted");
    handlers.onStatus?.("searching_docs");
    expect(lastAssistant().status).toBe("searching");
    handlers.onStatus?.("reading_doc");
    handlers.onStatus?.("starting");
    expect(lastAssistant().status).toBe("searching");
    handlers.onStatus?.("cache_hit");
    expect(lastAssistant().status).toBe("writing");
    handlers.onDelta("A PDA");
    handlers.onStatus?.("using_tool");
    expect(lastAssistant()).toMatchObject({ text: "A PDA", status: "writing" });
  });

  it("rates answers with a run id once per choice", async () => {
    askStore.send("Q?");
    await answer("Answer.");
    const id = lastAssistant().id;
    askStore.rate(id, "up");
    askStore.rate(id, "up");
    expect(lastAssistant().rating).toBe("up");
    expect(sendFeedback).toHaveBeenCalledTimes(1);
    expect(sendFeedback).toHaveBeenCalledWith({ runId: "101", rating: "up" });
  });

  it("can't rate an answer without a run id", async () => {
    askStore.send("Q?");
    await answer("Answer.", { runId: null });
    askStore.rate(lastAssistant().id, "down");
    expect(lastAssistant().rating).toBeUndefined();
    expect(sendFeedback).not.toHaveBeenCalled();
  });

  it("resets to an empty conversation", async () => {
    askStore.send("Q?");
    await answer("Answer.");
    askStore.send("Still going?");
    const before = askStore.getState().focusRequest;
    askStore.reset();
    expect(chats[1]!.options.signal.aborted).toBe(true);
    expect(askStore.getState()).toMatchObject({
      messages: [],
      conversationId: null,
      busy: false,
      focusRequest: before + 1,
    });
  });

  it("rejects empty and over-long questions", () => {
    expect(askStore.send("   ")).toEqual({ ok: false, reason: "empty" });
    expect(askStore.send("x".repeat(4001))).toEqual({
      ok: false,
      reason: "tooLong",
    });
    expect(askStore.getState().messages).toEqual([]);
    expect(streamChat).not.toHaveBeenCalled();
  });

  it("sends the composer draft and clears it", () => {
    askStore.setComposerDraft("From the composer");
    expect(askStore.submitComposer()).toEqual({ ok: true, queued: false });
    expect(askStore.getState().composerDraft).toBe("");
    expect(askStore.getState().messages[0]).toMatchObject({
      role: "user",
      text: "From the composer",
    });
  });
});

describe("entry points", () => {
  function docsPage() {
    document.body.innerHTML =
      '<div id="content" data-page-title="Accounts" data-page-href="/developers/docs/core/accounts"></div>';
  }

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("asks about code, cut to 3,500 characters, showing the page title but sending neither it nor the page", async () => {
    docsPage();
    askStore.open({ code: `  ${"a".repeat(4000)}  ` });
    expect(askStore.getState().open).toBe(true);
    const fenced = `\`\`\`\n${"a".repeat(3500)}\n\`\`\``;
    const question = askStore.getState().messages[0];
    expect(question).toMatchObject({
      text: `Explain this code from Accounts:\n\n${fenced}`,
      sent: `Explain this code:\n\n${fenced}`,
    });
    expect(question).not.toHaveProperty("pageContext");
    // The agent's router would turn "Accounts" into a canned answer.
    expect(chats[0]!.options.message).toBe(`Explain this code:\n\n${fenced}`);
  });

  it("keeps a code block's language on the fence", () => {
    docsPage();
    askStore.open({ code: "let x = 1;", language: "rust" });
    expect(chats[0]!.options.message).toBe(
      "Explain this code:\n\n```rust\nlet x = 1;\n```",
    );
    // Not a language: left off.
    askStore.reset();
    askStore.open({ code: "let x = 1;", language: "rust\n```" });
    expect(chats[1]!.options.message).toBe(
      "Explain this code:\n\n```\nlet x = 1;\n```",
    );
  });

  it("sends a code question again without the title", () => {
    docsPage();
    askStore.open({ code: "let x;" });
    chat().onError("request failed (503)");
    expect(lastAssistant().state).toBe("error");
    askStore.retry(lastAssistant().id);
    expect(chats.map((c) => c.options.message)).toEqual([
      "Explain this code:\n\n```\nlet x;\n```",
      "Explain this code:\n\n```\nlet x;\n```",
    ]);
  });

  it("uses localized prompts", () => {
    askStore.setPrompts({ explainCode: (title) => `Explique (${title}) :` });
    document.title = "Doc";
    askStore.open({ code: "let x;" });
    expect(askStore.getState().messages[0]?.text).toBe(
      "Explique (Doc) :\n\n```\nlet x;\n```",
    );
  });

  it("attaches this page without sending, then sends its title with the next question", async () => {
    docsPage();
    const before = askStore.getState().focusRequest;
    askStore.open({ aboutPage: true });
    expect(askStore.getState()).toMatchObject({
      open: true,
      messages: [],
      pageContext: {
        title: "Accounts",
        url: "https://solana.com/developers/docs/core/accounts",
      },
      focusRequest: before + 1,
    });
    expect(chats).toHaveLength(0);

    askStore.send("What is rent here?");
    expect(askStore.getState().pageContext).toBeNull();
    expect(askStore.getState().messages[0]).toMatchObject({
      text: "What is rent here?",
      pageContext: { title: "Accounts" },
    });
    // Bri's client sends only the message: the page's title goes on its
    // own line, never its URL.
    expect(chats[0]!.options.message).toBe(
      "What is rent here?\n\n(Asked on the docs page “Accounts”.)",
    );
    await answer("About accounts.");

    // Asked again, the page goes with it again.
    askStore.retry(lastAssistant().id);
    expect(chats[1]!.options.message).toBe(
      "What is rent here?\n\n(Asked on the docs page “Accounts”.)",
    );
  });

  it("leaves the page out of a question it would push past 4,000 characters", () => {
    docsPage();
    askStore.open({ aboutPage: true });
    expect(askStore.send("x".repeat(4000))).toEqual({
      ok: true,
      queued: false,
    });
    expect(chats[0]!.options.message).toBe("x".repeat(4000));
    expect(askStore.getState().messages[0]).toMatchObject({
      pageContext: { title: "Accounts" },
    });
  });

  it("sends the search hand-off and follow-ups without the attached page", () => {
    docsPage();
    askStore.open({ aboutPage: true });
    askStore.open({ question: "How do fees work?" });
    expect(chats[0]!.options.message).toBe("How do fees work?");
    // Still attached for the reader's own next question.
    expect(askStore.getState().pageContext).toMatchObject({
      title: "Accounts",
    });
    askStore.setPageContext(null);
    expect(askStore.getState().pageContext).toBeNull();
    expect(askStore.attachCurrentPage()).toBe(true);
    expect(askStore.getState().pageContext?.title).toBe("Accounts");
    document.body.innerHTML = "";
    askStore.setPageContext(null);
    expect(askStore.attachCurrentPage()).toBe(false);
  });

  it("routes open events and [data-docs-ask-open] clicks", () => {
    const disconnect = connectAskAiEvents();
    window.dispatchEvent(
      new CustomEvent(DOCS_ASK_OPEN_EVENT, {
        detail: { question: "How do fees work?" },
      }),
    );
    expect(askStore.getState().open).toBe(true);
    expect(askStore.getState().messages[0]).toMatchObject({
      text: "How do fees work?",
    });

    askStore.close();
    document.body.innerHTML =
      '<button data-docs-ask-open=""><span>✨</span></button>';
    document
      .querySelector("button span")!
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(askStore.getState().open).toBe(true);
    expect(askStore.getState().pageContext).toBeNull();

    // `="page"` attaches this page.
    askStore.close();
    docsPage();
    document.body.insertAdjacentHTML(
      "beforeend",
      '<button data-docs-ask-open="page"><span>✨</span></button>',
    );
    document
      .querySelector("button span")!
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(askStore.getState()).toMatchObject({
      open: true,
      pageContext: { title: "Accounts" },
    });
    disconnect();
  });

  it("answers Bri's openAskSolanaWidget, including a request made before it connected", () => {
    openAskSolanaWidget("What is rent?");
    const disconnect = connectAskAiEvents();
    expect(askStore.getState().open).toBe(true);
    expect(chats[0]!.options.message).toBe("What is rent?");
    openAskSolanaWidget("And fees?");
    expect(askStore.getState().queued).toBe(1);
    disconnect();
    openAskSolanaWidget("Not taken here");
    expect(askStore.getState().queued).toBe(1);
  });
});

describe("selected text", () => {
  const ACCOUNTS = {
    title: "Accounts",
    url: "https://solana.com/developers/docs/core/accounts",
  };
  function docsPage() {
    document.body.innerHTML =
      '<div id="content" data-page-title="Accounts" data-page-href="/developers/docs/core/accounts"></div>';
  }

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("opens with the selection as a quote and focuses the composer, keeping the draft, never sending", () => {
    docsPage();
    askStore.setComposerDraft("Why?");
    const before = askStore.getState().focusRequest;
    askStore.open({
      selection: { text: "  Rent is   a\n\n  deposit,\tkept\u00a0back.  " },
    });
    expect(askStore.getState()).toMatchObject({
      open: true,
      composerDraft: "Why?",
      // Tidied: runs of spaces collapsed, a paragraph break kept as one
      // newline. Its page goes with it.
      composerQuote: {
        text: "Rent is a\ndeposit, kept back.",
        pageContext: ACCOUNTS,
      },
      // Not the page chip: the quote carries its page.
      pageContext: null,
      focusRequest: before + 1,
      messages: [],
    });
    expect(chats).toHaveLength(0);
  });

  it("replaces an earlier quote", () => {
    askStore.open({ selection: { text: "First" } });
    askStore.open({ selection: { text: "Second" } });
    expect(askStore.getState().composerQuote).toEqual({ text: "Second" });
    // Removed from the composer.
    askStore.setComposerQuote(null);
    expect(askStore.getState().composerQuote).toBeNull();
  });

  it("ignores a selection of whitespace or a single character", () => {
    askStore.open({ selection: { text: " \n\t " } });
    askStore.open({ selection: { text: " x " } });
    expect(askStore.getState()).toMatchObject({
      open: true,
      composerQuote: null,
    });
  });

  it("cuts a long quote at a word, with an ellipsis", () => {
    const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(" ");
    askStore.open({ selection: { text: words } });
    const text = askStore.getState().composerQuote!.text;
    expect(text.length).toBeLessThanOrEqual(1200);
    expect(text).toMatch(/ word\d+…$/);
    expect(words.startsWith(text.slice(0, -1))).toBe(true);
    expect(words.charAt(text.length - 1)).toBe(" ");
  });

  it("sends the quote ahead of the question, with its page, and clears it", () => {
    docsPage();
    askStore.open({
      selection: { text: "Rent is a deposit.\nIt comes back." },
    });
    askStore.setComposerDraft("  Why is it needed?  ");
    expect(askStore.submitComposer()).toEqual({ ok: true, queued: false });
    const sent = "> Rent is a deposit.\n> It comes back.\n\nWhy is it needed?";
    expect(askStore.getState()).toMatchObject({
      composerDraft: "",
      composerQuote: null,
    });
    // The bubble shows the words with the quote above them.
    expect(askStore.getState().messages[0]).toEqual({
      id: expect.any(String),
      role: "user",
      text: "Why is it needed?",
      pageContext: ACCOUNTS,
      sent,
      quote: { text: "Rent is a deposit.\nIt comes back." },
    });
    // Bri's client sends only the message: the quote's page goes on its
    // own line, as an attached page's does.
    expect(chats[0]!.options.message).toBe(
      `${sent}\n\n(Asked on the docs page “Accounts”.)`,
    );
  });

  it("asks the localized explainSelection without a question", () => {
    askStore.setPrompts({ explainSelection: () => "Explique ça" });
    askStore.open({ selection: { text: "Rent is a deposit." } });
    expect(askStore.submitComposer()).toMatchObject({ ok: true });
    expect(askStore.getState().messages[0]).toMatchObject({
      text: "Explique ça",
      sent: "> Rent is a deposit.\n\nExplique ça",
    });
    // No quote and no words: nothing to send.
    expect(askStore.submitComposer()).toEqual({ ok: false, reason: "empty" });
  });

  it("keeps code as it is, fenced with its language (longer than its own fences)", async () => {
    askStore.open({
      selection: {
        text: "\n  let x = 1;\n\n    y();\n\n",
        code: true,
        language: "rust",
      },
    });
    expect(askStore.getState().composerQuote).toEqual({
      text: "  let x = 1;\n\n    y();",
      code: true,
      language: "rust",
    });
    askStore.submitComposer();
    expect(chats[0]!.options.message).toBe(
      "```rust\n  let x = 1;\n\n    y();\n```\n\nExplain this",
    );
    await answer("Explained.");
    askStore.open({
      selection: { text: "md = `\n```\n`", code: true, language: "<b>" },
    });
    askStore.submitComposer();
    expect(chats[1]!.options.message).toBe(
      "````\nmd = `\n```\n`\n````\n\nExplain this",
    );
  });

  it("counts the quote against the length limit, keeping both when refused", () => {
    askStore.open({ selection: { text: "q".repeat(1000) } });
    // "> " + 1,000 + "\n\n" + the question: 4,001 characters.
    askStore.setComposerDraft("x".repeat(2997));
    expect(askStore.submitComposer()).toEqual({
      ok: false,
      reason: "tooLong",
    });
    expect(askStore.getState()).toMatchObject({
      composerDraft: "x".repeat(2997),
      composerQuote: { text: "q".repeat(1000) },
      messages: [],
    });
    askStore.setComposerDraft("x".repeat(2996));
    expect(askStore.submitComposer()).toMatchObject({ ok: true });
  });

  it("sends the quote again on retry", () => {
    docsPage();
    askStore.open({ selection: { text: "Rent is a deposit." } });
    askStore.setComposerDraft("Why?");
    askStore.submitComposer();
    chat().onError("request failed (503)");
    expect(lastAssistant().state).toBe("error");
    askStore.retry(lastAssistant().id);
    const sent =
      "> Rent is a deposit.\n\nWhy?\n\n(Asked on the docs page “Accounts”.)";
    expect(chats.map((c) => c.options.message)).toEqual([sent, sent]);
    expect(askStore.getState().messages[0]).toMatchObject({
      quote: { text: "Rent is a deposit." },
    });
  });

  it("clears the quote with New chat, and routes openAskAi selections", () => {
    const disconnect = connectAskAiEvents();
    openAskAi({ selection: { text: "Rent is a deposit." } });
    expect(askStore.getState()).toMatchObject({
      open: true,
      composerQuote: { text: "Rent is a deposit." },
    });
    askStore.reset();
    expect(askStore.getState().composerQuote).toBeNull();
    disconnect();
  });
});

describe("full-screen link", () => {
  const ACCOUNTS = {
    title: "Accounts",
    url: "https://solana.com/developers/docs/core/accounts",
  };
  const ID = "0123456789abcdef01234567";
  const HANDOFF = `${ASK_STORAGE_KEYS.handoff}${ID}`;
  const LINK = `/developers/docs/core/accounts?x=1&ask=full&askThread=${ID}#rent`;
  const handedOff = ({
    savedAt = Date.now(),
    finished = false,
    conversationId = "7",
  } = {}) =>
    JSON.stringify({
      v: 1,
      savedAt,
      messages: [
        {
          id: "u1",
          role: "user",
          text: "What is a PDA?",
          quote: { text: "A program derived address" },
        },
        {
          id: "a1",
          role: "assistant",
          state: "done",
          text: "An address with no key.",
          runId: "5",
        },
        { id: "u2", role: "user", text: "And rent?" },
        finished
          ? {
              id: "a2",
              role: "assistant",
              state: "done",
              text: "Rent is a deposit.",
              runId: "6",
            }
          : // Still streaming in the other tab.
            {
              id: "a2",
              role: "assistant",
              state: "streaming",
              status: "writing",
              text: "Rent is",
            },
      ],
      conversationId,
      pageContext: {
        title: "Accounts",
        url: "https://solana.com/developers/docs/core/accounts",
      },
      composerDraft: "Show me code",
      composerQuote: { text: "Rent is a deposit", pageContext: ACCOUNTS },
    });
  const ownThread = () =>
    sessionStorage.setItem(
      ASK_STORAGE_KEYS.thread,
      JSON.stringify({
        messages: [{ id: "o1", role: "user", text: "This tab's own" }],
        conversationId: "3",
      }),
    );
  const here = () => `${location.pathname}${location.search}${location.hash}`;

  beforeEach(() => setViewport(1440));

  afterEach(() => {
    window.history.replaceState(null, "", "/");
    Object.defineProperty(document, "prerendering", {
      value: false,
      configurable: true,
    });
  });

  it("opens full screen with the thread the link's tab left and cleans the URL", async () => {
    ownThread();
    localStorage.setItem(HANDOFF, handedOff());
    window.history.replaceState({ kept: true }, "", LINK);
    askStore.subscribe(() => undefined);

    const state = askStore.getState();
    expect(state).toMatchObject({
      hydrated: true,
      open: true,
      layout: "fullscreen",
      prevLayout: "docked",
      conversationId: "7",
      pageContext: {
        title: "Accounts",
        url: "https://solana.com/developers/docs/core/accounts",
      },
      composerDraft: "Show me code",
      // The quote waiting in the composer goes with it, and quotes asked.
      composerQuote: { text: "Rent is a deposit", pageContext: ACCOUNTS },
    });
    expect(state.messages[0]).toMatchObject({
      quote: { text: "A program derived address" },
    });
    expect(state.messages.map((m) => m.text)).toEqual([
      "What is a PDA?",
      "An address with no key.",
      "And rent?",
      "Rent is",
    ]);
    // The answer the other tab is still writing shows as still arriving
    // (see "waits for the answer…" below), not as broken.
    expect(lastAssistant()).toMatchObject({
      id: "a2",
      state: "streaming",
      status: "writing",
    });
    expect(lastAssistant().error).toBeUndefined();
    expect(state.busy).toBe(true);
    // The copy is this tab's own from now on.
    expect(isThreadId(state.threadId)).toBe(true);
    expect(state.threadId).not.toBe(ID);
    const saved = JSON.parse(sessionStorage.getItem(ASK_STORAGE_KEYS.thread)!);
    expect(saved).toMatchObject({
      conversationId: "7",
      threadId: state.threadId,
    });
    expect(saved.messages).toHaveLength(4);
    expect(JSON.parse(sessionStorage.getItem(ASK_STORAGE_KEYS.ui)!)).toEqual({
      open: true,
      fullscreen: true,
    });
    expect(html.getAttribute("data-ask")).toBe("fullscreen");

    await vi.waitFor(() =>
      expect(here()).toBe("/developers/docs/core/accounts?x=1#rent"),
    );
    expect(window.history.state).toBeNull();

    // Esc (Exit full screen) goes back to the docked panel.
    askStore.setFullscreen(false);
    expect(html.getAttribute("data-ask")).toBe("docked");
    expect(html.style.getPropertyValue("--ask-w")).toBe("420px");
  });

  it("opens full screen with this tab's own thread when the handoff is gone or expired", async () => {
    ownThread();
    localStorage.setItem(
      HANDOFF,
      handedOff({ savedAt: Date.now() - ASK_HANDOFF_TTL_MS - 1 }),
    );
    window.history.replaceState(null, "", LINK);
    askStore.subscribe(() => undefined);
    expect(askStore.getState()).toMatchObject({
      layout: "fullscreen",
      conversationId: "3",
    });
    expect(askStore.getState().messages.map((m) => m.text)).toEqual([
      "This tab's own",
    ]);
    expect(localStorage.getItem(HANDOFF)).toBeNull();
    await vi.waitFor(() =>
      expect(here()).toBe("/developers/docs/core/accounts?x=1#rent"),
    );
  });

  it("opens full screen, empty, from a link without a thread", async () => {
    window.history.replaceState(null, "", "/ja/developers?ask=full");
    askStore.subscribe(() => undefined);
    expect(askStore.getState()).toMatchObject({
      layout: "fullscreen",
      messages: [],
    });
    await vi.waitFor(() => expect(here()).toBe("/ja/developers"));
  });

  it("waits for activation before taking a handoff or touching the URL", async () => {
    Object.defineProperty(document, "prerendering", {
      value: true,
      configurable: true,
    });
    localStorage.setItem(HANDOFF, handedOff());
    window.history.replaceState(null, "", LINK);
    askStore.subscribe(() => undefined);
    askStore.prepareHandoff();
    expect(askStore.getState()).toMatchObject({ hydrated: false, open: false });
    expect(localStorage.getItem(HANDOFF)).not.toBeNull();
    expect(
      Object.keys(localStorage).filter((key) =>
        key.startsWith(ASK_STORAGE_KEYS.handoff),
      ),
    ).toEqual([HANDOFF]);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(here()).toBe(LINK);

    Object.defineProperty(document, "prerendering", {
      value: false,
      configurable: true,
    });
    document.dispatchEvent(new Event("prerenderingchange"));
    expect(askStore.getState()).toMatchObject({
      hydrated: true,
      layout: "fullscreen",
      conversationId: "7",
    });
    expect(askStore.getState().messages).toHaveLength(4);
    await vi.waitFor(() =>
      expect(here()).toBe("/developers/docs/core/accounts?x=1#rent"),
    );
  });

  it("gives the thread to every tab opened from the link in time, then deletes it", () => {
    vi.useFakeTimers();
    localStorage.setItem(HANDOFF, handedOff({ finished: true }));
    window.history.replaceState(null, "", LINK);
    askStore.subscribe(() => undefined);
    expect(askStore.getState().messages).toHaveLength(4);
    expect(askStore.getState().busy).toBe(false);
    // A second Ctrl-click's tab, loading a moment later.
    vi.advanceTimersByTime(250);
    resetAskStoreForTests();
    sessionStorage.clear();
    window.history.replaceState(null, "", LINK);
    askStore.subscribe(() => undefined);
    expect(askStore.getState()).toMatchObject({
      layout: "fullscreen",
      conversationId: "7",
    });
    expect(askStore.getState().messages.map((m) => m.id)).toEqual([
      "u1",
      "a1",
      "u2",
      "a2",
    ]);
    vi.advanceTimersByTime(14_999);
    expect(localStorage.getItem(HANDOFF)).not.toBeNull();
    vi.advanceTimersByTime(1);
    expect(localStorage.getItem(HANDOFF)).toBeNull();
  });

  it("waits for the answer the link's tab was still writing, then takes it", async () => {
    localStorage.setItem(HANDOFF, handedOff({ conversationId: "" }));
    window.history.replaceState(null, "", LINK);
    askStore.subscribe(() => undefined);
    expect(askStore.getState()).toMatchObject({
      busy: true,
      conversationId: null,
    });
    // Asked here meanwhile: it waits rather than going out in a
    // conversation the other tab is still answering in.
    expect(askStore.send("Show me code")).toEqual({ ok: true, queued: true });
    expect(chats).toHaveLength(0);
    const changed = (key: string, newValue: string | null) =>
      window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
    changed("docs-ask:other", "x");
    changed(HANDOFF, handedOff());
    changed(HANDOFF, null);
    expect(lastAssistant()).toMatchObject({ id: "a2", state: "streaming" });

    changed(HANDOFF, handedOff({ finished: true, conversationId: "8" }));
    expect(askStore.getState().messages[3]).toMatchObject({
      id: "a2",
      state: "done",
      text: "Rent is a deposit.",
      runId: "6",
    });
    expect(askStore.getState().conversationId).toBe("8");
    // Then the question asked here, in the same conversation.
    expect(chats).toHaveLength(1);
    expect(chats[0]!.options).toMatchObject({
      // With the page the link's tab had attached.
      message: "Show me code\n\n(Asked on the docs page “Accounts”.)",
      conversationId: "8",
    });
    await answer("Here is code.");
    expect(lastAssistant().text).toBe("Here is code.");
    // Already ended here: a later snapshot changes nothing.
    changed(HANDOFF, handedOff({ finished: true, conversationId: "9" }));
    expect(askStore.getState().conversationId).toBe("7");
  });

  it("stops waiting on Stop, and when the handoff expires", () => {
    vi.useFakeTimers();
    localStorage.setItem(HANDOFF, handedOff());
    window.history.replaceState(null, "", LINK);
    askStore.subscribe(() => undefined);
    askStore.stop();
    expect(lastAssistant()).toMatchObject({ id: "a2", state: "stopped" });
    expect(askStore.getState().busy).toBe(false);
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: HANDOFF,
        newValue: handedOff({ finished: true }),
      }),
    );
    expect(lastAssistant()).toMatchObject({ id: "a2", state: "stopped" });

    // The link's tab never says (it crashed): incomplete at the expiry.
    resetAskStoreForTests();
    sessionStorage.clear();
    localStorage.setItem(
      HANDOFF,
      handedOff({ savedAt: Date.now() - ASK_HANDOFF_TTL_MS + 1_000 }),
    );
    window.history.replaceState(null, "", LINK);
    askStore.subscribe(() => undefined);
    expect(askStore.getState().busy).toBe(true);
    vi.advanceTimersByTime(999);
    expect(lastAssistant().state).toBe("streaming");
    vi.advanceTimersByTime(1);
    expect(lastAssistant()).toMatchObject({
      id: "a2",
      state: "error",
      error: "incomplete",
      text: "Rent is",
    });
    expect(askStore.getState().busy).toBe(false);
  });

  it("hands a streaming answer over again as it ends: done, New chat or the page going", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const handedOver = (threadId: string) =>
      JSON.parse(
        localStorage.getItem(`${ASK_STORAGE_KEYS.handoff}${threadId}`) ??
          "null",
      );
    const streaming = (question: string) => {
      askStore.send(question);
      chat().onDelta("Rent is");
      expect(lastAssistant().text).toBe("Rent is");
      return chat();
    };

    // Ctrl-click mid-answer, then the answer finishes.
    const first = streaming("What is rent?");
    const { threadId } = askStore.getState();
    askStore.prepareHandoff();
    expect(handedOver(threadId).messages.at(-1)).toMatchObject({
      state: "streaming",
      text: "Rent is",
    });
    first.onDelta(" a deposit.");
    first.onDone({ ...DONE, runId: "1", conversationId: "9" });
    expect(askStore.getState().busy).toBe(false);
    expect(handedOver(threadId)).toMatchObject({
      conversationId: "9",
      messages: [
        { role: "user", text: "What is rent?" },
        { role: "assistant", state: "done", text: "Rent is a deposit." },
      ],
    });
    // Left for the tab to take (it deletes it).
    vi.advanceTimersByTime(20_000);
    expect(handedOver(threadId)).not.toBeNull();

    // A plain click mid-answer: that end is dropped after the grace period.
    const second = streaming("And fees?");
    askStore.prepareHandoff();
    askStore.releaseHandoff();
    second.onDone({ ...DONE, runId: "2", conversationId: "9" });
    expect(askStore.getState().busy).toBe(false);
    expect(handedOver(threadId).messages.at(-1)).toMatchObject({
      state: "done",
    });
    vi.advanceTimersByTime(15_000);
    expect(handedOver(threadId)).toBeNull();

    // New chat mid-answer: stopped.
    streaming("And PDAs?");
    askStore.prepareHandoff();
    askStore.reset();
    expect(handedOver(threadId).messages.at(-1)).toMatchObject({
      state: "stopped",
      text: "Rent is",
    });

    // The page going mid-answer: incomplete there; this tab is unchanged.
    streaming("And mints?");
    const next = askStore.getState().threadId;
    askStore.prepareHandoff();
    window.dispatchEvent(new Event("pagehide"));
    expect(handedOver(next).messages.at(-1)).toMatchObject({
      state: "error",
      error: "incomplete",
    });
    expect(lastAssistant().state).toBe("streaming");
  });

  it("leaves the thread for a new tab, pruning expired ones", async () => {
    const expired = `${ASK_STORAGE_KEYS.handoff}eeeeeeeeeeeeeeee`;
    localStorage.setItem(
      expired,
      JSON.stringify({ v: 1, savedAt: Date.now() - ASK_HANDOFF_TTL_MS - 1 }),
    );
    askStore.send("What is a PDA?");
    await answer("A PDA is an address.");
    askStore.setComposerDraft("And rent?");
    askStore.setPageContext({
      title: "Accounts",
      url: "https://solana.com/developers/docs/core/accounts",
    });
    askStore.setComposerQuote({ text: "Rent is a deposit" });
    const { threadId } = askStore.getState();
    expect(isThreadId(threadId)).toBe(true);

    askStore.prepareHandoff();
    const raw = localStorage.getItem(`${ASK_STORAGE_KEYS.handoff}${threadId}`)!;
    expect(JSON.parse(raw)).toMatchObject({
      v: 1,
      savedAt: expect.any(Number),
      conversationId: "7",
      pageContext: { title: "Accounts" },
      composerDraft: "And rent?",
      composerQuote: { text: "Rent is a deposit" },
      messages: [
        { role: "user", text: "What is a PDA?" },
        { role: "assistant", state: "done", text: "A PDA is an address." },
      ],
    });
    expect(localStorage.getItem(expired)).toBeNull();
    // This tab is unchanged.
    expect(askStore.getState()).toMatchObject({ open: false, threadId });
  });

  it("drops a plain click's handoff after a grace period, unless replaced", () => {
    askStore.subscribe(() => undefined);
    vi.useFakeTimers();
    const key = `${ASK_STORAGE_KEYS.handoff}${askStore.getState().threadId}`;
    askStore.prepareHandoff();
    askStore.releaseHandoff();
    vi.advanceTimersByTime(14_000);
    // A tab a middle click opened just before may still want it.
    expect(localStorage.getItem(key)).not.toBeNull();
    vi.advanceTimersByTime(1_000);
    expect(localStorage.getItem(key)).toBeNull();

    askStore.prepareHandoff();
    askStore.releaseHandoff();
    vi.advanceTimersByTime(1);
    askStore.prepareHandoff();
    vi.advanceTimersByTime(20_000);
    expect(localStorage.getItem(key)).not.toBeNull();
  });

  it("keeps the thread id across reloads; New chat starts a new one", async () => {
    askStore.send("Saved?");
    await answer("Saved.");
    const { threadId } = askStore.getState();
    resetAskStoreForTests();
    askStore.subscribe(() => undefined);
    expect(askStore.getState().threadId).toBe(threadId);
    askStore.reset();
    expect(askStore.getState().threadId).not.toBe(threadId);
    expect(isThreadId(askStore.getState().threadId)).toBe(true);
  });
});

describe("analytics", () => {
  const events: AskSolanaAnalyticsDetail[] = [];
  const record = (event: Event) =>
    events.push((event as CustomEvent<AskSolanaAnalyticsDetail>).detail);

  beforeEach(() => {
    events.length = 0;
    window.addEventListener(ASK_SOLANA_ANALYTICS_EVENT, record);
  });

  afterEach(() => {
    window.removeEventListener(ASK_SOLANA_ANALYTICS_EVENT, record);
  });

  it("sends Bri's events as the panel opens, a question goes out and is timed, and an answer is rated", async () => {
    setViewport(1440);
    askStore.open();
    askStore.open();
    askStore.send("What is rent?");
    chat().onTiming?.({ phase: "first_delta", elapsedMs: 840 });
    await answer("Rent is a deposit.");
    askStore.rate(lastAssistant().id, "up");
    expect(events).toEqual([
      { event: "docs_ai_chat_opened", properties: { view: "chat" } },
      {
        event: "docs_ai_message_sent",
        properties: {
          conversation_id: null,
          message_length: 13,
          surface: "docked",
        },
      },
      {
        event: "docs_ai_timing",
        properties: {
          phase: "first_delta",
          elapsed_ms: 840,
          detail: undefined,
          conversation_id: null,
          surface: "docked",
        },
      },
      {
        event: "docs_ai_feedback",
        properties: { run_id: "101", rating: "up" },
      },
    ]);
  });
});

describe("persistence", () => {
  it("saves the thread and restores it, marking interrupted answers incomplete", async () => {
    askStore.send("Saved question?");
    await answer("Saved answer.", {
      codeFollowups: {
        prompt: "Code?",
        buttons: [
          {
            type: "show_code",
            label: "Rust",
            language: "rust",
            message: "In Rust.",
          },
        ],
      },
    });
    askStore.send("Interrupted?");
    chat().onDelta("Half");
    window.dispatchEvent(new Event("pagehide"));

    const saved = JSON.parse(sessionStorage.getItem(ASK_STORAGE_KEYS.thread)!);
    expect(saved.conversationId).toBe("7");
    expect(saved.messages).toHaveLength(4);

    // A reload: fresh module state, same storage.
    resetAskStoreForTests();
    const { result } = renderHook(() =>
      useAskSelector((state) => state.messages),
    );
    expect(result.current.map((m) => m.text)).toEqual([
      "Saved question?",
      "Saved answer.",
      "Interrupted?",
      "Half",
    ]);
    expect(result.current[1]).toMatchObject({
      runId: "101",
      codeFollowups: { prompt: "Code?" },
    });
    expect(result.current[3]).toMatchObject({
      state: "error",
      error: "incomplete",
    });
    expect(askStore.getState().conversationId).toBe("7");
    act(() => askStore.reset());
    expect(
      JSON.parse(sessionStorage.getItem(ASK_STORAGE_KEYS.thread)!).messages,
    ).toEqual([]);
  });

  it("restores a code question as sent", () => {
    sessionStorage.setItem(
      ASK_STORAGE_KEYS.thread,
      JSON.stringify({
        messages: [
          {
            id: "1",
            role: "user",
            text: "Explain this code from Accounts:\n\n```\nx\n```",
            sent: "Explain this code:\n\n```\nx\n```",
          },
        ],
      }),
    );
    askStore.subscribe(() => undefined);
    expect(askStore.getState().messages[0]).toMatchObject({
      sent: "Explain this code:\n\n```\nx\n```",
    });
  });

  it("restores an expired chat's error and a new conversation's notice", () => {
    sessionStorage.setItem(
      ASK_STORAGE_KEYS.thread,
      JSON.stringify({
        conversationId: "8",
        messages: [
          { id: "1", role: "user", text: "Q1" },
          {
            id: "2",
            role: "assistant",
            state: "error",
            text: "",
            error: "conversationNotFound",
          },
          { id: "3", role: "user", text: "Q2" },
          {
            id: "4",
            role: "assistant",
            state: "done",
            text: "A2",
            // Saved before there were kinds.
            conversationReset: true,
          },
          {
            id: "5",
            role: "assistant",
            state: "done",
            text: "A3",
            conversationReset: "yes",
          },
          {
            id: "6",
            role: "assistant",
            state: "done",
            text: "A4",
            conversationReset: "full",
          },
          // Interrupted on the way: it answered nothing.
          {
            id: "7",
            role: "assistant",
            state: "streaming",
            text: "Half",
            conversationReset: "full",
          },
        ],
      }),
    );
    askStore.subscribe(() => undefined);
    const [, gone, , fresh, odd, full, cut] = askStore.getState().messages;
    expect(gone).toMatchObject({ error: "conversationNotFound" });
    expect(fresh).toMatchObject({ conversationReset: "session" });
    expect(odd).not.toHaveProperty("conversationReset");
    expect(full).toMatchObject({ conversationReset: "full" });
    expect(cut).toMatchObject({ state: "error", error: "incomplete" });
    expect(cut).not.toHaveProperty("conversationReset");
  });

  it("ignores malformed stored messages", () => {
    sessionStorage.setItem(
      ASK_STORAGE_KEYS.thread,
      JSON.stringify({
        messages: [
          { id: "1", role: "user", text: "Kept" },
          {
            id: "2",
            role: "assistant",
            state: "done",
            text: "Kept too",
            ui: { bad: true },
            citations: [{ title: "PDA", url: "/docs/core/pda" }, { x: 1 }],
            codeFollowups: { prompt: "Code?", buttons: [] },
            runId: "5",
          },
          { id: "4", role: "assistant", state: "error", error: "nope" },
          { role: "user", text: "No id" },
          { id: "3", role: "system", text: "Wrong role" },
        ],
        conversationId: "9",
      }),
    );
    askStore.subscribe(() => undefined);
    expect(askStore.getState().messages).toEqual([
      { id: "1", role: "user", text: "Kept" },
      {
        id: "2",
        role: "assistant",
        state: "done",
        text: "Kept too",
        citations: [{ title: "PDA", url: "/developers/docs/core/pda" }],
        codeFollowups: null,
        runId: "5",
      },
      {
        id: "4",
        role: "assistant",
        state: "error",
        text: "",
        citations: [],
        codeFollowups: null,
        runId: null,
        error: "generic",
      },
    ]);
    expect(askStore.getState().conversationId).toBe("9");
  });

  it("keeps a question's quote across a reload; threads from before quotes still load", async () => {
    document.body.innerHTML =
      '<div id="content" data-page-title="Accounts" data-page-href="/developers/docs/core/accounts"></div>';
    askStore.open({ selection: { text: "Rent is a deposit" } });
    askStore.submitComposer();
    await answer("Quoted answer.");

    resetAskStoreForTests();
    askStore.subscribe(() => undefined);
    expect(askStore.getState().messages[0]).toEqual({
      id: expect.any(String),
      role: "user",
      text: "Explain this",
      pageContext: {
        title: "Accounts",
        url: "https://solana.com/developers/docs/core/accounts",
      },
      sent: "> Rent is a deposit\n\nExplain this",
      quote: { text: "Rent is a deposit" },
    });

    resetAskStoreForTests();
    sessionStorage.setItem(
      ASK_STORAGE_KEYS.thread,
      JSON.stringify({
        messages: [
          // Saved before quotes existed.
          { id: "1", role: "user", text: "Old question" },
          { id: "2", role: "user", text: "Bad quote", quote: { text: 7 } },
          {
            id: "3",
            role: "user",
            text: "Code",
            quote: { text: "let x;", code: true, language: "rust" },
          },
        ],
      }),
    );
    askStore.subscribe(() => undefined);
    expect(askStore.getState().messages).toEqual([
      { id: "1", role: "user", text: "Old question" },
      { id: "2", role: "user", text: "Bad quote" },
      {
        id: "3",
        role: "user",
        text: "Code",
        quote: { text: "let x;", code: true, language: "rust" },
      },
    ]);
    document.body.innerHTML = "";
  });
});
