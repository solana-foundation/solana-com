import "server-only";

import { tableFromIPC } from "apache-arrow";

const ENV_KEYS = {
  instanceUrl: "DATABRICKS_INSTANCE_URL",
  workspaceId: "DATABRICKS_WORKSPACE_ID",
  dashboardId: "DATABRICKS_DASHBOARD_ID",
  servicePrincipalId: "DATABRICKS_SERVICE_PRINCIPAL_ID",
  servicePrincipalSecret: "DATABRICKS_SERVICE_PRINCIPAL_SECRET",
} as const;

const OPTIONAL_ENV_KEYS = {
  externalViewerId: "DATABRICKS_EXTERNAL_VIEWER_ID",
  externalValue: "DATABRICKS_EXTERNAL_VALUE",
} as const;

const DEFAULT_EXTERNAL_VIEWER_ID = "public-dashboard-viewer";
const DEFAULT_EXTERNAL_VALUE = "public";
const METRICS_BY_PROVIDER_REF_ID = "03b55d91";
const QUERY_BYTE_LIMIT = 100_000_000;
const QUERY_ROW_LIMIT = 100_000;

export type DatabricksConfig = {
  instanceUrl: string;
  workspaceId: string;
  dashboardId: string;
  servicePrincipalId: string;
  servicePrincipalSecret: string;
  externalViewerId: string;
  externalValue: string;
};

export type DatabricksMetricRow = {
  date: string;
  metricName: string;
  unit: string;
  providerName: string;
  value: number;
};

type AccessTokenResponse = {
  access_token: string;
};

type TokenInfoResponse = {
  authorization_details: unknown;
  [key: string]: unknown;
};

type PublishedDashboardResponse = {
  published_dashboard: {
    name: string;
    revision_id: string;
    revision_create_time?: {
      seconds?: number;
      nanos?: number;
    };
    datasets: Array<{
      name: string;
      customer_ref_id?: string;
      display_name?: string;
    }>;
  };
};

type PublishedQueryResponse = {
  data: Array<{
    status: {
      success?: {
        data_token: string;
        truncated?: boolean;
        partition_info?: Array<{
          id?: string;
          row_count?: number;
        }>;
      };
      error?: {
        message?: string;
        error_code?: string;
      };
    };
  }>;
};

export function getDatabricksConfig():
  | { ok: true; config: DatabricksConfig }
  | { ok: false; invalidEnv: string[]; missingEnv: string[] } {
  const rawConfig = {
    instanceUrl: readEnv(ENV_KEYS.instanceUrl),
    workspaceId: readEnv(ENV_KEYS.workspaceId),
    dashboardId: readEnv(ENV_KEYS.dashboardId),
    servicePrincipalId: readEnv(ENV_KEYS.servicePrincipalId),
    servicePrincipalSecret: readEnv(ENV_KEYS.servicePrincipalSecret),
  };

  const missingEnv = Object.entries(rawConfig)
    .filter(([, value]) => !value)
    .map(([key]) => ENV_KEYS[key as keyof typeof rawConfig]);

  const invalidEnv: string[] = [];
  const instanceUrl = rawConfig.instanceUrl
    ? normalizeInstanceUrl(rawConfig.instanceUrl)
    : undefined;

  if (rawConfig.instanceUrl && !instanceUrl) {
    invalidEnv.push(ENV_KEYS.instanceUrl);
  }

  if (missingEnv.length > 0 || invalidEnv.length > 0) {
    return { ok: false, invalidEnv, missingEnv };
  }

  return {
    ok: true,
    config: {
      instanceUrl: instanceUrl as string,
      workspaceId: rawConfig.workspaceId as string,
      dashboardId: rawConfig.dashboardId as string,
      servicePrincipalId: rawConfig.servicePrincipalId as string,
      servicePrincipalSecret: rawConfig.servicePrincipalSecret as string,
      externalViewerId:
        readEnv(OPTIONAL_ENV_KEYS.externalViewerId) ??
        DEFAULT_EXTERNAL_VIEWER_ID,
      externalValue:
        readEnv(OPTIONAL_ENV_KEYS.externalValue) ?? DEFAULT_EXTERNAL_VALUE,
    },
  };
}

