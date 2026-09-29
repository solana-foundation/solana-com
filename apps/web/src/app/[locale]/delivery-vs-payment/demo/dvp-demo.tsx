"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { address, type KeyPairSigner } from "@solana/kit";
import { ArrowLeft } from "@boxicons/react/ArrowLeft";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
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
import styles from "./dvp-demo.module.css";

type StageKey = "parties" | "assets" | "trade" | "asset" | "cash" | "settle";
type StageStatus = "waiting" | "running" | "complete" | "error";
type StageState = {
  status: StageStatus;
  signatures?: string[];
  error?: string;
};

const STAGES: Array<{
  key: StageKey;
  title: string;
  description: string;
}> = [
  {
    key: "parties",
    title: "Create the parties",
    description:
      "Generate fresh demo identities for the maker, seller, buyer, and settlement authority.",
  },
  {
    key: "assets",
    title: "Prepare the assets",
    description:
      "Issue demo TBILL to the seller and dUSD to the buyer. The treasury sponsors fees.",
  },
  {
    key: "trade",
    title: "Create the trade",
    description:
      "Record the terms and create the DvP account with an escrow account for each leg.",
  },
  {
    key: "asset",
    title: "Fund the asset leg",
    description:
      "The seller transfers 100 TBILL to the asset escrow using a standard token transfer.",
  },
  {
    key: "cash",
    title: "Fund the payment leg",
    description: "The buyer transfers 10,000 dUSD to the payment escrow.",
  },
  {
    key: "settle",
    title: "Settle atomically",
    description:
      "The authority releases both legs together and closes the DvP and escrow accounts.",
  },
];

const initialStages = (): Record<StageKey, StageState> =>
  Object.fromEntries(
    STAGES.map(({ key }) => [key, { status: "waiting" }]),
  ) as Record<StageKey, StageState>;

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

function explorerAddress(value: string) {
  return `https://explorer.solana.com/address/${value}?cluster=devnet`;
}

function explorerTransaction(value: string) {
  return `https://explorer.solana.com/tx/${value}?cluster=devnet`;
}

