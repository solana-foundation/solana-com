/**
 * Terminal panel for recorded example output (pure). Shared by the examples
 * build (`examples:build`, one panel per runnable tab that has a
 * `<stem>.run.json` next to its `<stem>.output.txt`) and gen:paths (the
 * multi-step job-path demos).
 *
 * Everything is server-rendered MDX (plain JSX elements with string
 * attributes, one element per line so their content is phrasing, markdown
 * punctuation backslash-escaped), so the complete output reads without
 * JavaScript. /docs-assets/scripts/run-examples.js enhances it in place: it hides the
 * output, shows the Run controls and streams the lines back in; it only sets
 * attributes on this markup and text on the empty status/time slots.
 *
 *   <div className="sol-term" data-term=<id> data-steps=<n> data-l-*=<labels>>
 *     .sol-term-head      dots, title, environment label, Copy
 *     .sol-term-stage     optional demo stage: rows of pills, one per progress
 *                         value (data-at); the last one (data-final) shows
 *                         without JS
 *     .sol-term-plan      optional numbered steps with descriptions
 *     .sol-term-screen    one .sol-term-step per step: .sol-term-row lines
 *                         (.sol-term-note step heading, .sol-term-cmd prompt,
 *                         .sol-term-ln output), then .sol-term-result badges
 *     .sol-term-success   optional final message
 *     .sol-term-foot      Run / Run all buttons, status (JS only)
 *
 * Output lines: base58 values of 32+ characters become
 * `<span className="sol-h" title=full>` holding the full value and a
 * middle-ellipsis short form (CSS shows the full one without JS); `key:`
 * tokens, HTTP status codes after `->` and whole-line tones (error, ok, warn)
 * are marked for tinting. URLs stay whole, as plain (inline code) text that
 * is never a link. The text itself is the recorded output, unchanged.
 */
import { existsSync, readFileSync } from "node:fs";

export type Tone = "ok" | "error" | "warn" | "info";
export const TONES: readonly Tone[] = ["ok", "error", "warn", "info"];

export interface TermBadge {
  tone: Tone;
  label: string;
}
export interface TermCommand {
  /** Output line (0-based) the command is shown before. */
  at: number;
  cmd: string;
  /** Prompt symbol, default ">" (a Node.js call). Use "$" for a shell. */
  prompt?: string;
}
/** `<stem>.run.json`, next to `<stem>.output.txt` in packages/docs-examples. */
export interface RunMeta {
  /** Panel title (falls back to the block's outputNote). */
  title?: string;
  /** What the status line says while waiting: transaction, HTTP or a call. */
  pending?: "tx" | "http" | "call";
  commands?: TermCommand[];
  badges?: TermBadge[];
}

export interface TermLabels {
  env: string;
  run: string;
  runStep: string;
  next: string;
  runAll: string;
  again: string;
  running: string;
  sending: string;
  requesting: string;
  calling: string;
  confirming: string;
  done: string;
  copy: string;
  copied: string;
  output: string;
  step: string;
}

export const DEFAULT_TERM_LABELS: TermLabels = {
  env: "Local test network (Surfpool)",
  run: "Run",
  runStep: "Run step",
  next: "Next step",
  runAll: "Run all",
  again: "Run again",
  running: "Running…",
  sending: "Sending transaction…",
  requesting: "Requesting…",
  calling: "Running…",
  confirming: "Confirming…",
  done: "Done",
  copy: "Copy",
  copied: "Copied",
  output: "Output",
  step: "Step",
};

export interface TermStep {
  title?: string;
  /** One paragraph of inline markdown. */
  description?: string;
  output: string;
  meta?: RunMeta;
}
export interface TermStageRow {
  label: string;
  /** Secondary text (a base58 address is shortened like output values). */
  sub?: string;
  /** One [tone, text] per progress value: before step 1, after step 1, … */
  states: [Tone | "todo", string][];
}
export interface TermInput {
  id: string;
  tab?: string;
  /** data-kind: "block" (examples) or the demo component (checkout, …). */
  kind: string;
  title: string;
  labels: TermLabels;
  steps: TermStep[];
  stage?: TermStageRow[];
  success?: string;
}

