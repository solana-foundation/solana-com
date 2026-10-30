import { inspect } from "node:util";
import type { AddressInfo } from "node:net";
import {
  generateKeyPairSigner,
  type KeyPairSigner,
  type Signature,
} from "@solana/kit";
import { beforeAll, describe, expect, it } from "vitest";
import { fundSol, setTokenBalance } from "../../../test/fixtures/fund";
import { recordText, runExample } from "../../../test/record";
import { confirm, newOrder } from "./demo";
import { getOrder, type Order } from "./orders";
import { payStore } from "./pay";
import { run } from "./run";
import { createCheckoutServer } from "./server";
import { verifyPayment } from "./verify-payment";
import { USDC_MINT } from "./config";

const out = (name: string) => new URL(`./${name}.output.txt`, import.meta.url);

describe("paths/payments/checkout", () => {
  let customer: KeyPairSigner;
  let store: KeyPairSigner;
  let order: Order;
  let paid: Signature;

  beforeAll(async () => {
    customer = await generateKeyPairSigner();
    store = await generateKeyPairSigner();
    await fundSol(customer.address);
    await setTokenBalance(customer.address, 10_000_000n); // 10 USDC
    await setTokenBalance(store.address, 0n); // the store's USDC account exists
  });

  it("run: checkout/run.ts pays an order and confirms it once", async () => {
    const r = await runExample(() => run(customer, 0), {
      output: out("run"),
    });
    ({ order, signature: paid } = r.value);
    expect(r.value.results).toEqual([200, 402]);
    expect([...new Set(r.succeeded)]).toEqual([paid]);
    // Step 1 of the try-it demo and the pay blocks show what Node prints
    // for the order and for the signature payStore() returned, as at a REPL
    // prompt (pay.run.json holds the prompts).
    expect(order).toEqual({
      id: "order-1001",
      storeOwner: r.value.store,
      amount: 1_000_000n,
      reference: order.reference,
    });
    recordText(out("pay"), `${inspect(order)}\n${inspect(paid)}`);
  });

  it("verify: verifyPayment checks amount, mint, recipient and reference", async () => {
    // The calls the verify block's prompts show (verify-payment.run.json),
    // printed the way Node prints their results.
    const r = await runExample(
      async () => {
        const signature = paid;
        const ok = await verifyPayment({
          ...order,
          signature,
          mint: USDC_MINT,
        });
        console.log(ok);
        const wrong = await verifyPayment({
          ...order,
          amount: 2_000_000n,
          signature,
          mint: USDC_MINT,
        });
        console.log(wrong);
        return { ok, wrong };
      },
      {
        output: out("verify-payment"),
        signatures: "none",
      },
    );
    expect(r.value.ok).toEqual({ paid: true });
    expect(r.value.wrong).toEqual({
      paid: false,
      reason: "amount mismatch: expected 2000000, received 1000000",
    });
    // The try-it demo shows the passing check as the shop's step and the
    // refused one in its own panel (checks.mdx).
    expect(r.text).toBe(`${inspect(r.value.ok)}\n${inspect(r.value.wrong)}`);
    recordText(out("verify-payment.paid"), inspect(r.value.ok));
    recordText(out("verify-payment.mismatch"), inspect(r.value.wrong));

    const base = {
      signature: paid,
      storeOwner: order.storeOwner,
      mint: USDC_MINT,
      amount: order.amount,
      reference: order.reference,
    };
    expect(await verifyPayment({ ...base, amount: 2_000_000n })).toEqual({
      paid: false,
      reason: "amount mismatch: expected 2000000, received 1000000",
    });
    const other = await generateKeyPairSigner();
    expect(await verifyPayment({ ...base, reference: other.address })).toEqual({
      paid: false,
      reason: "reference not found",
    });
    expect(await verifyPayment({ ...base, storeOwner: other.address })).toEqual(
      {
        paid: false,
        reason: "amount mismatch: expected 1000000, received 0",
      },
    );
    expect(await verifyPayment({ ...base, mint: other.address })).toEqual({
      paid: false,
      reason: "amount mismatch: expected 1000000, received 0",
    });
  });

  it("route: confirms once, rejects a replay and a short payment", async () => {
    const order2 = await newOrder("order-1002", store.address, 1_000_000n);
    const sig2 = await payStore(customer, order2);
    const order3 = await newOrder("order-1003", store.address, 2_000_000n);
    const short = await payStore(customer, { ...order3, amount: 1_000_000n });
    const r = await runExample(
      async () => {
        const first = await confirm(order2.id, sig2);
        const replay = await confirm(order2.id, sig2);
        const underpaid = await confirm(order3.id, short);
        return { first, replay, underpaid };
      },
      { output: out("route") },
    );
    expect(r.value.first).toEqual({
      status: 200,
      body: { paid: true, orderId: order2.id, signature: sig2 },
    });
    expect(r.value.replay).toEqual({
      status: 402,
      body: { paid: false, reason: "already used" },
    });
    expect(r.value.underpaid).toEqual({
      status: 402,
      body: {
        paid: false,
        reason: "amount mismatch: expected 2000000, received 1000000",
      },
    });
  });

  it("server: the node:http variant confirms a payment", async () => {
    const server = createCheckoutServer();
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const { port } = server.address() as AddressInfo;
    try {
      const order4 = await newOrder("order-1004", store.address, 1_500_000n);
      const sig = await payStore(customer, order4);
      const res4 = await fetch(
        `http://127.0.0.1:${port}/api/orders/${order4.id}/confirm`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ signature: sig }),
        },
      );
      expect(res4.status).toBe(200);

      // Hostile or broken requests get 4xx answers and the server stays up.
      const post = (path: string, body: string) =>
        fetch(`http://127.0.0.1:${port}${path}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body,
        });
      expect((await post("/api/orders/%E0%A4%A/confirm", "{}")).status).toBe(
        400,
      );
      expect(
        (await post("/api/orders/order-1004/confirm", "not json")).status,
      ).toBe(400);
      expect(
        (await post("/api/orders/order-1004/confirm", "null")).status,
      ).toBe(400);
      expect(
        (
          await post(
            "/api/orders/order-1004/confirm",
            JSON.stringify({ signature: 42 }),
          )
        ).status,
      ).toBe(400);
      expect((await post("/api/orders/nope/confirm", "{}")).status).toBe(404);

      // A second, different valid payment for an already-paid order is refused.
      const again = await payStore(customer, (await getOrder("order-1004"))!);
      const res = await post(
        "/api/orders/order-1004/confirm",
        JSON.stringify({ signature: again }),
      );
      expect(res.status).toBe(402);
      expect(await res.json()).toEqual({ paid: false, reason: "already used" });
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
