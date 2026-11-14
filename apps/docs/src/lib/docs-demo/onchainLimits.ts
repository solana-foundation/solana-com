/**
 * Server-only: fleet-wide daily caps for the devnet wallets behind
 * /api/devnet-airdrop and /api/demo/*, with the chain as the only state.
 *
 * Each route tags its transactions with a memo. Before sending, it reads the
 * sending wallet's recent signatures (getSignaturesForAddress returns each
 * one's memo and block time) and counts its own tag over the last 24 hours.
 * Every serverless instance sees the same count, unlike the in-memory limits
 * in rate-limit.ts. Concurrent requests can overshoot a cap by however many
 * land at once.
 */
import {
  address,
  getUtf8Encoder,
  type Address,
  type Instruction,
  type Rpc,
  type Signature,
  type SolanaRpcApi,
} from "@solana/kit";

const MEMO_PROGRAM = address("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
const DAY_SECONDS = 24 * 60 * 60;
/** getSignaturesForAddress's largest page. */
const PAGE = 1000;
/** Pages read before failing closed: both routes share one wallet. */
const MAX_PAGES = 4;

export const MEMOS = {
  airdrop: "solana.com quickstart airdrop",
  demo: "solana.com docs demo",
} as const;

/** A Memo Program instruction carrying `text`, with no signers. */
export function memoInstruction(text: string): Instruction {
  return {
    programAddress: MEMO_PROGRAM,
    data: getUtf8Encoder().encode(text),
  };
}

/** A positive number from the environment, or `fallback`. */
export function envNumber(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

/**
 * True once `wallet` has sent `cap` transactions tagged `memo` in the last
 * 24 hours. Pages back through the wallet's history and fails closed: if
 * every page read is still inside the window, or a signature has no block
 * time, it counts against the cap.
 */
export async function dailyCapReached(
  rpc: Rpc<SolanaRpcApi>,
  wallet: Address,
  memo: string,
  cap: number,
): Promise<boolean> {
  const since = Math.floor(Date.now() / 1000) - DAY_SECONDS;
  let count = 0;
  let before: Signature | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const recent = await rpc
      .getSignaturesForAddress(wallet, {
        limit: PAGE,
        commitment: "confirmed",
        ...(before ? { before } : {}),
      })
      .send();
    for (const tx of recent) {
      if (tx.blockTime !== null && Number(tx.blockTime) < since) return false;
      // The RPC reports memos as "[length] text".
      if (tx.memo?.includes(memo) && ++count >= cap) return true;
    }
    if (recent.length < PAGE) return false;
    before = recent[recent.length - 1]!.signature;
  }
  return true;
}
