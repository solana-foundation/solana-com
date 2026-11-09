// The Solana Quickstart in one file, for Solana Playground:
// https://solana.com/developers/docs/quickstart
//
// It runs steps 1, 3, 4, and 5 on devnet with your Playground wallet. Step 2,
// Send dollars, needs the local setup: it sends USDC with the Token Program
// client (@solana-program/token), and Playground doesn't load that package.
import {
  createClient,
  generateKeyPairSigner,
  isSolanaError,
  SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM,
  type Address,
} from "@solana/kit";
import { solanaDevnetRpc } from "@solana/kit-plugin-rpc";
import { signerFromFile } from "@solana/kit-plugin-signer";
import {
  extension,
  findAssociatedTokenPda,
  TOKEN_2022_ERROR__ACCOUNT_FROZEN,
  TOKEN_2022_PROGRAM_ADDRESS,
  token2022Program,
} from "@solana-program/token-2022";

// Connects to devnet, signs and pays fees with your wallet, and knows
// Token-2022. In Playground, signerFromFile is your Playground wallet.
const client = await createClient()
  .use(signerFromFile("wallet.json"))
  .use(solanaDevnetRpc())
  .use(token2022Program());
const wallet = client.identity;
const { instructions } = client.token2022;

/** How much of a Token-2022 asset an address holds, once it has an account. */
async function tokenBalance(owner: Address, mint: Address) {
  // The holder's token account address comes from the owner and the mint.
  const [account] = await findAssociatedTokenPda({
    owner,
    mint,
    tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
  });
  const { value } = await client.rpc.getTokenAccountBalance(account).send();
  return value.uiAmountString;
}

/** Whether Token-2022 rejected a transaction with AccountFrozen (error 17). */
function isAccountFrozen(error: unknown) {
  // Kit wraps the program's error in others: follow the causes down to it.
  for (let e = error; e; e = (e as { cause?: unknown }).cause)
    if (isSolanaError(e, SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM))
      return e.context.code === TOKEN_2022_ERROR__ACCOUNT_FROZEN;
  return false;
}

// Step 1: Check a balance
console.log("Step 1: Check a balance");
console.log("Wallet:", wallet.address);
// Balances are in lamports: 1 SOL = 1,000,000,000 lamports.
const { value: balance } = await client.rpc.getBalance(wallet.address).send();
console.log("Balance:", Number(balance) / 1e9, "SOL");

// Step 2: Send dollars. Not in this file (see the first comment).
console.log("\nStep 2: Send dollars (skipped: it needs the local setup)");

// Step 3: Create an asset
console.log("\nStep 3: Create an asset");
const mint = await generateKeyPairSigner(); // the new asset's address

// One transaction: create the mint (the account that defines the asset) with
// its name, symbol, and details stored in it, then mint 1,000 EXF to your
// token account, created if needed. Amounts are in base units: 1,000 x 10^2.
const { context: created } = await client.sendTransaction([
  await instructions.createMint({
    newMint: mint,
    decimals: 2,
    mintAuthority: wallet,
    freezeAuthority: wallet.address, // lets you freeze holders (step 5)
    extensions: [
      extension("MetadataPointer", {
        authority: wallet.address,
        metadataAddress: mint.address,
      }),
      extension("TokenMetadata", {
        updateAuthority: wallet.address,
        mint: mint.address,
        name: "Example Fund",
        symbol: "EXF",
        uri: "https://example.com/exf.json",
        additionalMetadata: new Map([["asset class", "fund share"]]),
      }),
    ],
  }),
  await instructions.mintToATA({
    mint: mint.address,
    owner: wallet.address,
    mintAuthority: wallet,
    amount: 100_000n,
    decimals: 2,
  }),
]);

// Read the asset back from the network. Its extensions are an Option: Some
// with the list, or None when a mint has none.
const asset = await client.token2022.accounts.mint.fetch(mint.address);
const { extensions } = asset.data;
const metadata = (extensions.__option === "Some" ? extensions.value : []).find(
  (e) => e.__kind === "TokenMetadata",
);

console.log("Asset (mint):", mint.address);
console.log("Name:", metadata?.name, `(${metadata?.symbol})`);
console.log("Signature:", created.signature);
console.log(
  `Explorer: https://explorer.solana.com/address/${mint.address}?cluster=devnet`,
);
console.log("Supply:", Number(asset.data.supply) / 100, "EXF");

// Step 4: Send the asset
console.log("\nStep 4: Send the asset");
// A new holder: a second wallet. In a real app, the holder keeps their own
// key; here it stays in memory so step 5 can sign for it.
const holder = await generateKeyPairSigner();

// Opens the holder's EXF token account, then moves 100 EXF
// (10,000 base units: EXF has 2 decimals) with TransferChecked.
const { context: sent } = await instructions
  .transferToATA({
    mint: mint.address,
    authority: wallet,
    recipient: holder.address,
    amount: 10_000n,
    decimals: 2,
  })
  .sendTransaction();

console.log("Sent 100 EXF to", holder.address);
console.log("Signature:", sent.signature);
console.log(
  `Explorer: https://explorer.solana.com/tx/${sent.signature}?cluster=devnet`,
);
console.log(
  "Holder balance:",
  await tokenBalance(holder.address, mint.address),
  "EXF",
);

// Step 5: Freeze a holder
console.log("\nStep 5: Freeze a holder");
const [account] = await findAssociatedTokenPda({
  mint: mint.address,
  owner: holder.address,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});

// The holder sends 10 EXF back to you (you pay the fee).
const sendBack = () =>
  instructions
    .transferToATA({
      mint: mint.address,
      authority: holder,
      recipient: wallet.address,
      amount: 1_000n,
      decimals: 2,
    })
    .sendTransaction();

// 1. As the freeze authority, freeze the holder's EXF account.
await instructions
  .freezeAccount({ account, mint: mint.address, owner: wallet })
  .sendTransaction();
console.log("Froze the holder's EXF account");

// 2. Nothing moves out of a frozen account: Token-2022 rejects the transfer
// (error 17, AccountFrozen) before it lands, so the holder keeps 100 EXF.
// Any other error, such as a network error, ends the run.
try {
  await sendBack();
} catch (error) {
  if (!isAccountFrozen(error)) throw error;
  console.log("Transfer blocked: account is frozen");
}

// 3. Thaw it, and the same transfer goes through.
await instructions
  .thawAccount({ account, mint: mint.address, owner: wallet })
  .sendTransaction();
const { context: back } = await sendBack();
console.log("Thawed. Transfer sent:", back.signature);
console.log(
  "Holder balance:",
  await tokenBalance(holder.address, mint.address),
  "EXF",
);
