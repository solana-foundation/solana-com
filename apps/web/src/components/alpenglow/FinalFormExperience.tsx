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
import { useLocale, useTranslations } from "@workspace/i18n/client";
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

export default function FinalFormExperience() {
  const t = useTranslations("alpenglow");
  const locale = useLocale();
  const canvasRef = useRef<FinalFormCanvasHandle>(null);
  const [mode, setMode] = useState<FinalityMode>("alpenglow");
  const [telemetry, setTelemetry] = useState(EMPTY_TELEMETRY);
  const [rpcTelemetry, setRpcTelemetry] = useState(EMPTY_RPC_TELEMETRY);
  const [tps, setTps] = useState(0);
  const [status, setStatus] = useState<StreamStatus["status"]>("connecting");
  const number = new Intl.NumberFormat(locale);

  const handleTelemetry = useCallback(
    (value: ArtworkTelemetry) => setTelemetry(value),
    [],
  );
  useEffect(() => {
    const source = new EventSource("/api/alpenglow/stream");
    source.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as AlpenglowEvent;
        if (event.type === "stream_status") setStatus(event.status);
        if (event.type === "performance_sample") {
          setTps(Math.round(event.totalTps));
          setRpcTelemetry((current) => ({
            ...current,
            nonVoteTps: Math.round(event.nonVoteTps ?? 0),
          }));
        }
        if (event.type === "block_confirmed")
          setRpcTelemetry((current) => ({
            ...current,
            confirmedSlot: event.slot,
            latestBlockTransactions: event.transactionCount,
          }));
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
  function formatDuration(ms: number) {
    if (!ms) return "—";
    return ms < 1_000
      ? t("duration.milliseconds", { value: number.format(Math.round(ms)) })
      : t("duration.seconds", {
          value: new Intl.NumberFormat(locale, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }).format(ms / 1_000),
        });
  }
  const statusLabel = t(`liveData.status.${status}`);

  return (
    <main className="ff-root">
      <section className="ff-hero" aria-labelledby="ff-title">
        <div>
          <p className="ff-kicker">{t("hero.kicker")}</p>
          <h1 id="ff-title">
            {t("hero.legacyFinality")}{" "}
            <span className="ff-finality-target">
              <span className="ff-finality-arrow" aria-hidden="true">
                →
              </span>{" "}
              {t("hero.alpenglowFinality")}
            </span>
          </h1>
        </div>
        <div className="ff-intro">
          <p>{t("hero.description")}</p>
          <Button
            asChild
            variant="outline"
            className="ff-intro-button rounded-none border-white/40 bg-transparent font-brand-mono text-xs font-normal uppercase tracking-[0.08em] text-white shadow-none hover:border-[#14f195] hover:bg-[#14f195] hover:text-black"
          >
            <a href="/upgrades/alpenglow">
              {t("actions.explore")} <span aria-hidden="true">↗</span>
            </a>
          </Button>
        </div>
      </section>
      <section className="ff-visualizer" aria-label={t("aria.finalityModel")}>
        <div className="ff-toolbar">
          <div className="ff-mode" aria-label={t("aria.finalityTiming")}>
            <button
              type="button"
              aria-pressed={mode === "legacy"}
              onClick={() => selectMode("legacy")}
            >
              {t("timing.legacy")}
            </button>
            <button
              type="button"
              aria-pressed={mode === "alpenglow"}
              onClick={() => selectMode("alpenglow")}
            >
              {t("timing.alpenglow")}
            </button>
          </div>
          <div className="ff-view-controls">
            <span>{t("controls.instructions")}</span>
            <button
              type="button"
              onClick={() => canvasRef.current?.resetView()}
            >
              {t("controls.reset")}
            </button>
          </div>
        </div>
        <div className="ff-scene">
          <div className="ff-canvas-stage">
            <FinalFormCanvas ref={canvasRef} onTelemetry={handleTelemetry} />
            <div className="ff-stage-labels" aria-hidden="true">
              <p>
                <Broadcast pack="filled" /> {t("stages.streaming")}
              </p>
              <p>
                <CheckCircle pack="filled" /> {t("stages.confirmed")}
              </p>
              <p>
                <Lock pack="filled" /> {t("stages.finalized")}
              </p>
            </div>
          </div>
        </div>
        <p className="ff-rpc-line" aria-label={t("aria.liveRpcData")}>
          <span className="ff-rpc-label">RPC</span>
          <span>{statusLabel}</span>
          <span>
            <strong>{tps ? number.format(tps) : "—"}</strong>{" "}
            {t("liveData.totalTps")}
          </span>
          <span>
            <strong>
              {rpcTelemetry.nonVoteTps
                ? number.format(rpcTelemetry.nonVoteTps)
                : "—"}
            </strong>{" "}
            {t("liveData.nonVoteTps")}
          </span>
          <span>
            {t("liveData.slot")}{" "}
            <strong>
              {rpcTelemetry.confirmedSlot
                ? number.format(rpcTelemetry.confirmedSlot)
                : "—"}
            </strong>
          </span>
          <span>
            <strong>
              {rpcTelemetry.latestBlockTransactions
                ? number.format(rpcTelemetry.latestBlockTransactions)
                : "—"}
            </strong>{" "}
            {t("liveData.transactionsInLatestBlock")}
          </span>
        </p>
      </section>
      <p className="ff-note">{t("visualizerNote")}</p>
      <section className="ff-shift" aria-labelledby="ff-shift-title">
        <div className="ff-section-heading">
          <p className="ff-kicker">{t("consensus.kicker")}</p>
          <h2 id="ff-shift-title">
            {t("consensus.title")}
            <br />
            <span>{t("consensus.titleAccent")}</span>
          </h2>
        </div>
        <div className="ff-shift-copy">
          <p>{t("consensus.description")}</p>
          <dl className="ff-unchanged-list">
            <div>
              <dt>{t("consensus.unchanged")}</dt>
              <dd>{t("consensus.svmAndPrograms")}</dd>
            </div>
            <div>
              <dt>{t("consensus.unchanged")}</dt>
              <dd>{t("consensus.transactionsAndFees")}</dd>
            </div>
            <div>
              <dt>{t("consensus.forUsers")}</dt>
              <dd>{t("consensus.noActionNeeded")}</dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="ff-votor" aria-labelledby="ff-votor-title">
        <div className="ff-votor-copy">
          <p className="ff-kicker">{t("votor.kicker")}</p>
          <h2 id="ff-votor-title">{t("votor.title")}</h2>
          <p>{t("votor.description")}</p>
          <p className="ff-votor-note">{t("votor.note")}</p>
        </div>
        <div className="ff-thresholds" aria-label={t("aria.votorThresholds")}>
          <article className="ff-threshold is-fast">
            <div className="ff-threshold-topline">
              <p>{t("votor.fastPath.label")}</p>
              <span>{t("votor.fastPath.rounds")}</span>
            </div>
            <strong>80%</strong>
            <div className="ff-threshold-track" aria-hidden="true">
              <span />
            </div>
            <p>{t("votor.fastPath.threshold")}</p>
            <small>{t("votor.fastPath.description")}</small>
          </article>
          <article className="ff-threshold is-fallback">
            <div className="ff-threshold-topline">
              <p>{t("votor.fallbackPath.label")}</p>
              <span>{t("votor.fallbackPath.rounds")}</span>
            </div>
            <strong>60%</strong>
            <div className="ff-threshold-track" aria-hidden="true">
              <span />
            </div>
            <p>{t("votor.fallbackPath.threshold")}</p>
            <small>{t("votor.fallbackPath.description")}</small>
          </article>
        </div>
      </section>
      <section className="ff-rollout" aria-labelledby="ff-rollout-title">
        <div className="ff-section-heading">
          <p className="ff-kicker">{t("rollout.kicker")}</p>
          <h2 id="ff-rollout-title">{t("rollout.title")}</h2>
        </div>
        <ol className="ff-phase-list">
          <li>
            <div className="ff-phase-marker" aria-hidden="true">
              <Certification pack="filled" />
            </div>
            <div>
              <p className="ff-phase-meta">{t("rollout.votor.meta")}</p>
              <h3>{t("rollout.votor.title")}</h3>
              <p>{t("rollout.votor.description")}</p>
            </div>
            <span className="ff-phase-status">{t("rollout.votor.status")}</span>
          </li>
          <li>
            <div className="ff-phase-marker" aria-hidden="true">
              <NetworkChart pack="filled" />
            </div>
            <div>
              <p className="ff-phase-meta">{t("rollout.rotor.meta")}</p>
              <h3>{t("rollout.rotor.title")}</h3>
              <p>{t("rollout.rotor.description")}</p>
            </div>
            <span className="ff-phase-status is-later">
              {t("rollout.rotor.status")}
            </span>
          </li>
        </ol>
      </section>
      <section className="ff-impact" aria-labelledby="ff-impact-title">
        <div className="ff-section-heading">
          <p className="ff-kicker">{t("impact.kicker")}</p>
          <h2 id="ff-impact-title">{t("impact.title")}</h2>
        </div>
        <div className="ff-impact-list">
          <article>
            <p className="ff-impact-index">
              <User pack="filled" aria-hidden="true" />{" "}
              {t("impact.users.label")}
            </p>
            <h3>{t("impact.users.title")}</h3>
            <p>{t("impact.users.description")}</p>
          </article>
          <article>
            <p className="ff-impact-index">
              <Code pack="filled" aria-hidden="true" />{" "}
              {t("impact.developers.label")}
            </p>
            <h3>{t("impact.developers.title")}</h3>
            <p>
              {t.rich("impact.developers.description", {
                bankId: (chunks) => <code>{chunks}</code>,
              })}
            </p>
          </article>
          <article>
            <p className="ff-impact-index">
              <Server pack="filled" aria-hidden="true" />{" "}
              {t("impact.validators.label")}
            </p>
            <h3>{t("impact.validators.title")}</h3>
            <p>{t("impact.validators.description")}</p>
          </article>
        </div>
      </section>
      <section className="ff-read-more" aria-labelledby="ff-read-more-title">
        <p className="ff-kicker">{t("readMore.kicker")}</p>
        <h2 id="ff-read-more-title">{t("readMore.title")}</h2>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="ff-read-more-button rounded-none border-white bg-white font-brand-mono text-xs font-normal uppercase tracking-[0.08em] text-black shadow-none hover:border-[#14f195] hover:bg-[#14f195] hover:text-black"
        >
          <a href="/upgrades/alpenglow">
            {t("actions.readGuide")} <span aria-hidden="true">↗</span>
          </a>
        </Button>
      </section>
      <div className="ff-sr-summary" aria-live="polite">
        {t("liveData.summary", {
          status: statusLabel.toLocaleLowerCase(locale),
          blocks: telemetry.holding,
          finality: formatDuration(telemetry.currentFinalityMs),
        })}
      </div>
    </main>
  );
}
