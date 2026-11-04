// #region blocked
import {
  isSolanaError,
  type Address,
  type Signature,
  type TransactionSigner,
} from "@solana/kit";
import {
  getPauseInstruction,
  getResumeInstruction,
  getTransferCheckedInstruction,
  isToken2022Error,
  TOKEN_2022_ERROR__ACCOUNT_FROZEN,
} from "@solana-program/token-2022";
import { rpc, send } from "./config";
import { lsf, tokenAccountOf } from "./approve-holder";

export async function transfer(
  from: TransactionSigner,
  mint: Address,
  to: Address,
  amount: bigint,
  options: { skipPreflight?: boolean; feePayer?: TransactionSigner } = {},
) {
  try {
    const signature = await send(
      options.feePayer ?? from,
      [
        getTransferCheckedInstruction({
          source: await tokenAccountOf(from.address, mint),
          mint,
          destination: await tokenAccountOf(to, mint),
          authority: from,
          amount,
          decimals: 6,
        }),
      ],
      options,
    );
    console.log(`Transfer ${lsf(amount)}: confirmed`);
    console.log("Signature:", signature);
    return signature;
  } catch (error) {
    // With preflight, the RPC node simulates the transfer and rejects it with
    // the program's error. With skipPreflight, it lands and fails onchain.
    const cause = isSolanaError(error) ? error.cause : undefined;
    console.log(
      `Transfer ${lsf(amount)}:`,
      options.skipPreflight
        ? "failed onchain"
        : `rejected: ${((cause ?? error) as Error).message}`,
    );
    throw error;
  }
}

/** What a failed transaction did onchain: its error, the program log and the fee. */
export async function failure(signature: Signature) {
  const tx = await rpc
    .getTransaction(signature, {
      commitment: "confirmed",
      encoding: "json",
      maxSupportedTransactionVersion: 0,
    })
    .send();
  return {
    err: tx?.meta?.err,
    log: tx?.meta?.logMessages?.find((l) => l.includes("Error")),
    fee: tx?.meta?.fee,
  };
}

/**
 * A transfer to an account the issuer has not approved fails with Token-2022
 * `AccountFrozen` (custom error 17). Sent with `skipPreflight`, it still lands
 * as a failed transaction and the sender still pays the fee.
 */
export async function sendToUnapproved(
  holder: TransactionSigner,
  mint: Address,
  unapproved: Address,
) {
  try {
    await transfer(holder, mint, unapproved, 1_000_000n, {
      skipPreflight: true,
    });
    throw new Error("expected the transfer to fail");
  } catch (error) {
    const signature = (error as { signature?: Signature }).signature;
    if (!signature) throw error;
    const failed = { signature, ...(await failure(signature)) };
    // `err` holds bigints, which JSON.stringify can't print as they are.
    const json = JSON.stringify(failed.err, (_k, v) =>
      typeof v === "bigint" ? Number(v) : v,
    );
    console.log("Failed signature:", signature);
    console.log("  err:", json);
    console.log("  log:", failed.log);
    console.log("  fee paid anyway:", String(failed.fee), "lamports");
    return failed;
  }
}

/** With preflight (the default) the RPC rejects it before it lands: no fee. */
export async function sendToUnapprovedWithPreflight(
  holder: TransactionSigner,
  mint: Address,
  unapproved: Address,
) {
  try {
    await transfer(holder, mint, unapproved, 1_000_000n);
    throw new Error("expected the transfer to fail");
  } catch (error) {
    const { transactionMessage } = error as {
      transactionMessage: Parameters<typeof isToken2022Error>[1];
    };
    const cause = isSolanaError(error) ? error.cause : undefined;
    const accountFrozen = isToken2022Error(
      cause,
      transactionMessage,
      TOKEN_2022_ERROR__ACCOUNT_FROZEN,
    );
    console.log("  accountFrozen:", accountFrozen, "(no fee: it never landed)");
    return {
      code: isSolanaError(error) ? error.context.__code : undefined,
      accountFrozen,
      message:
        (cause as Error | undefined)?.message ?? (error as Error).message,
    };
  }
}

/**
 * The permanent delegate (the issuer) moves tokens out of any account
 * without the holder's signature, e.g. to recover them after a court order.
 */
export async function clawBack(
  issuer: TransactionSigner,
  mint: Address,
  holder: Address,
  amount: bigint,
) {
  const source = await tokenAccountOf(holder, mint);
  const signature = await send(issuer, [
    getTransferCheckedInstruction({
      source,
      mint,
      destination: await tokenAccountOf(issuer.address, mint),
      authority: issuer,
      amount,
      decimals: 6,
    }),
  ]);
  console.log(
    `Permanent delegate moved ${lsf(amount)} from ${source} to the issuer`,
  );
  console.log("Signature:", signature);
  return signature;
}

/** Pause every transfer of the asset, then resume. */
export async function pause(issuer: TransactionSigner, mint: Address) {
  const signature = await send(issuer, [
    getPauseInstruction({ mint, authority: issuer }),
  ]);
  console.log("Paused the asset. Signature:", signature);
  return signature;
}
export async function resume(issuer: TransactionSigner, mint: Address) {
  const signature = await send(issuer, [
    getResumeInstruction({ mint, authority: issuer }),
  ]);
  console.log("Resumed the asset. Signature:", signature);
  return signature;
}
// #endregion blocked
