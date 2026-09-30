"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "@boxicons/react/ArrowLeft";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Check } from "@boxicons/react/Check";
import { Button } from "@/app/components/ui/button";
import { Container } from "@/component-library/container";
import {
  ASSET_TOKEN,
  CASH_TOKEN,
  DEMO_BALANCES,
  PRESET,
  PROGRAM_ID,
  explorerAddress,
  explorerTx,
  type RoleKey,
} from "@/lib/delivery-vs-payment/config";
import { shortAddress } from "@/lib/delivery-vs-payment/format";
import type { TradeTerms } from "@/lib/delivery-vs-payment/solana/dvp";
import type { DvpAddresses } from "@/lib/delivery-vs-payment/solana/pdas";
import {
  PARTY_META,
  STAGES,
  type StageKey,
  type StageState,
} from "./demo-state";

const captionClass = "font-brand-mono text-[10px] uppercase tracking-[0.12em]";
const focusClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-nd-highlight-green";
const partyKeys: RoleKey[] = ["maker", "partyA", "partyB", "authority"];

function amount(value: bigint, decimals: number) {
  return (Number(value) / 10 ** decimals).toLocaleString("en-US", {
    maximumFractionDigits: decimals,
  });
}

function ExplorerLink({
  value,
  transaction = false,
  light = false,
  label,
}: {
  value: string;
  transaction?: boolean;
  light?: boolean;
  label?: string;
}) {
  return (
    <a
      href={transaction ? explorerTx(value) : explorerAddress(value)}
      target="_blank"
      rel="noopener noreferrer"
      title={value}
      aria-label={`${label ?? (transaction ? "Transaction" : "Account")} ${value} on Solana Explorer (opens in a new tab)`}
      className={`inline-flex shrink-0 items-center gap-1 font-brand-mono text-[11px] underline-offset-4 hover:underline ${focusClass} ${light ? "text-black/70" : "text-nd-high-em-text"}`}
    >
      {shortAddress(value)}
      <ArrowUpRight className="!size-3.5" aria-hidden="true" />
    </a>
  );
}

function CopyAddress({ value }: { value: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  useEffect(() => {
    setStatus("idle");
  }, [value]);
  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);
  return (
    <button
      type="button"
      className={`rounded-md border border-nd-border-prominent px-2 py-1 text-[11px] text-nd-mid-em-text hover:text-white ${focusClass}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setStatus("copied");
        } catch {
          setStatus("error");
        }
      }}
      aria-label="Copy trade address"
    >
      <span role="status">
        {status === "copied"
          ? "Copied"
          : status === "error"
            ? "Copy failed"
            : "Copy"}
      </span>
    </button>
  );
}

function ExpiryClock({
  terms,
  settled,
  replaying,
}: {
  terms: TradeTerms | null;
  settled: boolean;
  replaying: boolean;
}) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (!terms || settled || replaying) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [terms, settled, replaying]);
  const remaining =
    terms && now !== null
      ? Math.max(0, Number(terms.expiryTimestamp) - Math.floor(now / 1000))
      : PRESET.expirySeconds;
  return (
    <div>
      <div className={`${captionClass} text-nd-mid-em-text`}>
        {settled
          ? "Trade window"
          : replaying
            ? "Original window"
            : terms
              ? "Expires in"
              : "Settlement window"}
      </div>
      <div className="mt-2 text-[23px] leading-none tabular-nums tracking-[-0.04em]">
        {settled
          ? "Closed"
          : replaying || !terms
            ? "60 min"
            : remaining === 0
              ? "Expired"
              : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`}
      </div>
    </div>
  );
}

