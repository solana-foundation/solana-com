// #region allowlist-remove
// npx tsx allowlist-remove.ts <wallet>
import { address, type Instruction } from "@solana/kit";
import {
  AccountState,
  fetchMaybeToken,
  findAssociatedTokenPda,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { findMintConfigPda, getFreezeInstruction } from "@solana/token-acl-sdk";
import {
  findListConfigPda,
  findWalletEntryPda,
  getRemoveWalletInstruction,
} from "@solana/token-acl-gate-sdk";
import { arg, env, loadSigner, rpc, send } from "./common";

const payer = await loadSigner("tokenization-demo");
const mint = address(env("MINT"));
const wallet = address(arg(1, "the wallet to remove"));
const [listConfig] = await findListConfigPda({
  authority: payer.address,
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
const account = await fetchMaybeToken(rpc, tokenAccount);
if (account.exists && account.data.state !== AccountState.Frozen) {
  const [mintConfig] = await findMintConfigPda({ mint });
  instructions.push(
    getFreezeInstruction({ authority: payer, mint, tokenAccount, mintConfig }),
  );
}
await send(payer, instructions);
// #endregion allowlist-remove
