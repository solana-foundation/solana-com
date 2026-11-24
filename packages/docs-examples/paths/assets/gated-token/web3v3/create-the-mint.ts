// #region create
// npx tsx create-the-mint.ts
import { none, some } from "@solana/kit";
import { Keypair } from "@solana/web3.js-v3";
import { getCreateAccountInstruction } from "@solana-program/system";
import {
  AccountState,
  extension,
  getInitializeConfidentialTransferMintInstruction,
  getInitializeDefaultAccountStateInstruction,
  getInitializeMetadataPointerInstruction,
  getInitializeMintInstruction,
  getInitializePausableConfigInstruction,
  getInitializePermanentDelegateInstruction,
  getInitializePermissionedBurnInstruction,
  getInitializeScaledUiAmountMintInstruction,
  getInitializeTokenMetadataInstruction,
  getMintSize,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import {
  findMintConfigPda,
  findThawExtraMetasAccountPda,
  getCreateConfigInstructionAsync,
  getTogglePermissionlessInstructionsInstruction,
} from "@solana/token-acl-sdk";
import {
  findListConfigPda,
  getCreateListInstruction,
  getSetupExtraMetasInstruction,
  Mode,
  TOKEN_ACL_GATE_PROGRAM_PROGRAM_ADDRESS,
} from "@solana/token-acl-gate-sdk";
import { connection, loadKeypair, send } from "./common";

const payer = await loadKeypair("tokenization-demo");
// One address per operational power, from the keys generated in step 1.
const authority = async (role: string) =>
  (await loadKeypair(`demo-authorities/${role}`)).publicKey.toBase58();
const metadataAuthority = await authority("metadata");
const pauseAuthority = await authority("pause");
const permanentDelegate = await authority("delegate");
const burnAuthority = await authority("burn");

const mint = await Keypair.generate();
const mintAddress = mint.publicKey.toBase58();
const payerAddress = payer.publicKey.toBase58();
const [name, symbol, uri] = [
  "Demo Tokenized Note",
  "DEMOTN",
  "https://example.com/demotn.json",
];

// The extension set the Mosaic tokenized-security template turns on.
const extensions = [
  extension("MetadataPointer", {
    authority: some(metadataAuthority),
    metadataAddress: some(mintAddress),
  }),
  extension("TokenMetadata", {
    updateAuthority: some(metadataAuthority),
    mint: mintAddress,
    name,
    symbol,
    uri,
    additionalMetadata: new Map<string, string>(),
  }),
  extension("PausableConfig", {
    authority: some(pauseAuthority),
    paused: false,
  }),
  extension("DefaultAccountState", { state: AccountState.Frozen }),
  extension("ConfidentialTransferMint", {
    authority: some(payerAddress),
    autoApproveNewAccounts: false,
    auditorElgamalPubkey: none(),
  }),
  extension("PermanentDelegate", { delegate: permanentDelegate }),
  extension("PermissionedBurn", { authority: some(burnAuthority) }),
  extension("ScaledUiAmountConfig", {
    authority: payerAddress,
    multiplier: 1,
    newMultiplierEffectiveTimestamp: 0n,
    newMultiplier: 1,
  }),
];

// Rent covers the full size including metadata. The account is allocated
// without the metadata bytes, because initializing metadata reallocates it.
const space = getMintSize(
  extensions.filter((ext) => ext.__kind !== "TokenMetadata"),
);
const rent = BigInt(
  await connection.getMinimumBalanceForRentExemption(getMintSize(extensions)),
);

const mintInstructions = [
  getCreateAccountInstruction({
    payer,
    newAccount: mint,
    lamports: rent,
    space,
    programAddress: TOKEN_2022_PROGRAM_ADDRESS,
  }),
  // Extension configs are initialized before the mint itself.
  getInitializeMetadataPointerInstruction({
    mint: mintAddress,
    authority: metadataAuthority,
    metadataAddress: mintAddress,
  }),
  getInitializePausableConfigInstruction({
    mint: mintAddress,
    authority: pauseAuthority,
  }),
  getInitializeDefaultAccountStateInstruction({
    mint: mintAddress,
    state: AccountState.Frozen,
  }),
  getInitializeConfidentialTransferMintInstruction({
    mint: mintAddress,
    authority: payerAddress,
    autoApproveNewAccounts: false,
    auditorElgamalPubkey: null,
  }),
  getInitializePermanentDelegateInstruction({
    mint: mintAddress,
    delegate: permanentDelegate,
  }),
  getInitializePermissionedBurnInstruction({
    mint: mintAddress,
    authority: burnAuthority,
  }),
  getInitializeScaledUiAmountMintInstruction({
    mint: mintAddress,
    authority: payerAddress,
    multiplier: 1,
  }),
  // The freeze authority starts on the payer: Token ACL's create config needs
  // the current freeze authority to sign, then moves it to the mint config.
  getInitializeMintInstruction({
    mint: mintAddress,
    decimals: 6,
    mintAuthority: payerAddress,
    freezeAuthority: payerAddress,
  }),
  getInitializeTokenMetadataInstruction({
    metadata: mintAddress,
    updateAuthority: metadataAuthority,
    mint: mintAddress,
    mintAuthority: payer,
    name,
    symbol,
    uri,
  }),
];

// The Token ACL config plus the gate program's allowlist. Permissionless thaw
// lets anyone open an allowlisted holder's account by paying the fee.
const gate = TOKEN_ACL_GATE_PROGRAM_PROGRAM_ADDRESS;
const [mintConfig] = await findMintConfigPda({ mint: mintAddress });
const [listConfig] = await findListConfigPda({
  authority: payerAddress,
  seed: mintAddress,
});
const [extraMetas] = await findThawExtraMetasAccountPda(
  { mint: mintAddress },
  { programAddress: gate },
);
const gateInstructions = [
  await getCreateConfigInstructionAsync({
    payer: payerAddress,
    authority: payer,
    mint: mintAddress,
    gatingProgram: gate,
  }),
  getTogglePermissionlessInstructionsInstruction({
    authority: payer,
    mintConfig,
    freezeEnabled: false,
    thawEnabled: true,
  }),
  getCreateListInstruction({
    authority: payer,
    payer,
    listConfig,
    mode: Mode.Allow,
    seed: mintAddress,
  }),
  getSetupExtraMetasInstruction({
    authority: payer,
    payer,
    tokenAclMintConfig: mintConfig,
    mint: mintAddress,
    extraMetas,
    addresses: [listConfig],
  }),
];

await send([payer, mint], [...mintInstructions, ...gateInstructions]);
console.log("Mint:", mintAddress);
console.log("Allowlist:", listConfig);
console.log("Freeze authority (Token ACL mint config):", mintConfig);
// #endregion create
