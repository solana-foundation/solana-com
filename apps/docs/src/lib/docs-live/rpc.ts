/**
 * Server-only: the mainnet JSON-RPC calls behind /api/slot-time/tip (the
 * docs live feed). A copy of the parts of apps/web's lib/slot200/rpc.ts it
 * needs, plus getBlockSignatures.
 */
const RPC_TIMEOUT_MS = 10_000;

export class RpcError extends Error {
  constructor(
    method: string,
    message: string,
    readonly code: number | undefined,
  ) {
    super(`RPC ${method}: ${message}`);
    this.name = "RpcError";
  }
}

function rpcUrl(): string {
  // Local/dev fallback — public RPC is rate-limited, fine for these light calls
  return process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";
}

export async function rpc<T>(
  method: string,
  params: unknown[] = [],
): Promise<T> {
  const res = await fetch(rpcUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    cache: "no-store",
    signal: AbortSignal.timeout(RPC_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`RPC ${method} failed: ${res.status}`);
  const json = (await res.json()) as {
    result?: T;
    error?: { code?: number; message: string };
  };
  if (json.error)
    throw new RpcError(method, json.error.message, json.error.code);
  return json.result as T;
}

export interface BlockSignatures {
  blockTime: number | null;
  signatures: string[];
}

/**
 * One confirmed block with only its transaction signatures: tens of KB, not
 * the megabytes of a full block, so the docs live feed can sample a block
 * every second.
 */
export async function getBlockSignatures(
  slot: number,
): Promise<BlockSignatures | null> {
  return rpc<BlockSignatures | null>("getBlock", [
    slot,
    {
      transactionDetails: "signatures",
      rewards: false,
      commitment: "confirmed",
      maxSupportedTransactionVersion: 1,
    },
  ]);
}

export async function getConfirmedSlot(): Promise<number> {
  return rpc<number>("getSlot", [{ commitment: "confirmed" }]);
}
