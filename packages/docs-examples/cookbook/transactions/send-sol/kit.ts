// #region transfer
import { createClient, generateKeyPairSigner, lamports } from "@solana/kit";
import { rpcAirdrop, solanaRpc } from "@solana/kit-plugin-rpc";
import { airdropPayer, payer } from "@solana/kit-plugin-signer";
import { getTransferSolInstruction } from "@solana-program/system";

const sender = await generateKeyPairSigner();
const recipient = await generateKeyPairSigner();

const LAMPORTS_PER_SOL = 1_000_000_000n;
const transferAmount = lamports(LAMPORTS_PER_SOL / 100n); // 0.01 SOL

const client = await createClient()
  .use(payer(sender))
  .use(
    solanaRpc({
      rpcUrl: "http://localhost:8899",
      rpcSubscriptionsUrl: "ws://localhost:8900",
    }),
  )
  .use(rpcAirdrop())
  .use(airdropPayer(lamports(LAMPORTS_PER_SOL)));

const transferInstruction = getTransferSolInstruction({
  source: sender,
  destination: recipient.address,
  amount: transferAmount,
});

const { context } = await client.sendTransaction([transferInstruction]);
console.log("Transaction Signature:", context.signature);
// #endregion transfer