export async function getScopedDashboardToken(config: DatabricksConfig) {
  const allApisToken = await getAllApisAccessToken(config);
  const tokenInfo = await getPublishedDashboardTokenInfo(config, allApisToken);
  const scopedPayload = createScopedTokenPayload(tokenInfo);

  const scopedTokenResponse = await databricksJsonRequest<AccessTokenResponse>(
    `${config.instanceUrl}/oidc/v1/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: getBasicAuthHeader(config),
      },
      body: scopedPayload,
    },
    isAccessTokenResponse,
    "Databricks scoped token request",
  );

  return scopedTokenResponse.access_token;
}

export async function getPublishedDashboardMetricRows(
  config: DatabricksConfig,
) {
  const scopedToken = await getScopedDashboardToken(config);
  const publishedDashboard = await getPublishedDashboard(config, scopedToken);
  const datasetName = getMetricsDatasetName(publishedDashboard);
  const queryResponse = await runPublishedDashboardQuery({
    config,
    datasetName,
    dashboardName: publishedDashboard.published_dashboard.name,
    revisionId: publishedDashboard.published_dashboard.revision_id,
    scopedToken,
  });

  const success = queryResponse.data[0]?.status.success;

  if (!success) {
    const error = queryResponse.data[0]?.status.error;
    throw new DatabricksResponseError(
      "Databricks published dashboard query",
      error?.message ?? error?.error_code ?? "missing-success-status",
    );
  }

  const partitions = success.partition_info?.length
    ? success.partition_info
    : [{ id: "0" }];
  const rows: DatabricksMetricRow[] = [];

  for (const [partitionIndex] of partitions.entries()) {
    const partitionRows = await getPublishedDashboardQueryRows({
      config,
      dashboardName: publishedDashboard.published_dashboard.name,
      revisionId: publishedDashboard.published_dashboard.revision_id,
      scopedToken,
      dataToken: success.data_token,
      partitionIndex,
    });

    rows.push(...partitionRows);
  }

  return {
    rows,
    truncated: Boolean(success.truncated),
    revisionId: publishedDashboard.published_dashboard.revision_id,
    revisionCreatedAt: timestampToISOString(
      publishedDashboard.published_dashboard.revision_create_time,
    ),
  };
}

async function getAllApisAccessToken(config: DatabricksConfig) {
  const allApisPayload = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "all-apis",
  });

  const oidcTokenResponse = await databricksJsonRequest<AccessTokenResponse>(
    `${config.instanceUrl}/oidc/v1/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: getBasicAuthHeader(config),
      },
      body: allApisPayload,
    },
    isAccessTokenResponse,
    "Databricks all-apis token request",
  );

  return oidcTokenResponse.access_token;
}

async function getPublishedDashboardTokenInfo(
  config: DatabricksConfig,
  accessToken: string,
) {
  const tokenInfoUrl = new URL(
    `${config.instanceUrl}/api/2.0/lakeview/dashboards/${config.dashboardId}/published/tokeninfo`,
  );
  tokenInfoUrl.searchParams.set("external_viewer_id", config.externalViewerId);
  tokenInfoUrl.searchParams.set("external_value", config.externalValue);

  return databricksJsonRequest<TokenInfoResponse>(
    tokenInfoUrl.toString(),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    isTokenInfoResponse,
    "Databricks dashboard tokeninfo request",
  );
}

async function getPublishedDashboard(
  config: DatabricksConfig,
  scopedToken: string,
) {
  return databricksJsonRequest<PublishedDashboardResponse>(
    `${config.instanceUrl}/api/2.0/lakeview/dashboards/${config.dashboardId}/published/embedded`,
    {
      headers: {
        Authorization: `Bearer ${scopedToken}`,
      },
    },
    isPublishedDashboardResponse,
    "Databricks published dashboard metadata request",
  );
}

