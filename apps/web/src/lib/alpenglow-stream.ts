export type RpcBlock = {
  blockhash: string;
  signatures: string[];
};

export type BlockRead = {
  slot: number;
  block: RpcBlock | null;
  failed: boolean;
};

export const MAX_SUPPORTED_TRANSACTION_VERSION = 1;

export function blockRequestOptions(commitment: "confirmed" | "finalized") {
  return {
    commitment,
    encoding: "json",
    transactionDetails: "signatures",
    rewards: false,
    maxSupportedTransactionVersion: MAX_SUPPORTED_TRANSACTION_VERSION,
  } as const;
}

export function cursorAfterBlockReads(end: number, reads: BlockRead[]) {
  const firstFailed = reads.find((read) => read.failed || !read.block);
  return firstFailed ? firstFailed.slot - 1 : end;
}

export function shouldReplayCanonicalBlock(
  observedHash: string | undefined,
  canonicalHash: string,
) {
  return observedHash !== canonicalHash;
}
