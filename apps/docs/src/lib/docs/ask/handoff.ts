/**
 * "Expand to full screen" is a link to this page with
 * `?ask=full&askThread=<thread id>`, so Ctrl/Cmd-click, middle-click and
 * "Open in new tab" open the conversation full screen in a new tab (a plain
 * click stays in place). A new tab does not reliably get a copy of this
 * tab's sessionStorage, where the thread lives, so just before the browser
 * may open the link the panel leaves a one-time snapshot in localStorage
 * (`docs-ask:handoff:<thread id>`). The new tab reads it on load, drops the
 * two params from its URL and deletes the snapshot a little later (a second
 * tab opened from the same link may still be loading). Snapshots expire
 * after 10 minutes; writing one prunes the expired others. Never the
 * session token: that is already shared through localStorage.
 *
 * Pure helpers over a Storage and a location; the store (./store.ts) wires
 * them to its state.
 */
import { ASK_LINK_PARAMS, ASK_STORAGE_KEYS } from "./config";
import { isAskPageContext, type AskPageContext } from "./page-context";
import {
  isRecord,
  toConversationReset,
  toNonEmptyString,
  type AskConversationReset,
} from "./protocol";
import { restoreComposerQuote, type AskComposerQuote } from "./quote";

export const ASK_HANDOFF_TTL_MS = 10 * 60 * 1000;

/** What a new tab gets. `messages` go through the store's own restore. */
export type AskHandoff = {
  v: 1;
  savedAt: number;
  messages: unknown[];
  conversationId: string | null;
  /** The dropped conversation the next answer says it went without (the store's `pendingReset`). */
  pendingReset: AskConversationReset | null;
  pageContext: AskPageContext | null;
  composerDraft: string;
  /** The composer's quote card ("Ask AI about this"); null in older snapshots. */
  composerQuote: AskComposerQuote | null;
};

type UrlParts = { pathname: string; search: string; hash: string };

/** Thread ids are ours (newThreadId); anything else in the URL is ignored. */
const THREAD_ID = /^[A-Za-z0-9_-]{8,64}$/;

/** A random id for a new thread. It stays with the thread, so the link does too. */
export function newThreadId(): string {
  const bytes = new Uint8Array(12);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.random() * 256;
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function isThreadId(value: unknown): value is string {
  return typeof value === "string" && THREAD_ID.test(value);
}

/**
 * The query's pairs other than the link's own, exactly as written (no
 * re-encoding through URLSearchParams).
 */
function otherParams(search: string): string[] {
  return search
    .replace(/^\?/, "")
    .split("&")
    .filter((pair) => {
      if (!pair) return false;
      let name = pair.split("=", 1)[0]!.replace(/\+/g, " ");
      try {
        name = decodeURIComponent(name);
      } catch {
        // Malformed escape: keep the pair as it is.
      }
      return name !== ASK_LINK_PARAMS.layout && name !== ASK_LINK_PARAMS.thread;
    });
}

/** This page (path, query and hash kept) as a link to its full-screen panel. */
export function fullscreenHref(location: UrlParts, threadId: string): string {
  const query = [
    ...otherParams(location.search),
    `${ASK_LINK_PARAMS.layout}=${ASK_LINK_PARAMS.fullscreen}`,
    `${ASK_LINK_PARAMS.thread}=${encodeURIComponent(threadId)}`,
  ].join("&");
  return `${location.pathname}?${query}${location.hash}`;
}

/**
 * The full-screen link's request, or null when the URL is not one:
 * `threadId` is null when absent or not one of ours.
 */
export function readFullscreenLink(
  search: string,
): { threadId: string | null } | null {
  const params = new URLSearchParams(search);
  if (params.get(ASK_LINK_PARAMS.layout) !== ASK_LINK_PARAMS.fullscreen)
    return null;
  const threadId = params.get(ASK_LINK_PARAMS.thread);
  return { threadId: isThreadId(threadId) ? threadId : null };
}

/** The URL without the link's two params; the rest of the query and the hash stay. */
export function withoutFullscreenParams(location: UrlParts): string {
  const query = otherParams(location.search).join("&");
  return `${location.pathname}${query ? `?${query}` : ""}${location.hash}`;
}

export function handoffKey(threadId: string): string {
  return `${ASK_STORAGE_KEYS.handoff}${threadId}`;
}

/** A stored handoff, or null when unreadable or expired. */
export function parseHandoff(
  raw: string | null,
  now = Date.now(),
): AskHandoff | null {
  if (!raw) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(value) || value.v !== 1) return null;
  const { savedAt } = value;
  if (typeof savedAt !== "number" || !Number.isFinite(savedAt)) return null;
  const age = now - savedAt;
  if (age < 0 || age > ASK_HANDOFF_TTL_MS) return null;
  return {
    v: 1,
    savedAt,
    messages: Array.isArray(value.messages) ? value.messages : [],
    conversationId: toNonEmptyString(value.conversationId),
    pendingReset: toConversationReset(value.pendingReset),
    pageContext: isAskPageContext(value.pageContext) ? value.pageContext : null,
    composerDraft:
      typeof value.composerDraft === "string" ? value.composerDraft : "",
    composerQuote: restoreComposerQuote(value.composerQuote),
  };
}

/** Removes expired or unreadable handoffs (every tab's). */
export function pruneHandoffs(storage: Storage | null, now = Date.now()) {
  if (!storage) return;
  try {
    const stale: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const name = storage.key(i);
      if (!name?.startsWith(ASK_STORAGE_KEYS.handoff)) continue;
      if (!parseHandoff(storage.getItem(name), now)) stale.push(name);
    }
    for (const name of stale) storage.removeItem(name);
  } catch {
    // Blocked storage: nothing to prune.
  }
}

/** Leaves the thread for a new tab; returns `savedAt`, or null if it could not. */
export function writeHandoff(
  storage: Storage | null,
  threadId: string,
  snapshot: Omit<AskHandoff, "v" | "savedAt">,
  now = Date.now(),
): number | null {
  if (!storage || !isThreadId(threadId)) return null;
  pruneHandoffs(storage, now);
  const handoff: AskHandoff = { v: 1, savedAt: now, ...snapshot };
  try {
    storage.setItem(handoffKey(threadId), JSON.stringify(handoff));
    return now;
  } catch {
    // Full or blocked: the new tab opens full screen with its own thread.
    return null;
  }
}

/**
 * Reads a handoff; null when missing or expired. Left in place: the reader
 * deletes it with discardHandoff once other tabs opened from the same link
 * have had time to read it too.
 */
export function readHandoff(
  storage: Storage | null,
  threadId: string,
  now = Date.now(),
): AskHandoff | null {
  if (!storage || !isThreadId(threadId)) return null;
  try {
    return parseHandoff(storage.getItem(handoffKey(threadId)), now);
  } catch {
    return null;
  }
}

/** Deletes this thread's handoff if it is still the one saved at `savedAt`. */
export function discardHandoff(
  storage: Storage | null,
  threadId: string,
  savedAt: number,
) {
  if (!storage || !isThreadId(threadId)) return;
  try {
    const value: unknown = JSON.parse(
      storage.getItem(handoffKey(threadId)) ?? "null",
    );
    if (isRecord(value) && value.savedAt === savedAt)
      storage.removeItem(handoffKey(threadId));
  } catch {
    // ignore
  }
}
