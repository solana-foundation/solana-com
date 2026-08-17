"use client";

import * as React from "react";
import type { ReactNode } from "react";
import type { AskGenerativeUi, AskGenerativeUiComponent } from "./api";
import {
  AnswerIntro as VectorAnswerIntro,
  CodeDisclosure,
  CodeSnippet,
  CommandTerminal,
  CommandList as VectorCommandList,
  CommandRow,
  ExecuteButton,
  FlowStep,
  FlowSteps,
  LabeledPanel,
  ResultBanner,
  SourceLink as VectorSourceLink,
  SourcesRow,
  StepReturns,
  TabBar,
  TabPanel,
  Tok,
  VectorArchetypeNode,
  VectorEffectList,
  VectorRelationshipChip,
  VectorSurface,
  normalizeVectorEffectAction,
  normalizeVectorNodeArchetype,
  normalizeVectorRelationshipKind,
  vectorNodeArchetypeMeta,
  type VectorArchetypeTone,
  type VectorEffectAction,
  type VectorEffectItem,
  type VectorNodeArchetype,
  type VectorRelationshipKind,
  type CodeLine,
} from "./vector";
import styles from "./vector/vector.module.css";

type UnknownRecord = Record<string, unknown>;

type TextField = {
  label: string;
  value: string;
  tone: VectorArchetypeTone | null;
  changed: boolean;
};

type SourceLink = {
  title: string;
  url: string;
  description: string | null;
};

type CodeTab = {
  label: string;
  language: string | null;
  code: string;
  sources: SourceLink[];
};

type ConceptNode = {
  id: string | null;
  archetype: VectorNodeArchetype;
  label: string;
  address: string | null;
  description: string | null;
  fields: TextField[];
  closed: boolean;
};

type ConceptRelationship = {
  fromId: string;
  toId: string;
  from: string;
  to: string;
  label: string | null;
  kind: VectorRelationshipKind | null;
};

type FlowEffectData = {
  action: VectorEffectAction | null;
  nodeId: string | null;
  toNodeId: string | null;
  field: string | null;
  value: string | null;
  label: string | null;
  kind: VectorRelationshipKind | null;
  text: string | null;
};

type FlowStepData = {
  title: string;
  body: string | null;
  command: string | null;
  result: string | null;
  stateChanges: FlowEffectData[];
  sources: SourceLink[];
  setup: boolean;
  optional: boolean;
};

const MAX_ITEMS = 12;
const MAX_INLINE_ITEMS = 8;
const MAX_TABS = 6;
const CODE_TAB_COLLAPSE_LINE_THRESHOLD = 24;
const CODE_TAB_COLLAPSE_CHAR_THRESHOLD = 1600;
const DEPRECATED_HEAVY_COMPONENT_TYPES = new Set([
  "cards",
  "code_tabs",
  "comparison",
  "definition_grid",
  "source_links",
]);
const RENDERED_COMPONENT_TYPES = new Set([
  "answer_intro",
  "callout",
  "command_list",
  "concept_model",
  "step_flow",
]);
const NODE_ID_KEYS = ["id", "key", "name"];
const NODE_ARCHETYPE_KEYS = [
  "archetype",
  "kind",
  "node_type",
  "nodeType",
  "type",
];

export type AskGenerativeUiDiagnostic = {
  level: "info" | "warning" | "error";
  path: string;
  message: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readValue(record: UnknownRecord, keys: string[]): unknown {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      return record[key];
    }
  }
  return undefined;
}

function toText(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return null;
}

function toCode(value: unknown): string | null {
  if (typeof value === "string") {
    const normalized = value.replace(/\r\n/g, "\n").trim();
    return normalized.length > 0 ? normalized : null;
  }
  return toText(value);
}

function getText(record: UnknownRecord, keys: string[]): string | null {
  return toText(readValue(record, keys));
}

function getCode(record: UnknownRecord, keys: string[]): string | null {
  return toCode(readValue(record, keys));
}

function getArray(record: UnknownRecord, keys: string[]): unknown[] {
  const value = readValue(record, keys);
  return Array.isArray(value) ? value : [];
}

function getTextList(
  record: UnknownRecord,
  keys: string[],
  limit = MAX_INLINE_ITEMS,
): string[] {
  const value = readValue(record, keys);
  if (Array.isArray(value)) {
    return value.flatMap((item) => toText(item) ?? []).slice(0, limit);
  }
  const text = toText(value);
  return text ? [text] : [];
}

function normalizeTone(value: unknown): VectorArchetypeTone | null {
  const tone = toText(value)?.toLowerCase();
  if (
    tone === "mint" ||
    tone === "account" ||
    tone === "purple" ||
    tone === "green" ||
    tone === "dim"
  ) {
    return tone;
  }
  return null;
}

function normalizeBoolean(value: unknown): boolean {
  return value === true || toText(value)?.toLowerCase() === "true";
}

function inferNodeArchetype(record: UnknownRecord): VectorNodeArchetype {
  const explicit = normalizeVectorNodeArchetype(
    getText(record, NODE_ARCHETYPE_KEYS),
  );
  if (explicit) return explicit;

  const text = [
    getText(record, ["id", "key", "name"]),
    getText(record, ["label", "title", "name"]),
    getText(record, ["body", "description", "summary", "text"]),
  ]
    .flatMap((value) => (value ? [value.toLowerCase()] : []))
    .join(" ");

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

  return "program";
}

function normalizeFields(
  value: unknown,
  limit = MAX_INLINE_ITEMS,
): TextField[] {
  const fields: TextField[] = [];

  if (Array.isArray(value)) {
    for (const item of value) {
      if (!isRecord(item)) continue;
      const label = getText(item, ["label", "title", "name", "key", "term"]);
      const fieldValue = getText(item, [
        "value",
        "body",
        "text",
        "description",
        "summary",
      ]);
      if (label && fieldValue) {
        fields.push({
          label,
          value: fieldValue,
          tone: normalizeTone(readValue(item, ["tone", "variant"])),
          changed: normalizeBoolean(readValue(item, ["changed", "pop"])),
        });
      }
      if (fields.length >= limit) break;
    }
    return fields;
  }

  if (isRecord(value)) {
    for (const [label, rawValue] of Object.entries(value)) {
      const fieldValue = toText(rawValue);
      if (fieldValue) {
        fields.push({ label, value: fieldValue, tone: null, changed: false });
      }
      if (fields.length >= limit) break;
    }
  }

  return fields;
}

function normalizeEffectFromText(value: string): FlowEffectData {
  const match = value.match(
    /^(reveal|update|connect|close)\s+([^:]+)(?::\s*(.+))?$/i,
  );
  if (!match) {
    return {
      action: null,
      nodeId: null,
      toNodeId: null,
      field: null,
      value: null,
      label: null,
      kind: null,
      text: value,
    };
  }

  const action = normalizeVectorEffectAction(match[1]);
  const target = match[2]?.trim() ?? "";
  const detail = match[3]?.trim() ?? null;

  if (action === "connect") {
    const [from, to] = target.split(/\s*->\s*/);
    return {
      action,
      nodeId: from?.trim() || target,
      toNodeId: to?.trim() || null,
      field: null,
      value: null,
      label: detail,
      kind: normalizeVectorRelationshipKind(detail),
      text: value,
    };
  }

  if (action === "update") {
    const [nodeId, field] = target.split(".");
    return {
      action,
      nodeId: nodeId?.trim() || target,
      toNodeId: null,
      field: field?.trim() || null,
      value: detail,
      label: null,
      kind: null,
      text: value,
    };
  }

  return {
    action,
    nodeId: target,
    toNodeId: null,
    field: null,
    value: null,
    label: detail,
    kind: null,
    text: value,
  };
}

