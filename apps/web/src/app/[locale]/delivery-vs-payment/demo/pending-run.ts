import type { CompletedRun } from "./demo-state";

const STORAGE_KEY = "dvp-demo-pending-v1";
const RECEIPT_KEY = "dvp-demo-recovery-receipt-v1";

export type RecoveryReceipt = {
  trade: string;
  refundSignature?: string;
  message: string;
};

export function savePendingRun(run: CompletedRun): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(run, (_, value) =>
      typeof value === "bigint" ? { bigint: value.toString() } : value,
    ),
  );
}

export function loadPendingRun(): CompletedRun | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const run = JSON.parse(stored, (_, value) =>
      value && typeof value === "object" && typeof value.bigint === "string"
        ? BigInt(value.bigint)
        : value,
    ) as CompletedRun;
    if (
      !run.roles ||
      !run.mints ||
      !run.terms ||
      !run.dvpAddresses ||
      !run.stages
    )
      throw new Error("Incomplete saved demo");
    return run;
  } catch {
    // Keep the role keys even if a checkpoint is corrupt: they may still
    // authorize a trade created before the browser wrote this checkpoint.
    return null;
  }
}

export function clearPendingRun(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function saveRecoveryReceipt(receipt: RecoveryReceipt): void {
  localStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt));
}

export function loadRecoveryReceipt(): RecoveryReceipt | null {
  try {
    const stored = localStorage.getItem(RECEIPT_KEY);
    if (!stored) return null;
    const receipt = JSON.parse(stored) as RecoveryReceipt;
    return receipt.trade && receipt.message ? receipt : null;
  } catch {
    return null;
  }
}

export function clearRecoveryReceipt(): void {
  localStorage.removeItem(RECEIPT_KEY);
}
