"use client";

import { useState } from "react";
import { MetricChart } from "./metric-chart";
import { MetricInfo } from "./metric-info";
import { useDashboardPoller } from "./use-dashboard-poller";
import {
  ALPENGLOW_DASHBOARD_NETWORKS,
  ALPENGLOW_DASHBOARD_RANGES,
  type AlpenglowDashboardActivationData,
  type AlpenglowDashboardDetailData,
  type AlpenglowDashboardLiveData,
  type AlpenglowDashboardNetwork,
  type AlpenglowDashboardRange,
  type MetricSeries,
} from "@/lib/upgrades/alpenglow-metrics-types";

const NETWORK_LABELS: Record<AlpenglowDashboardNetwork, string> = {
  mainnet: "Mainnet",
  testnet: "Testnet",
  devnet: "Devnet",
};

const RANGE_LABELS: Record<AlpenglowDashboardRange, string> = {
  "1h": "1 hour",
  "6h": "6 hours",
  "24h": "24 hours",
  "7d": "7 days",
};

const STATUS_POLL_INTERVAL_MS = 10_000;
const STATUS_MAX_BACKOFF_MS = 60_000;
const LIVE_POLL_INTERVAL_MS = 3_000;
const DETAIL_POLL_INTERVAL_MS = 15_000;

function statusPollInterval(
  data: AlpenglowDashboardActivationData,
): number | null {
  if (data.alpenglowActive === true) return null;
  return STATUS_POLL_INTERVAL_MS;
}

function formatNumber(value: number | null, maximumFractionDigits = 0) {
  if (value === null) return "Unavailable";
  return new Intl.NumberFormat("en", { maximumFractionDigits }).format(value);
}

function formatLatency(value: number | null) {
  if (value === null) return { value: "Unavailable", unit: undefined };
  if (value < 1) {
    return { value: formatNumber(value * 1_000, 0), unit: "ms" };
  }
  return { value: formatNumber(value, 2), unit: "seconds" };
}

function latestMetricValue(series: MetricSeries[], label?: string) {
  const candidates = label
    ? series.filter((item) => item.label === label)
    : series;
  let latest: { timestamp: number; value: number } | null = null;

  for (const item of candidates) {
    for (const [timestamp, value] of item.points) {
      if (!latest || timestamp > latest.timestamp) {
        latest = { timestamp, value };
      }
    }
  }

  return latest?.value ?? null;
}

