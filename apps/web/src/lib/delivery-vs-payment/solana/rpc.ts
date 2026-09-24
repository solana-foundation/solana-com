import {
  createSolanaRpc,
  type Rpc,
  type SolanaRpcApi,
  type Signature,
} from "@solana/kit";

/**
 * Browser RPC. Every call is POSTed to our same-origin /api/rpc proxy, which
 * forwards to the keyed devnet endpoint server-side (the RPC key never reaches
 * the client). Confirmation is by polling — no websocket subscription needed.
 */
export function makeRpc(): Rpc<SolanaRpcApi> {
  const origin =
    typeof location !== "undefined" ? location.origin : "http://localhost";
  return createSolanaRpc(new URL("/api/dvp-demo/rpc", origin).href);
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
