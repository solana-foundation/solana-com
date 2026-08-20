import { getVercelOidcToken } from "@vercel/oidc";
import {
  ExternalAccountClient,
  GoogleAuth,
  type AuthClient,
} from "google-auth-library";

import type { AmbassadorApplication } from "./validation";

const SHEETS_API_URL = "https://sheets.googleapis.com/v4/spreadsheets";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const HEADER_RANGE = "A1:O1";
const DEFAULT_APPEND_RANGE = "A:O";

const RESPONSE_HEADERS = [
  "Timestamp",
  "Submission ID",
  "Locale",
  "School",
  "Country",
  "Major",
  "Graduation date",
  "Video shipped",
  "Video organized",
  "Build idea",
  "Co-lead name",
  "Co-lead email",
  "Prior ecosystem involvement",
  "Solana Training or Bootcamp",
  "Source",
] as const;

type GoogleSheetsConfig = {
  projectNumber: string;
  poolId: string;
  providerId: string;
  serviceAccountEmail: string;
  sheetId: string;
  appendRange: string;
};

type AppendMetadata = {
  locale: string;
  submissionId: string;
};

let authClient: AuthClient | undefined;

export class UniversityAmbassadorSheetsConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UniversityAmbassadorSheetsConfigurationError";
  }
}

export async function appendUniversityAmbassadorApplication(
  values: AmbassadorApplication,
  metadata: AppendMetadata,
  signal?: AbortSignal,
) {
  const config = getGoogleSheetsConfig();
  const client = await getAuthClient(config);

  await ensureResponseHeaders(config, client, signal);

  const row = [
    new Date().toISOString(),
    metadata.submissionId,
    metadata.locale,
    values.school,
    values.country,
    values.major,
    values.graduation,
    values.videoShipped,
    values.videoOrganized,
    values.buildIdea,
    values.coLeadName,
    values.coLeadEmail,
    values.involvement,
    values.education,
    "university-ambassador",
  ].map(toSafeSheetValue);

  const response = await sheetsRequest(
    config,
    client,
    `/${encodeURIComponent(config.appendRange)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      body: JSON.stringify({
        majorDimension: "ROWS",
        values: [row],
      }),
    },
    signal,
  );

  if (!response.ok) {
    throw new Error(
      `Google Sheets append failed with status ${response.status}`,
    );
  }
}

function getGoogleSheetsConfig(): GoogleSheetsConfig {
  const requiredValues = {
    projectNumber: process.env.GCP_PROJECT_NUMBER,
    poolId: process.env.GCP_WORKLOAD_IDENTITY_POOL_ID,
    providerId: process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID,
    serviceAccountEmail: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
    sheetId: process.env.UNIVERSITY_AMBASSADOR_GOOGLE_SHEET_ID,
  };

  const missingValues = Object.entries(requiredValues)
    .filter(([, value]) => !value?.trim())
    .map(([name]) => name);

  if (missingValues.length > 0) {
    throw new UniversityAmbassadorSheetsConfigurationError(
      `Missing Google Sheets configuration: ${missingValues.join(", ")}`,
    );
  }

  return {
    projectNumber: requiredValues.projectNumber!,
    poolId: requiredValues.poolId!,
    providerId: requiredValues.providerId!,
    serviceAccountEmail: requiredValues.serviceAccountEmail!,
    sheetId: requiredValues.sheetId!,
    appendRange:
      process.env.UNIVERSITY_AMBASSADOR_GOOGLE_SHEET_RANGE?.trim() ||
      DEFAULT_APPEND_RANGE,
  };
}

async function getAuthClient(config: GoogleSheetsConfig) {
  if (authClient) {
    return authClient;
  }

  if (isLocalDevelopment()) {
    authClient = await new GoogleAuth({ scopes: [SHEETS_SCOPE] }).getClient();
    return authClient;
  }

  const client = ExternalAccountClient.fromJSON({
    type: "external_account",
    audience: `//iam.googleapis.com/projects/${config.projectNumber}/locations/global/workloadIdentityPools/${config.poolId}/providers/${config.providerId}`,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    token_url: "https://sts.googleapis.com/v1/token",
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${encodeURIComponent(config.serviceAccountEmail)}:generateAccessToken`,
    scopes: [SHEETS_SCOPE],
    subject_token_supplier: {
      getSubjectToken: async () => getVercelOidcToken(),
    },
  });

  if (!client) {
    throw new UniversityAmbassadorSheetsConfigurationError(
      "Could not create the Google external account client.",
    );
  }

  authClient = client;
  return client;
}

function isLocalDevelopment() {
  return process.env.NODE_ENV === "development" && !process.env.VERCEL;
}

async function ensureResponseHeaders(
  config: GoogleSheetsConfig,
  client: AuthClient,
  signal?: AbortSignal,
) {
  const response = await sheetsRequest(
    config,
    client,
    `/${HEADER_RANGE}`,
    { method: "GET" },
    signal,
  );

  if (!response.ok) {
    throw new Error(
      `Google Sheets header lookup failed with status ${response.status}`,
    );
  }

  const payload = (await response.json()) as {
    values?: unknown[][];
  };
  const existingHeaders = payload.values?.[0] ?? [];

  const hasExpectedHeaders =
    existingHeaders.length === RESPONSE_HEADERS.length &&
    RESPONSE_HEADERS.every(
      (header, index) => existingHeaders[index] === header,
    );

  if (hasExpectedHeaders) {
    return;
  }

  const hasExistingHeaderValues = existingHeaders.some((value) =>
    String(value ?? "").trim(),
  );

  if (hasExistingHeaderValues) {
    throw new UniversityAmbassadorSheetsConfigurationError(
      "The University Ambassador sheet must be initialized with the expected response headers before accepting applications.",
    );
  }

  // This update is idempotent and only touches row 1. Concurrent first
  // submissions can safely write the same headers; INSERT_ROWS appends each
  // application below the header row without overwriting another submission.
  const updateResponse = await sheetsRequest(
    config,
    client,
    `/${HEADER_RANGE}?valueInputOption=RAW`,
    {
      method: "PUT",
      body: JSON.stringify({
        majorDimension: "ROWS",
        values: [RESPONSE_HEADERS],
      }),
    },
    signal,
  );

  if (!updateResponse.ok) {
    throw new Error(
      `Google Sheets header initialization failed with status ${updateResponse.status}`,
    );
  }
}

async function sheetsRequest(
  config: GoogleSheetsConfig,
  client: AuthClient,
  path: string,
  init: RequestInit,
  signal?: AbortSignal,
) {
  const authorizationHeaders = await client.getRequestHeaders();
  const headers = new Headers(authorizationHeaders as HeadersInit);

  if (init.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(
    `${SHEETS_API_URL}/${encodeURIComponent(config.sheetId)}${path}`,
    {
      ...init,
      headers,
      signal,
      cache: "no-store",
    },
  );
}

function toSafeSheetValue(value: string) {
  return /^[=+\-@]/u.test(value) ? `'${value}` : value;
}
