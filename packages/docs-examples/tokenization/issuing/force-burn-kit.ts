// #region force-burn
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  AccountRole,
  type Address,
  address,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createClient,
  createKeyPairSignerFromBytes,
  createTransactionMessage,
  getSignatureFromTransaction,
  type Instruction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type TransactionSigner,
} from "@solana/kit";
import { solanaDevnetRpc } from "@solana/kit-plugin-rpc";
import { signer } from "@solana/kit-plugin-signer";
import {
  AccountState,
  TOKEN_2022_PROGRAM_ADDRESS,
  fetchMaybeToken,
  fetchMint,
  findAssociatedTokenPda,
  getPermissionedBurnCheckedInstruction,
} from "@solana-program/token-2022";
import {
  fetchMintConfig,
  findFlagAccountPda,
  findMintConfigPda,
  findThawExtraMetasAccountPda,
  getThawPermissionlessInstruction,
} from "@solana/token-acl-sdk";
import {
  findListConfigPda,
  findWalletEntryPda,
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

function arg(index: number, name: string): string {
  const value = process.argv[index + 1];
  if (!value) throw new Error(`usage: pass ${name} as argument ${index}`);
  return value;
}

const payer = await loadSigner(keypairFile("tokenization-demo.json"));
const permanentDelegate = await loadSigner(
  keypairFile("demo-authorities/delegate.json"),
);
const burnAuthority = await loadSigner(
  keypairFile("demo-authorities/burn.json"),
);
const client = createClient().use(signer(payer)).use(solanaDevnetRpc());
const mint = address(env("MINT"));
const from = address(arg(1, "the wallet to burn from"));
const amount = arg(2, "the decimal amount");

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

// Scales a decimal amount to base units without going through a float.
function toBaseUnits(amount: string, decimals: number): bigint {
  const [whole, fraction = ""] = amount.split(".");
  return BigInt(whole + fraction.padEnd(decimals, "0").slice(0, decimals));
}

// Token ACL thaws a frozen account only when the gate program approves the
// owner. The gate reads three extra accounts: its extra-metas record for the
// mint, the allowlist, and the owner's entry on that list. The tutorial's list
// is keyed by the mint authority and the mint, which is how Mosaic derives it.
async function thawThroughGate(
  authority: TransactionSigner,
  tokenAccount: Address,
  owner: Address,
  listAuthority: Address,
): Promise<Instruction> {
  const [mintConfig] = await findMintConfigPda({ mint });
  const { data: config } = await fetchMintConfig(client.rpc, mintConfig);
  const gate = { programAddress: config.gatingProgram };
  const [flagAccount] = await findFlagAccountPda({ tokenAccount });
  const [extraMetas] = await findThawExtraMetasAccountPda({ mint }, gate);
  const [listConfig] = await findListConfigPda(
    { authority: listAuthority, seed: mint },
    gate,
  );
  const [walletEntry] = await findWalletEntryPda(
    { listConfig, wallet: owner },
    gate,
  );
  const instruction = getThawPermissionlessInstruction({
    authority,
    mint,
    tokenAccount,
    flagAccount,
    tokenAccountOwner: owner,
    mintConfig,
    gatingProgram: config.gatingProgram,
  });
  const extra = [extraMetas, listConfig, walletEntry].map((address) => ({
    address,
    role: AccountRole.READONLY,
  }));
  return { ...instruction, accounts: [...instruction.accounts, ...extra] };
}

const { data: mintData } = await fetchMint(client.rpc, mint);
const [tokenAccount] = await findAssociatedTokenPda({
  mint,
  owner: from,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
const account = await fetchMaybeToken(client.rpc, tokenAccount);
const instructions: Instruction[] = [];

// Token-2022 does not burn from a frozen account, so a frozen source is
// thawed through the gate first. That only succeeds while the wallet is still
// on the allowlist.
if (account.exists && account.data.state === AccountState.Frozen) {
  instructions.push(
    await thawThroughGate(payer, tokenAccount, from, payer.address),
  );
}

// Burns without the holder. The permanent delegate signs as the authority,
// and because the mint carries permissioned burn on a separate key, the burn
// authority co-signs.
instructions.push(
  getPermissionedBurnCheckedInstruction({
    account: tokenAccount,
    mint,
    permissionedBurnAuthority: burnAuthority,
    authority: permanentDelegate,
    amount: toBaseUnits(amount, mintData.decimals),
    decimals: mintData.decimals,
  }),
);

await send(payer, instructions);
// #endregion
