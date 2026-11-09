/**
 * Turns the agent's loose `solana-docs-ui/v1` visuals (`AskGenerativeUi`,
 * @solana-com/ui-chrome/ask-solana/api) into the typed model the renderers
 * in components/docs/ask/visuals draw. The agent writes field aliases,
 * numbers where strings belong and state changes as prose, so this accepts
 * everything PR #1828's renderer accepted (its generative-ui.tsx and
 * archetype-node.tsx) and drops the rest.
 * No React: the renderers only map this model to markup.
 *
 * Rendered component types: answer_intro, callout, command_list,
 * concept_model and step_flow. When an answer has both a concept_model and a
 * step_flow they are drawn as one visual, and each step knows the nodes and
 * relationships it touches.
 *
 * Skipped types (listed in `skipped`), kept here only as notes on their wire
 * shape in case the agent still sends them:
 * - cards: `cards|items: [{title|label|name, body|summary|description|text,
 *   links|sources}]`
 * - code_tabs: `tabs|items|snippets: [{label|title|name, language|lang|id,
 *   code|content|text|body, sources}]`, or one `code` with `language`
 * - comparison: `columns|headers: string[]`, `rows|items: [{label|feature|
 *   title|name, values: string[] | left|a|first|option_a, right|b|second|
 *   option_b}]`
 * - definition_grid: `definitions|items|terms: [{term|title|label|name|key,
 *   definition|body|value|description|text}]`
 * - source_links: `links|sources|items|citations: [{title|label|name,
 *   url|href|source, description}]`; the answer's citations cover these
 */
import type { AskGenerativeUi } from "@solana-com/ui-chrome/ask-solana/api";

type UnknownRecord = Record<string, unknown>;

/** Caps: a visual is a summary, not the whole answer. */
const MAX_ITEMS = 12;
const MAX_INLINE_ITEMS = 8;
const MAX_EFFECTS = 4;

/* ---------------------------------------------------------- Vocabulary */

export type AskNodeArchetype =
  | "wallet"
  | "signer"
  | "mint-account"
  | "token-account"
  | "pda"
  | "program"
  | "instruction"
  | "transaction"
  | "rpc-node"
  | "validator";

export type AskRelationshipKind =
  | "owns"
  | "signs"
  | "derives"
  | "initializes"
  | "invokes"
  | "writes"
  | "reads"
  | "mints-to"
  | "transfers-to";

export type AskEffectAction = "reveal" | "update" | "connect" | "close";

/**
 * What kind of thing a part or a link is, as a colour: purple for
 * definitions (mints, PDAs) and the links that make them, green for holders
 * and signers and the value they move, blue for code and what it runs,
 * amber for the network. Neutral when the kind is unknown.
 */
export type AskNodeTone = "purple" | "green" | "blue" | "amber" | "neutral";

export const ASK_NODE_ARCHETYPES: Record<
  AskNodeArchetype,
  { label: string; tone: AskNodeTone }
> = {
  wallet: { label: "Wallet", tone: "green" },
  signer: { label: "Signer", tone: "green" },
  "mint-account": { label: "Mint account", tone: "purple" },
  "token-account": { label: "Token account", tone: "green" },
  pda: { label: "PDA", tone: "purple" },
  program: { label: "Program", tone: "blue" },
  instruction: { label: "Instruction", tone: "blue" },
  transaction: { label: "Transaction", tone: "blue" },
  "rpc-node": { label: "RPC node", tone: "amber" },
  validator: { label: "Validator", tone: "amber" },
};

export const ASK_RELATIONSHIP_TONES: Record<AskRelationshipKind, AskNodeTone> =
  {
    owns: "purple",
    initializes: "purple",
    derives: "purple",
    signs: "green",
    "mints-to": "green",
    "transfers-to": "green",
    invokes: "blue",
    writes: "blue",
    reads: "blue",
  };

export const ASK_RELATIONSHIP_LABELS: Record<AskRelationshipKind, string> = {
  owns: "owns",
  signs: "signs",
  derives: "derives",
  initializes: "initializes",
  invokes: "invokes",
  writes: "writes",
  reads: "reads",
  "mints-to": "mints to",
  "transfers-to": "transfers to",
};

const EFFECT_ACTIONS: AskEffectAction[] = [
  "reveal",
  "update",
  "connect",
  "close",
];

function vocabKey(value: string | null | undefined) {
  return value ? value.toLowerCase().replace(/[_\s]+/g, "-") : "";
}

export function normalizeNodeArchetype(
  value: string | null | undefined,
): AskNodeArchetype | null {
  const key = vocabKey(value);
  return Object.hasOwn(ASK_NODE_ARCHETYPES, key)
    ? (key as AskNodeArchetype)
    : null;
}

