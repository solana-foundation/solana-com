"use client";

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
            12 sec <span aria-hidden="true">→</span> 150 msec.
          </h1>
        </div>
        <div className="ff-intro">
          <p>
            A faster path from transaction to certainty. Follow live Solana
            activity through streaming, confirmation, and finality.
          </p>
          <a
            href="https://docs.anza.xyz/alpenglow"
            target="_blank"
            rel="noreferrer"
          >
            Explore Alpenglow <span aria-hidden="true">↗</span>
          </a>
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
          <p className={`ff-status is-${status}`}>
            <span aria-hidden="true" /> {statusLabel}
          </p>
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
                <span>01</span> Streaming
              </p>
              <p>
                <span>02</span> Confirmed
              </p>
              <p>
                <span>03</span> Finalized
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

      <div className="ff-sr-summary" aria-live="polite">
        Solana mainnet is {statusLabel.toLowerCase()}. {telemetry.holding}{" "}
        blocks are confirming. Current observed finality is{" "}
        {formatDuration(telemetry.currentFinalityMs)}.
      </div>
    </main>
  );
}
