"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { address, type KeyPairSigner } from "@solana/kit";
import { ArrowLeft } from "@boxicons/react/ArrowLeft";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Check } from "@boxicons/react/Check";
import { Button } from "@/app/components/ui/button";
import { Container } from "@/component-library/container";
import {
  ASSET_TOKEN,
  CASH_TOKEN,
  PRESET,
  PROGRAM_ID,
  type RoleKey,
} from "@/lib/delivery-vs-payment/config";
import {
  createDvp,
  fundLeg,
  setSponsor,
  settle,
  type TradeTerms,
} from "@/lib/delivery-vs-payment/solana/dvp";
import type { DvpAddresses } from "@/lib/delivery-vs-payment/solana/pdas";
import {
  loadOrCreateSeeds,
  resetSeeds,
  signersFromSeeds,
} from "@/lib/delivery-vs-payment/solana/roles";
import { makeRpc } from "@/lib/delivery-vs-payment/solana/rpc";

type StageKey = "parties" | "assets" | "trade" | "asset" | "cash" | "settle";
type StageStatus = "waiting" | "running" | "complete" | "error";
type StageState = {
  status: StageStatus;
  signatures?: string[];
  error?: string;
};
type AccountRow = {
  label: string;
  value: string;
  party?: RoleKey;
};
type CompletedRun = {
  stages: Record<StageKey, StageState>;
  roles: Record<RoleKey, string>;
  mints: { asset: string; cash: string };
  dvpAddresses: DvpAddresses;
  terms: TradeTerms;
};

const PARTY_META: Record<
  RoleKey,
  { label: string; chipClass: string; dotClass: string }
> = {
  maker: {
    label: "Maker",
    chipClass:
      "border-nd-highlight-lavendar/35 bg-nd-highlight-lavendar/[0.08] text-nd-highlight-lavendar",
    dotClass: "bg-nd-highlight-lavendar",
  },
  partyA: {
    label: "Seller · Party A",
    chipClass:
      "border-nd-highlight-blue/35 bg-nd-highlight-blue/[0.08] text-nd-highlight-blue",
    dotClass: "bg-nd-highlight-blue",
  },
  partyB: {
    label: "Buyer · Party B",
    chipClass:
      "border-nd-highlight-green/35 bg-nd-highlight-green/[0.08] text-nd-highlight-green",
    dotClass: "bg-nd-highlight-green",
  },
  authority: {
    label: "Settlement authority",
    chipClass:
      "border-nd-highlight-orange/35 bg-nd-highlight-orange/[0.08] text-nd-highlight-orange",
    dotClass: "bg-nd-highlight-orange",
  },
};

const STAGES: Array<{
  key: StageKey;
  title: string;
  description: string;
  parties: RoleKey[];
}> = [
  {
    key: "parties",
    title: "Create the parties",
    description:
      "Generate fresh demo identities for the maker, seller, buyer, and settlement authority.",
    parties: ["maker", "partyA", "partyB", "authority"],
  },
  {
    key: "assets",
    title: "Prepare the assets",
    description:
      "Issue demo TBILL to the seller and dUSD to the buyer. The treasury sponsors fees.",
    parties: ["partyA", "partyB"],
  },
  {
    key: "trade",
    title: "Create the trade",
    description:
      "Record the terms and create the DvP account with an escrow account for each leg.",
    parties: ["maker", "partyA", "partyB", "authority"],
  },
  {
    key: "asset",
    title: "Fund the asset leg",
    description:
      "The seller transfers 100 TBILL to the asset escrow using a standard token transfer.",
    parties: ["partyA"],
  },
  {
    key: "cash",
    title: "Fund the payment leg",
    description: "The buyer transfers 10,000 dUSD to the payment escrow.",
    parties: ["partyB"],
  },
  {
    key: "settle",
    title: "Settle atomically",
    description:
      "The authority releases both legs together and closes the DvP and escrow accounts.",
    parties: ["authority", "partyA", "partyB"],
  },
];

