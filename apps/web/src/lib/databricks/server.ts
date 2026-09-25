import "server-only";

const ENV_KEYS = {
  baseUrl: "DATA_API_URL",
  apiKey: "DATA_API_KEY",
} as const;

type DataApiConfigError = {
  invalidEnv: string[];
  missingEnv: string[];
};

export type DataApiConfig = {
  baseUrl: string;
  apiKey: string;
};

export type DataApiMetricRow = {
  date: string;
  metricName: string;
  unit: string;
  providerName: string;
  value: number;
};

type MetricsResponse = {
  data?: {
    rows?: unknown[];
  };
};

export function getDataApiConfig():
  | { ok: true; config: DataApiConfig }
  | ({ ok: false } & DataApiConfigError) {
  const baseUrlRaw = readEnv(ENV_KEYS.baseUrl);
  const apiKey = readEnv(ENV_KEYS.apiKey);
  const baseUrl = baseUrlRaw ? normalizeBaseUrl(baseUrlRaw) : undefined;
  const missingEnv = getMissingConfigEnv({ baseUrlRaw, apiKey });
  const invalidEnv = getInvalidConfigEnv({ baseUrl, baseUrlRaw });

  if (missingEnv.length > 0 || invalidEnv.length > 0 || !baseUrl || !apiKey) {
    return { ok: false, invalidEnv, missingEnv };
  }

  return {
    ok: true,
    config: {
      baseUrl,
      apiKey,
    },
  };
}

export async function getDataApiMetricRows(config: DataApiConfig) {
  const data = await fetchDataApiMetrics(config);

  return {
    rows: data.rows.flatMap((record) => {
      const row = toMetricRow(record);

      return row ? [row] : [];
    }),
    // data-api's `truncated` isn't wired up to anything on the frontend
    // yet; hardcode it until a follow-up PR drops the field from the
    // data-api payload entirely.
    truncated: false,
  };
}

async function fetchDataApiMetrics(config: DataApiConfig) {
  const response = await fetch(`${config.baseUrl}/metrics`, {
    cache: "no-store",
    headers: { "x-api-key": config.apiKey },
  });

  const payload = (await response
    .json()
    .catch(() => null)) as MetricsResponse | null;

  if (!response.ok) {
    throw new DataApiResponseError(
      "data-api metrics request",
      `${response.status} ${response.statusText}`.trim(),
    );
  }

  if (!Array.isArray(payload?.data?.rows)) {
    throw new DataApiResponseError(
      "data-api metrics response",
      "invalid-payload",
    );
  }

  return payload.data as { rows: unknown[] };
}

function toMetricRow(record: unknown): DataApiMetricRow | null {
  const { date, metric_name, provider_name, unit, value } = (record ??
    {}) as Record<string, unknown>;
  const normalizedDate = normalizeSqlDate(date);
  const normalizedValue = normalizeSqlNumber(value);

  if (
    !normalizedDate ||
    typeof metric_name !== "string" ||
    typeof unit !== "string" ||
    typeof provider_name !== "string" ||
    typeof normalizedValue !== "number" ||
    !Number.isFinite(normalizedValue)
  ) {
    return null;
  }

  return {
    date: normalizedDate,
    metricName: metric_name,
    unit,
    providerName: provider_name,
    value: normalizedValue,
  };
}

function normalizeSqlDate(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return undefined;
}

function normalizeSqlNumber(value: unknown) {
  const parsed = typeof value === "string" ? Number(value) : value;

  return typeof parsed === "number" && Number.isFinite(parsed)
    ? parsed
    : undefined;
}

function normalizeBaseUrl(value: string) {
  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      return undefined;
    }

    url.hash = "";
    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";

    return url.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

function getInvalidConfigEnv({
  baseUrl,
  baseUrlRaw,
}: {
  baseUrl?: string;
  baseUrlRaw?: string;
}) {
  const invalidEnv: string[] = [];

  if (baseUrlRaw && !baseUrl) {
    invalidEnv.push(ENV_KEYS.baseUrl);
  }

  return invalidEnv;
}

function getMissingConfigEnv({
  baseUrlRaw,
  apiKey,
}: {
  baseUrlRaw?: string;
  apiKey?: string;
}) {
  const missingEnv: string[] = [];

  if (!baseUrlRaw) {
    missingEnv.push(ENV_KEYS.baseUrl);
  }

  if (!apiKey) {
    missingEnv.push(ENV_KEYS.apiKey);
  }

  return missingEnv;
}

function readEnv(key: string) {
  const value = process.env[key]?.trim();

  if (!value || isPlaceholderValue(value)) {
    return undefined;
  }

  return value;
}

function isPlaceholderValue(value: string) {
  const lowerValue = value.toLowerCase();

  return (
    value.startsWith("<") ||
    lowerValue.startsWith("your_") ||
    lowerValue === "changeme" ||
    lowerValue === "todo"
  );
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export class DataApiResponseError extends Error {
  constructor(context: string, reason: string) {
    super(`${context} returned ${reason}`);
    this.name = "DataApiResponseError";
  }
}
