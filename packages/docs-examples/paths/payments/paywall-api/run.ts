// #region run
// paywall-api/run.ts: start the paywall server, call it without paying, pay,
// replay the same payment, and try a client whose cap is below the price.
//   npx tsx paywall-api/run.ts
// The client key is read from CLIENT_KEYPAIR, or from the Solana CLI default
// ~/.config/solana/id.json. It needs SOL for fees and 0.001 USDC.
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
  signature as toSignature,
  signTransactionMessageWithSigners,
  type Address,
  type TransactionSigner,
} from "@solana/kit";
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { rpc, rpcSubscriptions, USDC_MINT } from "../checkout/config";
import { createPaymentHeader, fetchWithPayment } from "./client";
import { createPaywallServer } from "./server";
import {
  decodeHeader,
  type PaymentRequired,
  type SettlementResponse,
} from "./x402";

export async function run(
  client: TransactionSigner,
  port = 3000,
): Promise<{
  payTo: Address;
  statuses: number[];
  signature: string;
  refused: boolean;
}> {
  // The wallet that gets paid. Use your own address in a real API.
  const payTo = (await generateKeyPairSigner()).address;
  const server = createPaywallServer({ payTo, price: 1_000n }); // 0.001 USDC
  await new Promise<void>((resolve, reject) =>
    server.once("error", reject).listen(port, resolve),
  );
  const { port: listening } = server.address() as AddressInfo;
  const url = `http://localhost:${listening}/api/forecast`;
  try {
    // Its USDC account must exist before it can receive USDC, so the client
    // opens it.
    const [ata] = await findAssociatedTokenPda({
      owner: payTo,
      mint: USDC_MINT,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
    const open = await signTransactionMessageWithSigners(
      pipe(
        createTransactionMessage({ version: 0 }),
        (m) => setTransactionMessageFeePayerSigner(client, m),
        (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
        (m) =>
          appendTransactionMessageInstructions(
            [
              getCreateAssociatedTokenIdempotentInstruction({
                payer: client,
                ata,
                owner: payTo,
                mint: USDC_MINT,
              }),
            ],
            m,
          ),
      ),
    );
    assertIsTransactionWithBlockhashLifetime(open);
    await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(open, {
      commitment: "confirmed",
    });

    // 1. No payment: 402 with the price.
    const unpaid = await fetch(url);
    const required = (await unpaid.json()) as PaymentRequired;
    const [option] = required.accepts;
    console.log("GET /api/forecast ->", unpaid.status, required.error);
    console.log(
      `  price: ${option!.maxAmountRequired} base units of ${option!.asset} (${Number(option!.maxAmountRequired) / 1e6} USDC)`,
    );
    console.log("  payTo:", option!.payTo, "network:", option!.network);

    // 2. Pay (at most 0.005 USDC) and retry with the X-PAYMENT header.
    const header = await createPaymentHeader(required, {
      signer: client,
      maxAmount: 5_000n,
    });
    const paid = await fetch(url, { headers: { "X-PAYMENT": header } });
    const settlement = decodeHeader<SettlementResponse>(
      paid.headers.get("x-payment-response") ?? "",
    );
    console.log(
      "GET /api/forecast (paid) ->",
      paid.status,
      JSON.stringify(await paid.json()),
    );
    console.log("  settled signature:", settlement.transaction);
    const tx = await rpc
      .getTransaction(toSignature(settlement.transaction), {
        commitment: "confirmed",
        encoding: "json",
        maxSupportedTransactionVersion: 0,
      })
      .send();
    console.log("  fee:", String(tx?.meta?.fee), "lamports");

    // 3. The same X-PAYMENT header again: refused.
    const replay = await fetch(url, { headers: { "X-PAYMENT": header } });
    console.log(
      "GET /api/forecast (replayed X-PAYMENT) ->",
      replay.status,
      ((await replay.json()) as PaymentRequired).error,
    );

    // 4. A client that pays at most 0.0005 USDC refuses and signs nothing.
    let refused = false;
    try {
      await fetchWithPayment(url, { signer: client, maxAmount: 500n });
    } catch (err) {
      refused = true;
      console.log("client refused:", (err as Error).message);
    }
    return {
      payTo,
      statuses: [unpaid.status, paid.status, replay.status],
      signature: settlement.transaction,
      refused,
    };
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
    process.env.CLIENT_KEYPAIR ??
    join(homedir(), ".config", "solana", "id.json");
  const bytes = new Uint8Array(JSON.parse(await readFile(keyPath, "utf8")));
  await run(
    await createKeyPairSignerFromBytes(bytes),
    Number(process.env.PORT ?? 3000),
  );
}
// #endregion run
