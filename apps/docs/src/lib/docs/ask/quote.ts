/**
 * Text the reader selected on the page and asked about ("Ask AI about this",
 * components/docs/ask/ask-selection.client.tsx). It waits in the composer
 * as a quote; sent, it goes ahead of the question as a Markdown blockquote,
 * or fenced when it came from one code block. Prose is tidied (runs of
 * whitespace collapsed, paragraph breaks kept as single newlines); code is
 * kept as it is. Both are cut to ASK_MAX_QUOTE_CHARS at a word.
 */
import { ASK_MAX_QUOTE_CHARS } from "./config";
import { isAskPageContext, type AskPageContext } from "./page-context";
import { isRecord } from "./protocol";

export type AskQuote = {
  text: string;
  /** From one code block: monospace in the panel, fenced on the wire. */
  code?: boolean;
  /** The code block's language, kept on the fence. */
  language?: string;
};

/**
 * The composer's quote, with the page it was selected on: sent as "Ask
 * about this page" sends its page.
 */
export type AskComposerQuote = AskQuote & { pageContext?: AskPageContext };

/** A code block's language as fences name it ("ts", "c++"), or "". */
export function fenceLanguage(language: string | null | undefined): string {
  return language && /^[\w#+.-]{1,24}$/.test(language) ? language : "";
}

/** Cuts `text` to `max` characters, ending in "…" at a word where it can. */
function clipAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const head = text.slice(0, max - 1);
  // The cut falls between words, or after the last whole word before it
  // (unless that throws away more than half).
  const boundary = /\s/.test(text.charAt(max - 1))
    ? head.length
    : head.search(/\s\S*$/);
  let cut = boundary > max / 2 ? head.slice(0, boundary) : head;
  // Never half an emoji.
  if (/[\uD800-\uDBFF]$/.test(cut)) cut = cut.slice(0, -1);
  return `${cut.trimEnd()}…`;
}

/**
 * The selection as a quote, or null when there is nothing to ask about
 * (only whitespace, or a single character).
 */
export function toQuote(selection: AskQuote): AskQuote | null {
  const raw = selection.text.replace(/\r\n?/g, "\n");
  const text = selection.code
    ? // Code as it is, without blank lines around it.
      raw.replace(/^(?:[^\S\n]*\n)+/, "").trimEnd()
    : raw
        // Zero-width spaces (each docs heading's anchor link) are not words.
        .replace(/[\u200B\uFEFF]/g, "")
        .split(/\s*\n\s*/)
        .map((line) => line.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .join("\n");
  if (text.trim().length < 2) return null;
  const clipped = clipAtWord(text, ASK_MAX_QUOTE_CHARS);
  if (!selection.code) return { text: clipped };
  const language = fenceLanguage(selection.language);
  return { text: clipped, code: true, ...(language ? { language } : {}) };
}

/** A stored quote (thread, handoff), or null when it can't be trusted. */
export function restoreQuote(value: unknown): AskQuote | null {
  if (!isRecord(value) || typeof value.text !== "string") return null;
  if (!value.text.trim()) return null;
  const text = value.text.slice(0, ASK_MAX_QUOTE_CHARS);
  if (value.code !== true) return { text };
  const language = fenceLanguage(
    typeof value.language === "string" ? value.language : "",
  );
  return { text, code: true, ...(language ? { language } : {}) };
}

/** A stored composer quote, with its page if that is still valid. */
export function restoreComposerQuote(value: unknown): AskComposerQuote | null {
  const quote = restoreQuote(value);
  if (!quote || !isRecord(value)) return null;
  return isAskPageContext(value.pageContext)
    ? { ...quote, pageContext: value.pageContext }
    : quote;
}

/** The quote as Markdown: a blockquote, or a fence long enough for the code. */
export function quoteMarkdown({ text, code, language }: AskQuote): string {
  if (code) {
    const ticks = Math.max(
      2,
      ...Array.from(text.matchAll(/`+/g), (match) => match[0].length),
    );
    const fence = "`".repeat(ticks + 1);
    return `${fence}${fenceLanguage(language)}\n${text}\n${fence}`;
  }
  return text
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}

/** The message as sent: the quote, a blank line, then the question. */
export function quotedQuestion(quote: AskQuote, question: string): string {
  return `${quoteMarkdown(quote)}\n\n${question}`;
}
