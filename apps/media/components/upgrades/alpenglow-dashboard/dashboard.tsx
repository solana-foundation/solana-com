"use client";

import { useMemo, useState } from "react";
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
const LIVE_POLL_INTERVAL_MS = 3_000;
const DETAIL_POLL_INTERVAL_MS = 15_000;
const STATUS_UNSUPPORTED_POLL_INTERVAL_MS = 5 * 60_000;

function statusPollInterval(
  data: AlpenglowDashboardActivationData,
): number | null {
  if (data.alpenglowActive === true) return null;
  if (data.alpenglowRpcSupported === false) {
    return STATUS_UNSUPPORTED_POLL_INTERVAL_MS;
  }
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

function shortAddress(address: string) {
  if (address.length <= 14) return address;
  return `${address.slice(0, 6)}…${address.slice(-6)}`;
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

function TableHeading({
  label,
  description,
  align = "left",
}: {
  label: string;
  description: string;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 font-medium normal-case ${align === "right" ? "text-right" : "text-left"}`}
    >
      <span
        className={`flex items-center gap-1 text-xs text-gray-400 ${align === "right" ? "justify-end" : "justify-start"}`}
      >
        {label}
        <MetricInfo
          label={label}
          description={description}
          align={align === "right" ? "end" : "start"}
        />
      </span>
    </th>
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
  const [network, setNetwork] = useState<AlpenglowDashboardNetwork>("testnet");
  const [range, setRange] = useState<AlpenglowDashboardRange>("24h");
  const [validatorFilter, setValidatorFilter] = useState("");

  const statusPoller = useDashboardPoller<AlpenglowDashboardActivationData>({
    url: `/api/upgrades/alpenglow/metrics/status?${new URLSearchParams({ network })}`,
    intervalMs: STATUS_POLL_INTERVAL_MS,
    maxBackoffMs: STATUS_UNSUPPORTED_POLL_INTERVAL_MS,
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
  const errors = [
    statusPoller.error,
    livePoller.error,
    detailPoller.error,
  ].filter((value): value is string => value !== null);
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

  const filteredValidators = useMemo(() => {
    if (!detail) return [];
    const needle = validatorFilter.trim().toLowerCase();
    if (!needle) return detail.validators;
    return detail.validators.filter(
      (validator) =>
        validator.nodekey.toLowerCase().includes(needle) ||
        validator.votekey.toLowerCase().includes(needle),
    );
  }, [detail, validatorFilter]);

  if (!detail && detailPoller.isLoading) {
    return (
      <DashboardSkeleton
        network={network}
        range={range}
        onNetworkChange={setNetwork}
        onRangeChange={setRange}
      />
    );
  }

  if (!detail) {
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
            {detailPoller.error ?? "Unable to load metric details"}
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
    trackedValidatorCount: detail.status.trackedValidatorCount,
    delinquentValidatorCount: detail.status.delinquentValidatorCount,
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
  const nonVoteTransactions = latestMetricValue(
    detail.charts.blockTransactions,
    "Non-vote transactions",
  );
  const voteTransactions = latestMetricValue(
    detail.charts.blockTransactions,
    "Vote transactions",
  );
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
  const generatedAt =
    live && live.generatedAt > detail.generatedAt
      ? live.generatedAt
      : detail.generatedAt;

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div aria-live="polite">
          <p className="text-xs text-gray-500">
            Updated {new Date(generatedAt).toLocaleTimeString()}
            {isRefreshing ? " · Refreshing…" : ""}
          </p>
          {errors[0] && (
            <p className="mt-1 text-xs text-amber-300">{errors[0]}</p>
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
            value={formatNumber(nonVoteTransactions, 1)}
            unit={nonVoteTransactions === null ? undefined : "tx/block"}
            description="The latest average count of non-vote transactions in sampled blocks—a close proxy for user activity."
            interpretation="This should remain stable through the switch even as Tower vote transactions leave blocks."
          />
          <UserMetricCard
            label="Tower vote share"
            value={formatNumber(towerVoteShare, 1)}
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
          <span className="text-xs text-gray-500">
            Showing {RANGE_LABELS[range]}
          </span>
        </div>
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
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03]">
        <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-1">
              <h2 className="text-xl font-semibold text-white">
                Validator sample
              </h2>
              <MetricInfo
                label="Validator sample"
                description="Tower transition diagnostics from monitored validator exporters, ordered by delinquency and vote-to-root lag. These signals do not measure Alpenglow certificate participation."
              />
            </div>
            <p className="mt-1 text-xs tabular-nums text-gray-500">
              {formatNumber(status.trackedValidatorCount)} tracked ·{" "}
              {formatNumber(status.delinquentValidatorCount)} delinquent · Up to
              100 shown
            </p>
          </div>
          <label>
            <span className="sr-only">Filter validators by address</span>
            <input
              value={validatorFilter}
              onChange={(event) => setValidatorFilter(event.target.value)}
              placeholder="Filter validators"
              className="block w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#14F195]/60 md:w-64"
            />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead className="text-gray-500">
              <tr>
                <TableHeading
                  label="Validator"
                  description="Identity and vote account"
                />
                <TableHeading
                  label="Status"
                  description="Tower delinquency flag"
                />
                <TableHeading
                  label="Last vote"
                  description="Latest Tower vote slot"
                  align="right"
                />
                <TableHeading
                  label="Root"
                  description="Latest rooted Tower slot"
                  align="right"
                />
                <TableHeading
                  label="Lag"
                  description="Last vote minus root"
                  align="right"
                />
                <TableHeading
                  label="Active stake"
                  description="Stake delegated to validator"
                  align="right"
                />
                <TableHeading
                  label="Vote tx/block"
                  description="Tower votes in sampled block"
                  align="right"
                />
              </tr>
            </thead>
            <tbody>
              {filteredValidators.map((validator) => (
                <tr
                  key={validator.nodekey}
                  className="border-t border-white/[0.07] text-gray-300"
                >
                  <td
                    className="px-4 py-3.5 font-mono text-xs"
                    title={validator.nodekey}
                  >
                    {shortAddress(validator.nodekey)}
                    {validator.votekey && (
                      <span
                        className="mt-1 block text-gray-600"
                        title={validator.votekey}
                      >
                        vote {shortAddress(validator.votekey)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        validator.delinquent
                          ? "bg-red-400/10 text-red-300"
                          : validator.delinquent === false
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-white/5 text-gray-400"
                      }`}
                    >
                      {validator.delinquent
                        ? "Delinquent"
                        : validator.delinquent === false
                          ? "Current"
                          : "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums">
                    {formatNumber(validator.lastVote)}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums">
                    {formatNumber(validator.rootSlot)}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums">
                    {formatNumber(validator.voteRootLag)}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums">
                    {validator.activeStake === null
                      ? "Unavailable"
                      : `${formatNumber(validator.activeStake)} SOL`}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums">
                    {formatNumber(validator.voteTransactionsPerBlock, 1)}
                  </td>
                </tr>
              ))}
              {filteredValidators.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No sampled validators match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

      <details className="text-xs text-gray-500">
        <summary className="w-fit cursor-pointer hover:text-gray-300">
          Methodology note
        </summary>
        <p className="mt-3 max-w-3xl text-pretty leading-5 text-gray-500">
          The genesis certificate endpoint reports the one-time transition
          certificate; it does not expose a continuing Alpenglow certificate
          rate. Tower metrics remain useful as transition indicators and are not
          treated as Alpenglow voting metrics.
        </p>
      </details>
    </div>
  );
}