async function runPublishedDashboardQuery({
  config,
  datasetName,
  dashboardName,
  revisionId,
  scopedToken,
}: {
  config: DatabricksConfig;
  datasetName: string;
  dashboardName: string;
  revisionId: string;
  scopedToken: string;
}) {
  return databricksJsonRequest<PublishedQueryResponse>(
    `${config.instanceUrl}/api/2.0/lakeview-query/query/published`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${scopedToken}`,
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        queries: [
          {
            name: "metrics-by-provider",
            dataset_name: datasetName,
            query_context: {
              trigger_details: {
                ui_details: { is_embedded: true },
                interaction_id: "solana-data-page",
              },
              row_limit: QUERY_ROW_LIMIT,
              byte_limit: QUERY_BYTE_LIMIT,
              parameter_selections: [],
              cache_semantics: 0,
            },
            describe: false,
          },
        ],
        dashboard_name: dashboardName,
        dashboard_revision_id: revisionId,
        query_execution_options: { wait_timeout: "30s" },
      }),
    },
    isPublishedQueryResponse,
    "Databricks published dashboard query request",
  );
}

async function getPublishedDashboardQueryRows({
  config,
  dashboardName,
  revisionId,
  scopedToken,
  dataToken,
  partitionIndex,
}: {
  config: DatabricksConfig;
  dashboardName: string;
  revisionId: string;
  scopedToken: string;
  dataToken: string;
  partitionIndex: number;
}) {
  const resultUrl = new URL(
    `${config.instanceUrl}/api/2.0/lakeview-query/query-results/${dataToken}`,
  );
  resultUrl.searchParams.set("dashboard_name", dashboardName);
  resultUrl.searchParams.set("dashboard_revision_id", revisionId);
  resultUrl.searchParams.set("format", "arrows");
  resultUrl.searchParams.set("partition_index", String(partitionIndex));
  resultUrl.searchParams.set("o", config.workspaceId);

  const response = await fetch(resultUrl, {
    headers: {
      Authorization: `Bearer ${scopedToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new DatabricksRequestError(
      "Databricks published dashboard query result request",
      response.status,
      await response.text(),
    );
  }

  const table = tableFromIPC(Buffer.from(await response.arrayBuffer()));
  const fields = table.schema.fields.map((field) => field.name);
  const rows: DatabricksMetricRow[] = [];

  for (let rowIndex = 0; rowIndex < table.numRows; rowIndex += 1) {
    const row = table.get(rowIndex);
    const record = Object.fromEntries(
      fields.map((field) => [field, row?.[field]]),
    );
    const metricRow = toMetricRow(record);

    if (metricRow) {
      rows.push(metricRow);
    }
  }

  return rows;
}

function getMetricsDatasetName(response: PublishedDashboardResponse) {
  const dataset = response.published_dashboard.datasets.find(
    (item) => item.customer_ref_id === METRICS_BY_PROVIDER_REF_ID,
  );

  if (!dataset) {
    throw new DatabricksResponseError(
      "Databricks published dashboard metadata request",
      "missing metrics-by-provider dataset",
    );
  }

  return dataset.name;
}

function createScopedTokenPayload(tokenInfo: TokenInfoResponse) {
  const payload = new URLSearchParams({
    grant_type: "client_credentials",
    authorization_details: JSON.stringify(tokenInfo.authorization_details),
  });

  for (const [key, value] of Object.entries(tokenInfo)) {
    if (key === "authorization_details" || value == null) {
      continue;
    }

    payload.set(key, stringifySearchParamValue(value));
  }

  return payload;
}

export async function databricksJsonRequest<T>(
  url: string,
  options: {
    method?: string;
    headers?: HeadersInit;
    body?: BodyInit | null;
  },
  isExpectedResponse: (value: unknown) => value is T,
  context: string,
) {
  const response = await fetch(url, {
    ...options,
    cache: "no-store",
  });
  const text = await response.text();

  if (!response.ok) {
    throw new DatabricksRequestError(context, response.status, text);
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new DatabricksResponseError(context, "non-json-response");
  }

  if (!isExpectedResponse(data)) {
    throw new DatabricksResponseError(context, "unexpected-response-shape");
  }

  return data;
}

function toMetricRow(
  record: Record<string, unknown>,
): DatabricksMetricRow | null {
  const date = normalizeArrowDate(record.date);
  const metricName = record.metric_name;
  const unit = record.unit;
  const providerName = record.provider_name;
  const value = record.value;

  if (
    !date ||
    typeof metricName !== "string" ||
    typeof unit !== "string" ||
    typeof providerName !== "string" ||
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return null;
  }

  return {
    date,
    metricName,
    unit,
    providerName,
    value,
  };
}

function normalizeArrowDate(value: unknown) {
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

function getBasicAuthHeader(config: DatabricksConfig) {
  const credentials = `${config.servicePrincipalId}:${config.servicePrincipalSecret}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

function isAccessTokenResponse(value: unknown): value is AccessTokenResponse {
  return isRecord(value) && typeof value.access_token === "string";
}

function isTokenInfoResponse(value: unknown): value is TokenInfoResponse {
  return isRecord(value) && "authorization_details" in value;
}

function isPublishedDashboardResponse(
  value: unknown,
): value is PublishedDashboardResponse {
  if (!isRecord(value) || !isRecord(value.published_dashboard)) {
    return false;
  }

  const dashboard = value.published_dashboard;

  return (
    typeof dashboard.name === "string" &&
    typeof dashboard.revision_id === "string" &&
    Array.isArray(dashboard.datasets)
  );
}

function isPublishedQueryResponse(
  value: unknown,
): value is PublishedQueryResponse {
  return isRecord(value) && Array.isArray(value.data);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeInstanceUrl(value: string) {
  const normalizedValue = value.replace(/\/+$/, "");

  try {
    const url = new URL(normalizedValue);
    return url.protocol === "http:" || url.protocol === "https:"
      ? normalizedValue
      : undefined;
  } catch {
    return undefined;
  }
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

function stringifySearchParamValue(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function timestampToISOString(
  timestamp: PublishedDashboardResponse["published_dashboard"]["revision_create_time"],
) {
  if (typeof timestamp?.seconds !== "number") {
    return undefined;
  }

  return new Date(timestamp.seconds * 1000).toISOString();
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export class DatabricksRequestError extends Error {
  constructor(context: string, status: number, responseBody: string) {
    super(`${context} failed with HTTP ${status}: ${responseBody}`);
    this.name = "DatabricksRequestError";
  }
}

export class DatabricksResponseError extends Error {
  constructor(context: string, reason: string) {
    super(`${context} returned ${reason}`);
    this.name = "DatabricksResponseError";
  }
}
