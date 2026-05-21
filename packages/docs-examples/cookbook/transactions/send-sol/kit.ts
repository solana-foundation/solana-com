// #region transfer
import { createClient, generateKeyPairSigner, lamports } from "@solana/kit";
import { solanaLocalRpc } from "@solana/kit-plugin-rpc";
import { airdropPayer, payer } from "@solana/kit-plugin-signer";
import { getTransferSolInstruction } from "@solana-program/system";

const sender = await generateKeyPairSigner();
const recipient = await generateKeyPairSigner();

const LAMPORTS_PER_SOL = 1_000_000_000n;
const transferAmount = lamports(LAMPORTS_PER_SOL / 100n); // 0.01 SOL

const client = await createClient()
  .use(payer(sender))
  .use(solanaLocalRpc())
  .use(airdropPayer(lamports(LAMPORTS_PER_SOL)));

const transferInstruction = getTransferSolInstruction({
  source: sender,
  destination: recipient.address,
  amount: transferAmount,
});

const { context } = await client.sendTransaction([transferInstruction]);
console.log("Transaction Signature:", context.signature);
// #endregion transfer
