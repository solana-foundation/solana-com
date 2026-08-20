const DEFAULT_SLOT_MS = 400;

function rpcUrl(): string {
  const key = process.env.HELIUS_API_KEY;
  if (key) return `https://mainnet.helius-rpc.com/?api-key=${key}`;
  // Local/dev fallback — public RPC is rate-limited, fine for these light calls
  return process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";
}

/** WebSocket endpoint matching rpcUrl(), for slotSubscribe. */
export function rpcWsUrl(): string {
  const key = process.env.HELIUS_API_KEY;
  if (key) return `wss://mainnet.helius-rpc.com/?api-key=${key}`;
  const custom = process.env.SOLANA_RPC_URL;
  if (custom) return custom.replace(/^http/, "ws");
  return "wss://api.mainnet-beta.solana.com";
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

export interface PerfSample {
  slot: number;
  numSlots: number;
  numNonVoteTransactions?: number;
  numTransactions: number;
  samplePeriodSecs: number;
}

/** Raw performance samples, newest first (one per minute, max 720 = 12h). */
export async function getPerformanceSamples(
  limit: number,
): Promise<PerfSample[]> {
  return rpc<PerfSample[]>("getRecentPerformanceSamples", [limit]);
}

/**
 * Average wall-clock milliseconds per slot, ratio-of-totals over recent
 * samples (never mean-of-gaps — WS/sample delivery is bursty). ~10 minutes
 * keeps the page responsive to a stage activation within one epoch.
 */
export async function getAvgSlotMs(): Promise<number> {
  try {
    const samples = await rpc<PerfSample[]>(
      "getRecentPerformanceSamples",
      [10],
    );
    const slots = samples.reduce((a, s) => a + s.numSlots, 0);
    const secs = samples.reduce((a, s) => a + s.samplePeriodSecs, 0);
    if (slots > 0 && secs > 0) return (secs / slots) * 1000;
  } catch {
    // fall through to default
  }
  return DEFAULT_SLOT_MS;
}

interface ClusterNode {
  pubkey: string;
  version: string | null;
}

export async function getClusterNodes(): Promise<ClusterNode[]> {
  return rpc<ClusterNode[]>("getClusterNodes");
}

interface BlockTx {
  transaction: {
    signatures: string[];
    message: {
      accountKeys: string[];
      instructions: { programIdIndex: number }[];
    };
  };
  meta: {
    err: unknown;
    loadedAddresses?: { writable: string[]; readonly: string[] };
  } | null;
}

export interface SampledBlock {
  blockHeight: number | null;
  blockTime: number | null;
  transactions: BlockTx[];
}

/** Program ids invoked by a transaction's top-level instructions. */
export function txProgramIds(tx: BlockTx): string[] {
  const keys = tx.transaction.message.accountKeys.concat(
    tx.meta?.loadedAddresses?.writable ?? [],
    tx.meta?.loadedAddresses?.readonly ?? [],
  );
  return tx.transaction.message.instructions.map(
    (ix) => keys[ix.programIdIndex],
  );
}

/** One confirmed block with full transactions, for registry classification. */
export async function getBlockFull(slot: number): Promise<SampledBlock | null> {
  return rpc<SampledBlock | null>("getBlock", [
    slot,
    {
      encoding: "json",
      transactionDetails: "full",
      rewards: false,
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    },
  ]);
}

export async function getConfirmedSlot(): Promise<number> {
  return rpc<number>("getSlot", [{ commitment: "confirmed" }]);
}

interface VoteAccount {
  nodePubkey: string;
  activatedStake: number;
}

export async function getCurrentVoteAccounts(): Promise<VoteAccount[]> {
  const res = await rpc<{ current: VoteAccount[] }>("getVoteAccounts", [
    { keepUnstakedDelinquents: false },
  ]);
  return res.current;
}

export async function getSlotLeaders(
  startSlot: number,
  limit: number,
): Promise<string[]> {
  return rpc<string[]>("getSlotLeaders", [startSlot, limit]);
}

/**
 * Parse a gossip version string into an Agave-equivalent [major, minor].
 * Agave reports plain semver ("4.2.1"). Firedancer reports its own scheme
 * with the Agave compatibility level as a trailing numeric segment
 * ("0.1105.40200" or "0.1104.0-rc.40200" → 40200 → 4.2.0).
 */
export function parseAgaveVersion(
  version: string | null | undefined,
): [number, number] | null {
  if (!version) return null;
  try {
    if (version.startsWith("0.")) {
      const segs = version
        .replace(/-rc\./g, ".")
        .split(".")
        .filter((s) => /^\d+$/.test(s));
      const last = segs[segs.length - 1];
      if (last && last.length >= 5) {
        const n = parseInt(last, 10);
        return [Math.floor(n / 10000), Math.floor((n % 10000) / 100)];
      }
      return null;
    }
    const parts = version.split("-")[0].split(".");
    const major = parseInt(parts[0], 10);
    const minor = parseInt(parts[1], 10);
    if (Number.isNaN(major) || Number.isNaN(minor)) return null;
    return [major, minor];
  } catch {
    return null;
  }
}

/** Agave v4.2 is the release carrying all four SIMD-0525 feature gates. */
export function runsUpgradedClient(
  version: string | null | undefined,
): boolean {
  const v = parseAgaveVersion(version);
  return v !== null && (v[0] > 4 || (v[0] === 4 && v[1] >= 2));
}

/**
 * Client family from the gossip version string. Firedancer publishes its own
 * "0.x" scheme; everything semver-shaped is the Agave lineage (gossip alone
 * cannot separate Agave from Jito-Agave — that needs the on-chain validator
 * history program, so this page doesn't claim it).
 */
export function clientFamily(
  version: string | null | undefined,
): "Firedancer" | "Agave lineage" | "Unknown" {
  if (!version) return "Unknown";
  if (version.startsWith("0.")) return "Firedancer";
  if (/^\d+\.\d+/.test(version)) return "Agave lineage";
  return "Unknown";
}
