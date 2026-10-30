// #region run
// checkout/run.ts: start the confirm server, pay an order as a customer, and
// confirm the payment through the endpoint, twice.
//   npx tsx checkout/run.ts
// The customer key is read from CUSTOMER_KEYPAIR, or from the Solana CLI
// default ~/.config/solana/id.json. It needs SOL for fees and 1 USDC.
import { readFile } from "node:fs/promises";
import type { AddressInfo } from "node:net";
import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createKeyPairSignerFromBytes,
  createTransactionMessage,
  generateKeyPairSigner,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type Address,
  type Signature,
  type TransactionSigner,
} from "@solana/kit";
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { rpc, rpcSubscriptions, USDC_MINT } from "./config";
import { createOrder, type Order } from "./orders";
import { payStore } from "./pay";
import { createCheckoutServer } from "./server";

/** Create `owner`'s USDC account if it doesn't exist yet; `payer` pays. */
export async function createUsdcAccount(
  payer: TransactionSigner,
  owner: Address,
) {
  const [ata] = await findAssociatedTokenPda({
    owner,
    mint: USDC_MINT,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(payer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) =>
      appendTransactionMessageInstructions(
        [
          getCreateAssociatedTokenIdempotentInstruction({
            payer,
            ata,
            owner,
            mint: USDC_MINT,
          }),
        ],
        m,
      ),
  );
  const transaction = await signTransactionMessageWithSigners(message);
  assertIsTransactionWithBlockhashLifetime(transaction);
  await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
    transaction,
    { commitment: "confirmed" },
  );
  return ata;
}

export async function run(
  customer: TransactionSigner,
  port = 3000,
): Promise<{
  order: Order;
  signature: Signature;
  store: Address;
  results: number[];
}> {
  const server = createCheckoutServer();
  await new Promise<void>((resolve, reject) =>
    server.once("error", reject).listen(port, resolve),
  );
  const { port: listening } = server.address() as AddressInfo;
  try {
    // The store's wallet. Use your own address in a real store. Its USDC
    // account must exist before it can receive USDC.
    const store = await generateKeyPairSigner();
    const storeUsdc = await createUsdcAccount(customer, store.address);
    console.log("Store wallet:", store.address, "USDC account:", storeUsdc);

    // Your server creates the order with a fresh reference...
    const order = await createOrder({
      id: "order-1001",
      storeOwner: store.address,
      amount: 1_000_000n, // 1 USDC
      reference: (await generateKeyPairSigner()).address,
    });
    // ...the customer pays it...
    const signature = await payStore(customer, order);
    const tx = await rpc
      .getTransaction(signature, {
        commitment: "confirmed",
        encoding: "json",
        maxSupportedTransactionVersion: 0,
      })
      .send();
    console.log(
      `Paid ${order.id}: ${Number(order.amount) / 1e6} USDC (${order.amount} base units)`,
    );
    console.log("Reference:", order.reference);
    console.log("Signature:", signature);
    console.log("Fee:", String(tx?.meta?.fee), "lamports");

    // ...and the checkout posts the signature to the confirm endpoint. The
    // second post reuses the signature and is refused.
    const results: number[] = [];
    for (let i = 0; i < 2; i++) {
      const res = await fetch(
        `http://localhost:${listening}/api/orders/${order.id}/confirm`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ signature }),
        },
      );
      const body = await res.text();
      console.log(`POST /api/orders/${order.id}/confirm ->`, res.status, body);
      results.push(res.status);
    }
    return { order, signature, store: store.address, results };
  } finally {
    server.close();
    server.closeAllConnections();
  }
}

// Run when started directly (not when imported by the tests).
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const keyPath =
    process.env.CUSTOMER_KEYPAIR ??
    join(homedir(), ".config", "solana", "id.json");
  const bytes = new Uint8Array(JSON.parse(await readFile(keyPath, "utf8")));
  await run(
    await createKeyPairSignerFromBytes(bytes),
    Number(process.env.PORT ?? 3000),
  );
}
// #endregion run
