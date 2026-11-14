/**
 * Bri's Ask Solana client (@solana-com/ui-chrome/ask-solana/api) in the
 * panel's terms: the strings its `onError` passes as error kinds, and its
 * citations with docs links as the panel opens them. Its stages
 * (`session_start`, `session_ready`, `chat_connecting`, `cache_hit` and
 * the agent's own) go through ./protocol.ts `askStatusForStage` as they are.
 */
import type { AskCitation } from "@solana-com/ui-chrome/ask-solana/api";
import {
  isRecord,
  normalizeDocsHref,
  toNonEmptyString,
  type AskErrorKind,
} from "./protocol";

/** What fetch() rejects with when the request never got out (Chrome, Firefox, Safari). */
const FETCH_FAILED =
  /^(?:failed to fetch|networkerror when attempting to fetch resource\.?|load failed)$/i;

/**
 * The error kind for a message `streamChat` passes to `onError`:
 * - `rate_limited` (a 429): rateLimited;
 * - `conversation_not_found` (a 404 for the conversation id, which the
 *   client has dropped): conversationNotFound;
 * - `conversation_full` (a 409 that says so), or another 409:
 *   conversationFull;
 * - `request failed (502|503|504)`, the chat's or the session's: unavailable;
 * - `(413)`: tooLong;
 * - the browser offline, or fetch() failing to send: offline;
 * - anything else (other statuses, a stream `error` event): generic.
 */
export function askErrorKindFor(message: string): AskErrorKind {
  if (message === "rate_limited") return "rateLimited";
  if (message === "conversation_not_found") return "conversationNotFound";
  if (message === "conversation_full") return "conversationFull";
  if (/request failed \((?:502|503|504)\)/.test(message)) return "unavailable";
  if (/\(413\)/.test(message)) return "tooLong";
  if (/\(409\)/.test(message)) return "conversationFull";
  if (
    (typeof navigator !== "undefined" && navigator.onLine === false) ||
    FETCH_FAILED.test(message.trim())
  ) {
    return "offline";
  }
  return "generic";
}

/**
 * Citations with a URL, docs links normalized for the reader's `locale`
 * (`/docs/x` becomes `/developers/docs/x`) and repeats (by link) dropped.
 * Reads the client's citations and a stored copy alike.
 */
export function toAskCitations(
  value: unknown,
  locale?: string | null,
): AskCitation[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const rawUrl = toNonEmptyString(item.url);
    if (!rawUrl) return [];
    const url = normalizeDocsHref(rawUrl, locale);
    if (seen.has(url)) return [];
    seen.add(url);
    return [{ title: toNonEmptyString(item.title) ?? "", url }];
  });
}
