// #region dontfront
import {
  address,
  AccountRole,
  createClient,
  createTransactionMessage,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  generateKeyPairSigner,
  getBase64EncodedWireTransaction,
  lamports,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type Address,
  type Instruction,
} from "@solana/kit";
import { rpcAirdrop, solanaRpc } from "@solana/kit-plugin-rpc";
import { airdropPayer, payer } from "@solana/kit-plugin-signer";
import { getTransferSolInstruction } from "@solana-program/system";

// Jito block engine endpoint (mainnet)
const JITO_ENDPOINT =
  "https://mainnet.block-engine.jito.wtf/api/v1/transactions";

// Any valid pubkey starting with "jitodontfront". Does not need to exist onchain.
// Mark as read-only for optimal landing speed.
const DONT_FRONT: Address = address(
  "jitodontfront111111111111111111111111111111",
);

// Jito tip accounts — pick one at random to reduce contention.
// Source: https://docs.jito.wtf/lowlatencytxnsend/#gettipaccounts
const TIP_ACCOUNTS: Address[] = [
  address("96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5"),
  address("HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe"),
  address("Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY"),
  address("ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49"),
  address("DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh"),
  address("ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt"),
  address("DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL"),
  address("3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT"),
];

// Append jitodontfront as a read-only account to any instruction.
// The block engine sees this prefix and ensures your tx is at bundle index 0.
function withDontFront(ix: Instruction): Instruction {
  return {
    ...ix,
    accounts: [
      ...(ix.accounts ?? []),
      { address: DONT_FRONT, role: AccountRole.READONLY },
    ],
  };
}

function randomTipAccount(): Address {
  return TIP_ACCOUNTS[Math.floor(Math.random() * TIP_ACCOUNTS.length)]!;
}

// Set up a kit client against the local validator and fund the signer
// so it can pay fees + tip.
const signer = await generateKeyPairSigner();
const recipient = await generateKeyPairSigner();
const client = await createClient()
  .use(payer(signer))
  .use(
    solanaRpc({
      rpcUrl: "http://localhost:8899",
      rpcSubscriptionsUrl: "ws://localhost:8900",
    }),
  )
  .use(rpcAirdrop())
  .use(airdropPayer(lamports(1_000_000_000n)));

// Build a transfer with dontfront protection
const transferIx = withDontFront(
  getTransferSolInstruction({
    source: signer,
    destination: recipient.address,
    amount: lamports(1_000_000n),
  }),
);

// Jito tip — SOL transfer to a random tip account (min 1000 lamports)
const tipIx = getTransferSolInstruction({
  source: signer,
  destination: randomTipAccount(),
  amount: lamports(1_000n),
});

// Build + sign manually because we submit via Jito's block engine, not RPC.
const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send();
const transactionMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (m) => setTransactionMessageFeePayerSigner(signer, m),
  (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
  (m) => appendTransactionMessageInstructions([transferIx, tipIx], m),
);

const signed = await signTransactionMessageWithSigners(transactionMessage);
assertIsTransactionWithBlockhashLifetime(signed);
const base64Tx = getBase64EncodedWireTransaction(signed);

// Sending through Jito submits a real mainnet transaction, so it is off by
// default and the example prints the signed transaction instead. To send it,
// sign with a funded mainnet keypair, take the blockhash from a mainnet RPC
// node, and set SEND_TO_JITO=1.
if (process.env.SEND_TO_JITO === "1") {
  // Send via Jito's block engine, not a regular RPC node.
  const response = await fetch(JITO_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "sendTransaction",
      params: [base64Tx, { encoding: "base64" }],
    }),
  });
  const body = (await response.json()) as {
    result?: string;
    error?: { code: number; message: string };
  };
  if (!response.ok || body.error || !body.result) {
    throw new Error(
      `Jito rejected the transaction (HTTP ${response.status}): ${JSON.stringify(body.error ?? body)}`,
    );
  }
  console.log("Sent with dontfront protection:", body.result);
} else {
  console.log("Signed transaction (base64):", base64Tx);
}
// #endregion dontfront
