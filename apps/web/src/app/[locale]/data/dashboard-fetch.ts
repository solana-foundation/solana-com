import {
  isRpcLatencyFiltersResponse,
  type DataApiResponse,
} from "./data-config";
import type { DataFetchErrorMessages } from "./dashboard-types";
import {
  isSendLandingFiltersResponse,
  isSendLandingResponse,
} from "./send-landing-config";

/** 503 when the deployment has no send benchmark credentials. */
export class SendLandingUnavailableError extends Error {
  constructor(readonly status: number) {
    super("Send benchmark data is unavailable");
  }
}

async function fetchSendLanding<T>(
  url: string,
  isValid: (_value: unknown) => _value is T,
) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new SendLandingUnavailableError(response.status);
  const payload: unknown = await response.json();
  if (!isValid(payload)) throw new Error("Invalid send benchmark response");
  return payload;
}

export function fetchSendLandingData(url: string) {
  return fetchSendLanding(url, isSendLandingResponse);
}

export function fetchSendLandingFilters(url: string) {
  return fetchSendLanding(url, isSendLandingFiltersResponse);
}

type DataErrorPayload = {
  detail?: string;
  error?: string;
};

export async function fetchData(
  url: string,
  errorMessages: DataFetchErrorMessages,
) {
  const response = await fetch(url);
  const payload = await readDataPayload(response, errorMessages);

  if (!response.ok) {
    throw new Error(getDataFetchErrorMessage(payload, errorMessages));
  }

  if (!isDataApiResponse(payload)) {
    throw new Error(errorMessages.invalidResponse);
  }

  return payload;
}

export async function fetchRpcFilters(url: string) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("RPC latency filters are unavailable");
  }

  const payload = (await response.json()) as unknown;

  if (!isRpcLatencyFiltersResponse(payload)) {
    throw new Error("RPC latency filters returned an invalid response");
  }

  return payload;
}

async function readDataPayload(
  response: Response,
  errorMessages: DataFetchErrorMessages,
) {
  try {
    return (await response.json()) as DataErrorPayload | DataApiResponse | null;
  } catch {
    if (response.ok) {
      throw new Error(errorMessages.invalidResponse);
    }

    return null;
  }
}

function getDataFetchErrorMessage(
  payload: DataErrorPayload | DataApiResponse | null,
  errorMessages: DataFetchErrorMessages,
) {
  if (payload && "detail" in payload && payload.detail) {
    return `${errorMessages.defaultUnavailable} ${payload.detail}`;
  }

  return errorMessages.defaultUnavailable;
}

function isDataApiResponse(value: unknown): value is DataApiResponse {
  return (
    !!value &&
    typeof value === "object" &&
    "rows" in value &&
    Array.isArray(value.rows)
  );
}