export function normalizeRelationshipKind(
  value: string | null | undefined,
): AskRelationshipKind | null {
  const key = vocabKey(value);
  return Object.hasOwn(ASK_RELATIONSHIP_LABELS, key)
    ? (key as AskRelationshipKind)
    : null;
}

export function normalizeEffectAction(
  value: string | null | undefined,
): AskEffectAction | null {
  const key = vocabKey(value);
  return (EFFECT_ACTIONS as string[]).includes(key)
    ? (key as AskEffectAction)
    : null;
}

/* --------------------------------------------------------------- Model */

export type VisualLink = { title: string; href: string };

export type VisualField = { key: string; value: string };

export type VisualNode = {
  id: string;
  name: string;
  /** Null when neither given nor recognisable from the node's text. */
  archetype: AskNodeArchetype | null;
  tone: AskNodeTone;
  address?: string;
  description?: string;
  fields: VisualField[];
  closed?: boolean;
};

export type VisualRelationship = {
  id: string;
  /** Node ids when the endpoint is a node of the model, else the raw text. */
  from: string;
  to: string;
  fromName: string;
  toName: string;
  kind: AskRelationshipKind | null;
  /** What the arrow says: the agent's label, else the kind's. */
  label: string;
};

export type VisualEffect = {
  /** Null for prose the effect grammar doesn't cover; `label` is the prose. */
  action: AskEffectAction | null;
  /** A model node id when it resolves to one, else the agent's text. */
  nodeId?: string;
  toNodeId?: string;
  field?: string;
  value?: string;
  /** The field's value before this step, when the model or an earlier step set it. */
  previous?: string;
  kind?: AskRelationshipKind;
  /** One readable line; empty for a bare reveal (nothing to list). */
  label: string;
};

export type VisualStep = {
  id: string;
  /** 1-based position within its group (setup, steps or optional). */
  n: number;
  title?: string;
  body?: string;
  command?: string;
  result?: string;
  effects: VisualEffect[];
  links: VisualLink[];
  /** Model nodes the step changes or uses (ids); empty without a model. */
  touches: string[];
  /** Model relationships the step creates (ids). */
  connects: string[];
};

export type VisualIntro = { title?: string; body?: string; bullets: string[] };

export type VisualCallout = {
  tone: "note" | "warning";
  title?: string;
  body?: string;
};

export type VisualCommand = { command: string; description?: string };

export type VisualCommandList = {
  title?: string;
  body?: string;
  footnote?: string;
  commands: VisualCommand[];
};

export type VisualConceptModel = {
  title?: string;
  body?: string;
  nodes: VisualNode[];
  relationships: VisualRelationship[];
  links: VisualLink[];
};

export type VisualStepFlow = {
  title?: string;
  body?: string;
  /** "Before you start": devnet, airdrop, CLI config. */
  setup: VisualStep[];
  steps: VisualStep[];
  /** "More you can do": cleanup and other extras. */
  optional: VisualStep[];
  links: VisualLink[];
};

/** Where each block sat in the payload, so they render in the agent's order. */
export type VisualBlock =
  | { type: "intro" }
  | { type: "callout"; index: number }
  | { type: "commands"; index: number }
  | { type: "model" }
  | { type: "flow" };

export type NormalizedVisual = {
  intro?: VisualIntro;
  callouts: VisualCallout[];
  commandLists: VisualCommandList[];
  model?: VisualConceptModel;
  flow?: VisualStepFlow;
  order: VisualBlock[];
  /** Component types present but not drawn (deprecated or unknown). */
  skipped: string[];
};

/* ------------------------------------------------------- Field readers */

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readValue(record: UnknownRecord, keys: string[]): unknown {
  for (const key of keys) {
    if (Object.hasOwn(record, key)) return record[key];
  }
  return undefined;
}

function toText(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return String(value);
  return undefined;
}

function getText(record: UnknownRecord, keys: string[]) {
  return toText(readValue(record, keys));
}

function getArray(record: UnknownRecord, keys: string[]): unknown[] {
  const value = readValue(record, keys);
  return Array.isArray(value) ? value : [];
}

function getTextList(record: UnknownRecord, keys: string[]): string[] {
  const value = readValue(record, keys);
  const items = Array.isArray(value) ? value : [value];
  return items.flatMap((item) => toText(item) ?? []).slice(0, MAX_INLINE_ITEMS);
}

function isTrue(value: unknown) {
  return value === true || toText(value)?.toLowerCase() === "true";
}

/** A shell command as the reader would type it: CRLF folded, no `$ ` prompt. */
function toCommand(value: unknown): string | undefined {
  if (typeof value !== "string") return toText(value);
  const code = value.replace(/\r\n?/g, "\n").trim();
  if (!code) return undefined;
  return code.includes("\n") ? code : code.replace(/^\$\s+/, "");
}

