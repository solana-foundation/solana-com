/**
 * Test-only funding for path examples. Lives outside every #region, so it is
 * never shown on a docs page. Uses the Surfpool cheatcodes over RPC because
 * the Surfnet object lives in the globalSetup process, not in test workers.
 */
import { address, createSolanaRpc, lamports, type Address } from "@solana/kit";
import { createSurfnetCheatcodesRpc } from "@solana/surfpool/kit";

export const RPC_URL = process.env.RPC_URL ?? "http://127.0.0.1:8899";
export const DEVNET_USDC_MINT = address(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
);

const rpc = createSolanaRpc(RPC_URL);
const cheatcodes = createSurfnetCheatcodesRpc(RPC_URL);

/** Airdrop SOL and wait until the balance shows up. */
export async function fundSol(owner: Address, sol = 1): Promise<void> {
  await rpc.requestAirdrop(owner, lamports(BigInt(sol * 1_000_000_000))).send();
  for (let i = 0; i < 40; i++) {
    const { value } = await rpc
      .getBalance(owner, { commitment: "confirmed" })
      .send();
    if (value > 0n) return;
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`airdrop to ${owner} did not land`);
}

/**
 * Give `owner` an associated token account holding `amount` base units of
 * `mint` (creates the ATA when missing). Pass `amount: 0` to just create it.
 */
export async function setTokenBalance(
  owner: Address,
  amount: bigint,
  mint: Address = DEVNET_USDC_MINT,
): Promise<void> {
  await cheatcodes
    .setTokenAccount(owner, mint, { amount, state: "initialized" })
    .send();
}

/**
 * Drop the surfnet's copy of a mainnet account so the next read clones it
 * again. Surfpool clones an account the first time it is read and then keeps
 * that copy, so a price feed read later in a long test run would be stale.
 */
export async function refetchFromMainnet(account: Address): Promise<void> {
  await cheatcodes.resetAccount(account).send();
}
