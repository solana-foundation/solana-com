// #region client
import { existsSync } from "node:fs";
import {
  address,
  createClient,
  generateKeyPairSigner,
  writeKeyPairSigner,
  type Address,
} from "@solana/kit";
import { solanaDevnetRpc } from "@solana/kit-plugin-rpc";
import { signerFromFile } from "@solana/kit-plugin-signer";
import { findAssociatedTokenPda, tokenProgram } from "@solana-program/token";
import { token2022Program } from "@solana-program/token-2022";

// Your wallet lives in wallet.json. The first run creates it.
if (!existsSync("wallet.json")) {
  await writeKeyPairSigner(await generateKeyPairSigner(true), "wallet.json");
}

// Connects to devnet (or RPC_URL, if set), signs and pays fees with your
// wallet, and knows the Token Program and Token-2022.
export const client = await createClient()
  .use(signerFromFile("wallet.json"))
  .use(solanaDevnetRpc({ rpcUrl: process.env.RPC_URL }))
  .use(tokenProgram())
  .use(token2022Program());

// USDC on devnet: free test dollars from https://faucet.circle.com.
export const USDC_MINT = address(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
);

/** How much of a token (USDC unless you pass another mint) an address holds. */
export async function tokenBalance(owner: Address, mint: Address = USDC_MINT) {
  // The holder's token account address comes from the owner, the mint, and
  // the token program that owns the mint (Token Program or Token-2022).
  const { value } = await client.rpc.getAccountInfo(mint).send();
  const [account] = await findAssociatedTokenPda({
    owner,
    mint,
    tokenProgram: value!.owner,
  });
  return client.rpc
    .getTokenAccountBalance(account)
    .send()
    .then(({ value }) => value.uiAmountString)
    .catch(() => "0"); // no token account yet
}
// #endregion client
