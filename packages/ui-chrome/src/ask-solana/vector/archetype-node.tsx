"use client";

import { type ReactNode } from "react";
import { cx, vectorMonoRoot, vectorRoot } from "./base";
import styles from "./vector.module.css";

export type VectorNodeArchetype =
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

export type VectorRelationshipKind =
  | "owns"
  | "signs"
  | "derives"
  | "initializes"
  | "invokes"
  | "writes"
  | "reads"
  | "mints-to"
  | "transfers-to";

export type VectorEffectAction = "reveal" | "update" | "connect" | "close";

export type VectorArchetypeTone =
  | "mint"
  | "account"
  | "purple"
  | "green"
  | "dim";

export type VectorArchetypeField = {
  label: ReactNode;
  value: ReactNode;
  tone?: VectorArchetypeTone;
  changed?: boolean;
};

export type VectorEffectItem = {
  action: VectorEffectAction | (string & {});
  nodeId?: ReactNode;
  toNodeId?: ReactNode;
  field?: ReactNode;
  value?: ReactNode;
  label?: ReactNode;
  text?: ReactNode;
};

type ArchetypeMeta = {
  label: string;
  tag: string;
  symbol: string;
  tone: VectorArchetypeTone;
  className?: string;
};

const ARCHETYPE_META: Record<VectorNodeArchetype, ArchetypeMeta> = {
  wallet: {
    label: "Wallet",
    tag: "WA",
    symbol: "▣",
    tone: "green",
    className: styles.archetypeWallet,
  },
  signer: {
    label: "Signer",
    tag: "SIG",
    symbol: "✦",
    tone: "green",
    className: styles.archetypeSigner,
  },
  "mint-account": {
    label: "Mint account",
    tag: "MA",
    symbol: "◆",
    tone: "mint",
    className: styles.archetypeMint,
  },
  "token-account": {
    label: "Token account",
    tag: "TA",
    symbol: "●",
    tone: "account",
    className: styles.archetypeToken,
  },
  pda: {
    label: "PDA",
    tag: "PDA",
    symbol: "◇",
    tone: "purple",
    className: styles.archetypePda,
  },
  program: {
    label: "Program",
    tag: "PG",
    symbol: "▱",
    tone: "purple",
    className: styles.archetypeProgram,
  },
  instruction: {
    label: "Instruction",
    tag: "IX",
    symbol: "→",
    tone: "dim",
    className: styles.archetypeInstruction,
  },
  transaction: {
    label: "Transaction",
    tag: "TX",
    symbol: "⟲",
    tone: "purple",
    className: styles.archetypeTransaction,
  },
  "rpc-node": {
    label: "RPC node",
    tag: "RPC",
    symbol: "◌",
    tone: "green",
    className: styles.archetypeRpc,
  },
  validator: {
    label: "Validator",
    tag: "VAL",
    symbol: "▵",
    tone: "green",
    className: styles.archetypeValidator,
  },
};

