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
export const DEFAULT_SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";

type AlpenglowRpcEnvironment = {
  SOLANA_RPC_URL?: string;
  NEXT_PUBLIC_RPC_ENDPOINT?: string;
};

export function alpenglowRpcUrl(environment: AlpenglowRpcEnvironment) {
  return (
    environment.SOLANA_RPC_URL?.trim() ||
    environment.NEXT_PUBLIC_RPC_ENDPOINT?.trim() ||
    DEFAULT_SOLANA_RPC_URL
  );
}

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
