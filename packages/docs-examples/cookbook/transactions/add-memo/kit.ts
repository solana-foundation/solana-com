// #region memo
import { createClient, generateKeyPairSigner, lamports } from "@solana/kit";
import { solanaLocalRpc } from "@solana/kit-plugin-rpc";
import { airdropPayer, payer } from "@solana/kit-plugin-signer";
import { getAddMemoInstruction } from "@solana-program/memo";

const sender = await generateKeyPairSigner();
const LAMPORTS_PER_SOL = 1_000_000_000n;

const client = await createClient()
  .use(payer(sender))
  .use(solanaLocalRpc())
  .use(airdropPayer(lamports(LAMPORTS_PER_SOL)));

const memoInstruction = getAddMemoInstruction({
  memo: "Hello, world!",
});

const { context } = await client.sendTransaction([memoInstruction]);
console.log("Transaction Signature:", context.signature);
// #endregion memo
