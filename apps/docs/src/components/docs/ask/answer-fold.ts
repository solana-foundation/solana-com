/**
 * Which part of an answer folds under "Full answer". As Bri's panel: only a
 * long part folds (over 1,600 characters, over 36 lines, or two code blocks
 * or more; with a visual, which already shows the shape, over 600
 * characters, 16 lines or one code block); a short one reads inline. An
 * answer with the Summary / Indepth headings folds its in-depth section;
 * one without them keeps its opening paragraph and folds the rest.
 */
import { splitAnswerSections } from "@/lib/docs/ask/protocol";

const LONG = { chars: 1600, lines: 36, codeBlocks: 2 } as const;
/** Bri's SUPPORTING_COLLAPSE_* thresholds: the text beside a visual. */
const LONG_BESIDE_VISUAL = { chars: 600, lines: 16, codeBlocks: 1 } as const;

/**
 * Bri's `shouldCondenseMarkdownAnswer`, or `shouldCondenseSupportingAnswer`
 * when the answer has a visual.
 */
export function isLongAnswer(markdown: string, hasVisual = false): boolean {
  const limit = hasVisual ? LONG_BESIDE_VISUAL : LONG;
  const fences = markdown.match(/```/g)?.length ?? 0;
  return (
    markdown.length > limit.chars ||
    markdown.split("\n").length > limit.lines ||
    Math.floor(fences / 2) >= limit.codeBlocks
  );
}

/** Top-level Markdown blocks: split on blank lines, fenced code kept whole. */
function markdownBlocks(markdown: string): string[] {
  const blocks: string[] = [];
  let current: string[] = [];
  let fence: string | null = null;
  const flush = () => {
    if (current.some((line) => line.trim())) blocks.push(current.join("\n"));
    current = [];
  };
  for (const line of markdown.replace(/\r\n/g, "\n").split("\n")) {
    const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (fence) {
      current.push(line);
      if (marker?.startsWith(fence)) fence = null;
    } else if (marker) {
      flush();
      fence = marker;
      current.push(line);
    } else if (!line.trim()) {
      flush();
    } else {
      current.push(line);
    }
  }
  flush();
  return blocks;
}

const isHeading = (block: string) => /^\s{0,3}#/.test(block);

/** A plain paragraph: not a heading, list, quote, table or code. */
const isParagraph = (block: string) =>
  !/^\s{0,3}(?:#|[-*+]\s|\d+[.)]\s|>|\||`{3}|~{3})/.test(block);

/**
 * An answer without section headings as a lead and the rest. The lead is
 * any heading it opens with and its first paragraph, plus a second one when
 * the first is a short lead-in; an answer that opens with a list or code
 * leads with that block. Safe on streaming text: the lead only grows until
 * the rest starts.
 */
export function splitLead(markdown: string): {
  lead: string;
  rest: string | null;
} {
  const blocks = markdownBlocks(markdown);
  let end = 0;
  let prose = 0;
  for (const block of blocks) {
    if (!isParagraph(block)) {
      if (prose > 0) break;
      end += 1;
      if (isHeading(block)) continue;
      break;
    }
    end += 1;
    prose += 1;
    if (prose === 2 || blocks.slice(0, end).join("\n\n").length >= 200) break;
  }
  const rest = blocks.slice(end).join("\n\n");
  return { lead: blocks.slice(0, end).join("\n\n"), rest: rest || null };
}

/**
 * The answer starts with a Summary heading or bold label (so an in-depth
 * part may follow).
 */
function hasSummaryHeading(markdown: string) {
  return /^\s*(?:#{1,6}[ \t]*summary\b|\*\*[ \t]*summary[ \t]+response\b)/i.test(
    markdown,
  );
}

export type AnswerParts = {
  /** Shown first, before any visual. */
  lead: string;
  /** The in-depth section, or what follows the lead of an unsectioned answer. */
  rest: string | null;
  /** `rest` sits under "Full answer" (else it reads inline). */
  fold: boolean;
  /** The answer has the Summary / Indepth headings. */
  sectioned: boolean;
};

/**
 * An answer's parts. While it streams the rest stays folded (its length
 * isn't known yet, and text the reader saw never folds away); once it ends
 * a short rest opens inline. An unsectioned answer that ends short reads as
 * one text, so `lead` is all of it.
 */
export function answerParts(
  body: string,
  streaming: boolean,
  hasVisual = false,
): AnswerParts {
  const { summary, inDepth } = splitAnswerSections(body);
  const sectioned = inDepth !== null || hasSummaryHeading(body);
  if (sectioned) {
    return {
      lead: summary,
      rest: inDepth,
      fold: !!inDepth && (streaming || isLongAnswer(inDepth, hasVisual)),
      sectioned,
    };
  }
  if (!streaming && !isLongAnswer(summary, hasVisual)) {
    return { lead: summary, rest: null, fold: false, sectioned };
  }
  const { lead, rest } = splitLead(summary);
  return { lead, rest, fold: !!rest, sectioned };
}
