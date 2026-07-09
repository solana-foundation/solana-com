import { isValidSolanaAddress } from "./public-key";

const SLOTS_PER_EPOCH = 432_000;
export const TARGET_EPOCH = 1000;

export { isValidSolanaAddress };

function rpcUrl(): string {
  const key = process.env.HELIUS_API_KEY;
  if (key) return `https://mainnet.helius-rpc.com/?api-key=${key}`;
  // Local/dev fallback — public RPC is rate-limited, fine for getEpochInfo
  return process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";
}

async function rpc<T>(method: string, params: unknown[] = []): Promise<T> {
  const res = await fetch(rpcUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`RPC ${method} failed: ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`RPC ${method}: ${json.error.message}`);
  return json.result as T;
}

export interface EpochInfo {
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  absoluteSlot: number;
}

export async function getEpochInfo(): Promise<EpochInfo> {
  return rpc<EpochInfo>("getEpochInfo");
}

interface PerfSample {
  numSlots: number;
  samplePeriodSecs: number;
}

/** Average wall-clock milliseconds per slot over the last ~hour. */
export async function getAvgSlotMs(): Promise<number> {
  try {
    const samples = await rpc<PerfSample[]>(
      "getRecentPerformanceSamples",
      [60],
    );
    const slots = samples.reduce((a, s) => a + s.numSlots, 0);
    const secs = samples.reduce((a, s) => a + s.samplePeriodSecs, 0);
    if (slots > 0 && secs > 0) return (secs / slots) * 1000;
  } catch {
    // fall through to default
  }
  return 420; // sensible mainnet default
}

export function epochOfSlot(slot: number): number {
  // Mainnet-beta has no warmup epochs: every epoch is 432,000 slots from genesis.
  return Math.floor(slot / SLOTS_PER_EPOCH);
}

export function slotsUntilEpoch(target: number, info: EpochInfo): number {
  return (target - info.epoch) * SLOTS_PER_EPOCH - info.slotIndex;
}

interface SignatureInfo {
  signature: string;
  slot: number;
  blockTime: number | null;
}

export interface FirstTx {
  signature: string;
  slot: number;
  blockTime: number | null;
  /** True if we hit the pagination cap before reaching the wallet's true first tx. */
  capped: boolean;
  scanned: number;
}

const PAGE_LIMIT = 1000;
const MAX_PAGES = 120; // 120k signatures — beyond this we report a lower bound

/** Walk a wallet's signature history back to its oldest transaction. */
export async function findFirstTransaction(
  address: string,
): Promise<FirstTx | null> {
  let before: string | undefined;
  let oldest: SignatureInfo | null = null;
  let scanned = 0;

  for (let page = 0; page < MAX_PAGES; page++) {
    const batch = await rpc<SignatureInfo[]>("getSignaturesForAddress", [
      address,
      { limit: PAGE_LIMIT, ...(before ? { before } : {}) },
    ]);
    if (batch.length === 0) break;
    scanned += batch.length;
    oldest = batch[batch.length - 1];
    before = oldest.signature;
    if (batch.length < PAGE_LIMIT) {
      return { ...oldest, capped: false, scanned };
    }
  }

  if (!oldest) return null;
  return { ...oldest, capped: true, scanned };
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}
