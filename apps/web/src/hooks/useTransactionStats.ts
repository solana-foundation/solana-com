import { useEffect, useState } from "react";
import type { NetworkPulse } from "@/lib/metrics/network-pulse";

/**
 * Seconds between reads of /api/metrics/network. The route shares one RPC
 * read per 30 seconds across all visitors, so polling faster gains nothing;
 * the counters extrapolate from TPS in between.
 */
export const PERF_UPDATE_SEC = 30;
/** Kept for callers; the server reads the latest performance samples. */
export const SAMPLE_HISTORY_HOURS = 6;

const NETWORK_PULSE_URL = "/api/metrics/network";
const MAX_CONSECUTIVE_FAILURES = 10;

/**
 * Live network counters from the site's cached /api/metrics/network route.
 * Browsers never call RPC directly. Polls only while `visible`.
 */
export const useTransactionStats = ({
  visible,
  performanceUpdateSeconds,
}: {
  visible: boolean;
  performanceUpdateSeconds: number;
  sampleHistoryHours?: number;
  getLiveTransactionCount?: boolean;
  getCurrentValidatorNodes?: boolean;
}): {
  /** True once a read has succeeded; values are zero until then. */
  availableStats: boolean;
  /** True when reads keep failing and polling has stopped. */
  unavailable: boolean;
  avgTps: number;
  totalTransactionCount: number;
  validators: number;
  superminority: number | null;
} => {
  const [availableStats, setAvailableStats] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [avgTps, setAvgTps] = useState(0);
  const [totalTransactionCount, setTotalTransactionCount] = useState(0);
  const [validators, setValidators] = useState(0);
  const [superminority, setSuperminority] = useState<number | null>(null);

  useEffect(() => {
    if (!visible) return;

    const controller = new AbortController();
    let failures = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const load = async () => {
      try {
        const response = await fetch(NETWORK_PULSE_URL, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`${response.status}`);
        const pulse = (await response.json()) as NetworkPulse;
        // A cached read can be up to a window old; advance the count to now.
        const elapsedSeconds = Math.max(
          0,
          (Date.now() - Date.parse(pulse.fetchedAt)) / 1000,
        );
        failures = 0;
        setUnavailable(false);
        setAvgTps(pulse.avgTps);
        setTotalTransactionCount(
          pulse.totalTransactionCount +
            Math.round(pulse.avgTps * elapsedSeconds),
        );
        setValidators(pulse.validators);
        setSuperminority(pulse.nakamotoCoefficient);
        setAvailableStats(true);
      } catch (error) {
        if (controller.signal.aborted) return;
        if (++failures >= MAX_CONSECUTIVE_FAILURES) {
          console.warn("Network stats unavailable; stopped polling.", error);
          clearInterval(interval);
          // Never present the initial zeros as real figures.
          setUnavailable(true);
        }
      }
    };

    load();
    interval = setInterval(load, performanceUpdateSeconds * 1000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [visible, performanceUpdateSeconds]);

  return {
    availableStats,
    unavailable,
    avgTps,
    totalTransactionCount,
    validators,
    superminority,
  };
};
