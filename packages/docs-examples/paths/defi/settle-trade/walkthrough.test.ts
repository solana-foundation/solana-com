/**
 * Records the transaction behind the "See a transaction in action" walkthrough
 * on How Solana works (apps/docs/src/components/tx-walkthrough): a SettleDvp of
 * a trade whose cash leg is exactly 100 USDC, sent by the tutorial's own
 * settle() in trade.ts. Not shown on any page.
 *
 * The fixture holds the raw getTransaction response (encoding "json") and the
 * wire transaction (base64), exactly as the local RPC returned them, plus a
 * name for each address so the walkthrough can say "USDC escrow" instead of a
 * bare address. Re-record with RECORD_OUTPUT=1; otherwise the committed file
 * must keep the same shape (base58 strings and numbers normalized), so the
 * walkthrough cannot drift from what the program really does.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  generateKeyPairSigner,
  type Address,
  type KeyPairSigner,
} from "@solana/kit";
import { MEMO_PROGRAM_ADDRESS } from "@solana-program/memo";
import { TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import {
  ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
  findAssociatedTokenPda,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { beforeAll, describe, expect, it } from "vitest";
import { fundSol, setTokenBalance } from "../../../test/fixtures/fund";
import { normalizeShape, runExample } from "../../../test/record";
import { approveHolder, openAccount } from "./approve-holder";
import { createAsset } from "./create-asset";
import { DVP_SWAP_PROGRAM_PROGRAM_ADDRESS } from "./dvp";
import {
  approveEscrow,
  balance,
  createTrade,
  fundAssetLeg,
  fundCashLeg,
  settle,
  USDC_MINT,
  type Trade,
} from "./trade";

const FIXTURE = new URL("./settle-walkthrough.json", import.meta.url);
const RPC_URL = process.env.RPC_URL ?? "http://127.0.0.1:8899";
const CASH = 100_000_000n; // 100 USDC (6 decimals)
const ASSET = 80_000_000n; // 80 LSF at the tutorial's $1.25 per share

async function rpcCall(method: string, params: unknown[]) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const body = (await res.json()) as { result?: unknown; error?: unknown };
  if (body.error) throw new Error(`${method}: ${JSON.stringify(body.error)}`);
  return body.result;
}

const ata = async (owner: Address, mint: Address, tokenProgram: Address) =>
  (await findAssociatedTokenPda({ owner, mint, tokenProgram }))[0];

describe("paths/defi/settle-trade walkthrough fixture (SettleDvp, 100 USDC)", () => {
  let issuer: KeyPairSigner;
  let seller: KeyPairSigner;
  let buyer: KeyPairSigner;
  let agent: KeyPairSigner;
  let asset: Address;
  let trade: Trade;

  beforeAll(async () => {
    [issuer, seller, buyer, agent] = (await Promise.all(
      [0, 1, 2, 3].map(() => generateKeyPairSigner()),
    )) as [KeyPairSigner, KeyPairSigner, KeyPairSigner, KeyPairSigner];
    await Promise.all([
      fundSol(issuer.address, 2),
      fundSol(seller.address),
      fundSol(buyer.address),
      fundSol(agent.address),
    ]);
    ({ mint: asset } = await createAsset(issuer));
    for (const [owner, amount] of [
      [seller.address, 1_000_000_000n],
      [buyer.address, 0n],
    ] as const) {
      await openAccount(issuer, asset, owner);
      await approveHolder(issuer, asset, owner, amount);
    }
    await setTokenBalance(buyer.address, CASH, USDC_MINT);
  });

  it("records a Settle that moves 100 USDC out of the PDA-owned escrow", async () => {
    // The tutorial's steps, with the cash leg fixed at 100 USDC.
    const { value: signature } = await runExample(async () => {
      ({ trade } = await createTrade(agent, {
        seller: seller.address,
        buyer: buyer.address,
        agent: agent.address,
        asset,
        assetAmount: ASSET,
        cashAmount: CASH,
      }));
      await approveEscrow(issuer, trade);
      await fundAssetLeg(seller, trade);
      await fundCashLeg(buyer, trade);
      expect(await balance(trade.escrowB)).toBe(CASH);
      return settle(agent, trade);
    });

    const config = {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    };
    const getTransaction = (await rpcCall("getTransaction", [
      signature,
      { ...config, encoding: "json" },
    ])) as {
      transaction: { signatures: string[]; message: { accountKeys: string[] } };
      meta: {
        err: unknown;
        fee: number;
        postTokenBalances: {
          owner: string;
          uiTokenAmount: { amount: string };
        }[];
      };
    };
    const wire = (await rpcCall("getTransaction", [
      signature,
      { ...config, encoding: "base64" },
    ])) as { transaction: [string, "base64"] };

    const T = TOKEN_PROGRAM_ADDRESS;
    const T22 = TOKEN_2022_PROGRAM_ADDRESS;
    const labels: Record<string, string> = {
      [agent.address]: "Settlement agent",
      [seller.address]: "Seller",
      [buyer.address]: "Buyer",
      [trade.record]: "Trade record (PDA)",
      [trade.escrowA]: "LSF escrow",
      [trade.escrowB]: "USDC escrow",
      [await ata(seller.address, USDC_MINT, T)]: "Seller's USDC account",
      [await ata(buyer.address, asset, T22)]: "Buyer's LSF account",
      [await ata(seller.address, asset, T22)]: "Seller's LSF account",
      [await ata(buyer.address, USDC_MINT, T)]: "Buyer's USDC account",
      [USDC_MINT]: "USDC mint",
      [asset]: "LSF mint",
      [DVP_SWAP_PROGRAM_PROGRAM_ADDRESS]: "DvP program",
      [T]: "Token Program",
      [T22]: "Token-2022 Program",
      [ASSOCIATED_TOKEN_PROGRAM_ADDRESS]: "Associated Token Program",
      [MEMO_PROGRAM_ADDRESS]: "Memo Program",
      "11111111111111111111111111111111": "System Program",
    };
    const fixture = {
      note: "Recorded by walkthrough.test.ts on a local Surfpool (mainnet fork). Re-record with RECORD_OUTPUT=1.",
      signature,
      cashAmount: String(CASH),
      assetAmount: String(ASSET),
      labels,
      wireBase64: wire.transaction[0],
      getTransaction,
    };

    // What the walkthrough says has to be true of the recorded run.
    expect(getTransaction.meta.err).toBeNull();
    expect(getTransaction.meta.fee).toBeGreaterThan(0);
    expect(getTransaction.transaction.signatures).toEqual([signature]);
    expect(getTransaction.transaction.message.accountKeys[0]).toBe(
      agent.address,
    );
    for (const key of getTransaction.transaction.message.accountKeys)
      expect(labels[key], `no label for ${key}`).toBeDefined();
    const sellerUsdc = getTransaction.meta.postTokenBalances.find(
      (b) =>
        b.owner === seller.address &&
        labels[
          getTransaction.transaction.message.accountKeys[
            (b as unknown as { accountIndex: number }).accountIndex
          ]!
        ] === "Seller's USDC account",
    );
    expect(sellerUsdc?.uiTokenAmount.amount).toBe(String(CASH));

    const path = fileURLToPath(FIXTURE);
    const text = `${JSON.stringify(fixture, null, 2)}\n`;
    if (process.env.RECORD_OUTPUT === "1") {
      writeFileSync(path, text);
    } else {
      expect(
        existsSync(path),
        `${path} is missing; record it with RECORD_OUTPUT=1`,
      ).toBe(true);
      // base64 is not base58, so mask it before normalizing. The committed
      // file is formatted by oxfmt, so compare it re-serialized.
      const shape = (t: string) =>
        normalizeShape(t.replace(/"wireBase64": "[^"]*"/, '"wireBase64": ""'));
      const committed = `${JSON.stringify(JSON.parse(readFileSync(path, "utf8")), null, 2)}\n`;
      expect(
        shape(text),
        `fixture shape drifted from ${path}; re-record with RECORD_OUTPUT=1`,
      ).toBe(shape(committed));
    }
  });
});
