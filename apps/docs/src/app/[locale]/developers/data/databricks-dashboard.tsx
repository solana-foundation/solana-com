"use client";

import { DatabricksDashboard } from "@databricks/aibi-client";
import { useEffect, useRef, useState } from "react";

const TOKEN_ENDPOINT = "/api/databricks/scoped-token";
const DASHBOARD_LOAD_ERROR =
  "The data dashboard could not be loaded. Try again in a moment.";

type DashboardTokenResponse = {
  token: string;
  instanceUrl: string;
  workspaceId: string;
  dashboardId: string;
};

type DashboardLoadState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; message: string };

type ApiErrorResponse = {
  error?: string;
};

export function DatabricksDashboardEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadState, setLoadState] = useState<DashboardLoadState>({
    status: "loading",
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    let dashboard: DatabricksDashboard | null = null;

    setLoadState({ status: "loading" });
    clearDashboardContainer(containerRef.current);

    const initializeDashboard = async () => {
      try {
        const tokenResponse = await fetchDashboardToken(abortController.signal);

        if (!containerRef.current || abortController.signal.aborted) {
          return;
        }

        dashboard = new DatabricksDashboard({
          instanceUrl: tokenResponse.instanceUrl,
          workspaceId: tokenResponse.workspaceId,
          dashboardId: tokenResponse.dashboardId,
          token: tokenResponse.token,
          container: containerRef.current,
          getNewToken: async () => {
            const nextTokenResponse = await fetchDashboardToken();
            return nextTokenResponse.token;
          },
          colorScheme: "light",
          config: {
            version: 1,
            hideDatabricksLogo: true,
          },
        });

        dashboard.initialize();

        if (!abortController.signal.aborted) {
          setLoadState({ status: "ready" });
        }
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        console.error("Databricks dashboard initialization failed", error);

        setLoadState({
          status: "error",
          message:
            error instanceof DashboardTokenError
              ? error.message
              : DASHBOARD_LOAD_ERROR,
        });
      }
    };

    void initializeDashboard();

    return () => {
      abortController.abort();
      dashboard?.destroy();
    };
  }, [reloadKey]);

  const isLoading = loadState.status === "loading";
  const hasError = loadState.status === "error";

  return (
    <div className="relative min-h-[560px] overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 shadow-sm md:min-h-[640px]">
      <div
        ref={containerRef}
        aria-hidden={hasError}
        className={`h-[min(760px,calc(100vh-220px))] min-h-[560px] w-full bg-white transition-opacity md:min-h-[640px] ${
          isLoading || hasError ? "opacity-0" : "opacity-100"
        }`}
      />

      {isLoading ? <DashboardLoadingState /> : null}

      {hasError ? (
        <DashboardErrorState
          message={loadState.message}
          onRetry={() => setReloadKey((value) => value + 1)}
        />
      ) : null}
    </div>
  );
}

function DashboardLoadingState() {
  return (
    <div
      aria-live="polite"
      className="absolute inset-0 flex flex-col gap-4 bg-white p-6"
      role="status"
    >
      <p className="text-sm font-medium text-zinc-700">
        Loading Solana data dashboard...
      </p>
      <div className="grid flex-1 gap-4 md:grid-cols-3">
        <div className="rounded-md bg-zinc-100" />
        <div className="rounded-md bg-zinc-100" />
        <div className="rounded-md bg-zinc-100" />
        <div className="rounded-md bg-zinc-100 md:col-span-2" />
        <div className="rounded-md bg-zinc-100" />
      </div>
    </div>
  );
}

function DashboardErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-white p-6"
      role="alert"
    >
      <div className="max-w-md rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-900">
        <h2 className="text-base font-semibold text-red-950">
          Dashboard unavailable
        </h2>
        <p className="mt-2 leading-6">{message}</p>
        <button
          className="mt-4 rounded-md border border-red-300 bg-white px-4 py-2 font-medium text-red-950 transition-colors hover:bg-red-100"
          onClick={onRetry}
          type="button"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

async function fetchDashboardToken(signal?: AbortSignal) {
  const response = await fetch(TOKEN_ENDPOINT, {
    cache: "no-store",
    signal,
  });
  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new DashboardTokenError(getApiErrorMessage(payload));
  }

  if (!isDashboardTokenResponse(payload)) {
    throw new DashboardTokenError(DASHBOARD_LOAD_ERROR);
  }

  return payload;
}

function isDashboardTokenResponse(
  value: unknown,
): value is DashboardTokenResponse {
  return (
    isRecord(value) &&
    typeof value.token === "string" &&
    typeof value.instanceUrl === "string" &&
    typeof value.workspaceId === "string" &&
    typeof value.dashboardId === "string"
  );
}

function getApiErrorMessage(payload: unknown) {
  if (isApiErrorResponse(payload) && payload.error) {
    return payload.error;
  }

  return DASHBOARD_LOAD_ERROR;
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    isRecord(value) && (!("error" in value) || typeof value.error === "string")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clearDashboardContainer(container: HTMLDivElement | null) {
  if (container) {
    container.replaceChildren();
  }
}

class DashboardTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DashboardTokenError";
  }
}
