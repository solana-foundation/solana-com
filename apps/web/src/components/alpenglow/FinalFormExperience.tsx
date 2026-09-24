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
import { defaultLocale } from "@workspace/i18n/config";
import { Button } from "@workspace/ui";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NewsItem } from "@/components/solutions/latest-news.v2";
import type {
  ArtworkTelemetry,
  FinalFormCanvasHandle,
} from "./FinalFormCanvas";
import type { AlpenglowEvent, StreamStatus } from "./types";

const FinalFormCanvas = dynamic(
  () => import("./FinalFormCanvas").then((module) => module.FinalFormCanvas),
  { ssr: false },
);

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
const MAX_BUFFERED_CANVAS_EVENTS = 10_000;

type FinalFormExperienceProps = {
  news: NewsItem[];
};

type NavigatorWithDeviceHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

function shouldUseStaticVisualizer() {
  const device = navigator as NavigatorWithDeviceHints;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    device.connection?.saveData === true ||
    (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 4) ||
    (device.deviceMemory != null && device.deviceMemory <= 4)
  );
}

function StaticFinalityDiagram() {
  return (
    <div className="ff-static-canvas" aria-hidden="true">
      <span className="ff-static-stage is-streaming" />
      <span className="ff-static-stage is-confirmed" />
      <span className="ff-static-stage is-finalized" />
    </div>
  );
}

export default function FinalFormExperience({
  news,
}: FinalFormExperienceProps) {
  const t = useTranslations("alpenglow");
  const locale = useLocale();
  const canvasRef = useRef<FinalFormCanvasHandle>(null);
  const bufferedCanvasEventsRef = useRef<AlpenglowEvent[]>([]);
  const selectedModeRef = useRef<FinalityMode>("alpenglow");
  const visualizerRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<FinalityMode>("alpenglow");
  const [useInteractiveVisualizer, setUseInteractiveVisualizer] =
    useState(false);
  const [visualizerIsActive, setVisualizerIsActive] = useState(false);
  const [telemetry, setTelemetry] = useState(EMPTY_TELEMETRY);
  const [rpcTelemetry, setRpcTelemetry] = useState(EMPTY_RPC_TELEMETRY);
  const [tps, setTps] = useState(0);
  const [status, setStatus] = useState<StreamStatus["status"]>("connecting");
  const number = new Intl.NumberFormat(locale);

  const handleTelemetry = useCallback(
    (value: ArtworkTelemetry) => setTelemetry(value),
    [],
  );
  const pushToCanvas = useCallback((event: AlpenglowEvent) => {
    if (canvasRef.current) {
      canvasRef.current.push(event);
      return;
    }
    const events = bufferedCanvasEventsRef.current;
    if (events.length >= MAX_BUFFERED_CANVAS_EVENTS) events.shift();
    events.push(event);
  }, []);
  const handleCanvasReady = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setMode(selectedModeRef.current);
    for (const event of bufferedCanvasEventsRef.current) canvas.push(event);
    bufferedCanvasEventsRef.current = [];
  }, []);
  useEffect(() => {
    setUseInteractiveVisualizer(!shouldUseStaticVisualizer());
  }, []);

  useEffect(() => {
    const element = visualizerRef.current;
    if (!element || !useInteractiveVisualizer) {
      setVisualizerIsActive(false);
      return;
    }

    let intersecting = false;
    const update = () =>
      setVisualizerIsActive(intersecting && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry?.isIntersecting ?? false;
        update();
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [useInteractiveVisualizer]);

  useEffect(() => {
    if (!visualizerIsActive) return;
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
        pushToCanvas(event);
      } catch {
        setStatus("reconnecting");
      }
    };
    source.onerror = () => setStatus("reconnecting");
    return () => source.close();
  }, [pushToCanvas, visualizerIsActive]);

  function selectMode(value: FinalityMode) {
    selectedModeRef.current = value;
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
  const localizeMediaHref = (href: string) =>
    locale === defaultLocale || !href.startsWith("/")
      ? href
      : `/${locale}${href}`;

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
            <a href={localizeMediaHref("/upgrades/alpenglow")}>
              {t("actions.explore")} <span aria-hidden="true">↗</span>
            </a>
          </Button>
        </div>
      </section>
      <section
        ref={visualizerRef}
        className="ff-visualizer"
        aria-label={t("aria.finalityModel")}
      >
        <div
          className={`ff-toolbar${useInteractiveVisualizer ? "" : " is-static"}`}
        >
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
            {useInteractiveVisualizer ? (
              <FinalFormCanvas
                ref={canvasRef}
                onTelemetry={handleTelemetry}
                onReady={handleCanvasReady}
              />
            ) : (
              <StaticFinalityDiagram />
            )}
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
        <p
          className={`ff-rpc-line${useInteractiveVisualizer ? "" : " is-static"}`}
          aria-label={t("aria.liveRpcData")}
        >
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
        <div className="ff-read-more-copy">
          <p className="ff-kicker">{t("readMore.kicker")}</p>
          <h2 id="ff-read-more-title">{t("readMore.title")}</h2>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="ff-read-more-button rounded-none border-white bg-white font-brand-mono text-xs font-normal uppercase tracking-[0.08em] text-black shadow-none hover:border-[#14f195] hover:bg-[#14f195] hover:text-black"
          >
            <a href={localizeMediaHref("/upgrades/alpenglow")}>
              {t("actions.readGuide")} <span aria-hidden="true">↗</span>
            </a>
          </Button>
        </div>
        {news.length > 0 && (
          <div className="ff-related-news" aria-label={t("aria.relatedNews")}>
            {news.map((article) => (
              <a
                className="ff-news-card"
                href={localizeMediaHref(article.link)}
                key={article.id}
              >
                <div className="ff-news-image">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    sizes="(max-width: 959px) 100vw, 33vw"
                  />
                </div>
                <div className="ff-news-meta">
                  <span>{t("readMore.newsLabel")}</span>
                  {article.date && (
                    <time dateTime={article.date}>
                      {new Intl.DateTimeFormat(locale, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(article.date))}
                    </time>
                  )}
                </div>
                <h3>{article.title}</h3>
                <span className="ff-news-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        )}
      </section>
      {useInteractiveVisualizer && (
        <div className="ff-sr-summary" aria-live="polite">
          {t("liveData.summary", {
            status: statusLabel.toLocaleLowerCase(locale),
            blocks: telemetry.holding,
            finality: formatDuration(telemetry.currentFinalityMs),
          })}
        </div>
      )}
    </main>
  );
}
