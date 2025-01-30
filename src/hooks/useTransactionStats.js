import { useCallback, useEffect, useState } from "react";
import { makeRPCCall } from "../utils/rpcUtils";

// Constants for performance and sample history
export const PERF_UPDATE_SEC = 5; // Performance update interval in seconds
export const SAMPLE_HISTORY_HOURS = 6; // Hours to query for historical data

// RPC Node URL
const rpcNodeURL = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
if (!rpcNodeURL) {
  console.warn("Warning: NEXT_PUBLIC_RPC_ENDPOINT is not set.");
}

// Check for AbortController support
const isAbortControllerSupported =
  typeof window !== "undefined" && window.hasOwnProperty("AbortController");
const noOp = () => null;

// Initializes an AbortController if supported
const initAbortController = () =>
  isAbortControllerSupported
    ? new AbortController()
    : { abort: noOp, signal: {} };

/**
 * Fetches the superminority count.
 *
 * @returns {Promise<number>} The count of superminority validators.
 */
export const fetchSuperminority = async () => {
  try {
    const voteAccounts = await makeRPCCall({
      method: "getVoteAccounts",
      rpcNodeURL,
    });

    // Sort validators by stake in ascending order
    const sortedValidators = voteAccounts.result.current.sort((a, b) => {
      const diff = BigInt(b.activatedStake) - BigInt(a.activatedStake);
      if (diff > 0) return 1;
      else if (diff < 0) return -1;
      else return 0;
    });

    // Calculate total stake from sorted validators
    const totalStake = sortedValidators.reduce(
      (sum, validator) => sum + BigInt(validator.activatedStake),
      BigInt(0),
    );

    // Calculate one-third of the total stake
    const oneThirdStake = totalStake / BigInt(3);
    let cumulativeStake = BigInt(0);
    let superminorityCount = 0;

    // Count superminority
    for (const validator of sortedValidators) {
      if (cumulativeStake > oneThirdStake) break;
      cumulativeStake += BigInt(validator.activatedStake);
      superminorityCount++;
    }

    return superminorityCount;
  } catch (error) {
    console.warn("Error fetching superminority:", error);
    return null;
  }
};

/**
 * Hook to return current transaction statistics from the JSON-RPC endpoint.
 *
 * @param {boolean} visible                   Only fire new queries when visible.
 * @param {number} performanceUpdateSeconds   Delay before next query.
 * @param {number} sampleHistoryHours         How many hours (60min.) the query should go back.
 * @param {boolean} getLiveTransactionCount
 * @param {boolean} getCurrentValidatorNodes
 * @returns {{availableStats: boolean, avgTps: number, validators: number, totalTransactionCount: number, superminority: number}}
 */
export const useTransactionStats = ({
  visible,
  performanceUpdateSeconds,
  sampleHistoryHours,
  getLiveTransactionCount = true,
  getCurrentValidatorNodes = true,
}) => {
  const [availableStats, setAvailableStats] = useState(false);
  const [avgTps, setAvgTps] = useState(0);
  const [totalTransactionCount, setTotalTransactionCount] = useState(0);
  const [validators, setValidators] = useState(0);
  const [superminority, setSuperminority] = useState(null);

  const getRPCData = useCallback(
    async (getValidatorNodes, getTransactionCount, abortSignal) => {
      try {
        if (rpcNodeURL) {
          await Promise.all([
            (async () => {
              const recentPerformanceSamples = await makeRPCCall({
                abortSignal,
                method: "getRecentPerformanceSamples",
                params: [60 * sampleHistoryHours],
                rpcNodeURL,
              });
              // Calculate average transactions per second
              const short = recentPerformanceSamples.result.reduce(
                (shortResults, sample) => {
                  if (sample.numTransactions !== 0) {
                    shortResults.push(
                      sample.numTransactions / sample.samplePeriodSecs,
                    );
                  }
                  return shortResults;
                },
                [],
              );
              const avgTps = Math.round(short[0]);
              setAvgTps(avgTps);
              setAvailableStats(true);
            })(),
            (async () => {
              if (!getValidatorNodes) {
                return;
              }
              const voteAccounts = await makeRPCCall({
                abortSignal,
                method: "getVoteAccounts",
                rpcNodeURL,
              });
              setValidators(voteAccounts.result.current.length);
              setAvailableStats(true);
            })(),
            (async () => {
              if (!getTransactionCount) {
                return;
              }
              const transactionCount = await makeRPCCall({
                abortSignal,
                method: "getTransactionCount",
                rpcNodeURL,
              });
              setTotalTransactionCount(transactionCount.result);
              setAvailableStats(true);
            })(),
          ]);
        }
      } catch (error) {
        if (error.name === "AbortError" || error.name === "TypeError") {
          return;
        }
        console.error("Error fetching RPC data:", error);
      }
    },
    [sampleHistoryHours],
  );

  // Load statistics only when the component is visible
  useEffect(() => {
    const abortController = initAbortController();
    if (visible) {
      getRPCData(
        getCurrentValidatorNodes,
        getLiveTransactionCount,
        abortController.signal,
      );

      // Fetch superminority count
      const fetchSuperminorityData = async () => {
        const count = await fetchSuperminority();
        setSuperminority(count);
      };
      fetchSuperminorityData();
    }

    const interval = setInterval(() => {
      getRPCData(false, getLiveTransactionCount, abortController.signal);
    }, performanceUpdateSeconds * 1000);

    return () => {
      abortController.abort();
      clearInterval(interval);
    };
  }, [
    visible,
    getCurrentValidatorNodes,
    getLiveTransactionCount,
    performanceUpdateSeconds,
    getRPCData,
  ]);

  return {
    availableStats,
    avgTps,
    totalTransactionCount,
    validators,
    superminority,
  };
};
