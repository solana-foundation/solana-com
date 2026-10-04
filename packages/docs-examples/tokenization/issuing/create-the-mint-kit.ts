// #region create
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  address,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createClient,
  createKeyPairSignerFromBytes,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  type Instruction,
  none,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  some,
  type TransactionSigner,
} from "@solana/kit";
import { solanaDevnetRpc } from "@solana/kit-plugin-rpc";
import { signer } from "@solana/kit-plugin-signer";
import { getCreateAccountInstruction } from "@solana-program/system";
import {
  AccountState,
  TOKEN_2022_PROGRAM_ADDRESS,
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
} from "@solana-program/token-2022";
import {
  findMintConfigPda,
  findThawExtraMetasAccountPda,
  getCreateConfigInstructionAsync,
  getSetGatingProgramInstruction,
  getTogglePermissionlessInstructionsInstruction,
} from "@solana/token-acl-sdk";
import {
  Mode,
  TOKEN_ACL_GATE_PROGRAM_PROGRAM_ADDRESS,
  findListConfigPda,
  getCreateListInstruction,
  getSetupExtraMetasInstruction,
} from "@solana/token-acl-gate-sdk";

// The same keypair files and environment variables the CLI tab uses.
const keypairFile = (name: string) =>
  join(homedir(), ".config", "solana", name);

async function loadSigner(path: string) {
  const bytes = JSON.parse(await readFile(path, "utf8")) as number[];
  return createKeyPairSignerFromBytes(new Uint8Array(bytes));
}

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`export ${name} before running this example`);
  return value;
}

const payer = await loadSigner(keypairFile("tokenization-demo.json"));
const client = createClient().use(signer(payer)).use(solanaDevnetRpc());

// One address per operational power, from the keys generated in step 1.
const authorityAddress = async (role: string) =>
  (await loadSigner(keypairFile(join("demo-authorities", `${role}.json`))))
    .address;
const metadataAuthority = await authorityAddress("metadata");
const pauseAuthority = await authorityAddress("pause");
const permanentDelegate = await authorityAddress("delegate");
const burnAuthority = await authorityAddress("burn");

const mint = await generateKeyPairSigner();
const decimals = 6;
const name = "Demo Tokenized Note";
const symbol = "DEMOTN";
const uri = "https://example.com/demotn.json";

// Builds one transaction from the instructions, signs it with every signer
// they reference, sends it, and prints the signature.
async function send(feePayer: TransactionSigner, instructions: Instruction[]) {
  const { value: latestBlockhash } = await client.rpc
    .getLatestBlockhash()
    .send();
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(feePayer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) => appendTransactionMessageInstructions(instructions, m),
  );
  const signed = await signTransactionMessageWithSigners(message);
  assertIsTransactionWithBlockhashLifetime(signed);
  await sendAndConfirmTransactionFactory({
    rpc: client.rpc,
    rpcSubscriptions: client.rpcSubscriptions,
  })(signed, { commitment: "confirmed" });
  console.log("Signature:", getSignatureFromTransaction(signed));
}

// The same extension set the Mosaic tokenized-security template turns on.
// Default account state is Frozen: every new holder account starts frozen and
// is opened through the gate.
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

// Rent covers the full size including metadata; the account is allocated
// without the metadata bytes because initializing metadata reallocates it.
const fullSize = getMintSize(extensions);
const initialSize = getMintSize(
  extensions.filter((ext) => ext.__kind !== "TokenMetadata"),
);
const rent = await client.rpc
  .getMinimumBalanceForRentExemption(BigInt(fullSize))
  .send();

const mintInstructions = [
  getCreateAccountInstruction({
    payer,
    newAccount: mint,
    lamports: rent,
    space: initialSize,
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
  // The freeze authority starts as the mint authority. Token ACL's create
  // config requires the current freeze authority to sign, then moves it to
  // the mint config account.
  getInitializeMintInstruction({
    mint: mint.address,
    decimals,
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

// Token ACL config plus the gate program's allowlist, keyed by the mint
// authority and the mint. Permissionless thaw is what lets an allowlisted
// holder's account be opened by anyone who pays the fee.
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
  getSetGatingProgramInstruction({
    authority: payer,
    mintConfig,
    newGatingProgram: gate,
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
console.log("Freeze authority (Token ACL mint config):", mintConfig);
console.log("Allowlist:", listConfig);
// #endregion
