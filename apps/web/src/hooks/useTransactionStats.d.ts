export const PERF_UPDATE_SEC: number;
export const SAMPLE_HISTORY_HOURS: number;

export interface UseTransactionStatsParams {
  visible: boolean;
  performanceUpdateSeconds: number;
  sampleHistoryHours: number;
  getLiveTransactionCount?: boolean;
  getCurrentValidatorNodes?: boolean;
}

export interface UseTransactionStatsReturn {
  availableStats: boolean;
  avgTps: number;
  totalTransactionCount: number;
  validators: number;
  superminority: number | null;
}

export declare function useTransactionStats(
  _params: UseTransactionStatsParams,
): UseTransactionStatsReturn;
