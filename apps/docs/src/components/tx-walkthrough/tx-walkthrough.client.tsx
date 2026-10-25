"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { EXCERPTS, githubUrl, lineLabel, type Excerpt } from "./excerpts";
import type { BalanceChange, WalkthroughModel } from "./model";
import { ACTORS, STEPS, type ActorId, type Step } from "./steps";

export interface TxWalkthroughClientProps {
  model: WalkthroughModel;
  /** Highlighted code for each excerpt id (plain <pre> in tests). */
  code: Record<string, ReactNode>;
  /** The trimmed getTransaction response, highlighted. */
  response: ReactNode;
  explorerUrl: string;
  rpcReferenceHref: string;
  /** The static transaction-flow diagram, behind "See the whole flow". */
  flow?: ReactNode;
}

export function TxWalkthroughClient({
  model,
  code,
  response,
  explorerUrl,
  rpcReferenceHref,
  flow,
}: TxWalkthroughClientProps) {
  const [index, setIndex] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [showFlow, setShowFlow] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const mounted = useRef(false);
  const id = useId();
  const last = STEPS.length - 1;
  const step = STEPS[index];

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setAnnouncement(
      `Step ${index + 1} of ${STEPS.length}: ${STEPS[index].title}`,
    );
  }, [index]);

  const go = useCallback(
    (next: number) => setIndex(Math.max(0, Math.min(last, next))),
    [last],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    // Leave arrow keys alone where they scroll (code) or edit.
    if (target.closest("[data-txw-scroll], input, textarea")) return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    go(keys[e.key]);
  };

  const fill = (text: string) =>
    text
      .replaceAll("{cash}", model.cash)
      .replaceAll("{asset}", model.asset)
      .replaceAll("{fee}", fmt(model.fee));

  const excerpts = step.excerpts.map((x) => EXCERPTS[x]);
  const hasCode = excerpts.length > 0 || step.id === "result";

  return (
    <section
      className="txw"
      aria-labelledby={`${id}-title`}
      onKeyDown={onKeyDown}
      data-step={step.id}
    >
      <header className="txw-head">
        <p className="txw-eyebrow">See a transaction in action</p>
        <p className="txw-title" id={`${id}-title`}>
          Settle a trade: {model.cash} USDC for {model.asset} fund shares
        </p>
        <p className="txw-lead">
          One real transaction, run on a local test network.
        </p>
      </header>

      <Rail index={index} onPick={go} />

      <p className="txw-sr" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>

      <article className="txw-stage" key={step.id}>
        <p className="txw-kicker">
          <span>
            Step {index + 1} of {STEPS.length} · {step.short}
          </span>
          {step.atomic ? (
            <span className="txw-badge">all or nothing</span>
          ) : null}
        </p>
        <h3 className="txw-stage-title">{step.title}</h3>
        <p className="txw-say">{inline(fill(step.say))}</p>
        <Scene step={step} model={model} />
        <Chips step={step} model={model} />
        {step.note ? (
          <p className="txw-note">{inline(fill(step.note))}</p>
        ) : null}
        {step.id === "result" ? (
          <p className="txw-links">
            <a
              className="txw-link"
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
            >
              View the program on Explorer
            </a>
            <a className="txw-link" href={rpcReferenceHref}>
              <span className="txw-mono">getTransaction</span> reference
            </a>
          </p>
        ) : null}
      </article>

      <div className="txw-foot">
        <div className="txw-foot-l">
          {hasCode ? (
            <button
              type="button"
              className="txw-toggle"
              aria-expanded={showCode}
              aria-controls={`${id}-code`}
              onClick={() => setShowCode((v) => !v)}
            >
              <ChevronIcon />
              Show the code
            </button>
          ) : null}
          {flow ? (
            <button
              type="button"
              className="txw-toggle txw-toggle-flow"
              aria-expanded={showFlow}
              aria-controls={`${id}-flow`}
              onClick={() => setShowFlow((v) => !v)}
            >
              <FlowIcon />
              See the whole flow
            </button>
          ) : null}
        </div>
        <div className="txw-foot-r">
          <button
            type="button"
            className="txw-btn"
            onClick={() => go(index - 1)}
            disabled={index === 0}
          >
            Back
          </button>
          <button
            type="button"
            className="txw-btn txw-btn-primary"
            onClick={() => go(index === last ? 0 : index + 1)}
          >
            {index === last ? "Start again" : `Next: ${STEPS[index + 1].short}`}
            {index === last ? null : <ArrowIcon />}
          </button>
        </div>
      </div>

      {hasCode && showCode ? (
        <div className="txw-code-list" id={`${id}-code`}>
          {excerpts.map((e) => (
            <CodeExcerpt key={e.id} excerpt={e} node={code[e.id]} />
          ))}
          {step.id === "result" ? (
            <div className="txw-block">
              <div className="txw-block-head">
                <span className="txw-file">
                  getTransaction response (trimmed)
                </span>
              </div>
              <div className="txw-code" data-txw-scroll tabIndex={0}>
                {response}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {flow ? (
        <div className="txw-flow" id={`${id}-flow`} hidden={!showFlow}>
          {flow}
        </div>
      ) : null}
    </section>
  );
}

/* ---------------------------------------------------------------- Rail */

function Rail({
  index,
  onPick,
}: {
  index: number;
  onPick: (i: number) => void;
}) {
  const first = STEPS.findIndex((s) => s.atomic);
  const count = STEPS.filter((s) => s.atomic).length;
  return (
    <div className="txw-rail">
      <span
        className="txw-rail-atomic"
        aria-hidden="true"
        style={{
          left: `calc(${(100 / STEPS.length) * first}% + 10px)`,
          width: `calc(${(100 / STEPS.length) * count}% - 20px)`,
        }}
      >
        <span>all or nothing</span>
      </span>
      <span
        className="txw-rail-fill"
        aria-hidden="true"
        style={{
          width: `${(index / (STEPS.length - 1)) * (100 - 100 / STEPS.length)}%`,
        }}
      />
      <ol className="txw-rail-list" aria-label="Steps">
        {STEPS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className="txw-rail-step"
              data-state={i === index ? "active" : i < index ? "done" : "todo"}
              aria-current={i === index ? "step" : undefined}
              aria-label={`Step ${i + 1}: ${s.short}${s.atomic ? " (all or nothing)" : ""}`}
              onClick={() => onPick(i)}
            >
              <span className="txw-rail-dot" aria-hidden="true">
                {i < index ? <CheckIcon /> : i + 1}
              </span>
              <span className="txw-rail-label" aria-hidden="true">
                {s.short}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* --------------------------------------------------------------- Scene */

interface Packet {
  label: ReactNode;
  icon: ReactNode;
  /** r: left actor to right actor; l: back. */
  dir: "r" | "l";
  solid?: boolean;
  dashed?: boolean;
}

function sceneOf(step: Step, model: WalkthroughModel) {
  const settle = model.instructions.at(-1)!;
  const cash = model.cpis.find((c) => c.name === "TransferChecked")!;
  let packets: Packet[] = [];
  let caption: ReactNode = null;
  switch (step.id) {
    case "build":
      packets = [
        {
          label: `${model.instructions.length} instructions`,
          icon: <DocIcon />,
          dir: "r",
        },
      ];
      caption = (
        <>
          <span className="txw-mono">{settle.name}</span>, plus{" "}
          {model.instructions.length - 1} that create token accounts
        </>
      );
      break;
    case "sign":
      packets = [
        {
          label: `message, ${fmt(model.messageBytes)} bytes`,
          icon: <MailIcon />,
          dir: "r",
        },
        {
          label: "signature",
          icon: <PenIcon />,
          dir: "l",
          solid: true,
          dashed: true,
        },
      ];
      break;
    case "send":
      packets = [
        {
          label: "signed transaction",
          icon: <DocIcon />,
          dir: "r",
          solid: true,
        },
      ];
      caption = "through an RPC node";
      break;
    case "fee":
      packets = [
        {
          label: `${fmt(model.fee)} lamports`,
          icon: <span className="txw-coin">◎</span>,
          dir: "l",
          solid: true,
        },
      ];
      caption = "the fee";
      break;
    case "run":
      packets = [
        { label: settle.name, icon: <CodeIcon />, dir: "r", solid: true },
      ];
      caption = "run the instruction";
      break;
    case "cpi":
      packets = [
        {
          label: `${cash.amount} ${cash.symbol}`,
          icon: <span className="txw-coin">$</span>,
          dir: "r",
          solid: true,
        },
      ];
      caption = (
        <>
          <span className="txw-mono">{cash.name}</span>, signed by the trade
          record (PDA)
        </>
      );
      break;
    case "result":
      packets = [
        { label: "confirmation", icon: <CheckIcon />, dir: "r", dashed: true },
      ];
      caption = model.succeeded ? "status: succeeded" : "status: failed";
      break;
  }
  return { packets, caption };
}

function Scene({ step, model }: { step: Step; model: WalkthroughModel }) {
  const { packets, caption } = sceneOf(step, model);
  const [left, right] = step.actors;
  return (
    <div className="txw-scene" data-board={step.id === "cpi" || undefined}>
      <ActorCard id={left} />
      <div className="txw-lane">
        {packets.map((p, i) => (
          <div
            key={i}
            className="txw-arrow"
            data-dir={p.dir}
            data-dashed={p.dashed || undefined}
          >
            <span
              className="txw-packet"
              data-solid={p.solid || undefined}
              style={{ animationDelay: `${i * 220}ms` }}
            >
              {p.icon}
              {p.label}
            </span>
          </div>
        ))}
        {caption ? <p className="txw-caption">{caption}</p> : null}
      </div>
      <ActorCard id={right} />
      {step.id === "cpi" ? (
        <>
          <div className="txw-down" aria-hidden="true">
            <span>writes balances</span>
          </div>
          <Board balances={model.balances} />
        </>
      ) : null}
    </div>
  );
}

function ActorCard({ id }: { id: ActorId }) {
  const a = ACTORS[id];
  return (
    <div className="txw-actor" data-yours={a.yours || undefined}>
      <span className="txw-actor-icon" aria-hidden="true">
        {ACTOR_ICONS[id]}
      </span>
      <span>
        <span className="txw-actor-name">{a.name}</span>
        <span className="txw-actor-note">{a.note}</span>
      </span>
    </div>
  );
}

function Board({ balances }: { balances: BalanceChange[] }) {
  return (
    <div className="txw-board">
      <div className="txw-board-head">
        <AccountsIcon />
        <span>Accounts</span>
        <small>balances before → after</small>
      </div>
      <ul className="txw-board-rows">
        {balances.map((b) => (
          <li
            key={b.account.address}
            data-dim={b.symbol !== "USDC" || undefined}
          >
            <span className="txw-board-name">{b.account.label}</span>
            <span className="txw-vals">
              <span className="txw-was">{b.before ?? "0"}</span>
              <span className="txw-to" aria-label="to">
                →
              </span>
              <span
                className="txw-now"
                data-up={
                  Number(b.after ?? 0) > Number(b.before ?? 0) || undefined
                }
              >
                {b.after ?? "0"}
              </span>
              {b.after === null ? (
                <span className="txw-tag">closed</span>
              ) : b.before === null ? (
                <span className="txw-tag">new</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --------------------------------------------------------------- Chips */

interface Chip {
  k?: string;
  v: ReactNode;
  acc?: boolean;
}

function chipsOf(step: Step, model: WalkthroughModel): Chip[] {
  const payer = model.feePayer.label;
  const cpis = model.cpis.filter((c) => c.name === "TransferChecked");
  switch (step.id) {
    case "build":
      return [
        { k: "Fee payer", v: payer },
        { v: `${fmt(model.sizeBytes)} of ${fmt(model.maxBytes)} bytes` },
      ];
    case "sign":
      return [
        { k: "Signs", v: payer },
        { v: `${model.numRequiredSignatures} signature` },
        {
          k: "Transaction ID",
          v: <span className="txw-mono">{short(model.signature)}</span>,
          acc: true,
        },
      ];
    case "send":
      return [
        {
          k: "Transaction ID",
          v: <span className="txw-mono">{short(model.signature)}</span>,
          acc: true,
        },
        { k: "Size", v: `${fmt(model.sizeBytes)} bytes` },
      ];
    case "fee":
      return [
        { k: "Fee", v: `${fmt(model.fee)} lamports`, acc: true },
        { k: "Paid by", v: payer },
      ];
    case "run":
      return [
        ...model.balances
          .filter((b) => b.after === null)
          .map((b) => ({ k: b.account.label, v: `${b.before} ${b.symbol}` })),
        { k: "Signs as", v: cpis[0].authority.label, acc: true },
      ];
    case "cpi":
      return [
        { k: "Signed by", v: cpis[0].authority.label, acc: true },
        ...cpis.map((c) => ({
          v: `${c.amount} ${c.symbol}`,
          k: `to ${c.to.label.startsWith("Seller") ? "the seller" : "the buyer"}`,
        })),
      ];
    case "result":
      return [
        { k: "Status", v: model.succeeded ? "Succeeded" : "Failed", acc: true },
        { k: "Fee", v: `${fmt(model.fee)} lamports` },
        ...(model.computeUnits === null
          ? []
          : [{ k: "Compute units", v: fmt(model.computeUnits) }]),
      ];
  }
}

function Chips({ step, model }: { step: Step; model: WalkthroughModel }) {
  return (
    <ul className="txw-chips">
      {chipsOf(step, model).map((c, i) => (
        <li key={i} className="txw-chip" data-acc={c.acc || undefined}>
          {step.id === "cpi" && c.k?.startsWith("to ") ? (
            <>
              <b>{c.v}</b> {c.k}
            </>
          ) : (
            <>
              {c.k ? <span>{c.k}</span> : null}
              <b>{c.v}</b>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- Code */

function CodeExcerpt({ excerpt, node }: { excerpt: Excerpt; node: ReactNode }) {
  const s = excerpt.source;
  return (
    <div className="txw-block">
      <div className="txw-block-head">
        <span className="txw-file">{excerpt.file}</span>
        <span className="txw-block-note">
          {s.kind === "github" ? (
            <a
              className="txw-link"
              href={githubUrl(s.path, excerpt.ranges)}
              target="_blank"
              rel="noreferrer"
            >
              {lineLabel(excerpt.ranges)} on GitHub
            </a>
          ) : (
            <a className="txw-link" href={s.href}>
              from {s.page}
            </a>
          )}
        </span>
      </div>
      <div className="txw-code" data-txw-scroll tabIndex={0}>
        {node}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Bits */

/** `code` spans in copy. */
function inline(text: string) {
  return text
    .split("`")
    .map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
}

const short = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;
const fmt = (n: number) => n.toLocaleString("en-US");

export function Icon({
  children,
  size = 22,
}: {
  children: ReactNode;
  size?: number;
}) {
  return (
    <svg
      className="txw-icon"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const ACTOR_ICONS: Record<ActorId, ReactNode> = {
  app: (
    <Icon>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </Icon>
  ),
  tx: (
    <Icon>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M10 12h5M10 16h5" />
    </Icon>
  ),
  wallet: (
    <Icon>
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9M18 12v3M21 12v2" />
    </Icon>
  ),
  network: (
    <Icon>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5" cy="18" r="2.2" />
      <circle cx="19" cy="18" r="2.2" />
      <path d="M10.9 7 6.1 16M13.1 7l4.8 9M7.2 18h9.6" />
    </Icon>
  ),
  program: (
    <Icon>
      <path d="M8 6 3 12l5 6M16 6l5 6-5 6M14 4l-4 16" />
    </Icon>
  ),
  token: (
    <Icon>
      <ellipse cx="12" cy="6" rx="7" ry="2.6" />
      <path d="M5 6v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6M5 12v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-6" />
    </Icon>
  ),
};

const AccountsIcon = () => (
  <Icon size={18}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </Icon>
);
const DocIcon = () => (
  <Icon size={15}>
    <path d="M7 3h7l4 4v14H7z" />
    <path d="M14 3v4h4" />
  </Icon>
);
const MailIcon = () => (
  <Icon size={15}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Icon>
);
const PenIcon = () => (
  <Icon size={15}>
    <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
  </Icon>
);
const CodeIcon = () => (
  <Icon size={15}>
    <path d="M8 6 3 12l5 6M16 6l5 6-5 6" />
  </Icon>
);
const CheckIcon = () => (
  <Icon size={14}>
    <path d="m5 12 5 5 9-10" />
  </Icon>
);
const ChevronIcon = () => (
  <Icon size={16}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);
const ArrowIcon = () => (
  <Icon size={16}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);
const FlowIcon = () => (
  <Icon size={16}>
    <path d="M6 3v18M18 3v18M6 8h12M18 14H6" />
  </Icon>
);
