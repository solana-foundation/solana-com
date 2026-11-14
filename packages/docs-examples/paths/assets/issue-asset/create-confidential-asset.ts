// #region confidential
import {
  flattenInstructionPlan,
  generateKeyPairSigner,
  some,
  type Address,
  type Instruction,
  type InstructionPlan,
  type KeyPairSigner,
  type Signature,
  type TransactionSigner,
} from "@solana/kit";
import { getCreateAccountInstruction } from "@solana-program/system";
import {
  AccountState,
  extension,
  fetchMint,
  fetchToken,
  getApproveConfidentialTransferAccountInstruction,
  getInitializeMintInstruction,
  getMintSize,
  getPostInitializeInstructionsForMintExtensions,
  getPreInitializeInstructionsForMintExtensions,
  getThawAccountInstruction,
  TOKEN_2022_PROGRAM_ADDRESS,
  type Token,
} from "@solana-program/token-2022";
import {
  deriveConfidentialKeys,
  getCreateConfidentialTransferAccountInstructionPlan,
} from "@solana-program/token-2022/confidential";
import {
  AeKey,
  ElGamalKeypair,
  ElGamalSecretKey,
} from "@solana/zk-sdk/bundler";
import { tokenAccountOf } from "./approve-holder";
import { rpc, send } from "./config";

/**
 * The same asset as createAsset, plus Confidential Balances. The extension
 * can only be added when the mint is created. With autoApproveNewAccounts
 * false the issuer approves each holder for confidential use, and the
 * auditor's ElGamal public key can decrypt every confidential transfer amount.
 */
export async function createConfidentialAsset(
  issuer: TransactionSigner,
  auditorElgamalPubkey: Address,
): Promise<{ mint: Address; signature: Signature; extensions: string[] }> {
  const mint = await generateKeyPairSigner();
  const extensions = [
    extension("MetadataPointer", {
      authority: issuer.address,
      metadataAddress: mint.address,
    }),
    extension("TokenMetadata", {
      updateAuthority: issuer.address,
      mint: mint.address,
      name: "Lisbon Solar Fund",
      symbol: "LSF",
      uri: "https://example.com/lsf.json",
      additionalMetadata: new Map([["isin", "PTLSF0000001"]]),
    }),
    extension("PausableConfig", { authority: issuer.address, paused: false }),
    extension("PermanentDelegate", { delegate: issuer.address }),
    extension("DefaultAccountState", { state: AccountState.Frozen }),
    extension("ConfidentialTransferMint", {
      authority: some(issuer.address),
      autoApproveNewAccounts: false,
      auditorElgamalPubkey: some(auditorElgamalPubkey),
    }),
  ];

  const space = getMintSize(
    extensions.filter((e) => e.__kind !== "TokenMetadata"),
  );
  const rent = await rpc
    .getMinimumBalanceForRentExemption(BigInt(getMintSize(extensions)))
    .send();

  const signature = await send(issuer, [
    getCreateAccountInstruction({
      payer: issuer,
      newAccount: mint,
      lamports: rent,
      space,
      programAddress: TOKEN_2022_PROGRAM_ADDRESS,
    }),
    ...getPreInitializeInstructionsForMintExtensions(mint.address, extensions),
    getInitializeMintInstruction({
      mint: mint.address,
      decimals: 6,
      mintAuthority: issuer.address,
      freezeAuthority: issuer.address,
    }),
    ...getPostInitializeInstructionsForMintExtensions(
      mint.address,
      issuer,
      extensions,
    ),
  ]);

  const account = await fetchMint(rpc, mint.address);
  const enabled =
    account.data.extensions.__option === "Some"
      ? account.data.extensions.value.map((e) => e.__kind)
      : [];
  return { mint: mint.address, signature, extensions: enabled };
}

/** The auditor's ElGamal public key, derived from the auditor's wallet. */
export async function auditorKey(auditor: KeyPairSigner) {
  const { elgamalKeypair } = await deriveConfidentialKeys({ signer: auditor });
  return elgamalKeypair.elgamalPubkey;
}

/**
 * Holder side: open the token account and set it up for confidential
 * balances. The holder's keys come from one wallet signature, and the
 * proof that the ElGamal key is valid is generated here, on the client.
 */
export async function enableConfidentialAccount(
  holder: KeyPairSigner,
  mint: Address,
) {
  const keys = await deriveConfidentialKeys({ signer: holder });
  const plan = await getCreateConfidentialTransferAccountInstructionPlan({
    rpc,
    payer: holder,
    owner: holder,
    mint,
    elgamalKeypair: ElGamalKeypair.fromSecretKey(
      ElGamalSecretKey.fromBytes(keys.elgamalKeypair.secretKey),
    ),
    aesKey: AeKey.fromBytes(keys.aeKey),
  });
  const signature = await send(holder, instructionsOf(plan));
  return { signature, ...(await stateOf(holder.address, mint)) };
}

/**
 * Issuer side, after your KYC check: thaw the account (freeze authority) and
 * approve it for confidential use (confidential transfer authority).
 */
export async function approveConfidentialHolder(
  issuer: TransactionSigner,
  mint: Address,
  owner: Address,
) {
  const account = await tokenAccountOf(owner, mint);
  const signature = await send(issuer, [
    getThawAccountInstruction({ account, mint, owner: issuer }),
    getApproveConfidentialTransferAccountInstruction({
      token: account,
      mint,
      authority: issuer,
    }),
  ]);
  return { signature, ...(await stateOf(owner, mint)) };
}

/** Whether the account is frozen, and whether it's approved for confidential use. */
async function stateOf(owner: Address, mint: Address) {
  const account = await tokenAccountOf(owner, mint);
  const { data } = await fetchToken(rpc, account);
  const confidential = confidentialExtension(data);
  return {
    account,
    state: AccountState[data.state],
    confidentialApproved: confidential?.approved ?? false,
  };
}

function confidentialExtension(data: Token) {
  if (data.extensions.__option !== "Some") return undefined;
  for (const e of data.extensions.value)
    if (e.__kind === "ConfidentialTransferAccount") return e;
  return undefined;
}

/** The helper returns an instruction plan; here it fits in one transaction. */
function instructionsOf(plan: InstructionPlan): Instruction[] {
  return flattenInstructionPlan(plan).map((p) => {
    if (p.kind !== "single") throw new Error("unexpected plan step");
    return p.instruction;
  });
}
// #endregion confidential
