// #region run
// run.ts: create the asset, approve holders and test every rule, in order.
//   npx tsx run.ts
// The issuer key is read from ISSUER_KEYPAIR, or from the Solana CLI default
// ~/.config/solana/id.json. On devnet, fund that wallet first.
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  createKeyPairSignerFromBytes,
  generateKeyPairSigner,
  lamports,
  type Address,
  type TransactionSigner,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import { fetchToken } from "@solana-program/token-2022";
import {
  approveHolder,
  lsf,
  openAccount,
  tokenAccountOf,
} from "./approve-holder";
import {
  clawBack,
  pause,
  resume,
  sendToUnapproved,
  sendToUnapprovedWithPreflight,
  transfer,
} from "./blocked-transfer";
import { rpc, send } from "./config";
import { createAsset } from "./create-asset";

export async function run(issuer: TransactionSigner) {
  const { mint } = await createAsset(issuer);

  const holder = await generateKeyPairSigner();
  const approved = await generateKeyPairSigner();
  const unapproved = await generateKeyPairSigner();
  // The holder signs its own transfers, so it needs a little SOL for fees.
  await send(issuer, [
    getTransferSolInstruction({
      source: issuer,
      destination: holder.address,
      amount: lamports(10_000_000n), // 0.01 SOL
    }),
  ]);

  // Approve two investors (after your KYC check) and the issuer's own
  // account, which clawBack sends tokens to. The first investor gets 1000 LSF.
  for (const [owner, amount] of [
    [holder.address, 1_000_000_000n],
    [approved.address, 0n],
    [issuer.address, 0n],
  ] as const) {
    await openAccount(issuer, mint, owner);
    await approveHolder(issuer, mint, owner, amount);
  }

  const sent = await transfer(holder, mint, approved.address, 100_000_000n);

  // The unapproved account exists but stays frozen.
  await openAccount(issuer, mint, unapproved.address);
  const blocked = await sendToUnapproved(holder, mint, unapproved.address);
  const rejected = await sendToUnapprovedWithPreflight(
    holder,
    mint,
    unapproved.address,
  );

  await pause(issuer, mint);
  let pausedTransferFailed = false;
  try {
    await transfer(holder, mint, approved.address, 1_000_000n);
  } catch {
    pausedTransferFailed = true; // transfer() printed why
  }
  await resume(issuer, mint);

  const recovered = await clawBack(issuer, mint, approved.address, 50_000_000n);

  const balance = async (owner: Address) =>
    lsf((await fetchToken(rpc, await tokenAccountOf(owner, mint))).data.amount);
  console.log(
    "Balances: holder",
    await balance(holder.address),
    "| approved",
    await balance(approved.address),
    "| unapproved",
    await balance(unapproved.address),
    "| issuer",
    await balance(issuer.address),
  );

  return { mint, sent, blocked, rejected, pausedTransferFailed, recovered };
}

// Run when started directly (not when imported by the tests).
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const keyPath =
    process.env.ISSUER_KEYPAIR ??
    join(homedir(), ".config", "solana", "id.json");
  const bytes = new Uint8Array(JSON.parse(await readFile(keyPath, "utf8")));
  await run(await createKeyPairSignerFromBytes(bytes));
}
// #endregion run
