"use client";

import { useLocale, useTranslations } from "@workspace/i18n/client";
import { useEffect, useState } from "react";

const METRICS_URL = "/api/upgrades/alpenglow/metrics/live?network=mainnet";
const REFRESH_MS = 5_000;

type LiveMetrics = {
  generatedAt: string;
  latestFinalityLatencySeconds: number | null;
  transactionsPerSecond: number | null;
  nonVoteTransactionsPerBlock: number | null;
  voteTransactionsPerBlock: number | null;
  totalTransactionsPerBlock: number | null;
};

function metric(value: unknown): value is number | null {
  return (
    value === null || (typeof value === "number" && Number.isFinite(value))
  );
}

function readLiveMetrics(value: unknown): LiveMetrics | null {
  if (typeof value !== "object" || value === null) return null;
  const data = value as Record<string, unknown>;
  if (
    data.network !== "mainnet" ||
    typeof data.generatedAt !== "string" ||
    !Number.isFinite(Date.parse(data.generatedAt)) ||
    !metric(data.latestFinalityLatencySeconds) ||
    !metric(data.transactionsPerSecond) ||
    !metric(data.nonVoteTransactionsPerBlock) ||
    !metric(data.voteTransactionsPerBlock) ||
    !metric(data.totalTransactionsPerBlock)
  ) {
    return null;
  }
  return data as LiveMetrics;
}

export function AlpenglowDashboardStats() {
  const t = useTranslations("alpenglow.dashboardStats");
  const locale = useLocale();
  const [data, setData] = useState<LiveMetrics | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    let requestId = 0;

    async function refresh() {
      if (!active || document.hidden) return;
      const id = ++requestId;
      controller = new AbortController();
      try {
        const response = await fetch(METRICS_URL, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Metrics request failed");
        const metrics = readLiveMetrics(await response.json());
        if (!metrics) throw new Error("Invalid metrics response");
        if (active && id === requestId) {
          setData(metrics);
          setUnavailable(false);
        }
      } catch {
        if (active && id === requestId && !controller.signal.aborted) {
          setData(null);
          setUnavailable(true);
        }
      } finally {
        if (active && id === requestId && !document.hidden)
          timer = setTimeout(refresh, REFRESH_MS);
      }
    }

    function onVisibilityChange() {
      if (document.hidden) {
        clearTimeout(timer);
        requestId++;
        controller?.abort();
      } else {
        void refresh();
      }
    }

    void refresh();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      active = false;
      clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const totalBlockTransactions =
    data?.totalTransactionsPerBlock ??
    (data?.nonVoteTransactionsPerBlock != null &&
    data.voteTransactionsPerBlock != null
      ? data.nonVoteTransactionsPerBlock + data.voteTransactionsPerBlock
      : null);
  const voteShare =
    data?.voteTransactionsPerBlock != null &&
    totalBlockTransactions != null &&
    totalBlockTransactions > 0
      ? (data.voteTransactionsPerBlock / totalBlockTransactions) * 100
      : null;
  const finality = data?.latestFinalityLatencySeconds;
  const availableCount = [
    finality,
    data?.transactionsPerSecond,
    data?.nonVoteTransactionsPerBlock,
    voteShare,
  ].filter((value) => value != null).length;
  const status =
    unavailable || (data && availableCount === 0)
      ? t("unavailable")
      : !data
        ? t("loading")
        : availableCount < 4
          ? t("partial")
          : t("status");
  const stats = [
    {
      label: t("finality"),
      value:
        finality == null
          ? "—"
          : finality < 1
            ? `${number.format(finality * 1_000)} ms`
            : `${number.format(finality)} s`,
    },
    {
      label: t("throughput"),
      value:
        data?.transactionsPerSecond == null
          ? "—"
          : `${number.format(data.transactionsPerSecond)} tx/s`,
    },
    {
      label: t("userTransactions"),
      value:
        data?.nonVoteTransactionsPerBlock == null
          ? "—"
          : number.format(data.nonVoteTransactionsPerBlock),
    },
    {
      label: t("towerVoteShare"),
      value: voteShare == null ? "—" : `${number.format(voteShare)}%`,
    },
  ];

  return (
    <div
      className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/20 py-4 font-brand-mono text-[10px] uppercase tracking-[0.06em] text-white/60"
      aria-label={t("ariaLabel")}
    >
      <span className="text-[#14f195]">{t("source")}</span>
      <span role="status">{status}</span>
      {stats.map(({ label, value }) => (
        <span
          key={label}
          className="border-l border-white/20 pl-5 tabular-nums"
        >
          <strong className="font-normal text-white">{value}</strong> {label}
        </span>
      ))}
    </div>
  );
}
