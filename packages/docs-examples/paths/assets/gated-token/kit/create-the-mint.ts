// #region create
// npx tsx create-the-mint.ts
import { generateKeyPairSigner, none, some } from "@solana/kit";
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
import { loadSigner, rpc, send } from "./common";

const payer = await loadSigner("tokenization-demo");
// One address per operational power, from the keys generated in step 1.
const authority = async (role: string) =>
  (await loadSigner(`demo-authorities/${role}`)).address;
const metadataAuthority = await authority("metadata");
const pauseAuthority = await authority("pause");
const permanentDelegate = await authority("delegate");
const burnAuthority = await authority("burn");

const mint = await generateKeyPairSigner();
const [name, symbol, uri] = [
  "Demo Tokenized Note",
  "DEMOTN",
  "https://example.com/demotn.json",
];

// The extension set the Mosaic tokenized-security template turns on.
const extensions = [
  extension("MetadataPointer", {
    authority: some(metadataAuthority),
    metadataAddress: some(mint.address),
  }),
  extension("TokenMetadata", {
    updateAuthority: some(metadataAuthority),
    mint: mint.address,
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
    authority: some(payer.address),
    autoApproveNewAccounts: false,
    auditorElgamalPubkey: none(),
  }),
  extension("PermanentDelegate", { delegate: permanentDelegate }),
  extension("PermissionedBurn", { authority: some(burnAuthority) }),
  extension("ScaledUiAmountConfig", {
    authority: payer.address,
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
const rent = await rpc
  .getMinimumBalanceForRentExemption(BigInt(getMintSize(extensions)))
  .send();

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
    mint: mint.address,
    authority: metadataAuthority,
    metadataAddress: mint.address,
  }),
  getInitializePausableConfigInstruction({
    mint: mint.address,
    authority: pauseAuthority,
  }),
  getInitializeDefaultAccountStateInstruction({
    mint: mint.address,
    state: AccountState.Frozen,
  }),
  getInitializeConfidentialTransferMintInstruction({
    mint: mint.address,
    authority: payer.address,
    autoApproveNewAccounts: false,
    auditorElgamalPubkey: null,
  }),
  getInitializePermanentDelegateInstruction({
    mint: mint.address,
    delegate: permanentDelegate,
  }),
  getInitializePermissionedBurnInstruction({
    mint: mint.address,
    authority: burnAuthority,
  }),
  getInitializeScaledUiAmountMintInstruction({
    mint: mint.address,
    authority: payer.address,
    multiplier: 1,
  }),
  // The freeze authority starts on the payer: Token ACL's create config needs
  // the current freeze authority to sign, then moves it to the mint config.
  getInitializeMintInstruction({
    mint: mint.address,
    decimals: 6,
    mintAuthority: payer.address,
    freezeAuthority: payer.address,
  }),
  getInitializeTokenMetadataInstruction({
    metadata: mint.address,
    updateAuthority: metadataAuthority,
    mint: mint.address,
    mintAuthority: payer,
    name,
    symbol,
    uri,
  }),
];

// The Token ACL config plus the gate program's allowlist. Permissionless thaw
// lets anyone open an allowlisted holder's account by paying the fee.
const gate = TOKEN_ACL_GATE_PROGRAM_PROGRAM_ADDRESS;
const [mintConfig] = await findMintConfigPda({ mint: mint.address });
const [listConfig] = await findListConfigPda({
  authority: payer.address,
  seed: mint.address,
});
const [extraMetas] = await findThawExtraMetasAccountPda(
  { mint: mint.address },
  { programAddress: gate },
);
const gateInstructions = [
  await getCreateConfigInstructionAsync({
    payer: payer.address,
    authority: payer,
    mint: mint.address,
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
    seed: mint.address,
  }),
  getSetupExtraMetasInstruction({
    authority: payer,
    payer,
    tokenAclMintConfig: mintConfig,
    mint: mint.address,
    extraMetas,
    addresses: [listConfig],
  }),
];

await send(payer, [...mintInstructions, ...gateInstructions]);
console.log("Mint:", mint.address);
console.log("Allowlist:", listConfig);
console.log("Freeze authority (Token ACL mint config):", mintConfig);
// #endregion create
