import "server-only";

import {
  getRpcTimeframeOption,
  parseRpcTimeframe,
  type MetricRow,
  type RpcTimeframe,
} from "@/app/[locale]/data/data-config";

const GRAFANA_PUBLIC_DASHBOARD_API_URL =
  "https://rpclatency.grafana.net/api/public/dashboards/6f18bcfc9e0e4e0ea62d10e5e484c50d";
const ECONOMICS_PANEL_ID = 1;
const TRANSACTIONS_OVER_TIME_PANEL_ID = 2;
const MS_PER_SECOND = 1000;

export type RpcSenderQueryOptions = {
  timeframe?: RpcTimeframe;
};

type GrafanaField = {
  name?: string;
};

type GrafanaFrame = {
  data?: {
    values?: unknown[][];
  };
  schema?: {
    fields?: GrafanaField[];
  };
};

type GrafanaPanelResponse = {
  results?: Record<
    string,
    {
      error?: string;
      frames?: GrafanaFrame[];
      status?: number;
    }
  >;
};

type RpcSenderRowsResult = {
  generatedAt: string;
  rows: MetricRow[];
  truncated: boolean;
};

type SenderEconomicsRow = {
  medianFeeLamports: number;
  medianTipLamports: number;
  provider: string;
  totalFeesSol: number;
  totalTipsSol: number;
  transactions: number;
};

type SenderTransactionSample = {
  provider: string;
  timestamp: number;
  transactions: number;
};

export function parseRpcSenderQueryOptions(
  params: URLSearchParams,
): Required<RpcSenderQueryOptions> {
  return {
    timeframe: parseRpcTimeframe(params.get("timeframe")),
  };
}

export function getRpcSenderCacheKey(options: RpcSenderQueryOptions = {}) {
  const timeframe = getRpcTimeframeOption(options.timeframe);

  return [
    GRAFANA_PUBLIC_DASHBOARD_API_URL,
    timeframe.value,
    timeframe.durationSeconds,
    timeframe.stepSeconds,
  ].join("|");
}

export async function getRpcSenderMetricRows(
  options: RpcSenderQueryOptions = {},
): Promise<RpcSenderRowsResult> {
  const timeframe = getRpcTimeframeOption(options.timeframe);
  const end = Date.now();
  const start = end - timeframe.durationSeconds * MS_PER_SECOND;
  const request = {
    intervalMs: timeframe.stepSeconds * MS_PER_SECOND,
    maxDataPoints: Math.ceil(timeframe.durationSeconds / timeframe.stepSeconds),
    timeRange: {
      from: String(start),
      timezone: "browser",
      to: String(end),
    },
  };
  const [economicsResponse, transactionsResponse] = await Promise.all([
    queryPublicDashboardPanel(ECONOMICS_PANEL_ID, request),
    queryPublicDashboardPanel(TRANSACTIONS_OVER_TIME_PANEL_ID, request),
  ]);
  const generatedAt = new Date(end).toISOString();

  return {
    generatedAt,
    rows: [
      ...toEconomicsMetricRows(
        parseEconomicsRows(getFirstFrame(economicsResponse)),
        generatedAt,
      ),
      ...toTransactionMetricRows(
        parseTransactionSamples(getFirstFrame(transactionsResponse)),
      ),
    ],
    truncated: false,
  };
}

