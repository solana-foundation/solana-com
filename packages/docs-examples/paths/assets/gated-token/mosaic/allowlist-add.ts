// #region allowlist-add
// npx tsx allowlist-add.ts <wallet>
import { address } from "@solana/kit";
import { createAddToAllowlistTransaction } from "@solana/mosaic-sdk";
import { arg, env, loadSigner, rpc, sendMessage } from "./common";

// The list authority is the key that created the mint.
const payer = await loadSigner("tokenization-demo");
const mint = address(env("MINT"));
const wallet = address(arg(1, "the wallet to allowlist"));

// Adds the wallet to the allowlist behind the Token ACL gate. If the wallet
// already has a frozen token account, the SDK thaws it in the same
// transaction.
await sendMessage(
  await createAddToAllowlistTransaction(rpc, mint, wallet, payer),
);
// #endregion allowlist-add