function shortAddress(value: string) {
  return `${value.slice(0, 5)}…${value.slice(-5)}`;
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
      className={styles.explorerLink}
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

  const updateStage = (key: StageKey, next: StageState) =>
    setStages((current) => ({ ...current, [key]: next }));

  const accountRows = useMemo(() => {
    const rows: Array<[string, string]> = [["DvP program", PROGRAM_ID]];
    if (roles) {
      rows.push(
        ["Maker", roles.maker],
        ["Seller · Party A", roles.partyA],
        ["Buyer · Party B", roles.partyB],
        ["Settlement authority", roles.authority],
      );
    }
    if (mints)
      rows.push(["TBILL mint", mints.asset], ["dUSD mint", mints.cash]);
    if (dvpAddresses) {
      rows.push(
        ["SwapDvp account", dvpAddresses.swapDvp],
        ["Asset escrow", dvpAddresses.escrowA],
        ["Payment escrow", dvpAddresses.escrowB],
        ["Nonce tombstone", dvpAddresses.nonceTombstone],
      );
    }
    return rows;
  }, [dvpAddresses, mints, roles]);

  async function runDemo() {
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
    <main className={styles.page}>
      <Container>
        <div className={styles.utilityBar}>
          <Link href="/delivery-vs-payment" className={styles.backLink}>
            <ArrowLeft className="!size-4" aria-hidden="true" />
            Delivery versus Payment
          </Link>
          <div className={styles.networkBadge}>
            <span className={styles.liveDot} /> Devnet
          </div>
        </div>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Live demo · Atomic settlement</p>
            <h1>Delivery versus Payment, settled atomically.</h1>
            <p className={styles.intro}>
              Watch an asset and its payment cross in one Solana transaction.
              The demo uses fresh accounts and test tokens—never real funds.
            </p>
            <Button
              onClick={runDemo}
              disabled={running}
              className={styles.startButton}
              size="lg"
            >
              {running
                ? "Settlement in progress…"
                : finished || error
                  ? "Run the demo again"
                  : "Run the devnet demo"}
              {!running && (
                <span className={styles.buttonIcon}>
                  <ArrowRight className="!size-4" aria-hidden="true" />
                </span>
              )}
            </Button>
          </div>

          <dl className={styles.proofStrip}>
            <div>
              <dd>1</dd>
              <dt>transaction settles both legs</dt>
            </div>
            <div>
              <dd>0</dd>
              <dt>counterparty risk at settlement</dt>
            </div>
            <div>
              <dd>0</dd>
              <dt>real funds used in this demo</dt>
            </div>
          </dl>
        </section>

        <section className={styles.workspace} aria-label="Demo progress">
          <div className={styles.workspaceHeader}>
            <div>
              <p>Settlement flow</p>
              <h2>Follow the trade onchain</h2>
            </div>
            <p>
              Every completed step links to the corresponding transaction in
              Solana Explorer.
            </p>
          </div>

          <div className={styles.workspaceGrid}>
            <div>
              <div className={styles.timeline} aria-live="polite">
                {STAGES.map((stage, index) => {
                  const state = stages[stage.key];
                  return (
                    <div
                      className={styles.stage}
                      data-status={state.status}
                      key={stage.key}
                    >
                      <div className={styles.stageMarker}>
                        {state.status === "complete"
                          ? "✓"
                          : String(index + 1).padStart(2, "0")}
                      </div>
                      <div className={styles.stageBody}>
                        <div className={styles.stageHeading}>
                          <h2>{stage.title}</h2>
                          <span>
                            {state.status === "waiting"
                              ? "Ready"
                              : state.status}
                          </span>
                        </div>
                        <p>{stage.description}</p>
                        {state.signatures?.length ? (
                          <div className={styles.transactions}>
                            {state.signatures.map(
                              (signature, signatureIndex) => (
                                <span key={signature}>
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
                          <p className={styles.errorText}>{state.error}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {finished && (
                <div className={styles.settledMessage}>
                  <span>✓</span>
                  <div>
                    <strong>Both legs settled.</strong>
                    <p>
                      TBILL reached the buyer as dUSD reached the seller—in the
                      same transaction.
                    </p>
                  </div>
                </div>
              )}
              {error && !running && (
                <div className={styles.demoError}>
                  <strong>The demo stopped.</strong>
                  <p>{error}</p>
                  <p>
                    No real funds are involved. You can safely run it again.
                  </p>
                </div>
              )}
            </div>

            <aside className={styles.inspector} aria-label="Account inspector">
              <div className={styles.inspectorHeader}>
                <span>Account inspector</span>
                <span>devnet</span>
              </div>
              <div className={styles.accountList}>
                {accountRows.map(([label, value]) => (
                  <div className={styles.accountRow} key={`${label}-${value}`}>
                    <span>{label}</span>
                    <ExplorerLink value={value} />
                  </div>
                ))}
              </div>

              {terms && (
                <div className={styles.terms}>
                  <h2>SwapDvp data</h2>
                  <dl>
                    <div>
                      <dt>Asset amount</dt>
                      <dd>100.00 TBILL</dd>
                    </div>
                    <div>
                      <dt>Payment amount</dt>
                      <dd>10,000.00 dUSD</dd>
                    </div>
                    <div>
                      <dt>Nonce</dt>
                      <dd>{terms.nonce.toString()}</dd>
                    </div>
                    <div>
                      <dt>Reference</dt>
                      <dd>{terms.ref}</dd>
                    </div>
                    <div>
                      <dt>Expires</dt>
                      <dd>
                        {new Date(
                          Number(terms.expiryTimestamp) * 1000,
                        ).toLocaleTimeString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
              {!roles && (
                <p className={styles.inspectorEmpty}>
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
