// #region allowlist-remove
// npx tsx allowlist-remove.ts <wallet>
import { address } from "@solana/kit";
import { createRemoveFromAllowlistTransaction } from "@solana/mosaic-sdk";
import { arg, env, loadSigner, rpc, sendMessage } from "./common";

const payer = await loadSigner("tokenization-demo");

// Removes the wallet from the allowlist. The same transaction freezes the
// wallet's associated token account when it exists and is thawed.
await sendMessage(
  await createRemoveFromAllowlistTransaction(
    rpc,
    address(env("MINT")),
    address(arg(1, "the wallet to remove")),
    payer,
  ),
);
// #endregion allowlist-remove
