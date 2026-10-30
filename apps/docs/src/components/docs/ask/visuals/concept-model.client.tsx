"use client";

import { useTranslations } from "next-intl";
import { cn } from "../cn";
import {
  ASK_NODE_ARCHETYPES,
  ASK_RELATIONSHIP_TONES,
  matchText,
  type VisualConceptModel,
  type VisualNode,
  type VisualNodeState,
  type VisualRelationship,
} from "@/lib/docs/ask/generative-ui/schema";
import { FrameProse, mono, signatureLabel, VisualFrame } from "./frame";
import { enterItem, staggerStyle, useEnter } from "./motion";
import { TONE_ACCENT, tonePill } from "./tones";

/** What a hovered or focused step points at, and the model as it leaves it. */
export type ModelFocus = {
  touches: string[];
  connects: string[];
  state: Map<string, VisualNodeState>;
};

const fade = "transition-opacity duration-150 motion-reduce:transition-none";

/**
 * Columns without a lone card on the last row: pairs once the panel has
 * room for 2, 4 or 8 cards, threes in a wide panel for 3, 5, 6 or 9, one
 * column otherwise.
 */
function gridColumns(count: number) {
  return cn(
    count % 2 === 0 && "[@container_(min-width:22rem)]:grid-cols-2",
    (count % 3 === 0 || count === 5) &&
      "[@container_(min-width:36rem)]:grid-cols-3",
  );
}

/** "mint account", "PDA": the archetype as the docs' lowercase type word. */
function typeLabel(label: string) {
  return /^[A-Z][a-z]/.test(label)
    ? label.charAt(0).toLowerCase() + label.slice(1)
    : label;
}

/** "Token Program" already says "program": the type would repeat it. */
function namesType(name: string, type: string) {
  return ` ${matchText(name)} `.includes(` ${matchText(type)} `);
}

type Row = { key: string; value: string; changed?: boolean; address?: true };

/**
 * Values in mono, as the docs' struct cards (`u64`, `0`, an address); a
 * value in words ("starts at 0") stays sans so it doesn't wrap a narrow
 * card into a column of code.
 */
function isCode(value: string) {
  return !/\s/.test(value.trim());
}

/**
 * A part of the model as the docs draw a struct: name and type on top,
 * hairline key/value rows, values at the end. The docs' concept-chip mark
 * (a small rotated square) and the type pill carry the part's tone; a step
 * that touches it fills it in that tone.
 */
