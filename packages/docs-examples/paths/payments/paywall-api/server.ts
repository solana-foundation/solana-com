// #region server
import { createServer } from "node:http";
import {
  address,
  getBase64Encoder,
  getCompiledTransactionMessageDecoder,
  getSignatureFromTransaction,
  getTransactionDecoder,
  type Address,
  type Base64EncodedWireTransaction,
} from "@solana/kit";
import {
  findAssociatedTokenPda,
  parseTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
  TokenInstruction,
} from "@solana-program/token";
import { rpc, USDC_MINT } from "../checkout/config";
import { verifyPayment } from "../checkout/verify-payment";
import {
  decodeHeader,
  encodeHeader,
  NETWORK,
  X402_VERSION,
  type PaymentPayload,
  type PaymentRequirements,
} from "./x402";

export function createPaywallServer(options: {
  payTo: Address;
  price: bigint;
}) {
  const usedSignatures = new Set<string>();
  const requirements: PaymentRequirements = {
    scheme: "exact",
    network: NETWORK,
    maxAmountRequired: options.price.toString(),
    asset: USDC_MINT,
    payTo: options.payTo,
    resource: "/api/forecast",
    description: "Tomorrow's forecast for one city",
    mimeType: "application/json",
    maxTimeoutSeconds: 60,
  };

  return createServer(async (req, res) => {
    const send = (status: number, body: unknown, headers = {}) => {
      res.writeHead(status, { "content-type": "application/json", ...headers });
      res.end(JSON.stringify(body));
    };
    const paymentRequired = (error: string) =>
      send(402, { x402Version: X402_VERSION, error, accepts: [requirements] });

    if (req.method !== "GET" || req.url !== "/api/forecast") {
      return send(404, { error: "not found" });
    }
    const header = req.headers["x-payment"];
    if (typeof header !== "string")
      return paymentRequired("X-PAYMENT header is required");

    let result: Awaited<ReturnType<typeof settle>>;
    try {
      result = await settle(header);
    } catch (err) {
      // RPC outage or similar: never let one request take the process down.
      console.error("settlement error", err);
      return send(500, { error: "payment could not be settled, try again" });
    }
    if (!result.ok) return paymentRequired(result.reason);
    send(
      200,
      { city: "Lisbon", tomorrow: "Sunny, 24°C" },
      {
        "X-PAYMENT-RESPONSE": encodeHeader({
          success: true,
          transaction: result.signature,
          network: NETWORK,
        }),
      },
    );
  });

  /** Check the signed transfer pays the price, then send it and confirm it. */
  async function settle(
    header: string,
  ): Promise<{ ok: true; signature: string } | { ok: false; reason: string }> {
    // Everything in the header is untrusted input: any decoding failure is a
    // 402 "malformed", never an exception.
    let payment: PaymentPayload;
    let wire: Base64EncodedWireTransaction;
    let transaction: ReturnType<
      ReturnType<typeof getTransactionDecoder>["decode"]
    >;
    let message: ReturnType<
      ReturnType<typeof getCompiledTransactionMessageDecoder>["decode"]
    >;
    try {
      payment = decodeHeader<PaymentPayload>(header);
      if (payment?.scheme !== "exact" || payment.network !== NETWORK) {
        return { ok: false, reason: "unsupported scheme or network" };
      }
      if (typeof payment.payload?.transaction !== "string") {
        return { ok: false, reason: "malformed X-PAYMENT header" };
      }
      wire = payment.payload.transaction as Base64EncodedWireTransaction;
      transaction = getTransactionDecoder().decode(
        getBase64Encoder().encode(wire),
      );
      message = getCompiledTransactionMessageDecoder().decode(
        transaction.messageBytes,
      );
    } catch {
      return { ok: false, reason: "malformed X-PAYMENT header" };
    }
    // Only accounts listed in the message itself are checked, so refuse
    // address lookup tables rather than resolving them.
    if (
      !("instructions" in message) ||
      ("addressTableLookups" in message &&
        (message.addressTableLookups?.length ?? 0) > 0)
    ) {
      return { ok: false, reason: "unsupported transaction version" };
    }
    const keys = message.staticAccounts;
    const inRange = (i: number) => i >= 0 && i < keys.length;

    const [payToTokenAccount] = await findAssociatedTokenPda({
      owner: options.payTo,
      mint: USDC_MINT,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    const transfer = message.instructions
      .filter(
        (ix) =>
          keys[ix.programAddressIndex] === TOKEN_PROGRAM_ADDRESS &&
          ix.data?.[0] === TokenInstruction.TransferChecked &&
          (ix.accountIndices ?? []).length >= 4 &&
          (ix.accountIndices ?? []).every(inRange),
      )
      .map((ix) =>
        parseTransferCheckedInstruction({
          programAddress: TOKEN_PROGRAM_ADDRESS,
          accounts: (ix.accountIndices ?? []).map((i) => ({
            address: address(keys[i]!),
            role: 0,
          })),
          data: ix.data!,
        }),
      )
      .find(
        (t) =>
          t.accounts.mint.address === USDC_MINT &&
          t.accounts.destination.address === payToTokenAccount &&
          t.data.amount >= options.price,
      );
    if (!transfer)
      return { ok: false, reason: "transaction does not pay the price" };

    const signature = getSignatureFromTransaction(transaction);
    if (usedSignatures.has(signature))
      return { ok: false, reason: "payment already used" };
    usedSignatures.add(signature);

    try {
      await rpc
        .sendTransaction(wire, {
          encoding: "base64",
          preflightCommitment: "confirmed",
        })
        .send();
    } catch (err) {
      return {
        ok: false,
        reason: `transaction rejected: ${(err as Error).message}`,
      };
    }
    for (let i = 0; i < 60; i++) {
      const { value } = await rpc.getSignatureStatuses([signature]).send();
      const status = value[0];
      if (status?.err) return { ok: false, reason: "transaction failed" };
      if (
        status?.confirmationStatus === "confirmed" ||
        status?.confirmationStatus === "finalized"
      )
        break;
      await new Promise((r) => setTimeout(r, 500));
    }

    // Same server-side check as the checkout tutorial: read the settled
    // transaction back and confirm the payTo account received the amount.
    const check = await verifyPayment({
      signature,
      storeOwner: options.payTo,
      mint: USDC_MINT,
      amount: transfer.data.amount,
    });
    return check.paid
      ? { ok: true, signature }
      : { ok: false, reason: check.reason };
  }
}
// #endregion server
