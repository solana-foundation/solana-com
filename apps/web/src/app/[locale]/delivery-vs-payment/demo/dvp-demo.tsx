"use client";

import { useRef, useState } from "react";
import { address, type KeyPairSigner } from "@solana/kit";
import {
  ASSET_TOKEN,
  CASH_TOKEN,
  PRESET,
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
import {
  initialStages,
  type CompletedRun,
  type StageKey,
  type StageState,
} from "./demo-state";
import { DvpDashboard } from "./dvp-dashboard";

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const REPLAY_STAGE_DELAY_MS = 1600;

export function DvpDemo() {
  const [stages, setStages] = useState(initialStages);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [replaying, setReplaying] = useState(false);
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

  async function replayDemo(snapshot: CompletedRun) {
    setReplaying(true);
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
    if (running) return;
    if (finished && completedRun.current) {
      await replayDemo(completedRun.current);
      return;
    }

    completedRun.current = null;
    setReplaying(false);
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
    <DvpDashboard
      stages={stages}
      running={running}
      finished={finished}
      replaying={replaying}
      error={error}
      roles={roles}
      mints={mints}
      dvpAddresses={dvpAddresses}
      terms={terms}
      onRun={runDemo}
    />
  );
}