function NodeCard({
  node,
  index,
  focus,
}: {
  node: VisualNode;
  index: number;
  focus: ModelFocus | null;
}) {
  const t = useTranslations("docsAsk.visuals");
  const enter = useEnter();
  const state = focus?.state.get(node.id);
  const closed = state ? state.closed : !!node.closed;
  const touched = !!focus?.touches.includes(node.id);
  const neutral = node.tone === "neutral";
  const type = node.archetype
    ? typeLabel(ASK_NODE_ARCHETYPES[node.archetype].label)
    : null;
  const rows: Row[] = [
    ...(node.address
      ? [{ key: "address", value: node.address, address: true as const }]
      : []),
    ...(state?.fields ?? node.fields),
  ];
  return (
    <li
      data-node={node.id}
      data-archetype={node.archetype ?? undefined}
      data-touched={touched || undefined}
      style={enter ? staggerStyle(index) : undefined}
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-lg border bg-[var(--sol-page)] transition-[opacity,background-color,border-color,box-shadow] duration-150 motion-reduce:transition-none",
        // A part of no known kind highlights in the docs' purple.
        TONE_ACCENT[neutral ? "purple" : node.tone],
        closed
          ? "border-dashed border-[var(--sol-line-strong)]"
          : "border-[var(--sol-line)]",
        touched &&
          "border-[var(--tone-line)] bg-[var(--tone-soft)] ring-1 ring-[var(--tone-line)]",
        // 70, not 60: dim text on a dimmed card stays legible.
        focus && !touched && "opacity-70",
        enter && enterItem,
      )}
    >
      {/* The head (name, type, description) carries a breath of the
          card's tone, above the hairline rows; none once closed, or for a
          part of no known kind. */}
      <div
        className={cn(
          !closed &&
            !neutral &&
            "bg-[color-mix(in_oklab,var(--tone-soft)_55%,transparent)]",
        )}
      >
        <div className="flex min-w-0 items-center gap-2 px-3 py-2">
          {closed || neutral ? null : (
            <span
              aria-hidden="true"
              className="size-[5px] shrink-0 rotate-45 rounded-[1px] bg-[var(--tone)]"
            />
          )}
          <p className="m-0 min-w-0 flex-1 text-[13px] font-medium leading-5 text-[var(--sol-text)] [overflow-wrap:anywhere] [@container_(min-width:42rem)]:text-[14px]">
            {node.name}
          </p>
          {closed ? (
            <span className="inline-flex shrink-0 items-center rounded-full border border-dashed border-[var(--sol-line-strong)] px-1.5 text-[11px] font-medium leading-4 text-[var(--sol-dim)]">
              {t("closed")}
            </span>
          ) : type && !namesType(node.name, type) ? (
            <span className={tonePill}>{type}</span>
          ) : null}
        </div>
        {node.description ? (
          <p className="m-0 -mt-1 px-3 pb-2 text-[12px] leading-[1.5] text-[var(--sol-muted)] [@container_(min-width:42rem)]:text-[13px]">
            {node.description}
          </p>
        ) : null}
      </div>
      {rows.length > 0 ? (
        <dl className="m-0">
          {rows.map((row, i) => (
            <div
              key={`${i}-${row.key}`}
              className={cn(
                "flex items-baseline justify-between gap-3 border-t px-3 py-1.5 text-[12px] leading-[18px] transition-colors duration-150 motion-reduce:transition-none [@container_(min-width:42rem)]:text-[13px] [@container_(min-width:42rem)]:leading-5",
                touched
                  ? "border-[var(--tone-line)]"
                  : "border-[var(--sol-line)]",
              )}
            >
              {/* Dim fails AA on a touched card's tint: muted there. */}
              <dt
                className={cn(
                  "m-0 shrink-0 font-normal",
                  touched ? "text-[var(--sol-muted)]" : "text-[var(--sol-dim)]",
                )}
              >
                {row.key}
              </dt>
              <dd
                data-changed={row.changed || undefined}
                title={row.address ? row.value : undefined}
                className={cn(
                  (row.address || isCode(row.value)) && mono,
                  "m-0 min-w-0 text-end",
                  row.address ? "truncate" : "[overflow-wrap:anywhere]",
                  row.changed
                    ? "font-medium text-[var(--tone)]"
                    : "text-[var(--sol-text)]",
                )}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </li>
  );
}

/** "Wallet → owns → Token account", the kind as a pill in its tone. */
function RelationshipRow({
  relationship,
  focus,
}: {
  relationship: VisualRelationship;
  focus: ModelFocus | null;
}) {
  const linked = !!focus?.connects.includes(relationship.id);
  const tone = relationship.kind
    ? ASK_RELATIONSHIP_TONES[relationship.kind]
    : "neutral";
  const arrow = (
    <span
      aria-hidden="true"
      className="inline-block text-[var(--tone)] group-data-[dir=rtl]/visual:-scale-x-100"
    >
      →
    </span>
  );
  return (
    <li
      data-relationship={relationship.id}
      className={cn(
        "flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[13px] leading-5 text-[var(--sol-text)] [@container_(min-width:42rem)]:text-[14px]",
        TONE_ACCENT[tone],
        fade,
        focus && !linked && "opacity-70",
      )}
    >
      <span>{relationship.fromName}</span>
      {arrow}
      <span
        className={cn(
          tonePill,
          "transition-shadow duration-150 motion-reduce:transition-none",
          linked && "ring-1 ring-[var(--tone-line)]",
        )}
      >
        {relationship.label}
      </span>
      {arrow}
      <span>{relationship.toName}</span>
    </li>
  );
}

/**
 * The model's parts as cards (one column in the docked panel, more when
 * there's room) and how they connect. With `focus`, the parts a step
 * touches are highlighted, the rest dimmed, and fields show the step's
 * result.
 */
export function ModelDiagram({
  model,
  focus = null,
}: {
  model: VisualConceptModel;
  focus?: ModelFocus | null;
}) {
  const t = useTranslations("docsAsk.visuals");
  return (
    <>
      <ul
        className={cn(
          // px-3.5: the cards' edges line up with the labels and the rail.
          // items-start: a card without fields stays its own height beside
          // one with, not a tall tinted slab.
          "m-0 grid list-none items-start gap-2 px-3.5 py-3",
          gridColumns(model.nodes.length),
        )}
      >
        {model.nodes.map((node, index) => (
          <NodeCard key={node.id} node={node} index={index} focus={focus} />
        ))}
      </ul>
      {model.relationships.length > 0 ? (
        <div className="border-t border-[var(--sol-line)] px-3.5 py-3">
          <p className={cn(signatureLabel, "m-0")}>{t("relationships")}</p>
          <ul className="m-0 mt-2 list-none space-y-1.5 p-0">
            {model.relationships.map((relationship) => (
              <RelationshipRow
                key={relationship.id}
                relationship={relationship}
                focus={focus}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

/** concept_model on its own: the diagram in a frame. */
export function VisualConceptModelBlock({
  model,
  prose,
}: {
  model: VisualConceptModel;
  /** Show the model's paragraph (the answer has no summary). */
  prose: boolean;
}) {
  const t = useTranslations("docsAsk.visuals");
  return (
    <VisualFrame label={t("diagram")} title={model.title ?? t("model")}>
      {prose && model.body ? <FrameProse text={model.body} /> : null}
      <ModelDiagram model={model} />
    </VisualFrame>
  );
}