// ---------------------------------------------------------------------------
// Escaping
// ---------------------------------------------------------------------------

/**
 * Literal text as MDX phrasing content. Backslash-escapes every character
 * markdown, MDX or remark-math would interpret (`{`, `<`, `*`, `_`, `` ` ``,
 * `$`, `&` (character references), `:` and `@` (GFM autolinks)), so the
 * server HTML holds exactly the recorded text.
 */
export function termText(s: string) {
  return s
    .replace(/[\\`*_[\]{}<>#|~$&:@!]/g, (c) => `\\${c}`)
    .replace(/www\./gi, (m) => `${m.slice(0, 3)}\\.`);
}

/**
 * Literal text that the docs' typography pass would rewrite (smart quotes
 * for `"` and `'`, dashes for `--`, an ellipsis for `...`) goes into an
 * inline code span, which it leaves alone (styles/demo.css resets the code
 * styling inside the panel). Leading and trailing spaces stay outside the
 * span (a code span strips one of each).
 */
export function termLiteral(s: string) {
  if (!/["'`]|--|\.\.\./.test(s)) return termText(s);
  const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s)!;
  const [, lead, body, trail] = m;
  if (!body) return termText(s);
  return `${termText(lead!)}${codeSpan(body)}${termText(trail!)}`;
}

/** An inline code span holding `body` verbatim (no leading/trailing space). */
function codeSpan(body: string) {
  let longest = 0;
  for (const r of body.matchAll(/`+/g))
    longest = Math.max(longest, r[0].length);
  const ticks = "`".repeat(longest + 1);
  const pad = /^`|`$/.test(body) ? " " : "";
  return `${ticks}${pad}${body}${pad}${ticks}`;
}

/** A JSX string attribute (quotes picked so no escaping is needed). */
export function termAttr(name: string, s: string) {
  const v = s.replace(/\s*\n\s*/g, " ");
  if (!v.includes('"')) return `${name}="${v}"`;
  if (!v.includes("'")) return `${name}='${v}'`;
  return `${name}="${v.replace(/"/g, "&quot;")}"`;
}

function inlineMd(s: string) {
  return s
    .replace(/\s*\n\s*/g, " ")
    .trim()
    .replace(/[{}<>$]/g, (c) => `\\${c}`);
}

// ---------------------------------------------------------------------------
// Lines
// ---------------------------------------------------------------------------

const B58 = "1-9A-HJ-NP-Za-km-z";
const TOKEN_RE = new RegExp(
  [
    // 1: base58 value (address, signature, hash) of 32+ characters
    `(?<![A-Za-z0-9])([${B58}]{32,88})(?![A-Za-z0-9])`,
    // 2: a `key:` token at the start of the text or after a space
    `(?<=^|\\s)([A-Za-z][\\w-]*:)(?=\\s|$)`,
    // 3, 4: HTTP status after an arrow
    `(->\\s)(\\d{3})\\b`,
    // 5: a URL, without trailing punctuation
    `(?<![\\w/])(https?:\\/\\/[^\\s"'<>\`]*[^\\s"'<>\`.,;:!?)])`,
  ].join("|"),
  "g",
);

/** Field names tinted when they are not the first token of a line. */
const KNOWN_KEYS =
  /^(state|balance|network|message|payTo|price|fee|reason|accountFrozen|signature|Signature):$/;

/** Middle ellipsis: first and last 4 characters. */
export function shortB58(v: string) {
  return v.length > 12 ? `${v.slice(0, 4)}…${v.slice(-4)}` : v;
}

/** Whole-line tone of a recorded output line. */
export function lineTone(line: string): Tone | undefined {
  if (
    /\b(failed|rejected|refused|blocked|error|mismatch|already used)\b/i.test(
      line,
    ) ||
    /^\s*err:/.test(line) ||
    /"paid":false|\bpaid: [Ff]alse\b/.test(line)
  )
    return "error";
  if (/->\s[45]\d\d\b|\bis paused\b/.test(line)) return "warn";
  if (
    /\bconfirmed\b|->\s2\d\d\b|"paid":true|\bpaid: [Tt]rue\b/.test(line) ||
    /^(Approved|Paid|Resumed)\b/.test(line)
  )
    return "ok";
  return undefined;
}

/**
 * Inline markup for one line of recorded text (no line wrapper). Plain text
 * between two marked tokens is collected first and escaped as one piece, so a
 * line with quotes becomes a single code span (see termLiteral), not several.
 * That includes plain prose with an apostrophe (`the approved holder's
 * account`): the code span only shields it from smart quotes, and
 * styles/demo.css resets code styling inside the panel so it reads like
 * every other line (pinned in terminal.test.ts).
 */
export function termInline(text: string) {
  let out = "";
  let plain = "";
  let last = 0;
  const flush = () => {
    out += termLiteral(plain);
    plain = "";
  };
  for (const m of text.matchAll(TOKEN_RE)) {
    const i = m.index!;
    plain += text.slice(last, i);
    last = i + m[0].length;
    if (m[5]) {
      // A URL stays whole and plain: inline code, which GFM never autolinks
      // and the typography pass leaves alone (styles/demo.css makes it read
      // like the rest of the line). Recorded runs are on Surfpool, so a link to the
      // transaction or account would point at nothing on devnet, and the
      // base58 highlighting would otherwise split the URL and cut its link.
      flush();
      out += codeSpan(m[5]);
    } else if (m[1]) {
      const v = m[1];
      flush();
      out += `<span className="sol-h" title="${v}"><span className="sol-h-f">${v}</span><span className="sol-h-s" aria-hidden="true">${shortB58(v)}</span></span>`;
    } else if (m[2]) {
      // A key: the first token of the line, or a known field name later on
      // (`… state: Frozen balance: 1000 LSF`), never inside a JSON string.
      const before = text.slice(0, i);
      const quotes = (before.match(/"/g) ?? []).length;
      const isKey =
        quotes % 2 === 0 && (!before.trim() || KNOWN_KEYS.test(m[2]));
      if (isKey) {
        flush();
        out += `<span className="sol-term-k">${termText(m[2])}</span>`;
      } else plain += m[2];
    } else if (m[4]) {
      const cls = m[4][0] === "2" ? "2xx" : m[4][0] === "4" ? "4xx" : "other";
      plain += m[3]!;
      flush();
      out += `<span className="sol-term-code" data-code="${cls}">${m[4]}</span>`;
    }
  }
  plain += text.slice(last);
  flush();
  return out;
}

function outputLine(line: string) {
  const body = line.replace(/^\s+/, "");
  const indent = line.length - body.length;
  const tone = lineTone(line);
  const attrs = [
    `className="sol-term-row sol-term-ln"`,
    ...(tone ? [`data-tone="${tone}"`] : []),
    ...(indent ? [`data-indent="${Math.min(indent, 8)}"`] : []),
  ].join(" ");
  return `<div ${attrs}>${termInline(body)}</div>`;
}

function commandLine(cmd: string, prompt: string) {
  return `<div className="sol-term-row sol-term-cmd"><span className="sol-term-ps" aria-hidden="true">${termText(prompt)}</span> ${termLiteral(cmd)}</div>`;
}

/** Pending kind of a step when run.json does not set it. */
export function pendingOf(output: string): NonNullable<RunMeta["pending"]> {
  if (/->\s\d{3}\b/.test(output)) return "http";
  if (/[Ss]ignature/.test(output)) return "tx";
  return "call";
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

function labelAttrs(l: TermLabels) {
  const map: [string, string][] = [
    ["run", l.run],
    ["run-step", l.runStep],
    ["next", l.next],
    ["all", l.runAll],
    ["again", l.again],
    ["running", l.running],
    ["tx", l.sending],
    ["http", l.requesting],
    ["call", l.calling],
    ["confirming", l.confirming],
    ["done", l.done],
    ["copied", l.copied],
    ["step", l.step],
  ];
  return map.map(([k, v]) => termAttr(`data-l-${k}`, v)).join(" ");
}

function renderStage(rows: TermStageRow[], kind: string, progressMax: number) {
  const lines = [`<div className="sol-term-stage" data-stage="${kind}">`];
  for (const r of rows) {
    const pills = r.states
      .map(
        ([tone, text], at) =>
          `<span className="sol-term-pill" data-at="${at}" data-tone="${tone}"${at === progressMax ? ` data-final=""` : ""}>${termLiteral(text)}</span>`,
      )
      .join("");
    const sub = r.sub
      ? `<span className="sol-term-item-sub">${termInline(r.sub)}</span>`
      : "";
    lines.push(
      `<div className="sol-term-item"><span className="sol-term-item-label">${termText(r.label)}</span>${sub}${pills}</div>`,
    );
  }
  lines.push("</div>");
  return lines;
}

export function renderTerminal(t: TermInput): string {
  const multi = t.steps.length > 1;
  const l = t.labels;
  const rootAttrs = [
    `className="sol-term not-prose"`,
    termAttr("data-term", t.id),
    ...(t.tab ? [termAttr("data-tab", t.tab)] : []),
    `data-kind="${t.kind}"`,
    `data-steps="${t.steps.length}"`,
    labelAttrs(l),
  ].join(" ");
  const lines: string[] = [`<div ${rootAttrs}>`];
  lines.push(
    `<div className="sol-term-head"><span className="sol-term-title">${termText(t.title)}</span><span className="sol-term-env">${termText(l.env)}</span><button type="button" className="sol-term-copy" data-act="copy">${termText(l.copy)}</button></div>`,
  );
  if (t.stage?.length)
    lines.push(...renderStage(t.stage, t.kind, t.steps.length));
  if (multi) {
    lines.push(`<ol className="sol-term-plan">`);
    t.steps.forEach((s, i) => {
      const desc = s.description
        ? ` <span className="sol-term-plan-desc">${inlineMd(s.description)}</span>`
        : "";
      lines.push(
        `<li data-step="${i + 1}"><span className="sol-term-plan-n" aria-hidden="true">${i + 1}</span><span className="sol-term-plan-body"><strong className="sol-term-plan-title">${termText(s.title ?? "")}</strong>${desc}</span></li>`,
      );
    });
    lines.push(`</ol>`);
  }
  lines.push(
    `<div className="sol-term-screen" role="region" tabIndex="0" ${termAttr("aria-label", `${t.title}: ${l.output}`)}>`,
  );
  t.steps.forEach((s, i) => {
    const meta = s.meta ?? {};
    const pending = meta.pending ?? pendingOf(s.output);
    lines.push(
      `<div className="sol-term-step" data-step="${i + 1}" data-pending="${pending}">`,
    );
    if (multi)
      lines.push(
        `<div className="sol-term-row sol-term-note">\\# ${termText(`${l.step} ${i + 1}/${t.steps.length} · ${s.title ?? ""}`)}</div>`,
      );
    const out = s.output.split("\n");
    const cmds = [...(meta.commands ?? [])].sort((a, b) => a.at - b.at);
    out.forEach((line, n) => {
      for (const c of cmds.filter((x) => x.at === n))
        lines.push(commandLine(c.cmd, c.prompt ?? ">"));
      // A recorded shell prompt (`$ python …`) is a command, not output.
      if (/^\$ /.test(line)) lines.push(commandLine(line.slice(2), "$"));
      else lines.push(outputLine(line));
    });
    const badges = (meta.badges ?? [])
      .map(
        (b) =>
          `<span className="sol-term-badge" data-tone="${b.tone}">${termLiteral(b.label)}</span>`,
      )
      .join("");
    lines.push(`<div className="sol-term-result">${badges}</div>`);
    lines.push(`</div>`);
  });
  lines.push(`</div>`);
  if (t.success)
    lines.push(
      `<div className="sol-term-success"><span className="sol-term-success-icon" aria-hidden="true">✓</span><span>${inlineMd(t.success)}</span></div>`,
    );
  lines.push(
    `<div className="sol-term-foot"><button type="button" className="sol-term-btn" data-act="run">${termText(multi ? `${l.runStep} 1` : l.run)}</button>${multi ? `<button type="button" className="sol-term-btn" data-act="all" data-variant="secondary">${termText(l.runAll)}</button>` : ""}<span className="sol-term-status"></span><span className="sol-term-sr" role="status"></span></div>`,
  );
  lines.push(`</div>`);
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// run.json
// ---------------------------------------------------------------------------

/** `<dir>/x.output.txt` -> `<dir>/x.run.json`. */
export function runMetaPath(outputAbs: string) {
  return outputAbs.replace(/\.output\.txt$/, ".run.json");
}

/** Read and validate a run.json; problems go to `errors`. */
export function readRunMeta(
  outputAbs: string,
  errors: string[],
  where: string,
): RunMeta | undefined {
  const file = runMetaPath(outputAbs);
  if (file === outputAbs || !existsSync(file)) return undefined;
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(file, "utf8"));
  } catch (err) {
    errors.push(`${where}: invalid run.json: ${(err as Error).message}`);
    return undefined;
  }
  return parseRunMeta(raw, errors, where);
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export function parseRunMeta(
  raw: unknown,
  errors: string[],
  where: string,
): RunMeta | undefined {
  if (!isObj(raw)) {
    errors.push(`${where}: run.json must be an object`);
    return undefined;
  }
  const known = new Set(["title", "pending", "commands", "badges"]);
  for (const k of Object.keys(raw))
    if (!known.has(k)) errors.push(`${where}: run.json: unknown field "${k}"`);
  const meta: RunMeta = {};
  if (raw.title !== undefined) {
    if (typeof raw.title !== "string" || !raw.title)
      errors.push(`${where}: run.json title must be a non-empty string`);
    else meta.title = raw.title;
  }
  if (raw.pending !== undefined) {
    if (!["tx", "http", "call"].includes(raw.pending as string))
      errors.push(`${where}: run.json pending must be tx, http or call`);
    else meta.pending = raw.pending as RunMeta["pending"];
  }
  if (raw.commands !== undefined) {
    if (!Array.isArray(raw.commands))
      errors.push(`${where}: run.json commands must be an array`);
    else
      meta.commands = raw.commands.flatMap((c, i) => {
        if (
          !isObj(c) ||
          typeof c.cmd !== "string" ||
          !c.cmd ||
          !Number.isInteger(c.at) ||
          (c.at as number) < 0 ||
          (c.prompt !== undefined && typeof c.prompt !== "string")
        ) {
          errors.push(
            `${where}: run.json commands[${i}] must be { at: line index, cmd, prompt? }`,
          );
          return [];
        }
        return [
          {
            at: c.at as number,
            cmd: c.cmd,
            ...(c.prompt ? { prompt: c.prompt as string } : {}),
          },
        ];
      });
  }
  if (raw.badges !== undefined) {
    if (!Array.isArray(raw.badges))
      errors.push(`${where}: run.json badges must be an array`);
    else
      meta.badges = raw.badges.flatMap((b, i) => {
        if (
          !isObj(b) ||
          !TONES.includes(b.tone as Tone) ||
          typeof b.label !== "string" ||
          !b.label
        ) {
          errors.push(
            `${where}: run.json badges[${i}] must be { tone: ok|error|warn|info, label }`,
          );
          return [];
        }
        return [{ tone: b.tone as Tone, label: b.label }];
      });
  }
  return meta;
}
