"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FinalFormCanvas } from "./FinalFormCanvas";
import type {
  ArtworkTelemetry,
  FinalFormCanvasHandle,
  Inspection,
} from "./FinalFormCanvas";
import type { AlpenglowEvent, StreamStatus } from "./types";

const EMPTY_TELEMETRY: ArtworkTelemetry = {
  holding: 0,
  rendered: 0,
  finalizedBlocks: 0,
  form: 147,
  progress: 0,
  currentFinalityMs: 0,
  medianFinalityMs: 0,
  transactions: 0,
};

function formatDuration(ms: number) {
  if (!ms) return "—";
  return ms < 1_000 ? `${Math.round(ms)}ms` : `${(ms / 1_000).toFixed(2)}s`;
}

function StatusLabel({ status }: { status: StreamStatus }) {
  const copy = {
    connecting: "Connecting to Solana mainnet…",
    live: "Live · Solana mainnet",
    reconnecting: "Stream interrupted — reconnecting",
    simulated: "Simulated data · deterministic fixture",
  }[status.status];
  return (
    <>
      <span className={`ff-status-dot is-${status.status}`} />
      {copy}
    </>
  );
}

export default function FinalFormExperience() {
  const canvasRef = useRef<FinalFormCanvasHandle>(null);
  const [status, setStatus] = useState<StreamStatus>({
    type: "stream_status",
    status: "connecting",
    protocol: "unknown",
    sampled: false,
  });
  const [telemetry, setTelemetry] = useState(EMPTY_TELEMETRY);
  const [tps, setTps] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [clock, setClock] = useState("");
  const [recentBlocks, setRecentBlocks] = useState<
    Array<{ slot: number; count: number; final: boolean }>
  >([]);

  const handleTelemetry = useCallback(
    (value: ArtworkTelemetry) => setTelemetry(value),
    [],
  );
  const handleInspect = useCallback(
    (value: Inspection | null) => setInspection(value),
    [],
  );

  useEffect(() => {
    const updateClock = () => setClock(new Date().toISOString().slice(11, 19));
    updateClock();
    const timer = window.setInterval(updateClock, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const source = new EventSource("/api/alpenglow/stream");
    source.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as AlpenglowEvent;
        if (event.type === "stream_status") setStatus(event);
        if (event.type === "performance_sample")
          setTps(Math.round(event.totalTps));
        if (event.type === "block_confirmed") {
          setRecentBlocks((current) =>
            [
              { slot: event.slot, count: event.transactionCount, final: false },
              ...current,
            ].slice(0, 6),
          );
        }
        if (event.type === "block_finalized") {
          setRecentBlocks((current) =>
            current.map((block) =>
              block.slot === event.slot ? { ...block, final: true } : block,
            ),
          );
        }
        canvasRef.current?.push(event);
      } catch {
        setStatus((current) => ({
          ...current,
          status: "reconnecting",
          message: "Invalid stream event",
        }));
      }
    };
    source.onerror = () => {
      setStatus((current) => ({ ...current, status: "reconnecting" }));
    };
    return () => source.close();
  }, []);

  function togglePaused() {
    const next = !paused;
    setPaused(next);
    canvasRef.current?.setPaused(next);
  }

  const protocol =
    status.protocol === "alpenglow"
      ? "ALPENGLOW"
      : status.protocol === "tower-bft"
        ? "TOWERBFT"
        : "CONSENSUS UNKNOWN";

  return (
    <main className="ff-root">
      <section className="ff-installation" aria-labelledby="ff-title">
        <FinalFormCanvas
          ref={canvasRef}
          onInspect={handleInspect}
          onTelemetry={handleTelemetry}
        />
        <header className="ff-topline">
          <a href="#ff-method" className="ff-wordmark">
            ALPENGLOW · FINAL FORM
          </a>
          <div className="ff-live">
            <StatusLabel status={status} />
          </div>
          <div className="ff-clock">{clock} UTC</div>
        </header>

        <div className="ff-thesis">
          <p className="ff-kicker">LIVE SOLANA CONSENSUS</p>
          <h1 id="ff-title">Watch a Solana block become final.</h1>
          <p className="ff-dek">
            Live transactions group into confirmed blocks. When a block becomes
            irreversible, it locks into the Solana mark.
          </p>
        </div>

        <div className="ff-zone-labels" aria-hidden="true">
          <div>
            <span>01</span>
            <b>Live transactions</b>
            <small>Each mark is one transaction</small>
          </div>
          <div>
            <span>02</span>
            <b>Confirmed blocks</b>
            <small>Each waveform is one block awaiting finality</small>
          </div>
          <div>
            <span>03</span>
            <b className="ff-final-label">
              <i className="ff-solana-mark" aria-hidden="true" />
              Finalized on Solana
            </b>
            <small>Each point territory belongs to one final block</small>
          </div>
        </div>

        <div className="ff-boundary-labels" aria-hidden="true">
          <span>CONFIRMED → GROUPED BY BLOCK</span>
          <span>FINALIZED → LOCKED IN PLACE</span>
        </div>

        <div className="ff-readout" aria-label="Current network state">
          <div>
            <strong>{tps ? tps.toLocaleString() : "—"}</strong>
            <span>TPS</span>
          </div>
          <div>
            <strong>{telemetry.holding}</strong>
            <span>blocks holding</span>
          </div>
          <div>
            <strong>{formatDuration(telemetry.currentFinalityMs)}</strong>
            <span>observed finality</span>
          </div>
          <div>
            <strong>{formatDuration(telemetry.medianFinalityMs)}</strong>
            <span>rolling median</span>
          </div>
        </div>

        <div className="ff-controls">
          <button type="button" onClick={togglePaused} aria-pressed={paused}>
            {paused ? "Resume motion" : "Pause motion"}
          </button>
          <a href="#ff-explainer">Read the work</a>
        </div>

        <div className="ff-form-caption">
          <span>FINAL FORM {String(telemetry.form).padStart(4, "0")}</span>
          <span>{telemetry.finalizedBlocks}/30 blocks</span>
          <span>{Math.round(telemetry.progress * 100)}% formed</span>
        </div>

        {inspection && (
          <aside className="ff-inspector" aria-live="polite">
            <button
              type="button"
              onClick={() => setInspection(null)}
              aria-label="Close inspection"
            >
              ×
            </button>
            <p>{inspection.kind}</p>
            <h2>{inspection.title}</h2>
            {inspection.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <a href={inspection.href} target="_blank" rel="noreferrer">
              Open in Explorer ↗
            </a>
          </aside>
        )}

        <p className="ff-disclosure">
          Every received transaction rendered
          {tps ? ` · paced at ${tps.toLocaleString()} TPS` : ""}
          <span>{protocol}</span>
        </p>

        <div className="ff-sr-summary" aria-live="polite">
          Solana mainnet is {status.status}. {telemetry.holding} confirmed
          blocks are waiting for finality. Current observed finality is{" "}
          {formatDuration(telemetry.currentFinalityMs)}.
        </div>
        <nav
          className="ff-keyboard-records"
          aria-label="Recent inspectable blocks"
        >
          {recentBlocks.map((block) => (
            <a
              key={block.slot}
              href={`https://explorer.solana.com/block/${block.slot}`}
              target="_blank"
              rel="noreferrer"
            >
              Slot {block.slot}, {block.count} transactions,{" "}
              {block.final ? "final" : "confirmed"}
            </a>
          ))}
        </nav>
      </section>

      <div className="ff-essay" id="ff-explainer">
        <section>
          <p className="ff-section-number">01 / WHAT YOU ARE SEEING</p>
          <h2>Happening is not the same as final.</h2>
          <div className="ff-three-state">
            <p>
              <b>Transactions</b>Each broken signal is derived from a distinct
              live signature. Its shape, mass and position remain stable.
            </p>
            <p>
              <b>Holding</b>Transactions gather by block. Each waveform is
              confirmed, visible, and still waiting to become irreversible.
            </p>
            <p>
              <b>Final</b>A finalized block crosses the threshold and takes an
              immovable territory in the mark.
            </p>
          </div>
        </section>
        <section>
          <p className="ff-section-number">02 / WHAT ALPENGLOW CHANGES</p>
          <h2>The middle nearly disappears.</h2>
          <p className="ff-large-copy">
            This artwork is made from the distance between a block appearing and
            becoming irreversible. Alpenglow changes that distance. The work
            changes with it.
          </p>
          <p>
            Alpenglow replaces Solana’s consensus mechanism and targets roughly
            150 millisecond finality. It does not claim to make execution,
            throughput, or block production 100× faster.
          </p>
        </section>
        <section>
          <p className="ff-section-number">03 / WHY IT MATTERS</p>
          <h2>Less time suspended between intent and certainty.</h2>
          <div className="ff-use-cases">
            <span>Payments</span>
            <span>Markets</span>
            <span>Interactive worlds</span>
            <span>Autonomous agents</span>
          </div>
        </section>
        <section id="ff-method">
          <p className="ff-section-number">04 / LIVE METHODOLOGY</p>
          <h2>A protocol instrument, with latency included.</h2>
          <p>
            Data is read server-side through the configured Solana RPC provider.
            “Observed finality” is wall-clock time between this collector seeing
            a confirmed block and seeing the matching block at finalized
            commitment. Provider, network, server, and geographic latency are
            part of that measurement.
          </p>
          <p>
            Every transaction received from a block is rendered as its own
            signature-derived glyph. The live TPS measurement paces their entry;
            it never creates transactions when the source queue is empty. Short
            lifetimes and stable lanes keep mainnet-scale density legible.
            Without a configured provider, the installation identifies its
            deterministic fixture as simulated.
          </p>
          <div className="ff-links">
            <a
              href="https://docs.anza.xyz/alpenglow"
              target="_blank"
              rel="noreferrer"
            >
              Alpenglow documentation ↗
            </a>
            <a
              href="https://github.com/solana-foundation/solana-improvement-documents"
              target="_blank"
              rel="noreferrer"
            >
              Solana improvement documents ↗
            </a>
            <a
              href="https://explorer.solana.com"
              target="_blank"
              rel="noreferrer"
            >
              Solana Explorer ↗
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
