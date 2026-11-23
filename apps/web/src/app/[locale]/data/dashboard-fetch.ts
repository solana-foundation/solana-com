import {
  isRpcLatencyFiltersResponse,
  type DataApiResponse,
} from "./data-config";
import type { DataFetchErrorMessages } from "./dashboard-types";
import { isStablecoinCoverageResponse } from "./stablecoin-coverage-data";

type DataErrorPayload = {
  detail?: string;
  error?: string;
};

export function fetchData(url: string, errorMessages: DataFetchErrorMessages) {
  return fetchValidated(url, errorMessages, isDataApiResponse);
}

export function fetchStablecoinCoverage(
  url: string,
  errorMessages: DataFetchErrorMessages,
) {
  return fetchValidated(url, errorMessages, isStablecoinCoverageResponse);
}

async function fetchValidated<T>(
  url: string,
  errorMessages: DataFetchErrorMessages,
  isValid: (value: unknown) => value is T,
) {
  const response = await fetch(url);
  const payload: unknown = await readDataPayload(response, errorMessages);

  if (!response.ok) {
    throw new Error(
      getDataFetchErrorMessage(
        payload as DataErrorPayload | DataApiResponse | null,
        errorMessages,
      ),
    );
  }

  if (!isValid(payload)) {
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
