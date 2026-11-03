import "server-only";

const DEFAULT_SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";
const REQUEST_TIMEOUT_MS = 10_000;

/** Server-side mainnet RPC; browsers never call RPC for site metrics. */
export async function callSolanaRpc<T>(
  method: string,
  params?: unknown[],
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      process.env.SOLANA_RPC_URL ??
        process.env.NEXT_PUBLIC_RPC_ENDPOINT ??
        DEFAULT_SOLANA_RPC_URL,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        cache: "no-store",
        signal: controller.signal,
      },
    );
    if (!response.ok) {
      throw new Error(`${method} responded ${response.status}`);
    }
    const payload = (await response.json()) as {
      result?: T;
      error?: { message?: string };
    };
    if (payload.error || payload.result === undefined) {
      throw new Error(
        `${method} failed: ${payload.error?.message ?? "no result"}`,
      );
    }
    return payload.result;
  } finally {
    clearTimeout(timeout);
  }
}

export type VoteAccounts = {
  current: { activatedStake: number | string }[];
};
