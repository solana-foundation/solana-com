// #region freeze
// npx tsx freeze.ts <wallet>
import { address } from "@solana/kit";
import {
  findAssociatedTokenPda,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { findMintConfigPda, getFreezeInstruction } from "@solana/token-acl-sdk";
import { arg, env, loadSigner, send } from "./common";

// The Token ACL config authority is the key that created the mint.
const payer = await loadSigner("tokenization-demo");
const mint = address(env("MINT"));
const [tokenAccount] = await findAssociatedTokenPda({
  mint,
  owner: address(arg(1, "the wallet to freeze")),
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
const [mintConfig] = await findMintConfigPda({ mint });

// Token ACL holds the mint's freeze authority; its config authority signs.
await send(payer, [
  getFreezeInstruction({ authority: payer, mint, tokenAccount, mintConfig }),
]);
// #endregion freeze
