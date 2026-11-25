/**
 * Pure helpers of the Ask AI panel: docs links as the panel opens them, the
 * code follow-ups kept with a stored answer, the answer's Summary / Indepth
 * sections, and the status row's stages. The agent's API is Bri's client
 * (@solana-com/ui-chrome/ask-solana/api); ./adapters.ts maps it to these.
 */
import { DOCS_LOCALES } from "../locales.mjs";
import type {
  CodeFollowupButton,
  CodeFollowups,
} from "@solana-com/ui-chrome/ask-solana/api";

/** Why an answer failed; each has a `docsAsk.errors.<kind>` string. */
export type AskErrorKind =
  | "generic"
  | "rateLimited"
  | "unavailable"
  | "incomplete"
  | "tooLong"
  | "conversationFull"
  | "conversationNotFound"
  | "offline";

/**
 * Why an answer went out without the conversation still on screen, which
 * the answer says (`docsAsk.conversationReset.<kind>`):
 * - session: the session was rejected, and Bri's client sent the question
 *   again without the old session's conversation;
 * - full: the agent said the conversation was full, and the reader asked
 *   again here rather than in a new chat.
 */
export type AskConversationReset = "session" | "full";

/** A stored reset kind; `true` from threads saved before there were kinds. */
export function toConversationReset(
  value: unknown,
): AskConversationReset | null {
  if (value === "session" || value === true) return "session";
  return value === "full" ? "full" : null;
}

/** What the status row says while an answer is on its way (`docsAsk.status.<status>`). */
export type AskStatus = "preparing" | "searching" | "writing" | "visual";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function toNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

const SOLANA_ORIGIN = /^https?:\/\/(?:www\.)?solana\.com(?=[/?#]|$)/i;
const DOCS_PATH =
  /^\/(?:([a-z]{2})\/)?(docs|developers\/docs|developers\/cookbook)(?=[/?#]|$)(.*)$/;

/**
 * A docs link as the panel should open it:
 * - `/docs/x` (the pre-move path) becomes `/developers/docs/x`;
 * - `https://solana.com/...docs...` becomes a site-relative path;
 * - an unprefixed English docs path gets the reader's locale prefix when
 *   the docs are translated into it (`/ja/developers/docs/x`);
 * - `/en/...` loses the prefix.
 * Anything else is returned unchanged.
 */
export function normalizeDocsHref(
  href: string,
  locale?: string | null,
): string {
  const trimmed = href.trim();
  const path = trimmed.replace(SOLANA_ORIGIN, "") || "/";
  const match = DOCS_PATH.exec(path);
  if (!match) return trimmed;
  const [, prefix, section, rest] = match;
  const base = section === "docs" ? "developers/docs" : section;
  const pathLocale =
    prefix && DOCS_LOCALES.includes(prefix)
      ? prefix
      : prefix
        ? null
        : locale && DOCS_LOCALES.includes(locale)
          ? locale
          : null;
  return `${pathLocale ? `/${pathLocale}` : ""}/${base}${rest}`;
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

/** Code follow-ups read back from storage: a prompt and at least one button. */
export function normalizeCodeFollowups(value: unknown): CodeFollowups | null {
  if (!isRecord(value)) return null;
  const prompt = toNonEmptyString(value.prompt);
  const buttons = (Array.isArray(value.buttons) ? value.buttons : []).flatMap(
    (item) => {
      const button = normalizeCodeFollowupButton(item);
      return button ? [button] : [];
    },
  );
  if (!prompt || buttons.length === 0) return null;
  return { prompt, buttons };
}

/**
 * A section label at the start of a line: a heading (`### Summary
 * response`, `## Summary`), or the bold label GLM answers write instead
 * (`**Summary response:**`, the colon inside or outside the bold), which
 * may have text after it on the same line.
 */
function sectionLabel(name: string): RegExp {
  const heading = `#{1,6}[ \\t]*${name}(?:[ \\t]+response)?[ \\t]*:?[ \\t]*(?:\\r?\\n|$)`;
  const bold = `\\*\\*[ \\t]*${name}[ \\t]+response[ \\t]*(?::[ \\t]*\\*\\*|\\*\\*[ \\t]*:?)[ \\t]*(?:\\r?\\n)?`;
  return new RegExp(`^(?:${heading}|${bold})`, "im");
}

const SUMMARY_HEADING = sectionLabel("summary");
const IN_DEPTH_HEADING = sectionLabel("in[- ]?depth");
const SECTION_HEADINGS = [
  "summary response",
  "indepth response",
  "in-depth response",
  "in depth response",
];

/**
 * Drops a half-streamed section label ("### Indep", "**In-depth res") from
 * the end of the text.
 */
function dropPartialHeading(text: string): string {
  const tail = text.slice(text.lastIndexOf("\n") + 1);
  if (!/^(?:#{1,6}|\*\*)/.test(tail)) return text;
  const words = tail
    .replace(/^(?:#+|\*\*)/, "")
    .replace(/[*:\s]+$/, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  return SECTION_HEADINGS.some((heading) => heading.startsWith(words))
    ? text.slice(0, text.length - tail.length)
    : text;
}

/**
 * The agent writes `### Summary response` then `### Indepth response` (on
 * GLM, `**Summary response:**` then `**In-depth response:**`). The panel
 * shows the summary and folds the in-depth part behind "Show the full
 * answer". Labels are removed; text without them is all summary. Safe on
 * partial (streaming) text.
 */
export function splitAnswerSections(text: string): {
  summary: string;
  inDepth: string | null;
} {
  const inDepth = IN_DEPTH_HEADING.exec(text);
  const before = inDepth
    ? text.slice(0, inDepth.index)
    : dropPartialHeading(text);
  const summary = before.replace(SUMMARY_HEADING, "").trim();
  const rest = inDepth
    ? text.slice(inDepth.index + inDepth[0].length).trim()
    : "";
  return { summary, inDepth: rest || null };
}

/**
 * The status row for a raw stage from `status` and `ui_status` events, and
 * from the client's own steps:
 * - searching: searching_docs, reading_doc, using_tool, retrieving_docs,
 *   building_plan (the agent is still gathering what to answer from);
 * - writing: writing, a response cache hit, a rendered template answer;
 * - visual: building_visual_answer and other ui stages;
 * - preparing: accepted, starting, the client's session_start,
 *   session_ready and chat_connecting, and anything unknown.
 */
export function askStatusForStage(stage: string): AskStatus {
  const normalized = stage.trim().toLowerCase();
  if (normalized.includes("visual") || normalized.startsWith("ui")) {
    return "visual";
  }
  if (/^(?:search|read|retriev|using_tool|building_plan)/.test(normalized)) {
    return "searching";
  }
  if (/^(?:writ|rendering_template)|cache_hit$/.test(normalized)) {
    return "writing";
  }
  return "preparing";
}

const STATUS_ORDER: readonly AskStatus[] = [
  "preparing",
  "searching",
  "writing",
  "visual",
];

/**
 * The status row only moves forward: the agent reports `searching_docs`,
 * then `reading_doc` per page, then (with a canonical page) `building_plan`,
 * so a later stage of an earlier step must not send "Writing" back to
 * "Searching".
 */
export function advanceAskStatus(
  current: AskStatus | undefined,
  next: AskStatus,
): AskStatus {
  if (!current) return next;
  return STATUS_ORDER.indexOf(next) > STATUS_ORDER.indexOf(current)
    ? next
    : current;
}