async function queryPublicDashboardPanel(
  panelId: number,
  request: {
    intervalMs: number;
    maxDataPoints: number;
    timeRange: {
      from: string;
      timezone: string;
      to: string;
    };
  },
) {
  const response = await fetch(
    `${GRAFANA_PUBLIC_DASHBOARD_API_URL}/panels/${panelId}/query`,
    {
      body: JSON.stringify(request),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );
  const payload = (await response
    .json()
    .catch(() => null)) as GrafanaPanelResponse | null;

  if (!response.ok) {
    throw new RpcSenderResponseError(
      `Grafana Sender panel ${panelId}`,
      `${response.status} ${response.statusText}`.trim(),
    );
  }

  const result = payload?.results?.A;

  if (
    !result ||
    (typeof result.status === "number" && result.status !== 200) ||
    !Array.isArray(result.frames)
  ) {
    throw new RpcSenderResponseError(
      `Grafana Sender panel ${panelId}`,
      result?.error ?? "invalid-payload",
    );
  }

  return payload;
}

function getFirstFrame(response: GrafanaPanelResponse) {
  const frame = response.results?.A?.frames?.[0];

  if (!frame) {
    throw new RpcSenderResponseError(
      "Grafana Sender response",
      "missing-frame",
    );
  }

  return frame;
}

function parseEconomicsRows(frame: GrafanaFrame): SenderEconomicsRow[] {
  const providers = getFieldValues(frame, "provider");
  const transactions = getFieldValues(frame, "Transactions");
  const totalTips = getFieldValues(frame, "Total tips (SOL)");
  const totalFees = getFieldValues(frame, "Total fees (SOL)");
  const medianTips = getFieldValues(frame, "Median tip (lamports)");
  const medianFees = getFieldValues(frame, "Median fee (lamports)");

  return providers.flatMap((provider, index) => {
    const row = {
      medianFeeLamports: toFiniteNumber(medianFees[index]),
      medianTipLamports: toFiniteNumber(medianTips[index]),
      provider: toNonEmptyString(provider),
      totalFeesSol: toFiniteNumber(totalFees[index]),
      totalTipsSol: toFiniteNumber(totalTips[index]),
      transactions: toFiniteNumber(transactions[index]),
    };

    return row.provider &&
      row.transactions !== undefined &&
      row.totalTipsSol !== undefined &&
      row.totalFeesSol !== undefined &&
      row.medianTipLamports !== undefined &&
      row.medianFeeLamports !== undefined
      ? [row as SenderEconomicsRow]
      : [];
  });
}

function parseTransactionSamples(
  frame: GrafanaFrame,
): SenderTransactionSample[] {
  const timestamps = getFieldValues(frame, "time");
  const providers = getFieldValues(frame, "provider");
  const transactions = getFieldValues(frame, "txs");

  return timestamps.flatMap((timestamp, index) => {
    const sample = {
      provider: toNonEmptyString(providers[index]),
      timestamp: toFiniteNumber(timestamp),
      transactions: toFiniteNumber(transactions[index]),
    };

    return sample.provider &&
      sample.timestamp !== undefined &&
      sample.transactions !== undefined
      ? [sample as SenderTransactionSample]
      : [];
  });
}

function getFieldValues(frame: GrafanaFrame, fieldName: string) {
  const fieldIndex = frame.schema?.fields?.findIndex(
    (field) => field.name === fieldName,
  );

  if (
    fieldIndex === undefined ||
    fieldIndex < 0 ||
    !Array.isArray(frame.data?.values?.[fieldIndex])
  ) {
    throw new RpcSenderResponseError(
      "Grafana Sender response",
      `missing-field:${fieldName}`,
    );
  }

  return frame.data.values[fieldIndex];
}

function toEconomicsMetricRows(
  rows: SenderEconomicsRow[],
  generatedAt: string,
): MetricRow[] {
  return rows.flatMap((row) => [
    toMetricRow(
      generatedAt,
      "Sender Total Transactions",
      row.provider,
      "Count",
      row.transactions,
    ),
    toMetricRow(
      generatedAt,
      "Sender Total Tips",
      row.provider,
      "SOL",
      row.totalTipsSol,
    ),
    toMetricRow(
      generatedAt,
      "Sender Total Fees",
      row.provider,
      "SOL",
      row.totalFeesSol,
    ),
    toMetricRow(
      generatedAt,
      "Sender Median Tip",
      row.provider,
      "Lamports",
      row.medianTipLamports,
    ),
    toMetricRow(
      generatedAt,
      "Sender Median Fee",
      row.provider,
      "Lamports",
      row.medianFeeLamports,
    ),
  ]);
}

function toTransactionMetricRows(
  samples: SenderTransactionSample[],
): MetricRow[] {
  return samples.map((sample) =>
    toMetricRow(
      new Date(sample.timestamp).toISOString(),
      "Sender Transactions",
      sample.provider,
      "Count",
      sample.transactions,
    ),
  );
}

function toMetricRow(
  date: string,
  metricName: string,
  providerName: string,
  unit: string,
  value: number,
): MetricRow {
  return {
    date,
    metricName,
    providerName,
    unit,
    value,
  };
}

function toFiniteNumber(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);

  return Number.isFinite(number) ? number : undefined;
}

function toNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export class RpcSenderResponseError extends Error {
  constructor(context: string, reason: string) {
    super(`${context} returned ${reason}`);
    this.name = "RpcSenderResponseError";
  }
}
