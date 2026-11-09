// #region freeze
// npx tsx freeze.ts <wallet>
import { address } from "@solana/kit";
import { getFreezeWalletTransaction } from "@solana/mosaic-sdk";
import { arg, env, loadSigner, rpc, sendMessage } from "./common";

// The Token ACL config authority is the key that created the mint.
const payer = await loadSigner("tokenization-demo");

// Freezes the wallet's associated token account through Token ACL.
await sendMessage(
  await getFreezeWalletTransaction({
    rpc,
    payer,
    authority: payer,
    wallet: address(arg(1, "the wallet to freeze")),
    mint: address(env("MINT")),
  }),
);
// #endregion freeze
