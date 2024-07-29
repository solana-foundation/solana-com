import { useCallback, useEffect, useState } from "react";
import { makeRPCCall } from "../utils/rpcUtils";

/**
 * After how many time the performance updates should be queried.
 *
 * @type {number}
 */
export const PERF_UPDATE_SEC = 5;

/**
 * How long back should be queried.
 * @type {number}
 */
export const SAMPLE_HISTORY_HOURS = 6;

/**
 * Current transaction costs.
 *
 * @type {string}
 */
export const TRANSACTION_COST = "$0.00025";

/**
 * The JSON-RPC Mainnet-Endpoint to query stats from in Preview / Production.
 *
 * @type {string}
 */
export const MAINNET_ENDPOINT = "https://explorer-api.mainnet-beta.solana.com";
/**
 * The JSON-RPC Endpoint to query stats from in Development.
 *
 * @type {string}
 */
export const INTERNAL_MAINNET_ENDPOINT = "";

// Test for AbortController support.
const isAbortControllerSupported =
  typeof window !== "undefined" && window.hasOwnProperty("AbortController");
const noOp = () => null;

/**
 * Initializes an AbortController if supported.
 *
 * @returns {AbortController|{abort: (function(): null), signal: {}}}
 */
const initAbortController = () =>
  isAbortControllerSupported
    ? new AbortController()
    : { abort: noOp, signal: {} };

const isDevelopment = process?.env?.NODE_ENV === "development" || false;

/**
 * Hook to return current transaction statistics from the JSON-RPC endpoint.
 *
 * @param {boolean}   visible                   Only fire new queries when visible.
 * @param {number}    performanceUpdateSeconds  Delay before next query.
 * @param {number}    sampleHistoryHours        How many hours (60min.) the query should go back.
 * @param {boolean}   getLiveTransactionCount
 * @param {boolean}   getCurrentValidatorNodes
 * @returns {{availableStats: boolean, avgTps: number, validators: number, totalTransactionCount: number}}
 */
export const useTransactionStats = ({
  visible = false,
  performanceUpdateSeconds,
  sampleHistoryHours,
  getLiveTransactionCount = true,
  getCurrentValidatorNodes = true,
}) => {
  const [availableStats, setAvailableStats] = useState(false);
  const [avgTps, setAvgTps] = useState(0);
  const [totalTransactionCount, setTotalTransactionCount] = useState(0);
  const [validators, setValidators] = useState(0);

  const getRPCData = useCallback(
    async (getValidatorNodes, getTransactionCount, abortSignal) => {
      if (!visible) {
        if (isDevelopment) {
          console.debug("not visible, or homepage exit");
        }
        return;
      }
      try {
        // Do *not* batch these queries.
        // Batching has been disabled on the homepage's API endpoint.
        const rpcNodeURL = isDevelopment
          ? INTERNAL_MAINNET_ENDPOINT
          : MAINNET_ENDPOINT;
        if (rpcNodeURL) {
          await Promise.all([
            (async () => {
              const recentPerformanceSamples = await makeRPCCall({
                abortSignal,
                method: "getRecentPerformanceSamples",
                params: [60 * sampleHistoryHours],
                rpcNodeURL,
              });
              // Calculate transactions per second for each sample.
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
              // Use latest sample as average transactions per second.
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

        isDevelopment && console.error("error: ", error);
      }
    },
    [sampleHistoryHours, visible],
  );

  // Load dynamic statistics only when the component is visible.
  useEffect(() => {
    // Get average transactions per second & validator node count
    // (abort controlled when unmounted, so no state update will happen).
    const abortController = initAbortController();
    if (visible) {
      getRPCData(
        getCurrentValidatorNodes,
        getLiveTransactionCount,
        abortController.signal,
      );
    }
    // Set an interval to call JSON-RPC periodically.
    const interval = setInterval(() => {
      getRPCData(false, getLiveTransactionCount, abortController.signal);
    }, performanceUpdateSeconds * 1000);
    return () => {
      abortController.abort();
      // Clear interval to prevent multiple calls to setInterval.
      if (interval) {
        clearInterval(interval);
      }
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
  };
};
