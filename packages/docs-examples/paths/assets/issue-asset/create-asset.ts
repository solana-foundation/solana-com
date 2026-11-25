// #region create
import {
  generateKeyPairSigner,
  type Address,
  type Signature,
  type TransactionSigner,
} from "@solana/kit";
import { getCreateAccountInstruction } from "@solana-program/system";
import {
  AccountState,
  extension,
  fetchMint,
  getInitializeMintInstruction,
  getMintSize,
  getPostInitializeInstructionsForMintExtensions,
  getPreInitializeInstructionsForMintExtensions,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { fee, rpc, send } from "./config";

/**
 * A restricted asset: onchain metadata, transfers the issuer can pause, a
 * permanent delegate (the issuer can move or burn any balance, e.g. to
 * enforce a court order) and token accounts that start FROZEN, so only
 * holders the issuer approves (thaws) can receive it.
 */
export async function createAsset(
  issuer: TransactionSigner,
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
  ];

  // Metadata is written after the mint is initialized: allocate without it,
  // but fund rent for the final size.
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
  console.log("Mint:", mint.address);
  console.log("Extensions:", enabled.join(", "));
  console.log("Signature:", signature);
  console.log("Fee:", String(await fee(signature)), "lamports");
  return { mint: mint.address, signature, extensions: enabled };
}
// #endregion create
