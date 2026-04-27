import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CONFIG = {
  instanceUrl: "https://dbc-8f4a920c-45cb.cloud.databricks.com",
  workspaceId: "1125560347127367",
  dashboardId: "01f1285fea66194a94ee20d29dac25de",
  servicePrincipalId: "<ID>",
  servicePrincipalSecret: "<SECRET>",
  externalViewerId: "user-1",
  externalValue: "user-1",
};

const requiredConfigKeys = Object.keys(CONFIG) as Array<keyof typeof CONFIG>;

export async function GET() {
  const missing = requiredConfigKeys.filter((key) => {
    return CONFIG[key].startsWith("YOUR_");
  });

  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: `Fill these CONFIG values first: ${missing.join(", ")}`,
      },
      { status: 500 },
    );
  }

  try {
    const token = await getScopedToken();
    return NextResponse.json({
      token,
      instanceUrl: CONFIG.instanceUrl,
      workspaceId: CONFIG.workspaceId,
      dashboardId: CONFIG.dashboardId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown token generation error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function getScopedToken() {
  const basicAuth = Buffer.from(
    `${CONFIG.servicePrincipalId}:${CONFIG.servicePrincipalSecret}`,
  ).toString("base64");

  const allApisPayload = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "all-apis",
  });

  const oidcTokenResponse = await httpRequest<{
    access_token: string;
  }>(`${CONFIG.instanceUrl}/oidc/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: allApisPayload,
  });

  const tokenInfoUrl = new URL(
    `${CONFIG.instanceUrl}/api/2.0/lakeview/dashboards/${CONFIG.dashboardId}/published/tokeninfo`,
  );
  tokenInfoUrl.searchParams.set("external_viewer_id", CONFIG.externalViewerId);
  tokenInfoUrl.searchParams.set("external_value", CONFIG.externalValue);

  const tokenInfo = await httpRequest<{
    authorization_details: unknown;
    [key: string]: unknown;
  }>(tokenInfoUrl.toString(), {
    headers: { Authorization: `Bearer ${oidcTokenResponse.access_token}` },
  });

  const { authorization_details, ...params } = tokenInfo;

  const scopedPayload = new URLSearchParams({
    grant_type: "client_credentials",
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ),
    authorization_details: JSON.stringify(authorization_details),
  });

  const scopedTokenResponse = await httpRequest<{ access_token: string }>(
    `${CONFIG.instanceUrl}/oidc/v1/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: scopedPayload,
    },
  );

  return scopedTokenResponse.access_token;
}

async function httpRequest<T>(
  url: string,
  options: {
    method?: string;
    headers?: HeadersInit;
    body?: URLSearchParams | string;
  } = {},
) {
  const response = await fetch(url, options);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Unexpected non-JSON response from ${url}`);
  }
}
