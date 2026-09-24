export type TransactionObserved = {
  type: "transaction_observed";
  signature: string;
  slot: number;
  blockhash?: string;
  observedAt: number;
  programIds: string[];
  success: boolean;
  fee?: number;
  computeUnits?: number;
  indexInBlock?: number;
};

export type BlockConfirmed = {
  type: "block_confirmed";
  slot: number;
  blockhash: string;
  confirmedAt: number;
  transactionCount: number;
};

export type BlockFinalized = {
  type: "block_finalized";
  slot: number;
  blockhash: string;
  finalizedAt: number;
  observedFinalityMs: number;
};

export type BlockOrphaned = {
  type: "block_orphaned";
  slot: number;
  blockhash: string;
  replacedBy: string;
};

export type PerformanceSample = {
  type: "performance_sample";
  sampledAt: number;
  totalTps: number;
  nonVoteTps?: number;
  samplePeriodSeconds: number;
};

export type StreamStatus = {
  type: "stream_status";
  status: "connecting" | "live" | "reconnecting" | "simulated";
  protocol: "tower-bft" | "alpenglow" | "unknown";
  sampled: boolean;
  message?: string;
};

export type AlpenglowEvent =
  | TransactionObserved
  | BlockConfirmed
  | BlockFinalized
  | BlockOrphaned
  | PerformanceSample
  | StreamStatus;

export function signatureSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
