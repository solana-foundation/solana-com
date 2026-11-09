// #region confidential-run
// confidential.ts: create the confidential asset, then enable and approve
// one holder.
//   npx tsx confidential.ts
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
  type TransactionSigner,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import { fetchMint } from "@solana-program/token-2022";
import { rpc, send } from "./config";
import {
  approveConfidentialHolder,
  auditorKey,
  createConfidentialAsset,
  enableConfidentialAccount,
} from "./create-confidential-asset";

export async function runConfidential(issuer: TransactionSigner) {
  // In production the auditor derives this key from their own wallet and
  // sends you only the public key.
  const auditor = await generateKeyPairSigner();
  const auditorPubkey = await auditorKey(auditor);
  const asset = await createConfidentialAsset(issuer, auditorPubkey);
  console.log("Mint:", asset.mint);
  console.log("Extensions:", asset.extensions.join(", "));
  const { data } = await fetchMint(rpc, asset.mint);
  const config =
    data.extensions.__option === "Some"
      ? data.extensions.value.find(
          (e) => e.__kind === "ConfidentialTransferMint",
        )
      : undefined;
  if (config?.__kind !== "ConfidentialTransferMint")
    throw new Error("ConfidentialTransferMint missing");
  console.log("Auto-approve new accounts:", config.autoApproveNewAccounts);
  console.log(
    "Auditor ElGamal key:",
    config.auditorElgamalPubkey.__option === "Some"
      ? config.auditorElgamalPubkey.value
      : "none",
  );
  console.log("Signature:", asset.signature);

  // The holder signs and pays for their own account setup.
  const holder = await generateKeyPairSigner();
  await send(issuer, [
    getTransferSolInstruction({
      source: issuer,
      destination: holder.address,
      amount: lamports(10_000_000n), // 0.01 SOL
    }),
  ]);

  const enabled = await enableConfidentialAccount(holder, asset.mint);
  console.log(
    "Holder enabled confidential balances on",
    enabled.account,
    "state:",
    enabled.state,
    "confidential approved:",
    enabled.confidentialApproved,
  );
  console.log("Signature:", enabled.signature);

  // After your KYC check passes.
  const approved = await approveConfidentialHolder(
    issuer,
    asset.mint,
    holder.address,
  );
  console.log(
    "Issuer approved",
    approved.account,
    "state:",
    approved.state,
    "confidential approved:",
    approved.confidentialApproved,
  );
  console.log("Signature:", approved.signature);

  return {
    asset,
    holder,
    autoApprove: config.autoApproveNewAccounts,
    auditor: config.auditorElgamalPubkey,
    auditorPubkey,
    enabled,
    approved,
  };
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
  await runConfidential(await createKeyPairSignerFromBytes(bytes));
}
// #endregion confidential-run