/** Lowercase words only, for the fuzzy matches below. */
export function matchText(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function sentence(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* --------------------------------------------------------------- Links */

/** solana.com hosts whose links can stay in this app (client navigation). */
const SOLANA_ORIGIN = /^https:\/\/(?:www\.)?solana\.com(?=[/?#]|$)/i;

/**
 * A link the visuals may render: a same-site path or an http(s) URL, never
 * `javascript:` or a protocol-relative `//host` (or `/\host`, which browsers
 * read the same way). Old `/docs/...` paths become `/developers/docs/...`,
 * the docs' home since the move, so they navigate client-side.
 */
export function safeHref(value: unknown): string | null {
  const raw = toText(value);
  if (!raw) return null;
  const href = raw.replace(SOLANA_ORIGIN, "") || "/";
  if (href.startsWith("/")) {
    if (href.startsWith("//") || href.startsWith("/\\")) return null;
    return href.replace(
      /^\/(?:([a-z]{2})\/)?docs(?=[/?#.]|$)/,
      (_, locale?: string) =>
        locale && locale !== "en"
          ? `/${locale}/developers/docs`
          : "/developers/docs",
    );
  }
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" ? href : null;
  } catch {
    return null;
  }
}

function normalizeLinks(value: unknown): VisualLink[] {
  const items = Array.isArray(value) ? value : value ? [value] : [];
  const seen = new Set<string>();
  const links: VisualLink[] = [];
  for (const item of items) {
    const record = isRecord(item) ? item : null;
    const href = safeHref(
      record ? readValue(record, ["url", "href", "source"]) : item,
    );
    if (!href || seen.has(href)) continue;
    seen.add(href);
    links.push({
      title: (record && getText(record, ["title", "label", "name"])) ?? href,
      href,
    });
    if (links.length >= MAX_INLINE_ITEMS) break;
  }
  return links;
}

function componentLinks(component: UnknownRecord) {
  return normalizeLinks(
    readValue(component, ["sources", "source_links", "links", "citations"]),
  );
}

/* ------------------------------------------------- Intro and callouts */

const TITLE_KEYS = ["title", "heading", "label"];
const BODY_KEYS = ["body", "summary", "description", "text"];

function normalizeIntro(component: UnknownRecord): VisualIntro | null {
  const intro = {
    title: getText(component, TITLE_KEYS),
    body: getText(component, BODY_KEYS),
    bullets: getTextList(component, ["bullets", "takeaways"]),
  };
  return intro.title || intro.body || intro.bullets.length > 0 ? intro : null;
}

function normalizeCallout(component: UnknownRecord): VisualCallout | null {
  const title = getText(component, TITLE_KEYS);
  const body = getText(component, ["body", "text", "description", "summary"]);
  if (!title && !body) return null;
  const tone = getText(component, ["tone", "variant", "level", "kind"]);
  const warning = /^(warn|warning|caution|danger|important)$/i.test(tone ?? "");
  return { tone: warning ? "warning" : "note", title, body };
}

function normalizeCommandList(
  component: UnknownRecord,
): VisualCommandList | null {
  const commands = getArray(component, ["commands", "items", "steps"])
    .flatMap((item): VisualCommand[] => {
      if (!isRecord(item)) {
        const command = toCommand(item);
        return command ? [{ command }] : [];
      }
      const command = toCommand(
        readValue(item, ["command", "cmd", "copy", "copyText", "code"]),
      );
      if (!command) return [];
      const description =
        getText(item, ["note", "description", "body", "summary"]) ??
        getText(item, ["step", "label", "title", "name"]);
      return [{ command, description }];
    })
    .slice(0, MAX_ITEMS);
  if (commands.length === 0) return null;
  return {
    title: getText(component, TITLE_KEYS),
    body: getText(component, BODY_KEYS),
    footnote: getText(component, ["footnote", "note"]),
    commands,
  };
}

/* ------------------------------------------------------- Concept model */

/** Recognises a node's kind from its words when the agent didn't say. */
function inferArchetype(record: UnknownRecord): AskNodeArchetype | null {
  const explicit = normalizeNodeArchetype(
    getText(record, ["archetype", "kind", "node_type", "nodeType", "type"]),
  );
  if (explicit) return explicit;
  const text = [
    getText(record, ["id", "key", "name"]),
    getText(record, ["label", "title", "name"]),
    getText(record, ["body", "description", "summary", "text"]),
  ]
    .join(" ")
    .toLowerCase();
  if (text.includes("token account") || text.includes("associated token")) {
    return "token-account";
  }
  if (text.includes("mint")) return "mint-account";
  if (text.includes("wallet")) return "wallet";
  if (text.includes("signer") || text.includes("authority")) return "signer";
  if (text.includes("pda") || text.includes("program derived")) return "pda";
  if (text.includes("transaction")) return "transaction";
  if (text.includes("instruction")) return "instruction";
  if (text.includes("rpc")) return "rpc-node";
  if (text.includes("validator")) return "validator";
  if (text.includes("program")) return "program";
  return null;
}

function normalizeFields(value: unknown): VisualField[] {
  const fields: VisualField[] = [];
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!isRecord(item)) continue;
      const key = getText(item, ["label", "title", "name", "key", "term"]);
      const fieldValue = getText(item, [
        "value",
        "body",
        "text",
        "description",
        "summary",
      ]);
      if (key && fieldValue) fields.push({ key, value: fieldValue });
      if (fields.length >= MAX_INLINE_ITEMS) break;
    }
  } else if (isRecord(value)) {
    for (const [key, raw] of Object.entries(value)) {
      const fieldValue = toText(raw);
      if (fieldValue) fields.push({ key, value: fieldValue });
      if (fields.length >= MAX_INLINE_ITEMS) break;
    }
  }
  return fields;
}

function uniqueId(base: string, taken: Set<string>) {
  let id = base;
  for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`;
  taken.add(id);
  return id;
}

function normalizeNodes(component: UnknownRecord): VisualNode[] {
  const taken = new Set<string>();
  return getArray(component, ["nodes", "items", "cards"])
    .filter(isRecord)
    .slice(0, MAX_ITEMS)
    .map((item, index) => {
      const rawId = getText(item, ["id", "key", "name"]);
      const archetype = inferArchetype(item);
      const name =
        getText(item, ["label", "title", "name"]) ??
        rawId ??
        (archetype ? ASK_NODE_ARCHETYPES[archetype].label : "Node");
      const node: VisualNode = {
        id: uniqueId(
          rawId ?? (matchText(name).replace(/ /g, "-") || `node-${index + 1}`),
          taken,
        ),
        name,
        archetype,
        tone: archetype ? ASK_NODE_ARCHETYPES[archetype].tone : "neutral",
        address: getText(item, [
          "address",
          "addr",
          "pubkey",
          "publicKey",
          "state_label",
          "stateLabel",
        ]),
        description: getText(item, BODY_KEYS),
        fields: normalizeFields(
          readValue(item, ["fields", "properties", "attributes", "facts"]),
        ),
      };
      if (isTrue(readValue(item, ["closed", "inactive"]))) node.closed = true;
      return node;
    });
}

/** The names a node goes by in prose: its id and name, minus filler words. */
function nodeAliases(node: VisualNode): string[] {
  const aliases = [node.id, node.name].flatMap((value) => {
    const words = matchText(value);
    return [
      words,
      words.replace(/\b(account|address|data|state)\b/g, "").trim(),
    ];
  });
  return [...new Set(aliases)].filter((alias) => alias.length >= 3);
}

/** True when `words` contains `phrase` as whole words (both from matchText). */
function hasWords(words: string, phrase: string) {
  return ` ${words} `.includes(` ${phrase} `);
}

/** Ids of the nodes whose names appear in `text`. */
function nodesNamedIn(text: string | undefined, nodes: VisualNode[]) {
  const words = matchText(text);
  return nodes
    .filter((node) => nodeAliases(node).some((alias) => hasWords(words, alias)))
    .map((node) => node.id);
}

/**
 * The model node the agent means by `ref`: its id, else the node whose name
 * or id shares whole words with it (the longest alias wins), so "the
 * token account" finds `holder-token` but "minter" isn't `mint`.
 */
export function resolveNodeId(
  ref: string | null | undefined,
  nodes: VisualNode[],
): string | null {
  if (!ref) return null;
  const exact = nodes.find((node) => node.id === ref);
  if (exact) return exact.id;
  const words = matchText(ref);
  if (words.length < 3) return null;
  let best: { id: string; length: number } | null = null;
  for (const node of nodes) {
    for (const alias of nodeAliases(node)) {
      const hit = hasWords(alias, words) || hasWords(words, alias);
      if (hit && (!best || alias.length > best.length)) {
        best = { id: node.id, length: alias.length };
      }
    }
  }
  return best?.id ?? null;
}

function relationshipLabel(kind: AskRelationshipKind | null, label?: string) {
  return label ?? (kind ? ASK_RELATIONSHIP_LABELS[kind] : "relates to");
}

function normalizeRelationships(
  component: UnknownRecord,
  nodes: VisualNode[],
): VisualRelationship[] {
  const taken = new Set<string>();
  return getArray(component, ["relationships", "relations", "edges"])
    .flatMap((item): VisualRelationship[] => {
      if (!isRecord(item)) return [];
      const rawFrom = getText(item, ["from", "source", "start"]);
      const rawTo = getText(item, ["to", "target", "end"]);
      if (!rawFrom || !rawTo) return [];
      const from = resolveNodeId(rawFrom, nodes) ?? rawFrom;
      const to = resolveNodeId(rawTo, nodes) ?? rawTo;
      const kindText = getText(item, ["kind", "type", "relationship", "verb"]);
      const kind = normalizeRelationshipKind(kindText);
      const label =
        getText(item, ["label", "title"]) ?? (kind ? undefined : kindText);
      return [
        {
          id: uniqueId(`${from}>${to}`, taken),
          from,
          to,
          fromName: nodes.find((node) => node.id === from)?.name ?? rawFrom,
          toName: nodes.find((node) => node.id === to)?.name ?? rawTo,
          kind,
          label: relationshipLabel(kind, label),
        },
      ];
    })
    .slice(0, MAX_INLINE_ITEMS);
}

function normalizeModel(component: UnknownRecord): VisualConceptModel | null {
  const nodes = normalizeNodes(component);
  if (nodes.length === 0) return null;
  return {
    title: getText(component, TITLE_KEYS),
    body: getText(component, BODY_KEYS),
    nodes,
    relationships: normalizeRelationships(component, nodes),
    links: componentLinks(component),
  };
}

/* ----------------------------------------------------------- Step flow */

/** An effect as the agent wrote it, before it is tied to the model. */
type RawEffect = {
  action: AskEffectAction | null;
  nodeId?: string;
  toNodeId?: string;
  field?: string;
  value?: string;
  /** The agent's own words for the change. */
  detail?: string;
  kind?: AskRelationshipKind;
};

/**
 * Effects written as text: `reveal <node>[: detail]`,
 * `update <node>.<field>: <value>`, `connect <a> -> <b>[: kind]`,
 * `close <node>`. Anything else stays prose.
 */
export function parseEffectText(text: string): RawEffect {
  const match = text.match(
    /^(reveal|update|connect|close)\s+([^:]+)(?::\s*(.+))?$/i,
  );
  if (!match) return { action: null, detail: text };
  const action = normalizeEffectAction(match[1]);
  const target = match[2]!.trim();
  const detail = match[3]?.trim() || undefined;
  if (action === "connect") {
    const [from, to] = target.split(/\s*->\s*/);
    return {
      action,
      nodeId: from?.trim() || target,
      toNodeId: to?.trim() || undefined,
      detail,
      kind: normalizeRelationshipKind(detail) ?? undefined,
    };
  }
  const dot = target.indexOf(".");
  if (dot > 0) {
    return {
      action,
      nodeId: target.slice(0, dot).trim(),
      field: target.slice(dot + 1).trim() || undefined,
      value: detail,
    };
  }
  return { action, nodeId: target, detail };
}

function normalizeEffects(value: unknown): RawEffect[] {
  const items = Array.isArray(value) ? value : value ? [value] : [];
  const effects: RawEffect[] = [];
  for (const item of items) {
    const text = toText(item);
    if (text) {
      effects.push(parseEffectText(text));
    } else if (isRecord(item)) {
      const effect: RawEffect = {
        action: normalizeEffectAction(
          getText(item, ["action", "type", "operation"]),
        ),
        nodeId: getText(item, ["node_id", "nodeId", "node", "id"]),
        toNodeId: getText(item, [
          "to_node_id",
          "toNodeId",
          "to_node",
          "toNode",
          "target",
          "to",
        ]),
        field: getText(item, ["field", "property", "key", "name"]),
        value: getText(item, ["value", "new_value", "newValue", "result"]),
        detail: getText(item, [
          "label",
          "body",
          "text",
          "description",
          "summary",
        ]),
        kind:
          normalizeRelationshipKind(
            getText(item, [
              "kind",
              "relationship_kind",
              "relationshipKind",
              "relationship",
            ]),
          ) ?? undefined,
      };
      if (Object.values(effect).some(Boolean)) effects.push(effect);
    }
    if (effects.length >= MAX_EFFECTS) break;
  }
  return effects;
}

const SETUP_FLAGS = ["setup", "prerequisite", "prereq", "is_setup", "isSetup"];
const OPTIONAL_FLAGS = [
  "optional",
  "is_optional",
  "isOptional",
  "secondary",
  "advanced",
];
const ROLE_KEYS = ["role", "kind", "category", "section"];

function hasFlag(item: UnknownRecord, keys: string[]) {
  const value = readValue(item, keys);
  return (
    isTrue(value) || /^(yes|setup|prerequisite)$/i.test(toText(value) ?? "")
  );
}

type StepDraft = {
  step: Omit<VisualStep, "effects" | "n" | "touches" | "connects">;
  effects: RawEffect[];
  /** Said so by the agent (a flag or role) or only guessed from the text. */
  setup: "explicit" | "guess" | null;
  optional: "explicit" | "guess" | null;
};

function classifySetup(item: UnknownRecord, text: string) {
  if (hasFlag(item, SETUP_FLAGS)) return "explicit";
  const role = matchText(getText(item, ROLE_KEYS));
  if (/\b(setup|set up|prereq|prerequisite|before start)\b/.test(role)) {
    return "explicit";
  }
  return /\b(select devnet|set devnet|configure devnet|point .* devnet)\b/.test(
    text,
  ) ||
    /\b(airdrop|fund wallet|fund the wallet|devnet sol)\b/.test(text) ||
    /\b(solana config set|solana airdrop)\b/.test(text)
    ? "guess"
    : null;
}

function classifyOptional(item: UnknownRecord, text: string) {
  if (hasFlag(item, OPTIONAL_FLAGS)) return "explicit";
  const role = matchText(getText(item, ROLE_KEYS));
  if (/\b(optional|secondary|advanced|cleanup|more actions)\b/.test(role)) {
    return "explicit";
  }
  return /\b(cleanup|clean up|close|burn|revoke|freeze)\b/.test(text)
    ? "guess"
    : null;
}

/** The first items of `items` that pass `test`. */
function leadingRun<T>(items: T[], test: (item: T) => boolean): T[] {
  const end = items.findIndex((item) => !test(item));
  return end < 0 ? items : items.slice(0, end);
}

/**
 * Splits steps into setup, main and optional. The agent's flags always
 * count. Guesses from the words count only for a leading run of the main
 * steps (setup) or a trailing run (optional), and only when two main steps
 * remain, so "How do I close an account?" (empty it, close it) keeps its
 * close step.
 */
function splitSteps(drafts: StepDraft[]) {
  const setup = new Set(drafts.filter((draft) => draft.setup === "explicit"));
  const optional = new Set(
    drafts.filter(
      (draft) => !setup.has(draft) && draft.optional === "explicit",
    ),
  );
  const main = drafts.filter(
    (draft) => !setup.has(draft) && !optional.has(draft),
  );
  const guessedSetup = leadingRun(main, (draft) => draft.setup === "guess");
  const guessedOptional = leadingRun(
    [...main].reverse(),
    (draft) => draft.optional === "guess" && !guessedSetup.includes(draft),
  );
  if (guessedSetup.length + guessedOptional.length <= main.length - 2) {
    for (const draft of guessedSetup) setup.add(draft);
    for (const draft of guessedOptional) optional.add(draft);
  } else if (main.length === 0) {
    // Everything was flagged: show the extras (or else the setup) as steps.
    if (optional.size > 0) optional.clear();
    else setup.clear();
  }
  return {
    setup: drafts.filter((draft) => setup.has(draft)),
    steps: drafts.filter((draft) => !setup.has(draft) && !optional.has(draft)),
    optional: drafts.filter((draft) => optional.has(draft)),
  };
}

type FlowDraft = {
  title?: string;
  body?: string;
  links: VisualLink[];
  setup: StepDraft[];
  steps: StepDraft[];
  optional: StepDraft[];
};

function normalizeFlowDraft(component: UnknownRecord): FlowDraft | null {
  const drafts = getArray(component, ["steps", "items", "flow"])
    .flatMap((item, index): StepDraft[] => {
      if (!isRecord(item)) return [];
      const title = getText(item, ["title", "label", "name"]);
      const body = getText(item, BODY_KEYS);
      const command = toCommand(
        readValue(item, ["command", "cmd", "copy", "copyText", "code"]),
      );
      const result = getText(item, ["result", "outcome", "returns", "output"]);
      if (!title && !body && !command && !result) return [];
      const text = matchText(
        [title, command, body, getText(item, ROLE_KEYS)].join(" "),
      );
      return [
        {
          step: {
            id: `step-${index + 1}`,
            title,
            body,
            command,
            result,
            links: normalizeLinks(
              readValue(item, [
                "sources",
                "source_links",
                "links",
                "citations",
              ]),
            ),
          },
          effects: normalizeEffects(
            readValue(item, [
              "state_changes",
              "stateChanges",
              "changes",
              "effects",
            ]),
          ),
          setup: classifySetup(item, text),
          optional: classifyOptional(item, text),
        },
      ];
    })
    .slice(0, MAX_ITEMS);
  if (drafts.length === 0) return null;
  return {
    title: getText(component, TITLE_KEYS),
    body: getText(component, BODY_KEYS),
    links: componentLinks(component),
    ...splitSteps(drafts),
  };
}

/* ------------------------------------------------------ Effects engine */

export type VisualNodeState = {
  fields: Array<VisualField & { changed: boolean }>;
  closed: boolean;
};

type ModelState = Map<string, VisualNodeState>;

function initialState(nodes: VisualNode[]): ModelState {
  return new Map(
    nodes.map((node) => [
      node.id,
      {
        fields: node.fields.map((field) => ({ ...field, changed: false })),
        closed: !!node.closed,
      },
    ]),
  );
}

/** Applies one step's effects; returns each update's previous value. */
function applyEffects(
  state: ModelState,
  effects: Array<RawEffect | VisualEffect>,
  changed: boolean,
): Array<string | undefined> {
  return effects.map((effect) => {
    if (!effect.nodeId) return undefined;
    let node = state.get(effect.nodeId);
    if (!node) {
      node = { fields: [], closed: false };
      state.set(effect.nodeId, node);
    }
    if (effect.action === "close") {
      node.closed = true;
      return undefined;
    }
    if (effect.action !== "update" && effect.action !== "reveal") {
      return undefined;
    }
    const value =
      effect.value ?? ("detail" in effect ? effect.detail : undefined);
    if (!effect.field || !value) return undefined;
    const key = matchText(effect.field);
    const field = node.fields.find((item) => matchText(item.key) === key);
    if (field) {
      const previous = field.value;
      field.value = value;
      field.changed = changed;
      return previous === value ? undefined : previous;
    }
    node.fields.push({ key: effect.field, value, changed });
    return undefined;
  });
}

function mentions(text: string, nodeName: string) {
  return hasWords(matchText(text), matchText(nodeName));
}

/** A connect effect between the relationship's two nodes, either way round. */
function joins(effect: RawEffect, relationship: VisualRelationship) {
  return (
    effect.action === "connect" &&
    ((effect.nodeId === relationship.from &&
      effect.toNodeId === relationship.to) ||
      (effect.nodeId === relationship.to &&
        effect.toNodeId === relationship.from))
  );
}

/** One line per effect, in the model's names ("Mint account supply: 0 → 100"). */
function effectLabel(
  effect: RawEffect,
  previous: string | undefined,
  nameOf: (id: string) => string,
): string {
  const { action, detail } = effect;
  if (!action || !effect.nodeId) return detail ? sentence(detail) : "";
  const name = nameOf(effect.nodeId);
  const said = (text: string) =>
    mentions(text, name) ? sentence(text) : `${name}: ${text}`;
  if (action === "connect") {
    if (!effect.toNodeId) return detail ? said(detail) : "";
    const to = nameOf(effect.toNodeId);
    if (effect.kind) {
      return `${name} ${ASK_RELATIONSHIP_LABELS[effect.kind]} ${to}`;
    }
    if (detail) {
      return mentions(detail, name) || mentions(detail, to)
        ? sentence(detail)
        : `${name} ${detail} ${to}`;
    }
    return `${name} → ${to}`;
  }
  if (action === "close") return detail ? said(detail) : `${name} closed`;
  const value = effect.value ?? detail;
  if (effect.field && value) {
    return `${name} ${effect.field}: ${previous ? `${previous} → ` : ""}${value}`;
  }
  return detail ? said(detail) : "";
}

/**
 * Ties a flow to its model: resolves effect targets to node ids, adds the
 * relationships connect effects create, and works out what each step
 * touches and how each field changes (`previous`).
 */
function finishFlow(
  draft: FlowDraft,
  model: VisualConceptModel | undefined,
): VisualStepFlow {
  const nodes = model?.nodes ?? [];
  const resolve = (ref?: string) =>
    ref ? (resolveNodeId(ref, nodes) ?? ref) : undefined;
  const nameOf = (id: string) =>
    nodes.find((node) => node.id === id)?.name ?? id;
  const isNode = (id?: string): id is string =>
    !!id && nodes.some((node) => node.id === id);
  const all = [...draft.setup, ...draft.steps, ...draft.optional];
  for (const step of all) {
    step.effects = step.effects.map((effect) => ({
      ...effect,
      nodeId: resolve(effect.nodeId),
      toNodeId: resolve(effect.toNodeId),
    }));
  }
  const usesEffects = all.some((step) => step.effects.length > 0);

  // Connect effects between model nodes that the model doesn't draw yet.
  if (model) {
    const taken = new Set(model.relationships.map((item) => item.id));
    for (const effect of all.flatMap((step) => step.effects)) {
      if (model.relationships.length >= MAX_INLINE_ITEMS) break;
      const { nodeId: from, toNodeId: to } = effect;
      if (effect.action !== "connect" || !isNode(from) || !isNode(to)) continue;
      if (model.relationships.some((item) => joins(effect, item))) continue;
      const verb =
        !effect.kind && effect.detail && !mentions(effect.detail, nameOf(from))
          ? effect.detail
          : undefined;
      model.relationships.push({
        id: uniqueId(`${from}>${to}`, taken),
        from,
        to,
        fromName: nameOf(from),
        toName: nameOf(to),
        kind: effect.kind ?? null,
        label: relationshipLabel(effect.kind ?? null, verb),
      });
    }
  }

  const finish = (drafts: StepDraft[], state: ModelState) =>
    drafts.map((draft, position): VisualStep => {
      const previous = applyEffects(state, draft.effects, false);
      const effects = draft.effects.map((effect, i): VisualEffect => {
        const item: VisualEffect = {
          action: effect.action,
          label: effectLabel(effect, previous[i], nameOf),
        };
        if (effect.nodeId) item.nodeId = effect.nodeId;
        if (effect.toNodeId) item.toNodeId = effect.toNodeId;
        if (effect.field) item.field = effect.field;
        const value =
          effect.value ?? (effect.field ? effect.detail : undefined);
        if (value) item.value = value;
        if (previous[i]) item.previous = previous[i];
        if (effect.kind) item.kind = effect.kind;
        return item;
      });
      // With effects, a step touches exactly their targets (prose effects:
      // the nodes they name); without any, the nodes its text names.
      const { title, body, command, result } = draft.step;
      const touches = [
        ...new Set(
          usesEffects
            ? draft.effects.flatMap((effect) => {
                const ids = [effect.nodeId, effect.toNodeId].filter(isNode);
                return ids.length > 0 || effect.action
                  ? ids
                  : nodesNamedIn(effect.detail, nodes);
              })
            : nodesNamedIn([title, body, command, result].join(" "), nodes),
        ),
      ];
      const connects = (model?.relationships ?? [])
        .filter((relationship) =>
          usesEffects
            ? draft.effects.some((effect) => joins(effect, relationship))
            : touches.includes(relationship.from) &&
              touches.includes(relationship.to),
        )
        .map((relationship) => relationship.id);
      return {
        ...draft.step,
        n: position + 1,
        effects,
        touches,
        connects,
      };
    });

  // Setup, then the main steps, run in order; each extra starts from there.
  const state = initialState(nodes);
  const setup = finish(draft.setup, state);
  const steps = finish(draft.steps, state);
  const optional = draft.optional.map((step, position) => ({
    ...finish([step], cloneState(state))[0]!,
    n: position + 1,
  }));
  return {
    title: draft.title,
    body: draft.body,
    setup,
    steps,
    optional,
    links: draft.links,
  };
}

function cloneState(state: ModelState): ModelState {
  return new Map(
    [...state].map(([id, node]) => [
      id,
      {
        closed: node.closed,
        fields: node.fields.map((field) => ({ ...field })),
      },
    ]),
  );
}

/**
 * The model as it stands after `stepId` (setup and earlier main steps
 * applied; an optional step applies after all main steps). Fields that step
 * changed are marked. Unknown ids give the model as the agent drew it.
 */
export function modelStateAtStep(
  model: VisualConceptModel,
  flow: VisualStepFlow | undefined,
  stepId: string | null,
): Map<string, VisualNodeState> {
  const state = initialState(model.nodes);
  if (!flow || !stepId) return state;
  const sequence = [...flow.setup, ...flow.steps];
  let applied: VisualStep[] = [];
  const index = sequence.findIndex((step) => step.id === stepId);
  if (index >= 0) applied = sequence.slice(0, index + 1);
  else {
    const extra = flow.optional.find((step) => step.id === stepId);
    if (extra) applied = [...sequence, extra];
  }
  applied.forEach((step, i) =>
    applyEffects(state, step.effects, i === applied.length - 1),
  );
  return state;
}

/* ---------------------------------------------------------- Entry point */

/** Normalizes a visual payload; blocks with nothing to draw are dropped. */
export function normalizeAskVisual(ui: AskGenerativeUi): NormalizedVisual {
  const visual: NormalizedVisual = {
    callouts: [],
    commandLists: [],
    order: [],
    skipped: [],
  };
  let flowDraft: FlowDraft | null = null;
  for (const component of ui.components) {
    if (!isRecord(component) || typeof component.type !== "string") continue;
    switch (component.type) {
      case "answer_intro": {
        const intro = visual.intro ? null : normalizeIntro(component);
        if (intro) {
          visual.intro = intro;
          visual.order.push({ type: "intro" });
        }
        break;
      }
      case "callout": {
        const callout = normalizeCallout(component);
        if (callout) {
          visual.order.push({ type: "callout", index: visual.callouts.length });
          visual.callouts.push(callout);
        }
        break;
      }
      case "command_list": {
        const list = normalizeCommandList(component);
        if (list) {
          visual.order.push({
            type: "commands",
            index: visual.commandLists.length,
          });
          visual.commandLists.push(list);
        }
        break;
      }
      case "concept_model": {
        const model = visual.model ? null : normalizeModel(component);
        if (model) {
          visual.model = model;
          visual.order.push({ type: "model" });
        }
        break;
      }
      case "step_flow": {
        const draft: FlowDraft | null = flowDraft
          ? null
          : normalizeFlowDraft(component);
        if (draft) {
          flowDraft = draft;
          visual.order.push({ type: "flow" });
        }
        break;
      }
      default:
        visual.skipped.push(component.type);
    }
  }
  if (flowDraft) visual.flow = finishFlow(flowDraft, visual.model);
  return visual;
}