function normalizeStateChanges(value: unknown, limit = 4): FlowEffectData[] {
  const changes: FlowEffectData[] = [];
  const candidates = Array.isArray(value) ? value : value ? [value] : [];

  for (const item of candidates) {
    const text = toText(item);
    if (text) {
      changes.push(normalizeEffectFromText(text));
    } else if (isRecord(item)) {
      const action = getText(item, ["action", "type", "operation"]);
      const node = getText(item, ["node_id", "nodeId", "node", "id"]);
      const toNode = getText(item, [
        "to_node_id",
        "toNodeId",
        "to_node",
        "toNode",
        "target",
        "to",
      ]);
      const field = getText(item, ["field", "property", "key", "name"]);
      const fieldValue = getText(item, [
        "value",
        "new_value",
        "newValue",
        "result",
      ]);
      const label = getText(item, [
        "label",
        "body",
        "text",
        "description",
        "summary",
      ]);
      const kind = normalizeVectorRelationshipKind(
        getText(item, [
          "kind",
          "relationship_kind",
          "relationshipKind",
          "relationship",
        ]),
      );
      if (action || node || toNode || field || fieldValue || label) {
        changes.push({
          action: normalizeVectorEffectAction(action),
          nodeId: node,
          toNodeId: toNode,
          field,
          value: fieldValue,
          label,
          kind,
          text: null,
        });
      }
    }

    if (changes.length >= limit) break;
  }

  return changes;
}

function safeHref(value: unknown): string | null {
  const href = toText(value);
  if (!href) return null;

  if (href.startsWith("/") && !href.startsWith("//")) {
    return href;
  }

  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" ? href : null;
  } catch {
    return null;
  }
}

function normalizeLinks(
  value: unknown,
  limit = MAX_INLINE_ITEMS,
): SourceLink[] {
  const candidates = Array.isArray(value) ? value : value ? [value] : [];
  const seen = new Set<string>();
  const links: SourceLink[] = [];

  for (const item of candidates) {
    if (typeof item === "string") {
      const url = safeHref(item);
      if (!url || seen.has(url)) continue;
      seen.add(url);
      links.push({ title: url, url, description: null });
    } else if (isRecord(item)) {
      const url = safeHref(readValue(item, ["url", "href", "source"]));
      if (!url || seen.has(url)) continue;
      seen.add(url);
      links.push({
        title: getText(item, ["title", "label", "name"]) ?? url,
        url,
        description: getText(item, ["description", "body", "summary", "text"]),
      });
    }

    if (links.length >= limit) break;
  }

  return links;
}

function componentSources(component: UnknownRecord): SourceLink[] {
  return normalizeLinks(
    readValue(component, ["sources", "source_links", "links", "citations"]),
  );
}

function codeLinesFromText(code: string): CodeLine[] {
  return code.split("\n").map((line) => [line]);
}

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function renderCommandText(command: string): ReactNode {
  const normalized = command.replace(/^\$\s*/, "");
  let wordIndex = 0;

  return normalized.split(/(\s+)/).map((part, index) => {
    if (/^\s+$/.test(part)) return part;

    const currentWordIndex = wordIndex;
    wordIndex += 1;

    if (/^<[^>]+>$/.test(part)) {
      return (
        <Tok key={`${part}-${index}`} tone="mint">
          {part}
        </Tok>
      );
    }

    if (/^\d+(\.\d+)?$/.test(part)) {
      return (
        <Tok key={`${part}-${index}`} tone="green">
          {part}
        </Tok>
      );
    }

    if (currentWordIndex === 1) {
      return (
        <Tok key={`${part}-${index}`} tone="green">
          {part}
        </Tok>
      );
    }

    return part;
  });
}

function SectionLead({
  title,
  body,
}: {
  title?: string | null;
  body?: string | null;
}) {
  if (!title && !body) return null;

  return (
    <VectorAnswerIntro>
      {title ? <strong>{title}</strong> : null}
      {title && body ? " - " : null}
      {body}
    </VectorAnswerIntro>
  );
}

function SourcesInline({
  links,
  label = "Sources:",
}: {
  links: SourceLink[];
  label?: ReactNode;
}) {
  if (links.length === 0) return null;

  return (
    <SourcesRow label={label}>
      {links.map((link) => (
        <VectorSourceLink
          key={link.url}
          href={link.url}
          external={isExternalUrl(link.url)}
        >
          {link.title}
        </VectorSourceLink>
      ))}
    </SourcesRow>
  );
}

function NodeCard({
  node,
  highlight,
  fields,
  closed,
}: {
  node: ConceptNode;
  highlight?: boolean;
  fields?: TextField[];
  closed?: boolean;
}) {
  return (
    <VectorArchetypeNode
      archetype={node.archetype}
      label={node.label}
      address={node.address ?? node.id ?? undefined}
      description={node.description ?? undefined}
      fields={(fields ?? node.fields).slice(0, 5).map((field) => ({
        label: field.label,
        value: field.value,
        tone: field.tone ?? undefined,
        changed: field.changed,
      }))}
      active={highlight}
      closed={closed ?? node.closed}
    />
  );
}

