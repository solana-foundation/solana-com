// #region approve
import type { Address, TransactionSigner } from "@solana/kit";
import {
  AccountState,
  fetchToken,
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstruction,
  getMintToCheckedInstruction,
  getThawAccountInstruction,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { rpc, send } from "./config";

/** Base units as LSF (6 decimals), for printing. */
export const lsf = (amount: bigint) => `${Number(amount) / 1e6} LSF`;

export async function tokenAccountOf(owner: Address, mint: Address) {
  const [ata] = await findAssociatedTokenPda({
    owner,
    mint,
    tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
  });
  return ata;
}

/** Open a holder's token account. With DefaultAccountState it starts frozen. */
export async function openAccount(
  issuer: TransactionSigner,
  mint: Address,
  owner: Address,
) {
  const account = await tokenAccountOf(owner, mint);
  await send(issuer, [
    getCreateAssociatedTokenIdempotentInstruction({
      payer: issuer,
      ata: account,
      owner,
      mint,
      tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
    }),
  ]);
  const { data } = await fetchToken(rpc, account);
  const state = AccountState[data.state];
  console.log("Opened", account, "state:", state);
  return { account, state };
}

/**
 * Approve a holder (after your KYC check): thaw their account with the
 * freeze authority, then optionally issue them `amount` base units.
 */
export async function approveHolder(
  issuer: TransactionSigner,
  mint: Address,
  owner: Address,
  amount = 0n,
) {
  const account = await tokenAccountOf(owner, mint);
  const signature = await send(issuer, [
    getThawAccountInstruction({ account, mint, owner: issuer }),
    ...(amount > 0n
      ? [
          getMintToCheckedInstruction({
            mint,
            token: account,
            mintAuthority: issuer,
            amount,
            decimals: 6,
          }),
        ]
      : []),
  ]);
  const { data } = await fetchToken(rpc, account);
  const state = AccountState[data.state];
  console.log(
    "Approved",
    account,
    "state:",
    state,
    "balance:",
    lsf(data.amount),
  );
  console.log("Signature:", signature);
  return { account, signature, state, balance: data.amount };
}
// #endregion approve
