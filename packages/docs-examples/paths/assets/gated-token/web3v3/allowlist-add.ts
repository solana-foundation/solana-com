// #region allowlist-add
// npx tsx allowlist-add.ts <wallet>
import {
  findListConfigPda,
  findWalletEntryPda,
  getAddWalletInstruction,
} from "@solana/token-acl-gate-sdk";
import { addressOf, arg, env, loadKeypair, send } from "./common";

// The list authority is the key that created the mint.
const payer = await loadKeypair("tokenization-demo");
const mint = addressOf(env("MINT"));
const wallet = addressOf(arg(1, "the wallet to allowlist"));

// The allowlist is a gate-program account keyed by its authority and the
// mint. Each approved wallet gets its own entry account under that list.
const [listConfig] = await findListConfigPda({
  authority: payer.publicKey.toBase58(),
  seed: mint,
});
const [walletEntry] = await findWalletEntryPda({ listConfig, wallet });

// This adds the entry only. A wallet that already holds a frozen account on
// this mint thaws it through the gate afterwards (see gate.ts).
await send(
  [payer],
  [
    getAddWalletInstruction({
      authority: payer,
      payer,
      listConfig,
      wallet,
      walletEntry,
    }),
  ],
);
// #endregion allowlist-add
