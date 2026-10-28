"use client";

import { useEffect, useState } from "react";

interface DashboardPollerOptions<T> {
  url: string;
  intervalMs: number;
  maxBackoffMs: number;
  getNextIntervalMs?: (_data: T) => number | null;
}

interface DashboardPollerState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function responseError(payload: unknown, fallback: string): string {
  if (!isRecord(payload)) return fallback;
  return typeof payload.error === "string" ? payload.error : fallback;
}

function jitter(delayMs: number, maximumMs: number): number {
  return Math.min(maximumMs, Math.round(delayMs * (1 + Math.random() * 0.1)));
}

/**
 * Polls one dashboard resource without overlapping requests.
 *
 * The poller pauses while the document is hidden, retains its last successful
 * payload after transient failures, and retries failures with exponential
 * backoff.
 */
export function useDashboardPoller<T>({
  url,
  intervalMs,
  maxBackoffMs,
  getNextIntervalMs,
}: DashboardPollerOptions<T>): DashboardPollerState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let active = true;
    let requestInFlight = false;
    let stopped = false;
    let failures = 0;
    let retryBaseMs = intervalMs;
    let timer: number | null = null;
    let controller: AbortController | null = null;

    function clearTimer() {
      if (timer === null) return;
      window.clearTimeout(timer);
      timer = null;
    }

    function schedule(delayMs: number | null) {
      clearTimer();
      if (!active) return;
      if (delayMs === null) {
        stopped = true;
        return;
      }
      if (document.visibilityState === "hidden") return;

      stopped = false;
      timer = window.setTimeout(
        () => void load(),
        jitter(delayMs, maxBackoffMs),
      );
    }

    async function load() {
      if (!active || requestInFlight || document.visibilityState === "hidden") {
        return;
      }

      requestInFlight = true;
      controller = new AbortController();
      setIsRefreshing(true);
      let nextInterval: number | null = intervalMs;

      try {
        const response = await fetch(url, { signal: controller.signal });
        const payload: unknown = await response.json();
        if (!response.ok) {
          throw new Error(responseError(payload, "Unable to load metrics"));
        }
        if (!isRecord(payload)) {
          throw new Error("The metrics endpoint returned an invalid response");
        }

        const nextData = payload as T;
        failures = 0;
        nextInterval = getNextIntervalMs
          ? getNextIntervalMs(nextData)
          : intervalMs;
        if (nextInterval !== null) retryBaseMs = nextInterval;
        if (active) {
          setData(nextData);
          setError(null);
        }
      } catch (loadError) {
        const aborted =
          loadError instanceof DOMException && loadError.name === "AbortError";
        if (!aborted) {
          failures += 1;
          nextInterval = Math.min(
            maxBackoffMs,
            retryBaseMs * 2 ** Math.max(0, failures - 1),
          );
          if (active) {
            setError(
              loadError instanceof Error
                ? loadError.message
                : "Unable to load metrics",
            );
          }
        }
      } finally {
        requestInFlight = false;
        controller = null;
        if (active) {
          setIsLoading(false);
          setIsRefreshing(false);
          schedule(nextInterval);
        }
      }
    }

    function handleVisibilityChange() {
      clearTimer();
      if (document.visibilityState === "visible" && !stopped) {
        void load();
      }
    }

    setData(null);
    setError(null);
    setIsLoading(true);
    setIsRefreshing(false);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    void load();

    return () => {
      active = false;
      clearTimer();
      controller?.abort();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [getNextIntervalMs, intervalMs, maxBackoffMs, url]);

  return { data, error, isLoading, isRefreshing };
}