function TradeLeg({
  leg,
  state,
  tradeCreated,
  settled,
  escrow,
}: {
  leg: "asset" | "cash";
  state: StageState;
  tradeCreated: boolean;
  settled: boolean;
  escrow?: string;
}) {
  const isAsset = leg === "asset";
  const token = isAsset ? ASSET_TOKEN : CASH_TOKEN;
  const quantity = amount(
    isAsset ? PRESET.amountA : PRESET.amountB,
    token.decimals,
  );
  const funded = state.status === "complete";
  const depositing = state.status === "running";
  const deliveredLabel = isAsset ? "Delivered to buyer" : "Paid to seller";
  const status = settled
    ? deliveredLabel
    : funded
      ? "Held in escrow"
      : depositing
        ? "Depositing…"
        : state.status === "error"
          ? "Deposit failed"
          : tradeCreated
            ? "Awaiting deposit"
            : "Awaiting trade";
  return (
    <section
      aria-label={isAsset ? "Asset leg" : "Payment leg"}
      className="rounded-[16px] bg-white/[0.92] px-5 py-4 text-black sm:px-6 sm:py-5"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="m-0 font-brand text-[15px] font-normal tracking-[-0.02em]">
          {isAsset ? "Delivery" : "Payment"}{" "}
          <span className="ml-1.5 text-black/50">
            / Leg {isAsset ? "A" : "B"}
          </span>
        </h3>
        <span className="flex items-center gap-1 text-[11px] text-black/65">
          {(funded || settled) && (
            <Check className="!size-3.5" aria-hidden="true" />
          )}
          {status}
        </span>
      </div>
      <div className="mt-2 grid items-center gap-x-7 gap-y-4 sm:grid-cols-[1fr_1fr]">
        <div className="flex items-baseline gap-2.5 whitespace-nowrap">
          <span className="text-[clamp(40px,4.6vw,62px)] leading-none tracking-[-0.065em] tabular-nums">
            {quantity}
          </span>
          <span className="text-[16px] tracking-[-0.03em]">{token.symbol}</span>
        </div>
        <div>
          <div
            role="progressbar"
            aria-label={`${token.symbol} ${settled ? "delivered" : "deposited"}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={funded || settled ? 100 : 0}
            aria-valuetext={status}
            className={`flex h-10 gap-[5px] sm:h-12 ${depositing ? "animate-pulse motion-reduce:animate-none" : ""}`}
          >
            {Array.from({ length: 24 }, (_, index) => (
              <span
                key={index}
                className={`h-full min-w-0 flex-1 rounded-full transition-colors duration-500 motion-reduce:transition-none ${funded || settled ? (isAsset ? "bg-nd-highlight-blue" : "bg-nd-highlight-green") : "bg-black/[0.13]"}`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between gap-2 font-brand-mono text-[10px] text-black/60">
            <span>
              {funded || settled ? quantity : "0"} / {quantity} {token.symbol}
            </span>
            <span>{settled ? "Delivered" : "In escrow"}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-black/[0.12] pt-3">
        <div className="flex items-center gap-2 text-[11px]">
          <span
            className={!funded && !settled ? "font-medium" : "text-black/55"}
          >
            {isAsset ? "Seller" : "Buyer"}
          </span>
          <ArrowRight className="!size-3 text-black/40" aria-hidden="true" />
          <span
            className={funded && !settled ? "font-medium" : "text-black/55"}
          >
            Escrow
          </span>
          <ArrowRight className="!size-3 text-black/40" aria-hidden="true" />
          <span className={settled ? "font-medium" : "text-black/55"}>
            {isAsset ? "Buyer" : "Seller"}
          </span>
        </div>
        {escrow ? (
          <span className="flex items-center gap-2 text-[10px] text-black/55">
            {settled ? "Closed escrow" : "Escrow"}
            <ExplorerLink
              value={escrow}
              light
              label={`${token.symbol} escrow`}
            />
          </span>
        ) : (
          <span className="text-[10px] text-black/55">
            {isAsset ? "Demo tokenized T-Bill" : "Demo stablecoin"}
          </span>
        )}
      </div>
    </section>
  );
}

function Balances({ stages }: { stages: Record<StageKey, StageState> }) {
  const prepared = stages.assets.status === "complete";
  const settled = stages.settle.status === "complete";
  const assetFunded = stages.asset.status === "complete";
  const cashFunded = stages.cash.status === "complete";
  const balances = [
    {
      party: "partyA" as const,
      asset: DEMO_BALANCES.asset - (assetFunded ? PRESET.amountA : 0n),
      cash: settled ? PRESET.amountB : 0n,
    },
    {
      party: "partyB" as const,
      asset: settled ? PRESET.amountA : 0n,
      cash: DEMO_BALANCES.cash - (cashFunded ? PRESET.amountB : 0n),
    },
  ];
  return (
    <section aria-label="Party balances" className="mt-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className={`${captionClass} m-0 font-normal text-nd-mid-em-text`}>
          Wallet balances
        </h3>
        <span className="text-[10px] text-nd-mid-em-text">
          {prepared
            ? "From confirmed demo transactions"
            : "Populated after token setup"}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {balances.map(({ party, asset, cash }) => (
          <div
            key={party}
            className="rounded-[14px] border border-nd-border-light bg-white/[0.035] p-4"
          >
            <div className="mb-4 flex items-center gap-2 text-[13px]">
              <span
                className={`size-1.5 rounded-full ${PARTY_META[party].dotClass}`}
                aria-hidden="true"
              />
              {PARTY_META[party].label}
            </div>
            <dl className="m-0 grid grid-cols-2 gap-3">
              <div>
                <dt className="font-brand-mono text-[10px] text-nd-mid-em-text">
                  TBILL
                </dt>
                <dd
                  className="m-0 mt-1 text-[26px] leading-none tracking-[-0.04em] tabular-nums"
                  data-balance={`${party}-asset`}
                >
                  {prepared ? amount(asset, ASSET_TOKEN.decimals) : "—"}
                </dd>
              </div>
              <div>
                <dt className="font-brand-mono text-[10px] text-nd-mid-em-text">
                  dUSD
                </dt>
                <dd
                  className="m-0 mt-1 text-[26px] leading-none tracking-[-0.04em] tabular-nums"
                  data-balance={`${party}-cash`}
                >
                  {prepared ? amount(cash, CASH_TOKEN.decimals) : "—"}
                </dd>
              </div>
            </dl>
            {settled && (
              <p
                className={`m-0 mt-3 text-[11px] ${PARTY_META[party].textClass}`}
              >
                Received {party === "partyA" ? "10,000 dUSD" : "100 TBILL"} at
                settlement
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function SettlementFlow({
  stages,
  running,
  replaying,
  error,
}: {
  stages: Record<StageKey, StageState>;
  running: boolean;
  replaying: boolean;
  error: string | null;
}) {
  const completed = STAGES.filter(
    ({ key }) => stages[key].status === "complete",
  ).length;
  return (
    <aside
      aria-label="Settlement flow"
      className="self-start rounded-[16px] border border-nd-border-light bg-white/[0.035] p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="m-0 text-[18px] font-normal tracking-[-0.03em]">
          The settlement flow
        </h2>
        <span className="font-brand-mono text-xs text-nd-mid-em-text">
          {completed}
          <span className="text-nd-mid-em-text/60"> / 6</span>
        </span>
      </div>
      <div className="mb-6 flex gap-1.5" aria-hidden="true">
        {STAGES.map(({ key }) => (
          <span
            key={key}
            className={`h-1 flex-1 rounded-full ${stages[key].status === "complete" ? "bg-nd-highlight-green" : stages[key].status === "running" ? "animate-pulse bg-white motion-reduce:animate-none" : "bg-white/15"}`}
          />
        ))}
      </div>
      <ol className="m-0 list-none p-0">
        {STAGES.map((stage, index) => {
          const state = stages[stage.key];
          const complete = state.status === "complete";
          const active = state.status === "running";
          const failed = state.status === "error";
          return (
            <li
              key={stage.key}
              data-stage={stage.key}
              data-status={state.status}
              className="relative pb-5 last:pb-0"
            >
              {index < STAGES.length - 1 && (
                <div
                  className={`absolute bottom-0 left-[13px] top-7 w-px ${complete ? "bg-nd-highlight-green/30" : "bg-nd-border-prominent"}`}
                  aria-hidden="true"
                />
              )}
              <details open={active || failed} className="group">
                <summary
                  className={`flex cursor-pointer list-none gap-3 rounded-sm [&::-webkit-details-marker]:hidden ${focusClass}`}
                >
                  <span
                    className={`relative grid size-7 shrink-0 place-items-center rounded-full border font-brand-mono text-[10px] ${complete ? "border-nd-highlight-green bg-nd-highlight-green text-black" : active ? "border-white bg-white text-black" : failed ? "border-nd-highlight-orange text-nd-highlight-orange" : "border-nd-border-prominent text-nd-mid-em-text"}`}
                  >
                    {complete ? (
                      <Check className="!size-4" aria-hidden="true" />
                    ) : failed ? (
                      "!"
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </span>
                  <span className="min-w-0 flex-1 pt-0.5">
                    <span
                      className={`block text-[13px] ${active || complete ? "text-white" : "text-nd-mid-em-text"}`}
                    >
                      {stage.title}
                    </span>
                    <span
                      className={`mt-1 flex items-center gap-1.5 text-[10px] ${PARTY_META[stage.actor].textClass}`}
                    >
                      <span
                        className={`size-1 rounded-full ${PARTY_META[stage.actor].dotClass}`}
                        aria-hidden="true"
                      />
                      {stage.actorLabel}
                    </span>
                  </span>
                  <span
                    className="pt-1 text-xs text-nd-mid-em-text group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                  <span className="sr-only">{state.status}</span>
                </summary>
                <div className="ml-10 mt-2">
                  <p className="m-0 text-xs leading-relaxed text-nd-mid-em-text">
                    {stage.description}
                  </p>
                  {active && (
                    <p className="mb-0 mt-2 text-[11px] text-white">
                      {replaying
                        ? "Replaying confirmed step…"
                        : stage.key === "parties"
                          ? "Creating demo identities…"
                          : "Waiting for devnet confirmation…"}
                    </p>
                  )}
                  {state.signatures?.map((signature, signatureIndex) => (
                    <div
                      key={signature}
                      className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-nd-mid-em-text"
                    >
                      <span>
                        Transaction
                        {state.signatures!.length > 1
                          ? ` ${signatureIndex + 1}`
                          : ""}
                      </span>
                      <ExplorerLink value={signature} transaction />
                    </div>
                  ))}
                  {state.error && (
                    <p className="mb-0 mt-2 break-words text-xs text-nd-highlight-orange">
                      {state.error}
                    </p>
                  )}
                </div>
              </details>
            </li>
          );
        })}
      </ol>
      <div className="mt-6 border-t border-nd-border-light pt-4 text-xs leading-relaxed text-nd-mid-em-text">
        {error
          ? "The run stopped at the highlighted step. Confirmed steps remain visible."
          : running
            ? "Follow along as each party takes its turn. The demo handles all six steps."
            : completed === 6
              ? "Every onchain step is confirmed. Expand a step to view its transactions."
              : "One click runs all six steps. Expand any step to see what happens."}
      </div>
    </aside>
  );
}

export function DvpDashboard({
  stages,
  running,
  finished,
  replaying,
  error,
  roles,
  mints,
  dvpAddresses,
  terms,
  onRun,
}: {
  stages: Record<StageKey, StageState>;
  running: boolean;
  finished: boolean;
  replaying: boolean;
  error: string | null;
  roles: Record<RoleKey, string> | null;
  mints: { asset: string; cash: string } | null;
  dvpAddresses: DvpAddresses | null;
  terms: TradeTerms | null;
  onRun: () => void;
}) {
  const [inspectedParty, setInspectedParty] = useState<RoleKey | null>(null);
  const activeStage = STAGES.find(
    ({ key }) =>
      stages[key].status === "running" || stages[key].status === "error",
  );
  const selectedParty =
    inspectedParty ?? activeStage?.actor ?? (finished ? "authority" : "maker");
  const selectedMeta = PARTY_META[selectedParty];
  const assetFunded = stages.asset.status === "complete";
  const cashFunded = stages.cash.status === "complete";
  const settled = stages.settle.status === "complete";
  const fundedLegs = Number(assetFunded) + Number(cashFunded);
  const tradeCreated = stages.trade.status === "complete";
  const status = settled
    ? "Settled atomically"
    : error
      ? "Run interrupted"
      : stages.settle.status === "running"
        ? "Settling both legs"
        : assetFunded && cashFunded
          ? "Ready to settle"
          : assetFunded
            ? "Awaiting payment"
            : tradeCreated
              ? "Awaiting deposits"
              : running
                ? "Preparing the trade"
                : "Ready when you are";
  const accounts = [
    { label: "DvP program", value: PROGRAM_ID },
    ...partyKeys.flatMap((party) =>
      roles ? [{ label: PARTY_META[party].label, value: roles[party] }] : [],
    ),
    ...(mints
      ? [
          { label: "TBILL mint", value: mints.asset },
          { label: "dUSD mint", value: mints.cash },
        ]
      : []),
    ...(dvpAddresses
      ? [
          {
            label: `Trade account${settled ? " · Closed" : ""}`,
            value: dvpAddresses.swapDvp,
          },
          {
            label: `Asset escrow${settled ? " · Closed" : ""}`,
            value: dvpAddresses.escrowA,
          },
          {
            label: `Payment escrow${settled ? " · Closed" : ""}`,
            value: dvpAddresses.escrowB,
          },
          {
            label: "Nonce tombstone · Retained",
            value: dvpAddresses.nonceTombstone,
          },
        ]
      : []),
  ];
  return (
    <main className="min-h-screen bg-nd-bg pb-20 pt-7 font-brand text-nd-high-em-text sm:pt-9">
      <Container className="max-w-[1240px]">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/delivery-vs-payment"
            className={`inline-flex items-center gap-2 text-xs text-nd-mid-em-text hover:text-white ${focusClass}`}
          >
            <ArrowLeft className="!size-3.5" aria-hidden="true" />
            Delivery versus Payment
          </Link>
          <span
            className={`flex items-center gap-2 text-nd-mid-em-text ${captionClass}`}
          >
            <span
              className="size-1.5 rounded-full bg-nd-highlight-green"
              aria-hidden="true"
            />
            Solana devnet
          </span>
        </div>

        <header className="flex flex-col justify-between gap-6 pb-8 pt-9 lg:flex-row lg:items-end lg:gap-10">
          <div>
            <p className={`${captionClass} m-0 mb-3 text-nd-mid-em-text`}>
              Delivery versus Payment / Live demo
            </p>
            <h1 className="m-0 text-[clamp(38px,4.4vw,58px)] font-normal leading-[1.02] tracking-[-0.055em]">
              Two sides. One settlement.
            </h1>
            <p className="mb-0 mt-4 max-w-[600px] text-[15px] leading-relaxed text-nd-mid-em-text">
              Follow an asset and its payment from two wallets, through escrow,
              to one atomic exchange.
            </p>
          </div>
          <div className="shrink-0 lg:pb-1 lg:text-right">
            <Button
              onClick={() => {
                setInspectedParty(null);
                onRun();
              }}
              disabled={running}
              className="h-12 w-full rounded-full bg-nd-cta pl-6 pr-2 text-[13px] text-black hover:bg-nd-highlight-green focus-visible:ring-nd-highlight-green focus-visible:ring-offset-black sm:w-auto"
            >
              {running
                ? replaying
                  ? "Replaying settlement…"
                  : "Settlement in progress…"
                : finished
                  ? "Replay this settlement"
                  : error
                    ? "Try a fresh demo"
                    : "Run the devnet demo"}
              <span className="ml-3 grid size-8 place-items-center rounded-full bg-black text-white">
                {running ? (
                  <span
                    className="size-3.5 animate-spin rounded-full border border-white/30 border-t-white motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowRight className="!size-4" aria-hidden="true" />
                )}
              </span>
            </Button>
            <p className="mb-0 mt-2.5 text-[11px] text-nd-mid-em-text">
              {finished || replaying
                ? "Replay uses the same confirmed transactions"
                : "No wallet needed · Test tokens only · Fees covered"}
            </p>
          </div>
        </header>

        <section
          aria-label="Trade parties"
          className="mb-7 border-y border-nd-border-light py-5"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2
              className={`${captionClass} m-0 font-normal text-nd-mid-em-text`}
            >
              Meet the four parties
            </h2>
            <span className="text-[11px] text-nd-mid-em-text">
              Select a party to explore its role
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {partyKeys.map((party) => {
              const meta = PARTY_META[party];
              const selected = selectedParty === party;
              return (
                <button
                  type="button"
                  key={party}
                  onClick={() => setInspectedParty(party)}
                  aria-pressed={selected}
                  aria-controls="party-detail"
                  className={`min-w-0 rounded-xl border px-3.5 py-3.5 text-left transition-colors motion-reduce:transition-none sm:px-4 ${focusClass} ${selected ? meta.selectedClass : "border-nd-border-light bg-white/[0.025] hover:border-nd-border-hovered"}`}
                >
                  <span className="flex items-center justify-between gap-1">
                    <span className="flex items-center gap-2 text-[13px]">
                      <span
                        className={`size-1.5 shrink-0 rounded-full ${meta.dotClass}`}
                        aria-hidden="true"
                      />
                      {meta.label}
                    </span>
                    {running && activeStage?.actor === party && (
                      <span
                        className="size-1.5 shrink-0 animate-pulse rounded-full bg-white motion-reduce:animate-none"
                        aria-label="Active party"
                      />
                    )}
                  </span>
                  <span className="mt-1.5 block text-[11px] text-nd-mid-em-text">
                    {meta.action}
                  </span>
                </button>
              );
            })}
          </div>
          <div
            id="party-detail"
            className="mt-4 flex min-h-[40px] flex-col justify-between gap-3 sm:flex-row sm:items-center"
            aria-live="polite"
          >
            <p className="m-0 max-w-[830px] text-xs leading-relaxed text-nd-mid-em-text">
              <span className={`${selectedMeta.textClass} mr-1`}>
                {selectedMeta.name}.
              </span>{" "}
              {selectedMeta.description}
            </p>
            {roles ? (
              <ExplorerLink
                value={roles[selectedParty]}
                label={selectedMeta.label}
              />
            ) : (
              <span className="shrink-0 font-brand-mono text-[10px] text-nd-mid-em-text">
                Wallet created on run
              </span>
            )}
          </div>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <section aria-label="Trade ticket">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2
                  className={`${captionClass} m-0 font-normal text-nd-mid-em-text`}
                >
                  Trade ticket
                </h2>
                <span
                  role="status"
                  className={`flex items-center gap-1.5 text-[11px] ${error ? "text-nd-highlight-orange" : settled ? "text-nd-highlight-green" : "text-nd-mid-em-text"}`}
                >
                  <span
                    className={`size-1.5 rounded-full ${error ? "bg-nd-highlight-orange" : settled ? "bg-nd-highlight-green" : "bg-nd-mid-em-text"}`}
                    aria-hidden="true"
                  />
                  {replaying ? "Replay · " : ""}
                  {status}
                </span>
              </div>
              <div className="space-y-3">
                <TradeLeg
                  leg="asset"
                  state={stages.asset}
                  tradeCreated={tradeCreated}
                  settled={settled}
                  escrow={dvpAddresses?.escrowA}
                />
                <TradeLeg
                  leg="cash"
                  state={stages.cash}
                  tradeCreated={tradeCreated}
                  settled={settled}
                  escrow={dvpAddresses?.escrowB}
                />
                <div
                  className={`grid gap-4 rounded-[16px] border p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6 ${settled ? "border-nd-highlight-green/30 bg-nd-highlight-green/[0.08]" : "border-nd-border-light bg-white/[0.035]"}`}
                >
                  <div>
                    <h3 className="m-0 text-[17px] font-normal tracking-[-0.03em]">
                      {settled
                        ? "Both sides received. Trade complete."
                        : "Both legs settle. Or neither does."}
                    </h3>
                    <p className="mb-0 mt-1.5 max-w-[470px] text-xs leading-relaxed text-nd-mid-em-text">
                      {settled
                        ? "The trade and both escrows closed in the settlement transaction. Their rent returned to the authority."
                        : "Once both deposits are in escrow, the authority exchanges them in a single transaction. Both transfers succeed together or both revert."}
                    </p>
                    {settled && stages.settle.signatures?.[0] && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-nd-mid-em-text">
                        Settlement transaction{" "}
                        <ExplorerLink
                          value={stages.settle.signatures[0]}
                          transaction
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 sm:block sm:text-right">
                    <div
                      className={`text-[42px] leading-none tracking-[-0.06em] ${settled ? "text-nd-highlight-green" : "text-white"}`}
                    >
                      {settled ? "1" : `${fundedLegs}/2`}
                    </div>
                    <div className="mt-1 text-[10px] text-nd-mid-em-text">
                      {settled ? "atomic transaction" : "legs funded"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 rounded-[14px] border border-nd-border-light px-4 py-4 sm:px-5">
                <ExpiryClock
                  terms={terms}
                  settled={settled}
                  replaying={replaying}
                />
                <div className="border-l border-nd-border-light pl-3 sm:pl-5">
                  <div className={`${captionClass} text-nd-mid-em-text`}>
                    Your fees
                  </div>
                  <div className="mt-2 text-[23px] leading-none tracking-[-0.04em]">
                    0{" "}
                    <span className="text-[13px] text-nd-mid-em-text">SOL</span>
                  </div>
                </div>
                <div className="border-l border-nd-border-light pl-3 sm:pl-5">
                  <div className={`${captionClass} text-nd-mid-em-text`}>
                    Fee payer
                  </div>
                  <div className="mt-2 text-[23px] leading-none tracking-[-0.04em]">
                    Treasury
                  </div>
                </div>
              </div>
              {dvpAddresses && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
                  <span className="font-brand-mono text-[10px] text-nd-mid-em-text">
                    {terms?.ref ?? "Trade account"}
                  </span>
                  <span className="flex items-center gap-2">
                    <ExplorerLink
                      value={dvpAddresses.swapDvp}
                      label="Trade account"
                    />
                    <CopyAddress value={dvpAddresses.swapDvp} />
                  </span>
                </div>
              )}
            </section>
            <Balances stages={stages} />
          </div>
          <SettlementFlow
            stages={stages}
            running={running}
            replaying={replaying}
            error={error}
          />
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-[14px] border border-nd-highlight-orange/30 bg-nd-highlight-orange/[0.06] p-5"
          >
            <p className="m-0 text-sm text-nd-highlight-orange">
              The demo stopped at “{activeStage?.title ?? "setup"}”.
            </p>
            <p className="mb-0 mt-2 break-words text-xs text-nd-mid-em-text">
              {error}
            </p>
            <p className="mb-0 mt-2 text-xs text-nd-mid-em-text">
              Only test tokens are involved. Use “Try a fresh demo” to start
              with new accounts.
            </p>
          </div>
        )}

        <details className="group mt-7 rounded-[14px] border border-nd-border-light">
          <summary
            className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-[14px] px-5 py-4 text-sm [&::-webkit-details-marker]:hidden ${focusClass}`}
          >
            <span>
              Onchain accounts & trade details{" "}
              <span className="ml-2 text-[11px] text-nd-mid-em-text">
                {accounts.length}{" "}
                {accounts.length === 1 ? "account" : "accounts"}
              </span>
            </span>
            <span
              className="text-lg text-nd-mid-em-text group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <div className="grid gap-6 border-t border-nd-border-light p-5 md:grid-cols-2 md:gap-10">
            <dl className="m-0">
              {accounts.map(({ label, value }) => (
                <div
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-nd-border-light py-2.5 last:border-b-0"
                  key={label}
                >
                  <dt className="text-xs text-nd-mid-em-text">{label}</dt>
                  <dd className="m-0">
                    <ExplorerLink value={value} label={label} />
                  </dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className="m-0 text-sm font-normal">
                A normal transfer on each side.
              </h3>
              <p className="mb-0 mt-2 text-xs leading-relaxed text-nd-mid-em-text">
                Each party funds its escrow with a standard token transfer. The
                settlement authority exchanges both legs together. In this demo,
                all parties are created for you and the treasury pays
                transaction fees and account rent.
              </p>
              {terms ? (
                <dl className="mb-0 mt-5 space-y-3 text-xs">
                  <div className="flex flex-wrap justify-between gap-2">
                    <dt className="text-nd-mid-em-text">Reference</dt>
                    <dd className="m-0 font-brand-mono">{terms.ref}</dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2">
                    <dt className="text-nd-mid-em-text">Nonce</dt>
                    <dd className="m-0 break-all font-brand-mono">
                      {terms.nonce.toString()}
                    </dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2">
                    <dt className="text-nd-mid-em-text">Expiry (UTC)</dt>
                    <dd className="m-0 font-brand-mono">
                      {new Date(Number(terms.expiryTimestamp) * 1000)
                        .toISOString()
                        .replace("T", " ")
                        .replace(".000Z", " UTC")}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-nd-mid-em-text">
                      Trade & escrow accounts
                    </dt>
                    <dd className="m-0">
                      {settled
                        ? "Closed"
                        : tradeCreated
                          ? "Open"
                          : "Not yet created"}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mb-0 mt-5 text-xs text-nd-mid-em-text">
                  Run the demo to inspect the trade reference, expiry, wallets,
                  and escrow accounts.
                </p>
              )}
              {settled && (
                <p className="mb-0 mt-5 text-xs leading-relaxed text-nd-mid-em-text">
                  The nonce tombstone stays onchain to prevent this trade from
                  being recreated. Closed accounts may no longer show account
                  data in Explorer; the transaction links preserve the history.
                </p>
              )}
            </div>
          </div>
        </details>
        <p className="mb-0 mt-5 text-center text-[11px] text-nd-mid-em-text">
          Live transactions on Solana devnet. TBILL and dUSD are demo tokens
          with no real-world value.
        </p>
      </Container>
    </main>
  );
}
