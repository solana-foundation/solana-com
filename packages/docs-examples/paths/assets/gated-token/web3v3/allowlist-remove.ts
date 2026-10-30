// #region allowlist-remove
// npx tsx allowlist-remove.ts <wallet>
import type { Instruction } from "@solana/kit";
import { PublicKey } from "@solana/web3.js-v3";
import {
  AccountState,
  findAssociatedTokenPda,
  getTokenDecoder,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { findMintConfigPda, getFreezeInstruction } from "@solana/token-acl-sdk";
import {
  findListConfigPda,
  findWalletEntryPda,
  getRemoveWalletInstruction,
} from "@solana/token-acl-gate-sdk";
import { addressOf, arg, connection, env, loadKeypair, send } from "./common";

const payer = await loadKeypair("tokenization-demo");
const mint = addressOf(env("MINT"));
const wallet = addressOf(arg(1, "the wallet to remove"));
const [listConfig] = await findListConfigPda({
  authority: payer.publicKey.toBase58(),
  seed: mint,
});
const [walletEntry] = await findWalletEntryPda({ listConfig, wallet });
const instructions: Instruction[] = [
  getRemoveWalletInstruction({ authority: payer, listConfig, walletEntry }),
];

// Removing the entry stops future thaws but does not touch an account that is
// already open, so freeze the wallet's token account in the same transaction.
const [tokenAccount] = await findAssociatedTokenPda({
  mint,
  owner: wallet,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
const account = await connection.getAccountInfo(new PublicKey(tokenAccount));
if (
  account &&
  getTokenDecoder().decode(account.data).state !== AccountState.Frozen
) {
  const [mintConfig] = await findMintConfigPda({ mint });
  instructions.push(
    getFreezeInstruction({ authority: payer, mint, tokenAccount, mintConfig }),
  );
}
await send([payer], instructions);
// #endregion allowlist-remove
