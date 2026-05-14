import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
const DATABRICKS_UNAVAILABLE_ERROR =
  "The data dashboard is unavailable right now.";

type DatabricksConfig = {
  instanceUrl: string;
  workspaceId: string;
  dashboardId: string;
  servicePrincipalId: string;
  servicePrincipalSecret: string;
  externalViewerId: string;
  externalValue: string;
};

type AccessTokenResponse = {
  access_token: string;
};

type TokenInfoResponse = {
  authorization_details: unknown;
  [key: string]: unknown;
};

type ScopedTokenResponse = {
  token: string;
  instanceUrl: string;
  workspaceId: string;
  dashboardId: string;
};

type ErrorResponse = {
  error: string;
  invalidEnv?: string[];
  missingEnv?: string[];
};

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET() {
  const configResult = getDatabricksConfig();

  if (!configResult.ok) {
    return json<ErrorResponse>(
      {
        error: "The Databricks dashboard is not configured.",
        ...(isProduction()
          ? {}
          : {
              invalidEnv: configResult.invalidEnv,
              missingEnv: configResult.missingEnv,
            }),
      },
      503,
    );
  }

  try {
    const token = await getScopedToken(configResult.config);

    return json<ScopedTokenResponse>({
      token,
      instanceUrl: configResult.config.instanceUrl,
      workspaceId: configResult.config.workspaceId,
      dashboardId: configResult.config.dashboardId,
    });
  } catch (error) {
    console.error("Failed to create Databricks scoped token", error);

    return json<ErrorResponse>(
      {
        error: DATABRICKS_UNAVAILABLE_ERROR,
      },
      502,
    );
  }
}

async function getScopedToken(config: DatabricksConfig) {
  const basicAuth = getBasicAuthHeader(config);
  const oidcTokenUrl = `${config.instanceUrl}/oidc/v1/token`;

  const allApisPayload = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "all-apis",
  });

  const oidcTokenResponse = await databricksJsonRequest<AccessTokenResponse>(
    oidcTokenUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: basicAuth,
      },
      body: allApisPayload,
    },
    isAccessTokenResponse,
    "Databricks all-apis token request",
  );

  const tokenInfoUrl = new URL(
    `${config.instanceUrl}/api/2.0/lakeview/dashboards/${config.dashboardId}/published/tokeninfo`,
  );
  tokenInfoUrl.searchParams.set("external_viewer_id", config.externalViewerId);
  tokenInfoUrl.searchParams.set("external_value", config.externalValue);

  const tokenInfo = await databricksJsonRequest<TokenInfoResponse>(
    tokenInfoUrl.toString(),
    {
      headers: {
        Authorization: `Bearer ${oidcTokenResponse.access_token}`,
      },
    },
    isTokenInfoResponse,
    "Databricks dashboard tokeninfo request",
  );

  const scopedPayload = createScopedTokenPayload(tokenInfo);

  const scopedTokenResponse = await databricksJsonRequest<AccessTokenResponse>(
    oidcTokenUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: basicAuth,
      },
      body: scopedPayload,
    },
    isAccessTokenResponse,
    "Databricks scoped token request",
  );

  return scopedTokenResponse.access_token;
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

async function databricksJsonRequest<T>(
  url: string,
  options: {
    method?: string;
    headers?: HeadersInit;
    body?: URLSearchParams | string;
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

function getDatabricksConfig():
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function json<T>(body: T, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: noStoreHeaders,
  });
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

function isProduction() {
  return process.env.NODE_ENV === "production";
}

class DatabricksRequestError extends Error {
  constructor(context: string, status: number, responseBody: string) {
    super(`${context} failed with HTTP ${status}: ${responseBody}`);
    this.name = "DatabricksRequestError";
  }
}

class DatabricksResponseError extends Error {
  constructor(context: string, reason: string) {
    super(`${context} returned ${reason}`);
    this.name = "DatabricksResponseError";
  }
}
