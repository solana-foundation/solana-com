/* eslint-disable @next/next/no-html-link-for-pages -- /upgrades is owned by the media app and requires a full navigation. */
"use client";

import { Broadcast } from "@boxicons/react/Broadcast";
import { Certification } from "@boxicons/react/Certification";
import { CheckCircle } from "@boxicons/react/CheckCircle";
import { Code } from "@boxicons/react/Code";
import { Lock } from "@boxicons/react/Lock";
import { NetworkChart } from "@boxicons/react/NetworkChart";
import { Server } from "@boxicons/react/Server";
import { User } from "@boxicons/react/User";
import { Button } from "@workspace/ui";
import { useCallback, useEffect, useRef, useState } from "react";
import { FinalFormCanvas } from "./FinalFormCanvas";
import type {
  ArtworkTelemetry,
  FinalFormCanvasHandle,
} from "./FinalFormCanvas";
import type { AlpenglowEvent, StreamStatus } from "./types";

type FinalityMode = "legacy" | "alpenglow";

type RpcTelemetry = {
  confirmedSlot: number;
  latestBlockTransactions: number;
  nonVoteTps: number;
};

const EMPTY_TELEMETRY: ArtworkTelemetry = {
  holding: 0,
  rendered: 0,
  finalizedBlocks: 0,
  currentFinalityMs: 0,
  medianFinalityMs: 0,
};

const EMPTY_RPC_TELEMETRY: RpcTelemetry = {
  confirmedSlot: 0,
  latestBlockTransactions: 0,
  nonVoteTps: 0,
};

function formatDuration(ms: number) {
  if (!ms) return "—";
  return ms < 1_000 ? `${Math.round(ms)} ms` : `${(ms / 1_000).toFixed(1)} s`;
}

