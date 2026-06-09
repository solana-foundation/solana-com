import "server-only";

import { DBSQLClient } from "@databricks/sql";

const ENV_KEYS = {
  serverHostname: "DATABRICKS_SERVER_HOSTNAME",
  httpPath: "DATABRICKS_HTTP_PATH",
  token: "DATABRICKS_TOKEN",
} as const;

type DatabricksConfigError = {
  invalidEnv: string[];
  missingEnv: string[];
};

export type DatabricksConfig = {
  serverHostname: string;
  httpPath: string;
  warehouseId: string;
  token: string;
};

export type DatabricksMetricRow = {
  date: string;
  metricName: string;
  unit: string;
  providerName: string;
  value: number;
};

export function getDatabricksConfig():
  | { ok: true; config: DatabricksConfig }
  | ({ ok: false } & DatabricksConfigError) {
  const serverHostnameRaw = readEnv(ENV_KEYS.serverHostname);
  const httpPathRaw = readEnv(ENV_KEYS.httpPath);
  const serverHostname = serverHostnameRaw
    ? normalizeServerHostname(serverHostnameRaw)
    : undefined;
  const httpPath = httpPathRaw ? normalizeHttpPath(httpPathRaw) : undefined;
  const token = readEnv(ENV_KEYS.token);
  const warehouseId = httpPath && getWarehouseIdFromHttpPath(httpPath);
  const missingEnv = getMissingConfigEnv({
    httpPathRaw,
    serverHostnameRaw,
    token,
  });
  const invalidEnv = getInvalidConfigEnv({
    httpPath,
    httpPathRaw,
    serverHostname,
    serverHostnameRaw,
  });

  if (
    missingEnv.length > 0 ||
    invalidEnv.length > 0 ||
    !serverHostname ||
    !httpPath ||
    !token ||
    !warehouseId
  ) {
    return { ok: false, invalidEnv, missingEnv };
  }

  return {
    ok: true,
    config: {
      serverHostname,
      httpPath,
      warehouseId,
      token,
    },
  };
}

export async function getDatabricksSqlMetricRows(
  config: DatabricksConfig,
  options: {
    metricNames: readonly string[];
    lookbackDays: number;
  },
) {
  const result = await executeDatabricksStatement(
    config,
    buildMetricRowsStatement(options),
  );

  return {
    rows: result.records.flatMap((record) => {
      const row = toMetricRow(record);

      return row ? [row] : [];
    }),
    truncated: false,
    statementId: result.statementId,
  };
}

async function executeDatabricksStatement(
  config: DatabricksConfig,
  statement: string,
) {
  const client = new DBSQLClient();
  let session: Awaited<ReturnType<typeof client.openSession>> | undefined;
  let operation:
    | Awaited<ReturnType<NonNullable<typeof session>["executeStatement"]>>
    | undefined;

  try {
    const connectedClient = await client.connect({
      token: config.token,
      host: config.serverHostname,
      path: config.httpPath,
    });

    session = await connectedClient.openSession();
    operation = await session.executeStatement(statement, { runAsync: true });

    return { records: await operation.fetchAll(), statementId: operation.id };
  } finally {
    await closeQuietly(operation, "operation");
    await closeQuietly(session, "session");
    await closeQuietly(client, "client");
  }
}

function buildMetricRowsStatement({
  lookbackDays,
  metricNames,
}: {
  metricNames: readonly string[];
  lookbackDays: number;
}) {
  const uniqueMetricNames = Array.from(new Set(metricNames));
  const safeLookbackDays = Math.max(1, Math.floor(lookbackDays));

  if (uniqueMetricNames.length === 0) {
    throw new DatabricksResponseError(
      "Databricks SQL statement request",
      "missing-metric-names",
    );
  }

  return `
SELECT
  CAST(mv.date AS DATE) AS date,
  m.name AS metric_name,
  m.unit,
  p.name AS provider_name,
  CAST(mv.value AS DOUBLE) AS value
FROM
  dev.mlh.metrics_values mv
    JOIN dev.mlh.metrics m
      ON mv.metric_id = m.id
    JOIN dev.mlh.providers p
      ON mv.provider_id = p.id
WHERE
  m.name IN (${uniqueMetricNames.map(toSqlStringLiteral).join(", ")})
  AND mv.date >= date_sub(current_date(), ${safeLookbackDays})
ORDER BY
  mv.date ASC,
  provider_name ASC,
  metric_name ASC
`.trim();
}

function toMetricRow(record: object): DatabricksMetricRow | null {
  const { date, metric_name, provider_name, unit, value } = record as Record<
    string,
    unknown
  >;
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

function normalizeServerHostname(value: string) {
  try {
    const url =
      value.startsWith("http://") || value.startsWith("https://")
        ? new URL(value)
        : new URL(`https://${value}`);

    return url.hostname || undefined;
  } catch {
    return undefined;
  }
}

function normalizeHttpPath(value: string) {
  const httpPathFromJdbcUrl = value.match(/(?:^|;)httpPath=([^;]+)/i)?.[1];
  const rawPath = decodeURIComponent(httpPathFromJdbcUrl ?? value);
  const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

  return getWarehouseIdFromHttpPath(path) ? path : undefined;
}

function getWarehouseIdFromHttpPath(httpPath: string) {
  return httpPath.match(/^\/sql\/1\.0\/warehouses\/([^/?#]+)$/)?.[1];
}

function getInvalidConfigEnv({
  httpPath,
  httpPathRaw,
  serverHostname,
  serverHostnameRaw,
}: {
  httpPath?: string;
  httpPathRaw?: string;
  serverHostname?: string;
  serverHostnameRaw?: string;
}) {
  const invalidEnv: string[] = [];

  if (serverHostnameRaw && !serverHostname) {
    invalidEnv.push(ENV_KEYS.serverHostname);
  }

  if (httpPathRaw && !httpPath) {
    invalidEnv.push(ENV_KEYS.httpPath);
  }

  return invalidEnv;
}

function getMissingConfigEnv({
  httpPathRaw,
  serverHostnameRaw,
  token,
}: {
  httpPathRaw?: string;
  serverHostnameRaw?: string;
  token?: string;
}) {
  const missingEnv: string[] = [];

  if (!serverHostnameRaw) {
    missingEnv.push(ENV_KEYS.serverHostname);
  }

  if (!httpPathRaw) {
    missingEnv.push(ENV_KEYS.httpPath);
  }

  if (!token) {
    missingEnv.push(ENV_KEYS.token);
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

function toSqlStringLiteral(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

async function closeQuietly(
  resource: { close: () => Promise<unknown> } | undefined,
  label: string,
) {
  try {
    await resource?.close();
  } catch (error) {
    console.error(`Failed to close Databricks SQL ${label}`, error);
  }
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export class DatabricksResponseError extends Error {
  constructor(context: string, reason: string) {
    super(`${context} returned ${reason}`);
    this.name = "DatabricksResponseError";
  }
}
