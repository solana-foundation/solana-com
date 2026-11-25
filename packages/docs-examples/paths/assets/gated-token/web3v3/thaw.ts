// #region thaw
// npx tsx thaw.ts <wallet>
import {
  findAssociatedTokenPda,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { findMintConfigPda, getThawInstruction } from "@solana/token-acl-sdk";
import { addressOf, arg, env, loadKeypair, send } from "./common";

// The Token ACL config authority is the key that created the mint.
const payer = await loadKeypair("tokenization-demo");
const mint = addressOf(env("MINT"));
const [tokenAccount] = await findAssociatedTokenPda({
  mint,
  owner: addressOf(arg(1, "the wallet to thaw")),
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
const [mintConfig] = await findMintConfigPda({ mint });

// The authority thaw. Unlike the permissionless thaw, it does not ask the
// gate.
await send(
  [payer],
  [getThawInstruction({ authority: payer, mint, tokenAccount, mintConfig })],
);
// #endregion thaw