function AnswerIntroComponent({ component }: { component: UnknownRecord }) {
  const title = getText(component, ["title", "heading", "label"]);
  const body = getText(component, ["body", "summary", "text", "description"]);
  const bullets = getTextList(component, ["bullets", "takeaways"]);

  if (!title && !body && bullets.length === 0) return null;

  return (
    <section>
      <SectionLead title={title} body={body} />
      {bullets.length > 0 ? (
        <ul className="mt-[-8px] list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-[#cdcdd6]">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function Callout({ component }: { component: UnknownRecord }) {
  const title = getText(component, ["title", "heading", "label"]);
  const body = getText(component, ["body", "text", "description", "summary"]);
  const tone = getText(component, ["tone", "variant", "level"])?.toLowerCase();

  if (!title && !body) return null;

  return (
    <LabeledPanel label={tone === "warning" ? "Warning" : "Note"} compact>
      <div className="space-y-1 text-[12.5px] leading-relaxed text-[#d8d8e0]">
        {title ? <div className="font-semibold text-white">{title}</div> : null}
        {body ? <p>{body}</p> : null}
      </div>
    </LabeledPanel>
  );
}

function normalizeConceptNodes(component: UnknownRecord): ConceptNode[] {
  return getArray(component, ["nodes", "items", "cards"])
    .flatMap((item) => {
      if (!isRecord(item)) return [];
      const id = getText(item, ["id", "key", "name"]);
      const archetype = inferNodeArchetype(item);
      const label =
        getText(item, ["label", "title", "name"]) ?? id ?? "Concept";
      const address = getText(item, [
        "address",
        "addr",
        "pubkey",
        "publicKey",
        "state_label",
        "stateLabel",
      ]);
      const description = getText(item, [
        "body",
        "description",
        "summary",
        "text",
      ]);
      const fields = normalizeFields(
        readValue(item, ["fields", "properties", "attributes", "facts"]),
      );
      const closed = normalizeBoolean(readValue(item, ["closed", "inactive"]));
      return [{ id, archetype, label, address, description, fields, closed }];
    })
    .slice(0, MAX_ITEMS);
}

function normalizeConceptRelationships(
  component: UnknownRecord,
  nodes: ConceptNode[],
): ConceptRelationship[] {
  const nodeLabels = new Map<string, string>();
  for (const node of nodes) {
    if (node.id) nodeLabels.set(node.id, node.label);
  }

  return getArray(component, ["relationships", "relations", "edges"])
    .flatMap((item) => {
      if (!isRecord(item)) return [];
      const from = getText(item, ["from", "source", "start"]);
      const to = getText(item, ["to", "target", "end"]);
      if (!from || !to) return [];
      return [
        {
          fromId: from,
          toId: to,
          from: nodeLabels.get(from) ?? from,
          to: nodeLabels.get(to) ?? to,
          label: getText(item, ["label", "title", "relationship", "verb"]),
          kind: normalizeVectorRelationshipKind(
            getText(item, ["kind", "type", "relationship", "verb"]),
          ),
        },
      ];
    })
    .slice(0, MAX_INLINE_ITEMS);
}

function normalizeStepFlag(item: UnknownRecord, keys: string[]): boolean {
  const explicit = readValue(item, keys);
  if (normalizeBoolean(explicit)) return true;
  const text = toText(explicit)?.toLowerCase();
  return text === "yes" || text === "setup" || text === "prerequisite";
}

function stepSearchText(
  item: UnknownRecord,
  title: string,
  command: string | null,
) {
  return normalizeMatchText(
    [
      title,
      command,
      getText(item, ["body", "description", "summary", "text"]),
      getText(item, ["role", "kind", "category", "section"]),
    ]
      .flatMap((value) => value ?? [])
      .join(" "),
  );
}

function isSetupStep(
  item: UnknownRecord,
  title: string,
  command: string | null,
) {
  if (
    normalizeStepFlag(item, [
      "setup",
      "prerequisite",
      "prereq",
      "is_setup",
      "isSetup",
    ])
  ) {
    return true;
  }

  const role = normalizeMatchText(
    getText(item, ["role", "kind", "category", "section"]),
  );
  if (/\b(setup|set up|prereq|prerequisite|before start)\b/.test(role)) {
    return true;
  }

  const text = stepSearchText(item, title, command);
  return (
    /\b(select devnet|set devnet|configure devnet|point .* devnet)\b/.test(
      text,
    ) ||
    /\b(airdrop|fund wallet|fund the wallet|devnet sol)\b/.test(text) ||
    /\b(solana config set|solana airdrop)\b/.test(text)
  );
}

function isOptionalStep(
  item: UnknownRecord,
  title: string,
  command: string | null,
) {
  if (
    normalizeStepFlag(item, [
      "optional",
      "is_optional",
      "isOptional",
      "secondary",
      "advanced",
    ])
  ) {
    return true;
  }

  const role = normalizeMatchText(
    getText(item, ["role", "kind", "category", "section"]),
  );
  if (/\b(optional|secondary|advanced|cleanup|more actions)\b/.test(role)) {
    return true;
  }

  const text = stepSearchText(item, title, command);
  return /\b(cleanup|clean up|close|burn|transfer|metadata|revoke|freeze)\b/.test(
    text,
  );
}

function ConceptModel({ component }: { component: UnknownRecord }) {
  const title =
    getText(component, ["title", "heading", "label"]) ?? "Mental model";
  const body = getText(component, ["body", "summary", "description", "text"]);
  const nodes = normalizeConceptNodes(component);

  if (nodes.length === 0) return null;

  const relationships = normalizeConceptRelationships(component, nodes);

  return (
    <LabeledPanel label={title}>
      {body ? <SectionLead body={body} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        {nodes.map((node, index) => (
          <NodeCard key={node.id ?? `${node.label}-${index}`} node={node} />
        ))}
      </div>
      {relationships.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2 text-[12px] text-[#8b8b9a]">
          {relationships.map((relationship) => (
            <VectorRelationshipChip
              key={`${relationship.from}-${relationship.to}-${relationship.label ?? ""}`}
              from={relationship.from}
              to={relationship.to}
              kind={relationship.kind ?? undefined}
              label={relationship.label ?? undefined}
            />
          ))}
        </div>
      ) : null}
    </LabeledPanel>
  );
}

function normalizeFlowSteps(component: UnknownRecord): FlowStepData[] {
  return getArray(component, ["steps", "items", "flow"])
    .flatMap((item, index) => {
      if (!isRecord(item)) return [];
      const command = getCode(item, [
        "command",
        "cmd",
        "copy",
        "copyText",
        "code",
      ]);
      const stepTitle =
        getText(item, ["title", "label", "name"]) ?? `Step ${index + 1}`;
      const stepBody = getText(item, [
        "body",
        "description",
        "summary",
        "text",
      ]);
      const result = getText(item, ["result", "outcome", "returns", "output"]);
      const stateChanges = normalizeStateChanges(
        readValue(item, [
          "state_changes",
          "stateChanges",
          "changes",
          "effects",
        ]),
      );
      const sources = normalizeLinks(
        readValue(item, ["sources", "source_links", "links", "citations"]),
      );
      if (!stepTitle && !stepBody && !command && !result) return [];
      const setup = isSetupStep(item, stepTitle, command);
      return [
        {
          title: stepTitle,
          body: stepBody,
          command,
          result,
          stateChanges,
          sources,
          setup,
          optional: !setup && isOptionalStep(item, stepTitle, command),
        },
      ];
    })
    .slice(0, MAX_ITEMS);
}

function effectText(effect: FlowEffectData): string {
  return [
    effect.action,
    effect.nodeId,
    effect.toNodeId,
    effect.field,
    effect.value,
    effect.label,
    effect.kind,
    effect.text,
  ]
    .flatMap((part) => (part ? [part] : []))
    .join(" ");
}

function StateChangeList({ changes }: { changes: FlowEffectData[] }) {
  if (changes.length === 0) return null;

  return (
    <VectorEffectList
      effects={changes.map(
        (change): VectorEffectItem => ({
          action: change.action ?? "update",
          nodeId: change.nodeId ?? undefined,
          toNodeId: change.toNodeId ?? undefined,
          field: change.field ?? undefined,
          value: change.value ?? undefined,
          label: change.label ?? undefined,
          text: change.text ?? undefined,
        }),
      )}
    />
  );
}

function CommandRows({
  commands,
  footnote,
}: {
  commands: Array<{
    label: ReactNode;
    command: string;
    note?: ReactNode;
    ok?: boolean;
  }>;
  footnote?: ReactNode;
}) {
  if (commands.length === 0) return null;

  return (
    <VectorCommandList footnote={footnote}>
      {commands.map((item, index) => (
        <CommandRow
          key={`${index}-${item.command}`}
          step={item.label}
          copyText={item.command}
          note={item.note}
          ok={item.ok}
        >
          {renderCommandText(item.command)}
        </CommandRow>
      ))}
    </VectorCommandList>
  );
}

function StepFlow({ component }: { component: UnknownRecord }) {
  const title =
    getText(component, ["title", "heading", "label"]) ?? "Step-by-step";
  const body = getText(component, ["body", "summary", "description", "text"]);
  const steps = normalizeFlowSteps(component);

  if (steps.length === 0) return null;

  return (
    <LabeledPanel label={title}>
      {body ? <SectionLead body={body} /> : null}
      <FlowSteps>
        {steps.map((step, index) => (
          <FlowStep
            key={`${index}-${step.title}`}
            num={String(index + 1).padStart(2, "0")}
            title={step.title}
            description={step.body}
            actionsColumn
          >
            {step.command ? (
              step.command.includes("\n") ? (
                <CodeSnippet lines={codeLinesFromText(step.command)} />
              ) : (
                <CommandRows
                  commands={[
                    {
                      label: "$",
                      command: step.command,
                    },
                  ]}
                />
              )
            ) : null}
            <StateChangeList changes={step.stateChanges} />
            {step.result ? (
              <StepReturns
                word="result"
                tone={index % 2 === 0 ? "mint" : "account"}
              >
                <ResultBanner>{step.result}</ResultBanner>
              </StepReturns>
            ) : null}
            <SourcesInline links={step.sources} label="Docs:" />
          </FlowStep>
        ))}
      </FlowSteps>
    </LabeledPanel>
  );
}

function normalizeMatchText(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function nodeAliases(node: ConceptNode): string[] {
  return [node.id, node.label]
    .flatMap((value) => {
      const normalized = normalizeMatchText(value);
      if (!normalized) return [];
      return [
        normalized,
        normalized.replace(/\b(account|address|data|state)\b/g, "").trim(),
      ];
    })
    .filter(
      (value, index, values) =>
        value.length >= 3 && values.indexOf(value) === index,
    );
}

function stepTouchesNode(step: FlowStepData, node: ConceptNode): boolean {
  const haystack = normalizeMatchText(
    [
      step.title,
      step.body,
      step.command,
      step.result,
      step.stateChanges.map(effectText),
    ]
      .flat()
      .join(" "),
  );

  return nodeAliases(node).some((candidate) => haystack.includes(candidate));
}

function effectTouchesNode(effect: FlowEffectData, node: ConceptNode): boolean {
  const targetText = normalizeMatchText(
    [effect.nodeId, effect.toNodeId].flatMap((value) => value ?? []).join(" "),
  );
  if (
    targetText &&
    nodeAliases(node).some(
      (candidate) =>
        targetText.includes(candidate) || candidate.includes(targetText),
    )
  ) {
    return true;
  }

  return nodeAliases(node).some((candidate) =>
    normalizeMatchText(effectText(effect)).includes(candidate),
  );
}

function upsertField(
  fields: TextField[],
  label: string,
  value: string,
  changed: boolean,
  tone: VectorArchetypeTone | null,
) {
  const fieldIndex = fields.findIndex(
    (field) => normalizeMatchText(field.label) === normalizeMatchText(label),
  );
  if (fieldIndex >= 0) {
    const currentField = fields[fieldIndex];
    if (!currentField) return;
    fields[fieldIndex] = {
      ...currentField,
      value,
      tone: tone ?? currentField.tone,
      changed,
    };
    return;
  }

  fields.push({ label, value, tone, changed });
}

function fieldsWithAppliedEffects(
  node: ConceptNode,
  completedSteps: FlowStepData[],
  recentStep: FlowStepData | null,
): { fields: TextField[]; closed: boolean } {
  const fields = node.fields.map((field) => ({ ...field, changed: false }));
  let closed = node.closed;

  for (const step of completedSteps) {
    for (const effect of step.stateChanges) {
      if (!effectTouchesNode(effect, node)) continue;
      if (effect.action === "close") {
        const changed = recentStep?.stateChanges.includes(effect) ?? false;
        closed = true;
        upsertField(fields, "state", "closed", changed, "dim");
        continue;
      }
      if (
        effect.action !== "update" &&
        !(effect.action === "reveal" && effect.field)
      ) {
        continue;
      }
      const nextValue = effect.value ?? effect.label;
      if (!effect.field || !nextValue) {
        continue;
      }

      const changed = recentStep?.stateChanges.includes(effect) ?? false;
      upsertField(fields, effect.field, nextValue, changed, null);
    }
  }

  return { fields, closed };
}

function stepHasExplicitEffects(step: FlowStepData): boolean {
  return step.stateChanges.length > 0;
}

function isNodeVisible(
  node: ConceptNode,
  nodeIndex: number,
  completedSteps: FlowStepData[],
  usesExplicitEffects: boolean,
): boolean {
  if (completedSteps.length === 0) return false;

  const touchedByEffect = completedSteps.some((step) =>
    step.stateChanges.some((effect) => effectTouchesNode(effect, node)),
  );

  if (usesExplicitEffects) {
    return touchedByEffect;
  }

  return (
    touchedByEffect ||
    completedSteps.some((step) => stepTouchesNode(step, node)) ||
    completedSteps.length > nodeIndex
  );
}

function nodeLabelForId(nodes: ConceptNode[], id: string): string {
  const normalizedId = normalizeMatchText(id);
  const matchingNode = nodes.find((node) =>
    nodeAliases(node).some(
      (candidate) =>
        candidate === normalizedId ||
        candidate.includes(normalizedId) ||
        normalizedId.includes(candidate),
    ),
  );

  return matchingNode?.label ?? id;
}

function relationshipMatchesEffect(
  relationship: ConceptRelationship,
  effect: FlowEffectData,
): boolean {
  if (effect.action !== "connect" || !effect.nodeId || !effect.toNodeId) {
    return false;
  }

  const effectFrom = normalizeMatchText(effect.nodeId);
  const effectTo = normalizeMatchText(effect.toNodeId);
  const relationshipFrom = normalizeMatchText(relationship.fromId);
  const relationshipTo = normalizeMatchText(relationship.toId);
  const endpointMatches = (left: string, right: string) =>
    left === right ||
    (left.length >= 4 &&
      right.length >= 4 &&
      (left.includes(right) || right.includes(left)));

  return (
    (endpointMatches(relationshipFrom, effectFrom) &&
      endpointMatches(relationshipTo, effectTo)) ||
    (endpointMatches(relationshipFrom, effectTo) &&
      endpointMatches(relationshipTo, effectFrom))
  );
}

function relationshipsFromConnectEffects(
  nodes: ConceptNode[],
  completedSteps: FlowStepData[],
): ConceptRelationship[] {
  return completedSteps
    .flatMap((step) => step.stateChanges)
    .flatMap((effect) => {
      if (effect.action !== "connect" || !effect.nodeId || !effect.toNodeId) {
        return [];
      }
      return [
        {
          fromId: effect.nodeId,
          toId: effect.toNodeId,
          from: nodeLabelForId(nodes, effect.nodeId),
          to: nodeLabelForId(nodes, effect.toNodeId),
          kind: effect.kind,
          label: effect.label,
        },
      ];
    });
}

function visibleRelationshipsForSteps({
  nodes,
  relationships,
  completedSteps,
  usesExplicitEffects,
}: {
  nodes: ConceptNode[];
  relationships: ConceptRelationship[];
  completedSteps: FlowStepData[];
  usesExplicitEffects: boolean;
}): ConceptRelationship[] {
  const visibleNodeIds = new Set(
    nodes
      .filter((node, index) =>
        isNodeVisible(node, index, completedSteps, usesExplicitEffects),
      )
      .flatMap((node) => [node.id, node.label].flatMap((value) => value ?? [])),
  );
  const completedEffects = completedSteps.flatMap((step) => step.stateChanges);
  const connectedRelationships = relationships.filter((relationship) => {
    if (usesExplicitEffects) {
      return completedEffects.some((effect) =>
        relationshipMatchesEffect(relationship, effect),
      );
    }

    return (
      visibleNodeIds.has(relationship.fromId) &&
      visibleNodeIds.has(relationship.toId)
    );
  });

  const relationshipsByKey = new Map<string, ConceptRelationship>();
  for (const relationship of [
    ...connectedRelationships,
    ...relationshipsFromConnectEffects(nodes, completedSteps),
  ]) {
    const key = `${normalizeMatchText(relationship.fromId)}-${normalizeMatchText(
      relationship.toId,
    )}-${relationship.kind ?? relationship.label ?? ""}`;
    if (!relationshipsByKey.has(key)) {
      relationshipsByKey.set(key, relationship);
    }
  }

  return [...relationshipsByKey.values()].slice(0, MAX_INLINE_ITEMS);
}

function splitFlowSteps(steps: FlowStepData[]): {
  setupSteps: FlowStepData[];
  mainSteps: FlowStepData[];
  optionalSteps: FlowStepData[];
} {
  const setupSteps = steps.filter((step) => step.setup);
  const optionalSteps = steps.filter((step) => step.optional);
  const mainSteps = steps.filter((step) => !step.setup && !step.optional);

  return {
    setupSteps,
    mainSteps:
      mainSteps.length > 0 ? mainSteps : steps.filter((step) => !step.optional),
    optionalSteps,
  };
}

function uniqueSourceLinks(links: SourceLink[]): SourceLink[] {
  const seen = new Set<string>();
  const result: SourceLink[] = [];

  for (const link of links) {
    if (seen.has(link.url)) continue;
    seen.add(link.url);
    result.push(link);
  }

  return result.slice(0, MAX_INLINE_ITEMS);
}

function modelStripToneClass(archetype: VectorNodeArchetype) {
  const tone = vectorNodeArchetypeMeta(archetype).tone;
  switch (tone) {
    case "mint":
      return styles.modelStripNodeMint;
    case "account":
    case "green":
      return styles.modelStripNodeGreen;
    case "purple":
      return styles.modelStripNodePurple;
    default:
      return styles.modelStripNodeDim;
  }
}

function ModelStrip({
  nodes,
  completedSteps,
  recentStep,
  usesExplicitEffects,
}: {
  nodes: ConceptNode[];
  completedSteps: FlowStepData[];
  recentStep: FlowStepData | null;
  usesExplicitEffects: boolean;
}) {
  return (
    <section className={styles.modelStripWrap} aria-label="Concept model">
      <div className={styles.modelStripHeader}>
        <span>Model</span>
        <span>
          {nodes.length} part{nodes.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className={styles.modelStrip}>
        {nodes.slice(0, 5).map((node, index) => {
          const meta = vectorNodeArchetypeMeta(node.archetype);
          const state = fieldsWithAppliedEffects(
            node,
            completedSteps,
            recentStep,
          );
          const active = isNodeVisible(
            node,
            index,
            completedSteps,
            usesExplicitEffects,
          );
          const recent = recentStep
            ? stepTouchesNode(recentStep, node) ||
              recentStep.stateChanges.some((effect) =>
                effectTouchesNode(effect, node),
              )
            : false;
          const changedField = state.fields.find((field) => field.changed);
          const status = state.closed
            ? "closed"
            : changedField
              ? `${changedField.label}: ${changedField.value}`
              : active
                ? "ready"
                : "pending";

          return (
            <React.Fragment key={node.id ?? `${node.label}-${index}`}>
              {index > 0 ? (
                <span className={styles.modelStripArrow} aria-hidden="true">
                  -&gt;
                </span>
              ) : null}
              <div
                className={cx(
                  styles.modelStripNode,
                  modelStripToneClass(node.archetype),
                  active && styles.modelStripNodeActive,
                  recent && styles.modelStripNodeRecent,
                  state.closed && styles.modelStripNodeClosed,
                )}
                data-archetype={node.archetype}
              >
                <span className={styles.modelStripTag}>{meta.tag}</span>
                <span className={styles.modelStripText}>
                  <span className={styles.modelStripTitle}>{node.label}</span>
                  <span className={styles.modelStripStatus}>{status}</span>
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}

function PrerequisiteChecklist({ steps }: { steps: FlowStepData[] }) {
  if (steps.length === 0) return null;

  return (
    <section className={styles.prereqChecklist}>
      <div className={styles.prereqHeader}>
        <span>Before you start</span>
        <span>
          {steps.length} prerequisite{steps.length === 1 ? "" : "s"}
        </span>
      </div>
      <ul className={styles.prereqRows}>
        {steps.slice(0, 4).map((step, index) => (
          <li
            key={`${index}-${step.title}`}
            className={styles.prereqRowCompact}
          >
            <span className={styles.prereqCheck} aria-hidden="true">
              ✓
            </span>
            <span className={styles.prereqText}>
              <span className={styles.prereqTitle}>{step.title}</span>
              {step.command ? (
                <code className={styles.prereqCommand}>
                  $ {step.command.replace(/^\$\s*/, "")}
                </code>
              ) : step.body ? (
                <span className={styles.prereqNote}>{step.body}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function effectSummary(effect: FlowEffectData): string {
  if (effect.text) return effect.text;
  if (effect.action === "connect" && effect.nodeId && effect.toNodeId) {
    return `${effect.nodeId} ${effect.kind ?? "connects to"} ${effect.toNodeId}`;
  }
  if (effect.action === "close" && effect.nodeId) {
    return `${effect.nodeId} closes`;
  }
  if (effect.nodeId && effect.field && (effect.value || effect.label)) {
    return `${effect.nodeId}.${effect.field} = ${effect.value ?? effect.label}`;
  }
  return [effect.nodeId, effect.field, effect.value, effect.label]
    .flatMap((part) => part ?? [])
    .join(" ");
}

function StepMetaRows({ step }: { step: FlowStepData }) {
  const effects = step.stateChanges
    .map(effectSummary)
    .filter((item) => item.length > 0);

  if (!step.result && effects.length === 0) return null;

  return (
    <div className={styles.stepMetaRows}>
      {step.result ? (
        <div className={styles.stepMetaRow}>
          <span>Result</span>
          <span>{step.result}</span>
        </div>
      ) : null}
      {effects.length > 0 ? (
        <details className={styles.stepMetaDetails}>
          <summary>State changes</summary>
          <ul>
            {effects.slice(0, 3).map((effect, index) => (
              <li key={`${index}-${effect}`}>{effect}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

function OptionalStepsDisclosure({ steps }: { steps: FlowStepData[] }) {
  if (steps.length === 0) return null;

  return (
    <details className={styles.optionalSteps}>
      <summary>More actions ({steps.length})</summary>
      <div className={styles.optionalStepRows}>
        {steps.map((step, index) => (
          <div
            key={`${index}-${step.title}`}
            className={styles.optionalStepRow}
          >
            <div className={styles.optionalStepText}>
              <span>{step.title}</span>
              {step.result ? <small>{step.result}</small> : null}
            </div>
            {step.command ? (
              <code className={styles.optionalStepCommand}>
                $ {step.command.replace(/^\$\s*/, "")}
              </code>
            ) : null}
          </div>
        ))}
      </div>
    </details>
  );
}

function InteractiveConceptFlow({
  conceptComponent,
  flowComponent,
}: {
  conceptComponent: UnknownRecord;
  flowComponent: UnknownRecord;
}) {
  const nodes = React.useMemo(
    () => normalizeConceptNodes(conceptComponent),
    [conceptComponent],
  );
  const steps = React.useMemo(
    () => normalizeFlowSteps(flowComponent),
    [flowComponent],
  );
  const relationships = React.useMemo(
    () => normalizeConceptRelationships(conceptComponent, nodes),
    [conceptComponent, nodes],
  );
  const [completed, setCompleted] = React.useState(0);
  const [isAdvancing, setIsAdvancing] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setCompleted(0);
    setIsAdvancing(false);
  }, [steps.length]);

  React.useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (nodes.length === 0 || steps.length === 0) return null;

  const conceptBody = getText(conceptComponent, [
    "body",
    "summary",
    "description",
    "text",
  ]);
  const flowTitle =
    getText(flowComponent, ["title", "heading", "label"]) ?? "Flow";
  const flowBody = getText(flowComponent, [
    "body",
    "summary",
    "description",
    "text",
  ]);
  const { setupSteps, mainSteps, optionalSteps } = splitFlowSteps(steps);
  const allComplete = completed >= mainSteps.length;
  const activeIndex = allComplete
    ? mainSteps.length - 1
    : Math.min(completed, mainSteps.length - 1);
  const completedMainSteps = mainSteps.slice(0, completed);
  const appliedSteps = [...setupSteps, ...completedMainSteps];
  const recentStep = completed > 0 ? (mainSteps[completed - 1] ?? null) : null;
  const usesExplicitEffects = steps.some(stepHasExplicitEffects);
  const visibleRelationships = visibleRelationshipsForSteps({
    nodes,
    relationships,
    completedSteps: appliedSteps,
    usesExplicitEffects,
  });
  const footerSources = uniqueSourceLinks([
    ...componentSources(conceptComponent),
    ...componentSources(flowComponent),
    ...steps.flatMap((step) => step.sources),
  ]);

  const handleAdvance = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    if (allComplete) {
      setCompleted(0);
      setIsAdvancing(false);
      return;
    }

    setIsAdvancing(true);
    timerRef.current = window.setTimeout(() => {
      setCompleted((value) => Math.min(value + 1, mainSteps.length));
      setIsAdvancing(false);
      timerRef.current = null;
    }, 520);
  };

  return (
    <section className={styles.guidedAnswer}>
      {conceptBody ? <SectionLead body={conceptBody} /> : null}
      <ModelStrip
        nodes={nodes}
        completedSteps={appliedSteps}
        recentStep={recentStep}
        usesExplicitEffects={usesExplicitEffects}
      />
      {visibleRelationships.length > 0 ? (
        <div className={styles.compactRelationshipRow}>
          {visibleRelationships.map((relationship) => (
            <VectorRelationshipChip
              key={`${relationship.fromId}-${relationship.toId}-${relationship.label ?? relationship.kind ?? ""}`}
              from={relationship.from}
              to={relationship.to}
              kind={relationship.kind ?? undefined}
              label={relationship.label ?? undefined}
            />
          ))}
        </div>
      ) : null}
      <PrerequisiteChecklist steps={setupSteps} />

      <section className={styles.compactFlow}>
        <div className={styles.compactFlowHeader}>
          <div>
            <h3>{flowTitle}</h3>
            {flowBody ? <p>{flowBody}</p> : null}
          </div>
          <span>
            {mainSteps.length} step{mainSteps.length === 1 ? "" : "s"}
          </span>
        </div>
        <FlowSteps>
          {mainSteps.map((step, index) => {
            const isCompleted = index < completed;
            const isActive = index === activeIndex;
            const hasSingleLineCommand =
              isActive && step.command ? !step.command.includes("\n") : false;
            const hasCommand = Boolean(step.command);
            return (
              <FlowStep
                key={`${index}-${step.title}`}
                num={isCompleted ? "✓" : String(index + 1).padStart(2, "0")}
                title={step.title}
                description={
                  isCompleted
                    ? (step.result ?? step.body)
                    : isActive
                      ? step.body
                      : step.body
                }
                current={isActive}
                done={isCompleted}
                actionsColumn={isActive}
              >
                {isActive && step.command ? (
                  step.command.includes("\n") ? (
                    <CodeSnippet lines={codeLinesFromText(step.command)} />
                  ) : (
                    <CommandTerminal
                      copyText={step.command}
                      hint={completed === 0 && !isAdvancing}
                      action={
                        <ExecuteButton
                          busy={isAdvancing}
                          onClick={handleAdvance}
                        >
                          {allComplete ? "Replay" : "Execute"}
                        </ExecuteButton>
                      }
                    >
                      {renderCommandText(step.command)}
                    </CommandTerminal>
                  )
                ) : null}
                {isActive && !hasSingleLineCommand ? (
                  <ExecuteButton
                    busy={isAdvancing}
                    variant={hasCommand ? "primary" : "secondary"}
                    onClick={handleAdvance}
                  >
                    {allComplete ? "Replay" : hasCommand ? "Execute" : "Next"}
                  </ExecuteButton>
                ) : null}
                {isCompleted ? <StepMetaRows step={step} /> : null}
              </FlowStep>
            );
          })}
        </FlowSteps>
      </section>

      <OptionalStepsDisclosure steps={optionalSteps} />
      <SourcesInline links={footerSources} label="Docs:" />
    </section>
  );
}

function CommandListComponent({ component }: { component: UnknownRecord }) {
  const title = getText(component, ["title", "heading", "label"]);
  const body = getText(component, ["body", "summary", "description", "text"]);
  const footnote = getText(component, ["footnote", "note"]);
  const commands = getArray(component, ["commands", "items", "steps"])
    .flatMap((item, index) => {
      if (!isRecord(item)) return [];
      const command = getCode(item, [
        "command",
        "cmd",
        "copy",
        "copyText",
        "code",
      ]);
      if (!command) return [];
      return [
        {
          label:
            getText(item, ["step", "label", "title", "name"]) ??
            String(index + 1).padStart(2, "0"),
          note: getText(item, ["note", "description", "body", "summary"]),
          command,
          ok: getText(item, ["ok", "done"]) === "true",
        },
      ];
    })
    .slice(0, MAX_ITEMS);

  if (commands.length === 0) return null;

  return (
    <CodeDisclosure summary={title ?? "Commands"}>
      {body ? <SectionLead body={body} /> : null}
      <CommandRows commands={commands} footnote={footnote} />
    </CodeDisclosure>
  );
}

function normalizeCodeTabs(component: UnknownRecord): CodeTab[] {
  const rawTabs = getArray(component, ["tabs", "items", "snippets"]);
  const tabs = rawTabs
    .flatMap((item) => {
      if (!isRecord(item)) return [];
      const code = getCode(item, ["code", "content", "text", "body"]);
      if (!code) return [];
      const language = getText(item, ["language", "lang", "id"]);
      return [
        {
          label:
            getText(item, ["label", "title", "name"]) ?? language ?? "Code",
          language,
          code,
          sources: normalizeLinks(
            readValue(item, ["sources", "source_links", "links", "citations"]),
          ),
        },
      ];
    })
    .slice(0, MAX_TABS);

  if (tabs.length > 0) return tabs;

  const code = getCode(component, ["code", "content", "text"]);
  if (!code) return [];
  const language = getText(component, ["language", "lang"]);
  return [
    {
      label:
        getText(component, ["label", "title", "name"]) ?? language ?? "Code",
      language,
      code,
      sources: componentSources(component),
    },
  ];
}

function codeLineCount(code: string): number {
  return code.length === 0 ? 0 : code.split("\n").length;
}

function shouldCollapseCodeTab(tab: CodeTab): boolean {
  const language = tab.language?.toLowerCase() ?? "";
  const isTypeScriptLike = ["ts", "tsx", "typescript", "javascript", "js"].some(
    (candidate) => language.includes(candidate),
  );
  const lineCount = codeLineCount(tab.code);

  return (
    tab.code.length > CODE_TAB_COLLAPSE_CHAR_THRESHOLD ||
    lineCount > CODE_TAB_COLLAPSE_LINE_THRESHOLD ||
    (isTypeScriptLike && lineCount > 12)
  );
}

function CodeTabs({ component }: { component: UnknownRecord }) {
  const tabs = React.useMemo(() => normalizeCodeTabs(component), [component]);
  const [selected, setSelected] = React.useState(0);
  const activeIndex = Math.min(selected, Math.max(tabs.length - 1, 0));
  const active = tabs[activeIndex];
  const title = getText(component, ["title", "heading"]) ?? "Code snippets";
  const body = getText(component, ["body", "summary", "description"]);
  const collapseByDefault = tabs.some(shouldCollapseCodeTab);

  React.useEffect(() => {
    if (selected >= tabs.length) setSelected(0);
  }, [selected, tabs.length]);

  if (!active) return null;

  const tabItems = tabs.map((tab, index) => ({
    id: String(index),
    label: tab.label,
  }));

  return (
    <CodeDisclosure
      summary={title}
      collapsible={collapseByDefault}
      defaultOpen={!collapseByDefault}
      collapsedLabel="Show code"
      expandedLabel="Hide code"
      meta={collapseByDefault ? `${codeLineCount(active.code)} lines` : null}
    >
      {body ? <SectionLead body={body} /> : null}
      {tabs.length > 1 ? (
        <TabBar
          tabs={tabItems}
          active={String(activeIndex)}
          onSelect={(id) => setSelected(Number(id))}
        />
      ) : null}
      <TabPanel>
        <CodeSnippet
          lines={codeLinesFromText(active.code)}
          compact={collapseByDefault}
        />
        <SourcesInline links={active.sources} label="Docs:" />
      </TabPanel>
    </CodeDisclosure>
  );
}

function SourceLinks({ component }: { component: UnknownRecord }) {
  const links = normalizeLinks(
    readValue(component, ["links", "sources", "items", "citations"]),
  );
  const title = getText(component, ["title", "heading", "label"]) ?? "Sources";
  const body = getText(component, ["body", "summary", "description", "text"]);

  if (links.length === 0) return null;

  return (
    <LabeledPanel label={title} compact>
      {body ? <SectionLead body={body} /> : null}
      <SourcesInline links={links} />
    </LabeledPanel>
  );
}

function Cards({ component }: { component: UnknownRecord }) {
  const title = getText(component, ["title", "heading", "label"]) ?? "Details";
  const body = getText(component, ["body", "summary", "description", "text"]);
  const cards = getArray(component, ["cards", "items"])
    .flatMap((item) => {
      if (!isRecord(item)) return [];
      const cardTitle = getText(item, ["title", "label", "name"]);
      const cardBody = getText(item, [
        "body",
        "summary",
        "description",
        "text",
      ]);
      const links = normalizeLinks(readValue(item, ["links", "sources"]));
      if (!cardTitle && !cardBody && links.length === 0) return [];
      return [{ title: cardTitle, body: cardBody, links }];
    })
    .slice(0, MAX_ITEMS);

  if (cards.length === 0) return null;

  return (
    <LabeledPanel label={title} compact>
      {body ? <SectionLead body={body} /> : null}
      <div className="grid gap-2 md:grid-cols-2">
        {cards.map((card, index) => (
          <div
            key={`${index}-${card.title ?? ""}`}
            className="rounded-lg border border-white/10 bg-white/[0.025] p-2.5"
          >
            {card.title ? (
              <h4 className="text-[12.5px] font-semibold text-white">
                {card.title}
              </h4>
            ) : null}
            {card.body ? (
              <p className="mt-1 text-[12px] leading-relaxed text-[#b7b7c3]">
                {card.body}
              </p>
            ) : null}
            <SourcesInline links={card.links} label="Docs:" />
          </div>
        ))}
      </div>
    </LabeledPanel>
  );
}

function DefinitionGrid({ component }: { component: UnknownRecord }) {
  const title =
    getText(component, ["title", "heading", "label"]) ?? "Definitions";
  const body = getText(component, ["body", "summary", "description", "text"]);
  const definitions = getArray(component, ["definitions", "items", "terms"])
    .flatMap((item) => {
      if (!isRecord(item)) return [];
      const term = getText(item, ["term", "title", "label", "name", "key"]);
      const definition = getText(item, [
        "definition",
        "body",
        "value",
        "description",
        "text",
      ]);
      if (!term || !definition) return [];
      return [{ term, definition }];
    })
    .slice(0, MAX_ITEMS);

  if (definitions.length === 0) return null;

  return (
    <LabeledPanel label={title}>
      {body ? <SectionLead body={body} /> : null}
      <dl className="grid gap-3 md:grid-cols-2">
        {definitions.map((item) => (
          <div
            key={item.term}
            className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
          >
            <dt className="text-[13px] font-semibold text-white">
              {item.term}
            </dt>
            <dd className="mt-1 text-[12.5px] leading-relaxed text-[#cdcdd6]">
              {item.definition}
            </dd>
          </div>
        ))}
      </dl>
    </LabeledPanel>
  );
}

function Comparison({ component }: { component: UnknownRecord }) {
  const title =
    getText(component, ["title", "heading", "label"]) ?? "Comparison";
  const body = getText(component, ["body", "summary", "description", "text"]);
  const columns =
    getTextList(component, ["columns", "headers"], 4).length > 0
      ? getTextList(component, ["columns", "headers"], 4)
      : ["Option A", "Option B"];
  const rows = getArray(component, ["rows", "items"])
    .flatMap((item) => {
      if (!isRecord(item)) return [];
      const label = getText(item, ["label", "feature", "title", "name"]);
      const values = Array.isArray(item.values)
        ? item.values.flatMap((value) => toText(value) ?? [])
        : [
            getText(item, ["left", "a", "first", "option_a"]),
            getText(item, ["right", "b", "second", "option_b"]),
          ].flatMap((value) => value ?? []);
      if (!label || values.length === 0) return [];
      return [{ label, values: values.slice(0, columns.length) }];
    })
    .slice(0, MAX_ITEMS);

  if (rows.length === 0) return null;

  return (
    <LabeledPanel label={title}>
      {body ? <SectionLead body={body} /> : null}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full text-left text-[12px]">
          <thead className="bg-white/[0.04] text-[#8b8b9a]">
            <tr>
              <th className="whitespace-nowrap px-3 py-2 font-medium">
                Feature
              </th>
              {columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-3 py-2 font-medium"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((row) => (
              <tr key={row.label}>
                <th className="min-w-28 px-3 py-2 align-top font-medium text-white">
                  {row.label}
                </th>
                {columns.map((column, index) => (
                  <td
                    key={`${row.label}-${column}`}
                    className="min-w-32 px-3 py-2 align-top text-[#cdcdd6]"
                  >
                    {row.values[index] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LabeledPanel>
  );
}

function collectConceptNodeIds(ui: AskGenerativeUi): Set<string> {
  const nodeIds = new Set<string>();

  for (const component of ui.components) {
    if (!isRecord(component) || component.type !== "concept_model") continue;
    for (const item of getArray(component, ["nodes", "items", "cards"])) {
      if (!isRecord(item)) continue;
      const id = getText(item, NODE_ID_KEYS);
      if (id) nodeIds.add(id);
    }
  }

  return nodeIds;
}

function pushDiagnostic(
  diagnostics: AskGenerativeUiDiagnostic[],
  diagnostic: AskGenerativeUiDiagnostic,
) {
  diagnostics.push(diagnostic);
}

function diagnoseConceptModel(
  component: UnknownRecord,
  componentPath: string,
  diagnostics: AskGenerativeUiDiagnostic[],
) {
  const nodes = getArray(component, ["nodes", "items", "cards"]);
  const nodeIds = new Set<string>();

  nodes.forEach((item, nodeIndex) => {
    const nodePath = `${componentPath}.nodes[${nodeIndex}]`;
    if (!isRecord(item)) {
      pushDiagnostic(diagnostics, {
        level: "error",
        path: nodePath,
        message: "Node must be an object.",
      });
      return;
    }

    const id = getText(item, NODE_ID_KEYS);
    const archetype = getText(item, NODE_ARCHETYPE_KEYS);
    if (id) nodeIds.add(id);
    if (!id) {
      pushDiagnostic(diagnostics, {
        level: "warning",
        path: nodePath,
        message:
          "Node is missing an id; step effects cannot target it reliably.",
      });
    }
    if (!archetype) {
      pushDiagnostic(diagnostics, {
        level: "warning",
        path: `${nodePath}.archetype`,
        message: "Node should include an explicit archetype.",
      });
    } else if (!normalizeVectorNodeArchetype(archetype)) {
      pushDiagnostic(diagnostics, {
        level: "error",
        path: `${nodePath}.archetype`,
        message: `Unsupported node archetype "${archetype}".`,
      });
    }
  });

  getArray(component, ["relationships", "relations", "edges"]).forEach(
    (item, relationshipIndex) => {
      const relationshipPath = `${componentPath}.relationships[${relationshipIndex}]`;
      if (!isRecord(item)) {
        pushDiagnostic(diagnostics, {
          level: "error",
          path: relationshipPath,
          message: "Relationship must be an object.",
        });
        return;
      }

      const from = getText(item, ["from", "source", "start"]);
      const to = getText(item, ["to", "target", "end"]);
      const kind = getText(item, ["kind", "type", "relationship", "verb"]);

      if (!from || !to) {
        pushDiagnostic(diagnostics, {
          level: "error",
          path: relationshipPath,
          message: "Relationship must include from and to ids.",
        });
      }
      if (from && !nodeIds.has(from)) {
        pushDiagnostic(diagnostics, {
          level: "warning",
          path: `${relationshipPath}.from`,
          message: `Relationship references unknown node id "${from}".`,
        });
      }
      if (to && !nodeIds.has(to)) {
        pushDiagnostic(diagnostics, {
          level: "warning",
          path: `${relationshipPath}.to`,
          message: `Relationship references unknown node id "${to}".`,
        });
      }
      if (!kind) {
        pushDiagnostic(diagnostics, {
          level: "warning",
          path: `${relationshipPath}.kind`,
          message: "Relationship should include a kind.",
        });
      } else if (!normalizeVectorRelationshipKind(kind)) {
        pushDiagnostic(diagnostics, {
          level: "error",
          path: `${relationshipPath}.kind`,
          message: `Unsupported relationship kind "${kind}".`,
        });
      }
    },
  );
}

function diagnoseStepFlow(
  component: UnknownRecord,
  componentPath: string,
  knownNodeIds: Set<string>,
  diagnostics: AskGenerativeUiDiagnostic[],
) {
  const steps = getArray(component, ["steps", "items", "flow"]);

  steps.forEach((item, stepIndex) => {
    const stepPath = `${componentPath}.steps[${stepIndex}]`;
    if (!isRecord(item)) {
      pushDiagnostic(diagnostics, {
        level: "error",
        path: stepPath,
        message: "Step must be an object.",
      });
      return;
    }

    const effects = getArray(item, [
      "state_changes",
      "stateChanges",
      "changes",
      "effects",
    ]);
    if (effects.length === 0) {
      pushDiagnostic(diagnostics, {
        level: "warning",
        path: `${stepPath}.effects`,
        message: "Procedural visual steps should include effects.",
      });
      return;
    }

    effects.forEach((effect, effectIndex) => {
      const effectPath = `${stepPath}.effects[${effectIndex}]`;
      const normalized =
        typeof effect === "string"
          ? normalizeEffectFromText(effect)
          : isRecord(effect)
            ? normalizeStateChanges([effect], 1)[0]
            : null;

      if (!normalized) {
        pushDiagnostic(diagnostics, {
          level: "error",
          path: effectPath,
          message:
            "Effect must be a structured object or supported effect string.",
        });
        return;
      }

      if (!normalized.action) {
        pushDiagnostic(diagnostics, {
          level: "error",
          path: `${effectPath}.action`,
          message: "Effect action must be reveal, update, connect, or close.",
        });
      }
      if (normalized.action === "connect" && !normalized.toNodeId) {
        pushDiagnostic(diagnostics, {
          level: "error",
          path: `${effectPath}.to_node_id`,
          message: "Connect effects must include to_node_id.",
        });
      }
      if (
        (normalized.action === "reveal" ||
          normalized.action === "update" ||
          normalized.action === "connect" ||
          normalized.action === "close") &&
        !normalized.nodeId
      ) {
        pushDiagnostic(diagnostics, {
          level: "error",
          path: `${effectPath}.node_id`,
          message: "Effect must include node_id.",
        });
      }
      for (const nodeId of [normalized.nodeId, normalized.toNodeId]) {
        if (nodeId && !knownNodeIds.has(nodeId)) {
          pushDiagnostic(diagnostics, {
            level: "error",
            path: effectPath,
            message: `Effect references unknown node id "${nodeId}".`,
          });
        }
      }
    });
  });
}

/**
 * Returns renderer diagnostics for development tooling and fixture previews.
 */
export function getAskGenerativeUiDiagnostics(
  ui: AskGenerativeUi,
): AskGenerativeUiDiagnostic[] {
  const diagnostics: AskGenerativeUiDiagnostic[] = [];
  const knownNodeIds = collectConceptNodeIds(ui);

  ui.components.forEach((component, componentIndex) => {
    const componentPath = `components[${componentIndex}]`;
    if (!isRecord(component) || typeof component.type !== "string") {
      pushDiagnostic(diagnostics, {
        level: "error",
        path: componentPath,
        message: "Component must be an object with a string type.",
      });
      return;
    }

    if (DEPRECATED_HEAVY_COMPONENT_TYPES.has(component.type)) {
      pushDiagnostic(diagnostics, {
        level: "info",
        path: `${componentPath}.type`,
        message: `Deprecated component "${component.type}" is ignored by the visual renderer.`,
      });
      return;
    }

    if (!RENDERED_COMPONENT_TYPES.has(component.type)) {
      pushDiagnostic(diagnostics, {
        level: "warning",
        path: `${componentPath}.type`,
        message: `Unsupported component "${component.type}" is ignored by the visual renderer.`,
      });
      return;
    }

    if (component.type === "concept_model") {
      diagnoseConceptModel(component, componentPath, diagnostics);
    } else if (component.type === "step_flow") {
      diagnoseStepFlow(component, componentPath, knownNodeIds, diagnostics);
    }
  });

  return diagnostics;
}

function renderComponent(component: AskGenerativeUiComponent) {
  if (!isRecord(component) || typeof component.type !== "string") return null;
  if (DEPRECATED_HEAVY_COMPONENT_TYPES.has(component.type)) return null;

  switch (component.type) {
    case "answer_intro":
      return <AnswerIntroComponent component={component} />;
    case "callout":
      return <Callout component={component} />;
    case "cards":
      return <Cards component={component} />;
    case "code_tabs":
      return <CodeTabs component={component} />;
    case "command_list":
      return <CommandListComponent component={component} />;
    case "comparison":
      return <Comparison component={component} />;
    case "concept_model":
      return <ConceptModel component={component} />;
    case "definition_grid":
      return <DefinitionGrid component={component} />;
    case "source_links":
      return <SourceLinks component={component} />;
    case "step_flow":
      return <StepFlow component={component} />;
    default:
      return null;
  }
}

function findInteractiveFlowComponents(
  components: AskGenerativeUiComponent[],
): {
  conceptComponent: UnknownRecord;
  flowComponent: UnknownRecord;
} | null {
  let conceptComponent: UnknownRecord | null = null;
  let flowComponent: UnknownRecord | null = null;

  for (const component of components) {
    if (!isRecord(component) || typeof component.type !== "string") continue;
    if (!conceptComponent && component.type === "concept_model") {
      conceptComponent = component;
    } else if (!flowComponent && component.type === "step_flow") {
      flowComponent = component;
    }
  }

  if (
    !conceptComponent ||
    !flowComponent ||
    normalizeConceptNodes(conceptComponent).length === 0 ||
    normalizeFlowSteps(flowComponent).length === 0
  ) {
    return null;
  }

  return { conceptComponent, flowComponent };
}

export function GenerativeUiAnswer({ ui }: { ui: AskGenerativeUi }) {
  const interactiveFlow = findInteractiveFlowComponents(ui.components);
  let didRenderInteractiveFlow = false;
  const rendered: React.ReactNode[] = [];

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const diagnostics = getAskGenerativeUiDiagnostics(ui);
    if (diagnostics.length > 0) {
      console.warn("Ask generative UI diagnostics", diagnostics);
    }
  }, [ui]);

  ui.components.forEach((component, index) => {
    if (
      interactiveFlow &&
      (component === interactiveFlow.conceptComponent ||
        component === interactiveFlow.flowComponent)
    ) {
      if (!didRenderInteractiveFlow) {
        didRenderInteractiveFlow = true;
        rendered.push(
          <InteractiveConceptFlow
            key={`interactive-flow-${index}`}
            conceptComponent={interactiveFlow.conceptComponent}
            flowComponent={interactiveFlow.flowComponent}
          />,
        );
      }
      return;
    }

    const node = renderComponent(component);
    if (node) {
      rendered.push(<React.Fragment key={index}>{node}</React.Fragment>);
    }
  });

  if (rendered.length === 0) return null;

  return (
    <VectorSurface className={cx("mt-4 space-y-4")}>{rendered}</VectorSurface>
  );
}