function DashboardControls({
  network,
  range,
  onNetworkChange,
  onRangeChange,
}: {
  network: AlpenglowDashboardNetwork;
  range: AlpenglowDashboardRange;
  onNetworkChange: (_network: AlpenglowDashboardNetwork) => void;
  onRangeChange: (_range: AlpenglowDashboardRange) => void;
}) {
  const buttonClass = (selected: boolean) =>
    `rounded-md px-3 py-2 text-xs font-medium transition-colors ${
      selected
        ? "bg-white text-black shadow-sm"
        : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
    }`;

  return (
    <div className="flex flex-wrap gap-3 sm:justify-end">
      <div
        className="inline-flex w-fit rounded-lg border border-white/10 bg-black/30 p-1"
        role="group"
        aria-label="Solana network"
      >
        {ALPENGLOW_DASHBOARD_NETWORKS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={network === option}
            onClick={() => onNetworkChange(option)}
            className={buttonClass(network === option)}
          >
            {NETWORK_LABELS[option]}
          </button>
        ))}
      </div>
      <div
        className="inline-flex w-fit rounded-lg border border-white/10 bg-black/30 p-1"
        role="group"
        aria-label="Dashboard time range"
      >
        {ALPENGLOW_DASHBOARD_RANGES.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={range === option}
            onClick={() => onRangeChange(option)}
            className={buttonClass(range === option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function UserMetricCard({
  label,
  value,
  unit,
  description,
  interpretation,
}: {
  label: string;
  value: string;
  unit?: string;
  description: string;
  interpretation: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-1">
        <h3 className="text-sm font-medium text-gray-400">{label}</h3>
        <MetricInfo
          label={label}
          description={description}
          guidance={interpretation}
        />
      </div>
      <p className="mt-4 text-3xl font-semibold tabular-nums text-white">
        {value}
        {unit && (
          <span className="ml-2 text-sm font-normal text-gray-500">{unit}</span>
        )}
      </p>
    </article>
  );
}

function DashboardSkeleton({
  network,
  range,
  onNetworkChange,
  onRangeChange,
}: {
  network: AlpenglowDashboardNetwork;
  range: AlpenglowDashboardRange;
  onNetworkChange: (_network: AlpenglowDashboardNetwork) => void;
  onRangeChange: (_range: AlpenglowDashboardRange) => void;
}) {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">
        Loading {NETWORK_LABELS[network]} consensus metrics
      </span>
      <div className="flex justify-end">
        <DashboardControls
          network={network}
          range={range}
          onNetworkChange={onNetworkChange}
          onRangeChange={onRangeChange}
        />
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="h-4 w-40 rounded bg-white/[0.06]" />
        <div className="mt-7 h-12 w-72 max-w-full rounded bg-white/[0.08]" />
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="bg-black/80 p-5">
              <div className="h-3 w-24 rounded bg-white/[0.06]" />
              <div className="mt-4 h-8 w-32 rounded bg-white/[0.08]" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-28 rounded-xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>
    </div>
  );
}

/** Renders the live Alpenglow transition dashboard. */
export function AlpenglowDashboard() {
  const [network, setNetwork] = useState<AlpenglowDashboardNetwork>("devnet");
  const [range, setRange] = useState<AlpenglowDashboardRange>("24h");

  const statusPoller = useDashboardPoller<AlpenglowDashboardActivationData>({
    url: `/api/upgrades/alpenglow/metrics/status?${new URLSearchParams({ network })}`,
    intervalMs: STATUS_POLL_INTERVAL_MS,
    maxBackoffMs: STATUS_MAX_BACKOFF_MS,
    getNextIntervalMs: statusPollInterval,
  });
  const livePoller = useDashboardPoller<AlpenglowDashboardLiveData>({
    url: `/api/upgrades/alpenglow/metrics/live?${new URLSearchParams({ network })}`,
    intervalMs: LIVE_POLL_INTERVAL_MS,
    maxBackoffMs: 30_000,
  });
  const detailPoller = useDashboardPoller<AlpenglowDashboardDetailData>({
    url: `/api/upgrades/alpenglow/metrics/detail?${new URLSearchParams({ network, range })}`,
    intervalMs: DETAIL_POLL_INTERVAL_MS,
    maxBackoffMs: 60_000,
  });

  const activation =
    statusPoller.data?.network === network ? statusPoller.data : null;
  const live = livePoller.data?.network === network ? livePoller.data : null;
  const detail =
    detailPoller.data?.network === network && detailPoller.data.range === range
      ? detailPoller.data
      : null;
  const pageErrors = [statusPoller.error, livePoller.error].filter(
    (value): value is string => value !== null,
  );
  const allErrors = [...pageErrors, detailPoller.error].filter(
    (value): value is string => value !== null,
  );
  const warnings = [
    ...(activation?.warnings ?? []),
    ...(live?.warnings ?? []),
    ...(detail?.warnings ?? []),
  ].filter(
    (warning, index, allWarnings) => allWarnings.indexOf(warning) === index,
  );
  const isRefreshing =
    statusPoller.isRefreshing ||
    livePoller.isRefreshing ||
    detailPoller.isRefreshing;
  const hasAnyData = activation !== null || live !== null || detail !== null;
  const isInitialLoading =
    !hasAnyData &&
    (statusPoller.isLoading || livePoller.isLoading || detailPoller.isLoading);

  if (isInitialLoading) {
    return (
      <DashboardSkeleton
        network={network}
        range={range}
        onNetworkChange={setNetwork}
        onRangeChange={setRange}
      />
    );
  }

  if (!hasAnyData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <DashboardControls
            network={network}
            range={range}
            onNetworkChange={setNetwork}
            onRangeChange={setRange}
          />
        </div>
        <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-6 text-red-200">
          <h2 className="font-semibold">
            {NETWORK_LABELS[network]} metrics are unavailable
          </h2>
          <p className="mt-2 text-sm text-red-200/70">
            {allErrors[0] ?? "Unable to load dashboard metrics"}
          </p>
        </div>
      </div>
    );
  }

  const status = {
    alpenglowRpcSupported: activation?.alpenglowRpcSupported ?? null,
    alpenglowActive: activation?.alpenglowActive ?? null,
    genesisSlot: activation?.genesisSlot ?? null,
    certificateValidatorCount: activation?.certificateValidatorCount ?? null,
    recentAverageFinalityLatencySeconds:
      live?.recentAverageFinalityLatencySeconds ?? null,
  };
  const transitionState =
    status.alpenglowActive === true
      ? "Alpenglow active"
      : status.alpenglowActive === false
        ? "Alpenglow inactive"
        : "Alpenglow status unavailable";
  const transitionExplanation =
    status.alpenglowActive === true
      ? "The cluster has returned an Alpenglow genesis certificate, marking the one-time activation of the new consensus protocol."
      : status.alpenglowRpcSupported === true
        ? "The cluster can report Alpenglow activation, but no genesis certificate has been observed. Tower BFT remains the active consensus protocol."
        : "This cluster does not currently expose enough information to confirm Alpenglow activation.";
  const transactionRate = live?.transactionsPerSecond ?? null;
  const recentAverageFinalityLatency = formatLatency(
    status.recentAverageFinalityLatencySeconds,
  );
  const showGenesisSlot =
    status.alpenglowActive === true && status.genesisSlot !== null;
  const showCertificateSigners =
    status.alpenglowActive === true &&
    status.certificateValidatorCount !== null;
  const showRecentAverageFinality =
    status.recentAverageFinalityLatencySeconds !== null;
  const heroMetricCount = [
    showGenesisSlot,
    showCertificateSigners,
    showRecentAverageFinality,
  ].filter(Boolean).length;
  const heroMetricLayout =
    heroMetricCount >= 3
      ? "sm:grid-cols-3"
      : heroMetricCount === 2
        ? "sm:w-2/3 sm:grid-cols-2"
        : "sm:w-1/3 sm:grid-cols-1";
  const nonVoteTransactions = detail
    ? latestMetricValue(
        detail.charts.blockTransactions,
        "Non-vote transactions",
      )
    : null;
  const voteTransactions = detail
    ? latestMetricValue(detail.charts.blockTransactions, "Vote transactions")
    : null;
  const blockTransactionTotal =
    nonVoteTransactions !== null && voteTransactions !== null
      ? nonVoteTransactions + voteTransactions
      : null;
  const towerVoteShare =
    voteTransactions !== null &&
    blockTransactionTotal !== null &&
    blockTransactionTotal > 0
      ? (voteTransactions / blockTransactionTotal) * 100
      : null;
  const updateStatus = live
    ? `Live metrics updated ${new Date(live.generatedAt).toLocaleTimeString()}`
    : detail
      ? `Trends updated ${new Date(detail.generatedAt).toLocaleTimeString()}`
      : activation
        ? `Consensus status updated ${new Date(activation.generatedAt).toLocaleTimeString()}`
        : "Metrics unavailable";

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div aria-live="polite">
          <p className="text-xs text-gray-500">
            {updateStatus}
            {isRefreshing ? " · Refreshing…" : ""}
          </p>
          {pageErrors[0] && (
            <p className="mt-1 text-xs text-amber-300">{pageErrors[0]}</p>
          )}
        </div>
        <DashboardControls
          network={network}
          range={range}
          onNetworkChange={setNetwork}
          onRangeChange={setRange}
        />
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-gray-400">
            <span
              className={`size-2 rounded-full ${status.alpenglowActive === true ? "bg-[#14F195]" : "bg-gray-500"}`}
            />
            Live consensus state
            <span className="text-gray-600">·</span>
            <span className="text-gray-500">{NETWORK_LABELS[network]}</span>
            <MetricInfo
              label="Consensus state"
              description={transitionExplanation}
            />
          </div>
          <h2
            className={`mt-5 text-balance text-4xl font-bold md:text-5xl ${status.alpenglowActive === true ? "text-[#14F195]" : "text-white"}`}
          >
            {transitionState}
          </h2>

          {heroMetricCount > 0 && (
            <dl
              className={`mt-8 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 ${heroMetricLayout}`}
            >
              {showGenesisSlot && (
                <div className="bg-black/85 p-5">
                  <dt className="flex items-center gap-1 text-sm font-medium text-gray-500">
                    <span>Genesis slot</span>
                    <MetricInfo
                      label="Genesis slot"
                      description="The slot where Alpenglow began. It is set once by the genesis certificate and does not update afterward."
                    />
                  </dt>
                  <dd className="mt-2 text-2xl font-semibold tabular-nums text-white">
                    {formatNumber(status.genesisSlot)}
                  </dd>
                </div>
              )}
              {showCertificateSigners && (
                <div className="bg-black/85 p-5">
                  <dt className="flex items-center gap-1 text-sm font-medium text-gray-500">
                    <span>Certificate signers</span>
                    <MetricInfo
                      label="Certificate signers"
                      description="Validators represented in the one-time certificate that activated Alpenglow; this is not a live participation count."
                    />
                  </dt>
                  <dd className="mt-2 text-2xl font-semibold tabular-nums text-white">
                    {formatNumber(status.certificateValidatorCount)}
                  </dd>
                </div>
              )}
              {showRecentAverageFinality && (
                <div className="bg-black/85 p-5">
                  <dt className="flex items-center gap-1 text-sm font-medium text-gray-500">
                    <span>Average observed finality</span>
                    <MetricInfo
                      label="Average observed finality"
                      description={
                        // testnet is over rpc, others are using laserstream
                        network === "testnet"
                          ? "Mean RPC-observed finality over the latest one-minute window"
                          : "Mean RPC-observed finality over the latest one-minute window, including polling and network delay."
                      }
                    />
                  </dt>
                  <dd className="mt-2 text-2xl font-semibold tabular-nums text-white">
                    {recentAverageFinalityLatency.value}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      {recentAverageFinalityLatency.unit}
                    </span>
                  </dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-1">
          <h2 className="text-xl font-semibold text-white">
            Current performance
          </h2>
          <MetricInfo
            label="Current performance"
            description="These latest samples separate user activity from Tower consensus traffic. A drop in total transactions can be healthy when Tower votes disappear but non-vote traffic remains steady."
          />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <UserMetricCard
            label="Observed network throughput"
            value={formatNumber(transactionRate, 1)}
            unit={transactionRate === null ? undefined : "tx/s"}
            description="The latest total transaction rate observed across the monitored exporter targets, including user and consensus transactions."
            interpretation="Compare this with user transactions per block. A lower total alone does not suggest that user capacity or performance declined."
          />
          <UserMetricCard
            label="User transactions per block"
            value={
              detail
                ? formatNumber(nonVoteTransactions, 1)
                : detailPoller.isLoading
                  ? "Loading…"
                  : "Unavailable"
            }
            unit={nonVoteTransactions === null ? undefined : "tx/block"}
            description="The latest average count of non-vote transactions in sampled blocks—a close proxy for user activity."
            interpretation="This should remain stable through the switch even as Tower vote transactions leave blocks."
          />
          <UserMetricCard
            label="Tower vote share"
            value={
              detail
                ? formatNumber(towerVoteShare, 1)
                : detailPoller.isLoading
                  ? "Loading…"
                  : "Unavailable"
            }
            unit={towerVoteShare === null ? undefined : "% of block tx"}
            description="The share of sampled block transactions used by Tower vote transactions rather than non-vote activity."
            interpretation="This should approach zero after Alpenglow activates. Its decline is expected consensus overhead leaving the transaction stream."
          />
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-semibold text-white">Trends</h2>
            <MetricInfo
              label="Trends"
              description="Use finality and activity charts together to distinguish user demand from disappearing Tower vote traffic. Tower-only signals indicate when the legacy protocol is winding down."
            />
          </div>
          <span
            className={`text-xs ${detailPoller.error ? "text-amber-300" : "text-gray-500"}`}
          >
            {detail
              ? `${detailPoller.error ? "Refresh failed · Last updated" : "Updated"} ${new Date(detail.generatedAt).toLocaleTimeString()} · Showing ${RANGE_LABELS[range]}`
              : detailPoller.isLoading
                ? `Loading · ${RANGE_LABELS[range]}`
                : `Unavailable · ${RANGE_LABELS[range]}`}
          </span>
        </div>
        {detail ? (
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <MetricChart
              title="Observed finality latency (p95)"
              description="The 95th percentile of RPC-observed finality measurements over a rolling five-minute window. Ninety-five percent of observations completed at or below this value; polling and network delay are included."
              series={detail.charts.p95FinalityLatencySeconds}
              unit="seconds"
            />
            <MetricChart
              title="Transaction throughput"
              description="Total transactions per second, including user and Tower vote transactions. Read it with block composition: an activation-related drop reflects vote traffic disappearing."
              series={detail.charts.transactionsPerSecond}
              unit="transactions per second"
            />
            <MetricChart
              title="Block transaction composition"
              description="Average vote and non-vote transactions in sampled blocks. The vote line should approach zero after activation; the non-vote line is the closest view of user activity."
              series={detail.charts.blockTransactions}
              unit="transactions per block"
            />
            <MetricChart
              title="Tower vote advancement"
              description="The average rate at which sampled validators' last Tower vote moves forward. It should fall to zero when Tower voting stops; that is expected after activation, not an outage signal."
              series={detail.charts.towerVoteSlotsPerSecond}
              unit="slots per second"
            />
            <MetricChart
              title="Tower vote-to-root lag"
              description="The average slot distance from a validator's latest Tower vote to its Tower root. It diagnoses legacy voting during the transition and should not be treated as Alpenglow finality after activation."
              series={detail.charts.averageVoteRootLag}
              unit="slots"
            />
          </div>
        ) : detailPoller.isLoading ? (
          <div
            className="mt-4 grid gap-4 xl:grid-cols-2"
            aria-busy="true"
            aria-label="Loading historical trends"
          >
            {[0, 1].map((item) => (
              <div
                key={item}
                className="h-72 rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="h-4 w-40 rounded bg-white/[0.06]" />
                <div className="mt-8 h-48 rounded-lg bg-white/[0.04]" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-5 text-amber-200"
            role="status"
          >
            <p className="font-medium">Historical trends are unavailable</p>
            <p className="mt-1 text-sm text-amber-200/70">
              {detailPoller.error ??
                "The historical metrics source did not return data."}
            </p>
          </div>
        )}
      </section>

      {warnings.length > 0 && (
        <details className="rounded-xl border border-amber-300/15 bg-amber-300/5 px-5 py-4 text-sm text-amber-100/80">
          <summary className="cursor-pointer font-medium">
            {warnings.length} data source warning
            {warnings.length === 1 ? "" : "s"}
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-amber-100/60">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