const initialStages = (): Record<StageKey, StageState> =>
  Object.fromEntries(
    STAGES.map(({ key }) => [key, { status: "waiting" }]),
  ) as Record<StageKey, StageState>;

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const REPLAY_STAGE_DELAY_MS = 500;

function explorerAddress(value: string) {
  return `https://explorer.solana.com/address/${value}?cluster=devnet`;
}

function explorerTransaction(value: string) {
  return `https://explorer.solana.com/tx/${value}?cluster=devnet`;
}

function shortAddress(value: string) {
  return `${value.slice(0, 5)}…${value.slice(-5)}`;
}

function PartyChip({ party }: { party: RoleKey }) {
  const meta = PARTY_META[party];

  return (
    <span
      className={`inline-flex items-center gap-[7px] rounded-full border px-2 py-1 font-brand-mono text-[9px] uppercase tracking-[0.08em] whitespace-nowrap ${meta.chipClass}`}
    >
      <span
        className={`size-1.5 shrink-0 rounded-full ${meta.dotClass}`}
        aria-hidden="true"
      />
      {meta.label}
    </span>
  );
}

function ExplorerLink({
  value,
  type = "address",
}: {
  value: string;
  type?: "address" | "transaction";
}) {
  return (
    <a
      href={
        type === "address" ? explorerAddress(value) : explorerTransaction(value)
      }
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-w-0 items-center gap-1 font-brand-mono text-[11px] text-[#f6f4f8] transition-colors hover:text-nd-highlight-green motion-reduce:transition-none"
      title={value}
    >
      {shortAddress(value)}
      <ArrowUpRight className="!size-3.5" aria-hidden="true" />
    </a>
  );
}

export function DvpDemo() {
  const [stages, setStages] = useState(initialStages);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Record<RoleKey, string> | null>(null);
  const [mints, setMints] = useState<{ asset: string; cash: string } | null>(
    null,
  );
  const [dvpAddresses, setDvpAddresses] = useState<DvpAddresses | null>(null);
  const [terms, setTerms] = useState<TradeTerms | null>(null);
  const completedRun = useRef<CompletedRun | null>(null);

  const updateStage = (key: StageKey, next: StageState) =>
    setStages((current) => ({ ...current, [key]: next }));

  const accountRows = useMemo(() => {
    const rows: AccountRow[] = [{ label: "DvP program", value: PROGRAM_ID }];
    if (roles) {
      rows.push(
        { label: PARTY_META.maker.label, value: roles.maker, party: "maker" },
        {
          label: PARTY_META.partyA.label,
          value: roles.partyA,
          party: "partyA",
        },
        {
          label: PARTY_META.partyB.label,
          value: roles.partyB,
          party: "partyB",
        },
        {
          label: PARTY_META.authority.label,
          value: roles.authority,
          party: "authority",
        },
      );
    }
    if (mints) {
      rows.push(
        { label: "TBILL mint", value: mints.asset },
        { label: "dUSD mint", value: mints.cash },
      );
    }
    if (dvpAddresses) {
      rows.push(
        { label: "SwapDvp account", value: dvpAddresses.swapDvp },
        { label: "Asset escrow", value: dvpAddresses.escrowA },
        { label: "Payment escrow", value: dvpAddresses.escrowB },
        { label: "Nonce tombstone", value: dvpAddresses.nonceTombstone },
      );
    }
    return rows;
  }, [dvpAddresses, mints, roles]);

  async function replayDemo(snapshot: CompletedRun) {
    setRunning(true);
    setFinished(false);
    setError(null);
    setStages(initialStages());
    setRoles(null);
    setMints(null);
    setDvpAddresses(null);
    setTerms(null);

    let activeStage: StageKey = "parties";
    try {
      updateStage("parties", { status: "running" });
      setRoles({ ...snapshot.roles });
      await wait(REPLAY_STAGE_DELAY_MS);
      updateStage("parties", snapshot.stages.parties);

      activeStage = "assets";
      updateStage("assets", { status: "running" });
      await wait(REPLAY_STAGE_DELAY_MS);
      setMints({ ...snapshot.mints });
      updateStage("assets", snapshot.stages.assets);

      setTerms(snapshot.terms);
      activeStage = "trade";
      updateStage("trade", { status: "running" });
      await wait(REPLAY_STAGE_DELAY_MS);
      setDvpAddresses({ ...snapshot.dvpAddresses });
      updateStage("trade", snapshot.stages.trade);

      activeStage = "asset";
      updateStage("asset", { status: "running" });
      await wait(REPLAY_STAGE_DELAY_MS);
      updateStage("asset", snapshot.stages.asset);

      activeStage = "cash";
      updateStage("cash", { status: "running" });
      await wait(REPLAY_STAGE_DELAY_MS);
      updateStage("cash", snapshot.stages.cash);

      activeStage = "settle";
      updateStage("settle", { status: "running" });
      await wait(REPLAY_STAGE_DELAY_MS);
      updateStage("settle", snapshot.stages.settle);
      setFinished(true);
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "The demo stopped unexpectedly";
      setError(message);
      updateStage(activeStage, { status: "error", error: message });
    } finally {
      setRunning(false);
    }
  }

  async function runDemo() {
    if (finished && completedRun.current) {
      await replayDemo(completedRun.current);
      return;
    }

    completedRun.current = null;
    setRunning(true);
    setFinished(false);
    setError(null);
    setStages(initialStages());
    setRoles(null);
    setMints(null);
    setDvpAddresses(null);
    setTerms(null);

    let activeStage: StageKey = "parties";
    try {
      updateStage("parties", { status: "running" });
      resetSeeds();
      const signers = await signersFromSeeds(loadOrCreateSeeds());
      const roleAddresses: Record<RoleKey, string> = {
        maker: signers.maker.address,
        partyA: signers.partyA.address,
        partyB: signers.partyB.address,
        authority: signers.authority.address,
      };
      setRoles(roleAddresses);
      await wait(500);
      updateStage("parties", { status: "complete" });

      activeStage = "assets";
      updateStage("assets", { status: "running" });
      const configResponse = await fetch("/api/dvp-demo/config", {
        cache: "no-store",
      });
      const config = await configResponse.json();
      if (!configResponse.ok)
        throw new Error(config.error ?? "Demo is not configured");
      setSponsor(config.treasury);
      const fundResponse = await fetch("/api/dvp-demo/fund", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ addresses: roleAddresses }),
      });
      const funding = await fundResponse.json();
      if (!fundResponse.ok)
        throw new Error(funding.error ?? "Could not prepare demo assets");
      setMints(funding.mints);
      updateStage("assets", {
        status: "complete",
        signatures: funding.setupSignatures,
      });

      const rpc = makeRpc();
      const nonce = crypto.getRandomValues(new BigUint64Array(1))[0] ?? 0n;
      const tradeTerms: TradeTerms = {
        settlementAuthority: address(roleAddresses.authority),
        userA: address(roleAddresses.partyA),
        userB: address(roleAddresses.partyB),
        mintA: address(funding.mints.asset),
        mintB: address(funding.mints.cash),
        amountA: PRESET.amountA,
        amountB: PRESET.amountB,
        decimalsA: ASSET_TOKEN.decimals,
        decimalsB: CASH_TOKEN.decimals,
        nonce,
        expiryTimestamp: BigInt(
          Math.floor(Date.now() / 1000) + PRESET.expirySeconds,
        ),
        ref: `SOLANA-DVP-${nonce.toString().slice(-6)}`,
      };
      setTerms(tradeTerms);

      activeStage = "trade";
      updateStage("trade", { status: "running" });
      const created = await createDvp(rpc, tradeTerms);
      setDvpAddresses(created.addresses);
      updateStage("trade", {
        status: "complete",
        signatures: [created.signature],
      });

      activeStage = "asset";
      updateStage("asset", { status: "running" });
      const assetSignature = await fundLeg(
        rpc,
        signers.partyA as KeyPairSigner,
        {
          mint: tradeTerms.mintA,
          decimals: tradeTerms.decimalsA,
          escrow: created.addresses.escrowA,
          amount: tradeTerms.amountA,
        },
      );
      updateStage("asset", {
        status: "complete",
        signatures: [assetSignature],
      });

      activeStage = "cash";
      updateStage("cash", { status: "running" });
      const cashSignature = await fundLeg(
        rpc,
        signers.partyB as KeyPairSigner,
        {
          mint: tradeTerms.mintB,
          decimals: tradeTerms.decimalsB,
          escrow: created.addresses.escrowB,
          amount: tradeTerms.amountB,
        },
      );
      updateStage("cash", {
        status: "complete",
        signatures: [cashSignature],
      });

      activeStage = "settle";
      updateStage("settle", { status: "running" });
      const settlementSignature = await settle(
        rpc,
        signers.authority as KeyPairSigner,
        tradeTerms,
        created.addresses,
      );
      updateStage("settle", {
        status: "complete",
        signatures: [settlementSignature],
      });
      completedRun.current = {
        stages: {
          parties: { status: "complete" },
          assets: {
            status: "complete",
            signatures: funding.setupSignatures,
          },
          trade: { status: "complete", signatures: [created.signature] },
          asset: { status: "complete", signatures: [assetSignature] },
          cash: { status: "complete", signatures: [cashSignature] },
          settle: {
            status: "complete",
            signatures: [settlementSignature],
          },
        },
        roles: roleAddresses,
        mints: funding.mints,
        dvpAddresses: created.addresses,
        terms: tradeTerms,
      };
      setFinished(true);
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "The demo stopped unexpectedly";
      setError(message);
      updateStage(activeStage, { status: "error", error: message });
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050506] py-8 pb-24 text-[#f6f4f8] max-sm:py-[22px] max-sm:pb-16">
      <Container>
        <div className="mx-auto mb-6 flex max-w-[1080px] items-center justify-between gap-5 max-sm:mb-[18px]">
          <Link
            href="/delivery-vs-payment"
            className="inline-flex items-center gap-2 text-[13px] text-[#a5a3ad] transition-colors hover:text-white motion-reduce:transition-none"
          >
            <ArrowLeft className="!size-4" aria-hidden="true" />
            Delivery versus Payment
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-[11px] py-[7px] font-brand-mono text-[10px] uppercase tracking-[0.1em] text-[#a5a3ad]">
            <span
              className="size-[7px] rounded-full bg-nd-highlight-green shadow-[0_0_0_4px_rgba(85,233,171,0.1)]"
              aria-hidden="true"
            />
            Devnet
          </div>
        </div>

        <section className="mx-auto max-w-[1080px] overflow-hidden rounded-[18px] border border-white/[0.13] bg-[#0a0a0d] max-sm:rounded-[14px]">
          <div className="max-w-[820px] px-10 pb-[54px] pt-[68px] max-sm:px-[22px] max-sm:pb-[38px] max-sm:pt-[42px]">
            <p className="m-0 font-brand-mono text-[10px] uppercase tracking-[0.19em] text-[#74727d]">
              Live demo · Atomic settlement
            </p>
            <h1 className="m-0 mt-4 max-w-[780px] font-serif text-[clamp(46px,6.2vw,76px)] font-normal leading-[0.98] tracking-[-0.045em] max-sm:text-[clamp(42px,13vw,58px)]">
              Delivery versus Payment, settled atomically.
            </h1>
            <p className="m-0 mt-[18px] max-w-[650px] text-[17px] leading-[1.55] text-[#aaa8b1] max-sm:text-[15px]">
              Watch an asset and its payment cross in one Solana transaction.
              The demo uses fresh accounts and test tokens—never real funds.
            </p>
            <Button
              onClick={runDemo}
              disabled={running}
              className="mt-[30px] h-12 rounded-full !bg-[#f6f4f8] !px-[19px] !pr-[7px] !text-[13px] !font-semibold !text-[#09090b] hover:!bg-nd-highlight-green disabled:opacity-[0.55]"
              size="lg"
            >
              {running
                ? "Settlement in progress…"
                : finished || error
                  ? "Run the demo again"
                  : "Run the devnet demo"}
              {!running && (
                <span className="ml-2 inline-flex size-[34px] items-center justify-center rounded-full bg-[#0a0a0d] text-white">
                  <ArrowRight className="!size-4" aria-hidden="true" />
                </span>
              )}
            </Button>
          </div>

          <dl className="m-0 grid grid-cols-3 border-t border-white/[0.13] max-sm:grid-cols-1">
            <div className="min-w-0 px-[26px] pb-[25px] pt-[23px] max-sm:grid max-sm:grid-cols-[36px_1fr] max-sm:items-baseline max-sm:gap-2.5 max-sm:px-[22px] max-sm:py-[17px]">
              <dd className="m-0 font-serif text-[28px] leading-none text-nd-highlight-green">
                1
              </dd>
              <dt className="m-0 mt-2 text-[13px] leading-[1.4] text-[#8d8b96] max-sm:mt-0">
                transaction settles both legs
              </dt>
            </div>
            <div className="min-w-0 border-l border-white/[0.13] px-[26px] pb-[25px] pt-[23px] max-sm:grid max-sm:grid-cols-[36px_1fr] max-sm:items-baseline max-sm:gap-2.5 max-sm:border-l-0 max-sm:border-t max-sm:px-[22px] max-sm:py-[17px]">
              <dd className="m-0 font-serif text-[28px] leading-none text-nd-highlight-green">
                0
              </dd>
              <dt className="m-0 mt-2 text-[13px] leading-[1.4] text-[#8d8b96] max-sm:mt-0">
                counterparty risk at settlement
              </dt>
            </div>
            <div className="min-w-0 border-l border-white/[0.13] px-[26px] pb-[25px] pt-[23px] max-sm:grid max-sm:grid-cols-[36px_1fr] max-sm:items-baseline max-sm:gap-2.5 max-sm:border-l-0 max-sm:border-t max-sm:px-[22px] max-sm:py-[17px]">
              <dd className="m-0 font-serif text-[28px] leading-none text-nd-highlight-green">
                0
              </dd>
              <dt className="m-0 mt-2 text-[13px] leading-[1.4] text-[#8d8b96] max-sm:mt-0">
                real funds used in this demo
              </dt>
            </div>
          </dl>
        </section>

        <section
          className="mx-auto mt-6 max-w-[1080px] rounded-[18px] border border-white/[0.13] bg-[#0a0a0d] p-[34px_40px_40px] max-sm:rounded-[14px] max-sm:p-[28px_22px_30px]"
          aria-label="Demo progress"
        >
          <div className="border-b border-white/[0.13] pb-7">
            <div className="flex items-end justify-between gap-10 max-sm:block">
              <div>
                <p className="m-0 font-brand-mono text-[10px] uppercase tracking-[0.19em] text-[#74727d]">
                  Settlement flow
                </p>
                <h2 className="m-0 mt-[7px] font-brand text-[27px] font-medium tracking-[-0.025em]">
                  Follow the trade onchain
                </h2>
              </div>
              <p className="m-0 max-w-[390px] text-[13px] leading-[1.5] text-[#85838d] max-sm:mt-3">
                Every completed step links to the corresponding transaction in
                Solana Explorer.
              </p>
            </div>
            <div
              className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-white/[0.09] pt-4"
              aria-label="Party color key"
            >
              <span className="mr-1 font-brand-mono text-[9px] uppercase tracking-[0.12em] text-[#6f6d78]">
                Party key
              </span>
              {(["maker", "partyA", "partyB", "authority"] as RoleKey[]).map(
                (party) => (
                  <PartyChip key={party} party={party} />
                ),
              )}
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_330px] gap-10 pt-2 max-[900px]:grid-cols-1 max-[900px]:gap-7">
            <div>
              <div aria-live="polite">
                {STAGES.map((stage, index) => {
                  const state = stages[stage.key];
                  const isRunning = state.status === "running";
                  const isComplete = state.status === "complete";
                  const isError = state.status === "error";
                  return (
                    <div
                      className={`grid grid-cols-[44px_1fr] gap-3.5 border-b border-white/[0.11] py-[22px] opacity-[0.62] transition-opacity duration-[220ms] motion-reduce:transition-none max-sm:grid-cols-[38px_1fr] max-sm:gap-2 ${isRunning || isComplete || isError ? "opacity-100" : ""}`}
                      data-status={state.status}
                      key={stage.key}
                    >
                      <div
                        className={`grid size-[30px] place-items-center rounded-full border border-white/[0.18] font-brand-mono text-[10px] text-[#a5a3ad] ${isRunning ? "animate-pulse border-white text-white motion-reduce:animate-none" : ""} ${isComplete ? "border-nd-highlight-green bg-nd-highlight-green text-[#050506]" : ""} ${isError ? "border-nd-highlight-orange text-nd-highlight-orange" : ""}`}
                      >
                        {isComplete ? (
                          <Check
                            className="!size-6 text-white"
                            aria-hidden="true"
                          />
                        ) : (
                          String(index + 1).padStart(2, "0")
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-baseline justify-between gap-4 max-sm:block">
                          <h2 className="m-0 font-brand text-[18px] font-medium tracking-[-0.015em] text-white">
                            {stage.title}
                          </h2>
                          <span
                            className={`font-brand-mono text-[9px] uppercase tracking-[0.12em] text-[#a5a3ad] max-sm:mt-1 max-sm:block ${isRunning ? "text-white" : ""} ${isComplete ? "text-nd-highlight-green" : ""}`}
                          >
                            {state.status === "waiting"
                              ? "Ready"
                              : state.status}
                          </span>
                        </div>
                        <p className="m-0 mt-1.5 max-w-[620px] text-sm leading-[1.5] text-white">
                          {stage.description}
                        </p>
                        <div
                          className="mt-[13px] flex flex-wrap items-center gap-x-2 gap-y-2"
                          aria-label={`Parties involved in ${stage.title}`}
                        >
                          <span className="mr-1 font-brand-mono text-[9px] uppercase tracking-[0.12em] text-[#a5a3ad]">
                            Parties
                          </span>
                          {stage.parties.map((party) => (
                            <PartyChip key={party} party={party} />
                          ))}
                        </div>
                        {state.signatures?.length ? (
                          <div className="mt-[11px] flex flex-wrap gap-x-4 gap-y-2">
                            {state.signatures.map(
                              (signature, signatureIndex) => (
                                <span
                                  className="flex items-center gap-[7px] font-brand-mono text-[10px] uppercase text-[#a5a3ad]"
                                  key={signature}
                                >
                                  {state.signatures!.length > 1
                                    ? `Transaction ${signatureIndex + 1}`
                                    : "Transaction"}
                                  <ExplorerLink
                                    value={signature}
                                    type="transaction"
                                  />
                                </span>
                              ),
                            )}
                          </div>
                        ) : null}
                        {state.error && (
                          <p className="m-0 mt-1.5 max-w-[620px] text-sm leading-[1.5] !text-nd-highlight-orange">
                            {state.error}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {finished && (
                <div className="mt-6 flex gap-[13px] rounded-xl border border-nd-highlight-green/40 bg-nd-highlight-green/[0.06] p-4">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-nd-highlight-green">
                    <Check className="!size-6 text-white" aria-hidden="true" />
                  </span>
                  <div>
                    <strong className="block font-medium">
                      Both legs settled.
                    </strong>
                    <p className="m-0 mt-[3px] text-[13px] text-[#8d8b96]">
                      TBILL reached the buyer as dUSD reached the seller—in the
                      same transaction.
                    </p>
                  </div>
                </div>
              )}
              {error && !running && (
                <div className="mt-6 block rounded-xl border border-nd-highlight-orange/40 bg-nd-highlight-orange/[0.06] p-4">
                  <strong className="block font-medium">
                    The demo stopped.
                  </strong>
                  <p className="m-0 mt-[3px] text-[13px] text-[#8d8b96]">
                    {error}
                  </p>
                  <p className="m-0 mt-[3px] text-[13px] text-[#8d8b96]">
                    No real funds are involved. You can safely run it again.
                  </p>
                </div>
              )}
            </div>

            <aside
              className="sticky top-24 mt-[22px] self-start overflow-hidden rounded-[13px] border border-white/[0.14] bg-[#0d0d11] max-[900px]:static max-[900px]:mt-0"
              aria-label="Account inspector"
            >
              <div className="flex justify-between border-b border-white/[0.1] px-4 py-3.5 font-brand-mono text-[9px] uppercase tracking-[0.12em] text-[#85838d]">
                <span>Account inspector</span>
                <span>devnet</span>
              </div>
              <div className="px-4 py-1">
                {accountRows.map(({ label, value, party }) => (
                  <div
                    className="flex items-center justify-between gap-3.5 border-b border-white/[0.08] py-[11px] last:border-b-0"
                    key={`${label}-${value}`}
                  >
                    <span className="flex min-w-0 items-center gap-2 text-xs text-[#8d8b96]">
                      {party ? (
                        <span
                          className={`size-1.5 shrink-0 rounded-full ${PARTY_META[party].dotClass}`}
                          aria-hidden="true"
                        />
                      ) : null}
                      {label}
                    </span>
                    <ExplorerLink value={value} />
                  </div>
                ))}
              </div>

              {terms && (
                <div className="border-t border-white/[0.1] p-4">
                  <h2 className="m-0 mb-[11px] font-brand-mono text-[9px] font-normal uppercase tracking-[0.12em]">
                    SwapDvp data
                  </h2>
                  <dl className="m-0">
                    <div className="m-0 flex justify-between gap-4 py-1 text-[11px]">
                      <dt className="text-[#6f6d78]">Asset amount</dt>
                      <dd className="m-0 min-w-0 overflow-hidden truncate whitespace-nowrap font-brand-mono text-white">
                        100.00 TBILL
                      </dd>
                    </div>
                    <div className="m-0 flex justify-between gap-4 py-1 text-[11px]">
                      <dt className="text-[#6f6d78]">Payment amount</dt>
                      <dd className="m-0 min-w-0 overflow-hidden truncate whitespace-nowrap font-brand-mono text-white">
                        10,000.00 dUSD
                      </dd>
                    </div>
                    <div className="m-0 flex justify-between gap-4 py-1 text-[11px]">
                      <dt className="text-[#6f6d78]">Nonce</dt>
                      <dd className="m-0 min-w-0 overflow-hidden truncate whitespace-nowrap font-brand-mono text-white">
                        {terms.nonce.toString()}
                      </dd>
                    </div>
                    <div className="m-0 flex justify-between gap-4 py-1 text-[11px]">
                      <dt className="text-[#6f6d78]">Reference</dt>
                      <dd className="m-0 min-w-0 overflow-hidden truncate whitespace-nowrap font-brand-mono text-white">
                        {terms.ref}
                      </dd>
                    </div>
                    <div className="m-0 flex justify-between gap-4 py-1 text-[11px]">
                      <dt className="text-[#6f6d78]">Expires</dt>
                      <dd className="m-0 min-w-0 overflow-hidden truncate whitespace-nowrap font-brand-mono text-white">
                        {new Date(
                          Number(terms.expiryTimestamp) * 1000,
                        ).toLocaleTimeString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
              {!roles && (
                <p className="m-0 px-4 py-6 text-xs leading-[1.5] text-[#6f6d78]">
                  Start the demo to generate fresh accounts and inspect them
                  here.
                </p>
              )}
            </aside>
          </div>
        </section>
      </Container>
    </main>
  );
}
