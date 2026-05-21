// #region create
import { createClient, generateKeyPairSigner, lamports } from "@solana/kit";
import { solanaLocalRpc } from "@solana/kit-plugin-rpc";
import { airdropPayer, payer } from "@solana/kit-plugin-signer";
import {
  getCreateAccountInstruction,
  SYSTEM_PROGRAM_ADDRESS,
} from "@solana-program/system";

const sender = await generateKeyPairSigner();
const LAMPORTS_PER_SOL = 1_000_000_000n;

const client = await createClient()
  .use(payer(sender))
  .use(solanaLocalRpc())
  .use(airdropPayer(lamports(LAMPORTS_PER_SOL)));

const newAccount = await generateKeyPairSigner();
const space = 0;
const rentLamports = await client.getMinimumBalance(space);

const createAccountInstruction = getCreateAccountInstruction({
  payer: sender,
  newAccount,
  lamports: rentLamports,
  programAddress: SYSTEM_PROGRAM_ADDRESS,
  space,
});

const { context } = await client.sendTransaction([createAccountInstruction]);
console.log("Transaction Signature for create account:", context.signature);
// #endregion create