const RELATIONSHIP_LABELS: Record<VectorRelationshipKind, string> = {
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

const EFFECT_LABELS: Record<VectorEffectAction, string> = {
  reveal: "reveal",
  update: "update",
  connect: "connect",
  close: "close",
};

export const VECTOR_NODE_ARCHETYPES = Object.keys(
  ARCHETYPE_META,
) as VectorNodeArchetype[];

export function normalizeVectorNodeArchetype(
  value: string | null | undefined,
): VectorNodeArchetype | null {
  if (!value) return null;
  const normalized = value.toLowerCase().replace(/[_\s]+/g, "-");
  return VECTOR_NODE_ARCHETYPES.includes(normalized as VectorNodeArchetype)
    ? (normalized as VectorNodeArchetype)
    : null;
}

export function vectorNodeArchetypeMeta(archetype: VectorNodeArchetype) {
  return ARCHETYPE_META[archetype];
}

export function normalizeVectorRelationshipKind(
  value: string | null | undefined,
): VectorRelationshipKind | null {
  if (!value) return null;
  const normalized = value.toLowerCase().replace(/[_\s]+/g, "-");
  return Object.prototype.hasOwnProperty.call(RELATIONSHIP_LABELS, normalized)
    ? (normalized as VectorRelationshipKind)
    : null;
}

export function normalizeVectorEffectAction(
  value: string | null | undefined,
): VectorEffectAction | null {
  if (!value) return null;
  const normalized = value.toLowerCase().replace(/[_\s]+/g, "-");
  return Object.prototype.hasOwnProperty.call(EFFECT_LABELS, normalized)
    ? (normalized as VectorEffectAction)
    : null;
}

function toneClass(tone: VectorArchetypeTone | undefined) {
  switch (tone) {
    case "mint":
      return styles.valMint;
    case "account":
    case "green":
      return styles.valGreen;
    case "purple":
      return styles.tokPurple;
    case "dim":
      return styles.valDim;
    default:
      return styles.valWhite;
  }
}

export function VectorArchetypeNode({
  archetype,
  label,
  address,
  description,
  fields,
  active,
  closed,
  className,
}: {
  archetype: VectorNodeArchetype;
  label?: ReactNode;
  address?: ReactNode;
  description?: ReactNode;
  fields?: VectorArchetypeField[];
  active?: boolean;
  closed?: boolean;
  className?: string;
}) {
  const meta = ARCHETYPE_META[archetype];

  return (
    <div
      className={vectorMonoRoot(
        styles.archetypeCard,
        meta.className,
        active && styles.cardWrite,
        closed && styles.archetypeClosed,
        className,
      )}
      data-archetype={archetype}
    >
      <div className={styles.archetypeHead}>
        <span className={styles.archetypeTag}>{meta.tag}</span>
        <span className={styles.archetypeTitle}>{label ?? meta.label}</span>
        {address ? (
          <span className={styles.archetypeAddr}>{address}</span>
        ) : null}
      </div>
      {description ? (
        <div className={styles.archetypeRole}>{description}</div>
      ) : null}
      {fields && fields.length > 0 ? (
        <div className={styles.archetypeRows}>
          {fields.map((field, index) => (
            <div key={`${index}`} className={styles.archetypeRow}>
              <span className={styles.rowLabel}>{field.label}</span>
              <span
                className={cx(
                  toneClass(field.tone ?? meta.tone),
                  field.changed && styles.valPop,
                )}
              >
                {field.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function VectorArchetypeKeyItem({
  archetype,
  children,
}: {
  archetype: VectorNodeArchetype;
  children?: ReactNode;
}) {
  const meta = ARCHETYPE_META[archetype];
  return (
    <span className={styles.keyItem}>
      <span className={toneClass(meta.tone)}>{meta.symbol}</span> ={" "}
      <span className={toneClass(meta.tone)}>{children ?? meta.label}</span>
    </span>
  );
}

export function VectorRelationshipChip({
  kind,
  from,
  to,
  label,
}: {
  kind?: VectorRelationshipKind | (string & {});
  from: ReactNode;
  to: ReactNode;
  label?: ReactNode;
}) {
  const relationship =
    kind && Object.prototype.hasOwnProperty.call(RELATIONSHIP_LABELS, kind)
      ? RELATIONSHIP_LABELS[kind as VectorRelationshipKind]
      : (label ?? kind ?? "relates");

  return (
    <span className={vectorRoot(styles.relationshipChip)}>
      <span className={styles.relationshipNode}>{from}</span>
      <span className={styles.relationshipKind}>{relationship}</span>
      <span className={styles.relationshipNode}>{to}</span>
    </span>
  );
}

export function VectorEffectList({ effects }: { effects: VectorEffectItem[] }) {
  if (effects.length === 0) return null;

  return (
    <div className={vectorRoot(styles.effectList)}>
      <div className={styles.effectLabel}>State change</div>
      <ul className={styles.effectRows}>
        {effects.map((effect, index) => {
          const action = Object.prototype.hasOwnProperty.call(
            EFFECT_LABELS,
            effect.action,
          )
            ? EFFECT_LABELS[effect.action as VectorEffectAction]
            : effect.action;
          const target = [effect.nodeId, effect.field].flatMap((part) =>
            part ? [part] : [],
          );
          const hasStructuredEffect = Boolean(
            effect.nodeId ||
            effect.field ||
            effect.toNodeId ||
            effect.value ||
            effect.label,
          );

          return (
            <li key={index} className={styles.effectRow}>
              <span className={styles.effectAction}>{action}</span>
              <span className={styles.effectText}>
                {target.length > 0
                  ? target.reduce<ReactNode[]>((parts, part, itemIndex) => {
                      if (itemIndex > 0) parts.push(".");
                      parts.push(part);
                      return parts;
                    }, [])
                  : null}
                {effect.toNodeId ? <> → {effect.toNodeId}</> : null}
                {effect.value ? <> = {effect.value}</> : null}
                {effect.label ? <> · {effect.label}</> : null}
                {!hasStructuredEffect ? effect.text : null}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