export default function FinalFormExperience() {
  const canvasRef = useRef<FinalFormCanvasHandle>(null);
  const [mode, setMode] = useState<FinalityMode>("alpenglow");
  const [telemetry, setTelemetry] = useState(EMPTY_TELEMETRY);
  const [rpcTelemetry, setRpcTelemetry] = useState(EMPTY_RPC_TELEMETRY);
  const [tps, setTps] = useState(0);
  const [status, setStatus] = useState<StreamStatus["status"]>("connecting");

  const handleTelemetry = useCallback(
    (value: ArtworkTelemetry) => setTelemetry(value),
    [],
  );

  useEffect(() => {
    const source = new EventSource("/api/alpenglow/stream");
    source.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as AlpenglowEvent;
        if (event.type === "stream_status") {
          setStatus(event.status);
        }
        if (event.type === "performance_sample") {
          setTps(Math.round(event.totalTps));
          setRpcTelemetry((current) => ({
            ...current,
            nonVoteTps: Math.round(event.nonVoteTps ?? 0),
          }));
        }
        if (event.type === "block_confirmed") {
          setRpcTelemetry((current) => ({
            ...current,
            confirmedSlot: event.slot,
            latestBlockTransactions: event.transactionCount,
          }));
        }
        canvasRef.current?.push(event);
      } catch {
        setStatus("reconnecting");
      }
    };
    source.onerror = () => setStatus("reconnecting");
    return () => source.close();
  }, []);

  function selectMode(value: FinalityMode) {
    setMode(value);
    canvasRef.current?.setMode(value);
  }

  const statusLabel =
    status === "live"
      ? "Live mainnet"
      : status === "simulated"
        ? "Simulated data"
        : status === "reconnecting"
          ? "Reconnecting"
          : "Connecting";
  return (
    <main className="ff-root">
      <section className="ff-hero" aria-labelledby="ff-title">
        <div>
          <p className="ff-kicker">Alpenglow consensus</p>
          <h1 id="ff-title">
            12 sec <span aria-hidden="true">→</span> 150 msec
          </h1>
        </div>
        <div className="ff-intro">
          <p>
            A faster path from transaction to certainty. Follow live Solana
            activity through streaming, confirmation, and finality.
          </p>
          <Button
            asChild
            variant="outline"
            className="ff-intro-button rounded-none border-white/40 bg-transparent font-brand-mono text-xs font-normal uppercase tracking-[0.08em] text-white shadow-none hover:border-[#14f195] hover:bg-[#14f195] hover:text-black"
          >
            <a href="/upgrades/alpenglow">
              Explore Alpenglow <span aria-hidden="true">↗</span>
            </a>
          </Button>
        </div>
      </section>

      <section className="ff-visualizer" aria-label="Alpenglow finality model">
        <div className="ff-toolbar">
          <div className="ff-mode" aria-label="Finality timing">
            <button
              type="button"
              aria-pressed={mode === "legacy"}
              onClick={() => selectMode("legacy")}
            >
              12 seconds
            </button>
            <button
              type="button"
              aria-pressed={mode === "alpenglow"}
              onClick={() => selectMode("alpenglow")}
            >
              150 milliseconds
            </button>
          </div>
          <div className="ff-view-controls">
            <span>Drag to rotate · Ctrl + scroll to zoom</span>
            <button
              type="button"
              onClick={() => canvasRef.current?.resetView()}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="ff-scene">
          <div className="ff-canvas-stage">
            <FinalFormCanvas ref={canvasRef} onTelemetry={handleTelemetry} />
            <div className="ff-stage-labels" aria-hidden="true">
              <p>
                <Broadcast pack="filled" /> Streaming
              </p>
              <p>
                <CheckCircle pack="filled" /> Confirmed
              </p>
              <p>
                <Lock pack="filled" /> Finalized
              </p>
            </div>
          </div>
        </div>

        <p className="ff-rpc-line" aria-label="Live RPC data">
          <span className="ff-rpc-label">RPC</span>
          <span>{statusLabel}</span>
          <span>
            <strong>{tps ? tps.toLocaleString() : "—"}</strong> total TPS
          </span>
          <span>
            <strong>
              {rpcTelemetry.nonVoteTps
                ? rpcTelemetry.nonVoteTps.toLocaleString()
                : "—"}
            </strong>{" "}
            non-vote TPS
          </span>
          <span>
            slot{" "}
            <strong>
              {rpcTelemetry.confirmedSlot
                ? rpcTelemetry.confirmedSlot.toLocaleString()
                : "—"}
            </strong>
          </span>
          <span>
            <strong>
              {rpcTelemetry.latestBlockTransactions
                ? rpcTelemetry.latestBlockTransactions.toLocaleString()
                : "—"}
            </strong>{" "}
            tx in latest block
          </span>
        </p>
      </section>

      <p className="ff-note">
        Each small cube is one transaction, grouped by its ledger block. The
        timing control models how many transactions remain in flight at 12
        seconds versus 150 milliseconds; incoming mainnet data stays live.
      </p>

      <section className="ff-shift" aria-labelledby="ff-shift-title">
        <div className="ff-section-heading">
          <p className="ff-kicker">What Alpenglow changes</p>
          <h2 id="ff-shift-title">
            Consensus, rewritten.
            <br />
            <span>Execution, untouched.</span>
          </h2>
        </div>
        <div className="ff-shift-copy">
          <p>
            Consensus is how validators agree on which block comes next and when
            it can no longer be undone. Alpenglow replaces TowerBFT with a
            faster path to that agreement while leaving the way transactions
            execute exactly as it is.
          </p>
          <dl className="ff-unchanged-list">
            <div>
              <dt>Unchanged</dt>
              <dd>SVM &amp; programs</dd>
            </div>
            <div>
              <dt>Unchanged</dt>
              <dd>Transactions &amp; fees</dd>
            </div>
            <div>
              <dt>For users</dt>
              <dd>No action needed</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="ff-votor" aria-labelledby="ff-votor-title">
        <div className="ff-votor-copy">
          <p className="ff-kicker">Phase one · Votor</p>
          <h2 id="ff-votor-title">Votes become certificates.</h2>
          <p>
            Validators send votes directly to one another instead of placing
            vote transactions inside blocks. Those votes combine into a quorum
            certificate that finalizes a block in one or two rounds.
          </p>
          <p className="ff-votor-note">
            Alpenglow tolerates 20% malicious stake plus 20% offline stake while
            still reaching consensus.
          </p>
        </div>

        <div className="ff-thresholds" aria-label="Votor voting thresholds">
          <article className="ff-threshold is-fast">
            <div className="ff-threshold-topline">
              <p>Fast path</p>
              <span>One round</span>
            </div>
            <strong>80%</strong>
            <div className="ff-threshold-track" aria-hidden="true">
              <span />
            </div>
            <p>of stake votes to notarize</p>
            <small>Block finalizes immediately.</small>
          </article>
          <article className="ff-threshold is-fallback">
            <div className="ff-threshold-topline">
              <p>Fallback path</p>
              <span>Two rounds</span>
            </div>
            <strong>60%</strong>
            <div className="ff-threshold-track" aria-hidden="true">
              <span />
            </div>
            <p>stake threshold for certificates</p>
            <small>A second round finalizes or skips.</small>
          </article>
        </div>
      </section>

      <section className="ff-rollout" aria-labelledby="ff-rollout-title">
        <div className="ff-section-heading">
          <p className="ff-kicker">The rollout</p>
          <h2 id="ff-rollout-title">Two protocols. One transition.</h2>
        </div>
        <ol className="ff-phase-list">
          <li>
            <div className="ff-phase-marker" aria-hidden="true">
              <Certification pack="filled" />
            </div>
            <div>
              <p className="ff-phase-meta">Agave 4.3 · Q3 2026</p>
              <h3>Votor</h3>
              <p>
                Replaces TowerBFT voting with direct validator votes and
                aggregate certificates. This is the phase that targets roughly
                150ms finality.
              </p>
            </div>
            <span className="ff-phase-status">In development</span>
          </li>
          <li>
            <div className="ff-phase-marker" aria-hidden="true">
              <NetworkChart pack="filled" />
            </div>
            <div>
              <p className="ff-phase-meta">Later release · Unscheduled</p>
              <h3>Rotor</h3>
              <p>
                Follows Votor to replace Turbine&apos;s tree-based block
                propagation with a single relay layer designed to reduce network
                latency.
              </p>
            </div>
            <span className="ff-phase-status is-later">Follows Votor</span>
          </li>
        </ol>
      </section>

      <section className="ff-impact" aria-labelledby="ff-impact-title">
        <div className="ff-section-heading">
          <p className="ff-kicker">What it means for you</p>
          <h2 id="ff-impact-title">The transition by role.</h2>
        </div>
        <div className="ff-impact-list">
          <article>
            <p className="ff-impact-index">
              <User pack="filled" aria-hidden="true" /> Users
            </p>
            <h3>No migration.</h3>
            <p>
              Signing, sending, and approving transactions stay the same.
              Finality simply arrives much sooner.
            </p>
          </article>
          <article>
            <p className="ff-impact-index">
              <Code pack="filled" aria-hidden="true" /> Developers
            </p>
            <h3>Execution stays put.</h3>
            <p>
              Apps that only send transactions and read account state need no
              changes. Block stream consumers should prepare for multiple banks
              per slot and the new <code>bank_id</code> field.
            </p>
          </article>
          <article>
            <p className="ff-impact-index">
              <Server pack="filled" aria-hidden="true" /> Validators
            </p>
            <h3>Prepare for Votor.</h3>
            <p>
              Operators need a registered BLS public key and Agave 4.3 to join
              Alpenglow consensus.
            </p>
          </article>
        </div>
      </section>

      <section className="ff-read-more" aria-labelledby="ff-read-more-title">
        <p className="ff-kicker">Go deeper</p>
        <h2 id="ff-read-more-title">
          Migration details, breaking changes, and the full protocol story.
        </h2>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="ff-read-more-button rounded-none border-white bg-white font-brand-mono text-xs font-normal uppercase tracking-[0.08em] text-black shadow-none hover:border-[#14f195] hover:bg-[#14f195] hover:text-black"
        >
          <a href="/upgrades/alpenglow">
            Read the Alpenglow upgrade guide <span aria-hidden="true">↗</span>
          </a>
        </Button>
      </section>

      <div className="ff-sr-summary" aria-live="polite">
        Solana mainnet is {statusLabel.toLowerCase()}. {telemetry.holding}{" "}
        blocks are confirming. Current observed finality is{" "}
        {formatDuration(telemetry.currentFinalityMs)}.
      </div>
    </main>
  );
}
