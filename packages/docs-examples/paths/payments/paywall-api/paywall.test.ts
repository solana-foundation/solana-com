import type { AddressInfo } from "node:net";
import { generateKeyPairSigner, type KeyPairSigner } from "@solana/kit";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fundSol, setTokenBalance } from "../../../test/fixtures/fund";
import { fetchTx, recordText, runExample } from "../../../test/record";
import { run } from "./run";
import { createPaywallServer } from "./server";
import { NETWORK } from "./x402";

const out = (name: string) => new URL(`./${name}.output.txt`, import.meta.url);
const PRICE = 1_000n; // 0.001 USDC

describe("paths/payments/paywall-api (x402-style)", () => {
  let buyer: KeyPairSigner;
  let seller: KeyPairSigner;
  let server: ReturnType<typeof createPaywallServer>;
  let url = "";

  beforeAll(async () => {
    buyer = await generateKeyPairSigner();
    seller = await generateKeyPairSigner();
    await fundSol(buyer.address);
    await setTokenBalance(buyer.address, 1_000_000n); // 1 USDC
    await setTokenBalance(seller.address, 0n);
    server = createPaywallServer({ payTo: seller.address, price: PRICE });
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const { port } = server.address() as AddressInfo;
    url = `http://127.0.0.1:${port}/api/forecast`;
  });
  afterAll(() => new Promise((resolve) => server?.close(resolve)));

  it("run: paywall-api/run.ts gets 402, pays, is refused a replay and an over-cap payment", async () => {
    const r = await runExample(() => run(buyer, 0), { output: out("run") });
    expect(r.value.statuses).toEqual([402, 200, 402]);
    expect(r.value.refused).toBe(true);
    expect(r.succeeded).toEqual([r.value.signature]);
    const tx = await fetchTx(
      r.value.signature as Parameters<typeof fetchTx>[0],
    );
    expect(tx.meta?.err).toBeNull();
    const credited = tx.meta!.postTokenBalances!.find(
      (b) => b.owner === r.value.payTo,
    );
    expect(credited?.uiTokenAmount.amount).toBe(PRICE.toString());

    // The browser page shows the unpaid request under server.ts. The try-it
    // demo shows the unpaid and the paid request, and its checks panel the
    // replay and the over-cap client.
    const lines = r.text.split("\n");
    const paid = lines.findIndex((l) => l.includes("(paid)"));
    const replay = lines.findIndex((l) => l.includes("(replayed X-PAYMENT)"));
    expect([paid, replay, lines.length]).toEqual([3, 6, 8]);
    recordText(out("server"), lines.slice(0, paid).join("\n"));
    recordText(out("client"), lines.slice(paid, replay).join("\n"));
    recordText(out("client.replay"), lines[replay]!);
    recordText(out("client.cap"), lines[replay + 1]!);
  });

  it("server: malformed X-PAYMENT headers get 402 and the server stays up", async () => {
    const enc = (v: unknown) =>
      Buffer.from(JSON.stringify(v)).toString("base64");
    const exact = { x402Version: 1, scheme: "exact", network: NETWORK };
    const cases: string[] = [
      "!!!not base64 json!!!",
      enc(null),
      enc({ ...exact }),
      enc({ ...exact, payload: {} }),
      enc({ ...exact, payload: { transaction: 42 } }),
      enc({ ...exact, payload: { transaction: "AAAA" } }),
      enc({
        ...exact,
        payload: { transaction: Buffer.alloc(300, 7).toString("base64") },
      }),
      enc({ ...exact, scheme: "upto", payload: { transaction: "AAAA" } }),
    ];
    for (const header of cases) {
      const res = await fetch(url, { headers: { "X-PAYMENT": header } });
      expect(res.status, header).toBe(402);
      const body = (await res.json()) as { error: string; accepts: unknown[] };
      expect(body.accepts).toHaveLength(1);
      expect(body.error).toMatch(/malformed|unsupported/);
    }
    // Still serving.
    expect((await fetch(url)).status).toBe(402);
  });
});
