// #region thaw
// npx tsx thaw.ts <wallet>
import { address } from "@solana/kit";
import {
  findAssociatedTokenPda,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { findMintConfigPda, getThawInstruction } from "@solana/token-acl-sdk";
import { arg, env, loadSigner, send } from "./common";

const payer = await loadSigner("tokenization-demo");
const mint = address(env("MINT"));
const [tokenAccount] = await findAssociatedTokenPda({
  mint,
  owner: address(arg(1, "the wallet to thaw")),
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
const [mintConfig] = await findMintConfigPda({ mint });

// The authority thaw. Unlike the permissionless thaw, it does not ask the
// gate.
await send(payer, [
  getThawInstruction({ authority: payer, mint, tokenAccount, mintConfig }),
]);
// #endregion thaw
