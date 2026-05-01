// #region dontfront
import {
  address,
  airdropFactory,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getBase64EncodedWireTransaction,
  lamports,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  AccountRole,
  type Instruction,
  type Address,
} from "@solana/kit";
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

const rpc = createSolanaRpc("http://localhost:8899");
const rpcSubscriptions = createSolanaRpcSubscriptions("ws://localhost:8900");

const signer = await generateKeyPairSigner();
const recipient = await generateKeyPairSigner();

// Fund signer so it can pay fees + tip
await airdropFactory({ rpc, rpcSubscriptions })({
  recipientAddress: signer.address,
  lamports: lamports(1_000_000_000n),
  commitment: "confirmed",
});

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

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

const transactionMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (m) => setTransactionMessageFeePayerSigner(signer, m),
  (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
  (m) => appendTransactionMessageInstructions([transferIx, tipIx], m),
);

const signed = await signTransactionMessageWithSigners(transactionMessage);
assertIsTransactionWithBlockhashLifetime(signed);
const base64Tx = getBase64EncodedWireTransaction(signed);

// Send via Jito block engine (not standard RPC). In tests we just verify the
// transaction builds + serializes — the actual block-engine submit needs a
// reachable Jito endpoint.
try {
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
  const { result: signature } = (await response.json()) as { result?: string };
  console.log(`Sent with dontfront protection: ${signature}`);
} catch (err) {
  console.warn("Jito submission failed (expected in offline tests):", err);
}
// #endregion dontfront
