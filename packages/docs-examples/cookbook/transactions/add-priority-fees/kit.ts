// #region priority
import {
  createClient,
  generateKeyPairSigner,
  lamports,
  type MicroLamports,
} from "@solana/kit";
import { solanaLocalRpc } from "@solana/kit-plugin-rpc";
import { airdropPayer, payer } from "@solana/kit-plugin-signer";
import { getAddMemoInstruction } from "@solana-program/memo";

// Create and fund an account
const keypairSigner = await generateKeyPairSigner();

// Configure priority fees on the client. The transaction planner will add a
// SetComputeUnitPrice instruction, and the executor will simulate the
// transaction to estimate compute units and add a SetComputeUnitLimit.
const client = await createClient()
  .use(payer(keypairSigner))
  .use(
    solanaLocalRpc({
      transactionConfig: {
        microLamportsPerComputeUnit: 5000n as MicroLamports,
        version: "legacy",
      },
    }),
  )
  .use(airdropPayer(lamports(1_000_000_000n)));

const memoInstruction = getAddMemoInstruction({ memo: "Hello, world!" });

const { context } = await client.sendTransaction([memoInstruction]);
console.log(`Transaction Signature: ${context.signature}`);
// #endregion priority
