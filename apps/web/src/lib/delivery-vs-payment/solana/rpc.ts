import {
  createSolanaRpcFromTransport,
  type Rpc,
  type RpcTransport,
  type SolanaRpcApi,
  type Signature,
} from "@solana/kit";
import {
  parseJsonWithBigInts,
  stringifyJsonWithBigInts,
  type RpcResponse,
} from "@solana/rpc-spec-types";

/**
 * Browser RPC. Read calls use a same-origin GET proxy because Vercel's preview
 * firewall denies POST requests to /api/dvp-demo/rpc. The keyed devnet URL
 * stays on the server. Confirmation is by polling; no websocket is needed.
 */
export function makeRpc(): Rpc<SolanaRpcApi> {
  const origin =
    typeof location !== "undefined" ? location.origin : "http://localhost";
  const transport: RpcTransport = async <TResponse>({
    payload,
    signal,
  }: Parameters<RpcTransport>[0]) => {
    const url = new URL("/api/dvp-demo/rpc", origin);
    url.searchParams.set("request", stringifyJsonWithBigInts(payload));
    const response = await fetch(url, {
      cache: "no-store",
      credentials: "same-origin",
      signal,
    });
    if (!response.ok) {
      throw new Error(`Demo RPC request failed (${response.status})`);
    }
    return parseJsonWithBigInts(
      await response.text(),
    ) as RpcResponse<TResponse>;
  };
  return createSolanaRpcFromTransport(transport);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Poll getSignatureStatuses until confirmed/finalized or the tx errors. */
export async function confirmSignature(
  rpc: Rpc<SolanaRpcApi>,
  sig: Signature,
  { timeoutMs = 45_000 }: { timeoutMs?: number } = {},
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const { value } = await rpc
      .getSignatureStatuses([sig], { searchTransactionHistory: false })
      .send();
    const st = value[0];
    if (st) {
      if (st.err)
        throw new Error(`Transaction failed: ${JSON.stringify(st.err)}`);
      if (
        st.confirmationStatus === "confirmed" ||
        st.confirmationStatus === "finalized"
      )
        return;
    }
    await sleep(700);
  }
  throw new Error(`Timed out confirming ${sig}`);
}
