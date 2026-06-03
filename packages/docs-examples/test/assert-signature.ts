import { expect, vi } from "vitest";
import { createSolanaRpc, signature, type Signature } from "@solana/kit";

// Base58 signatures are 87 or 88 chars; the alphabet excludes 0 O I l.
const SIGNATURE_RE = /[1-9A-HJ-NP-Za-km-z]{87,88}/g;

const rpc = createSolanaRpc("http://127.0.0.1:8899");

/**
 * Run a cookbook example and assert every signature it logs is real.
 * Use this for any example that ends with `console.log("...:", signature)`.
 *
 * Pass a thunk so the dynamic import resolves relative to the test file,
 * not this helper.
 *
 * Two checks per signature:
 *   1. `signature()` parses the logged payload — catches a malformed string.
 *   2. The tx is fetchable from the local RPC and `meta.err === null` —
 *      catches the case where the example signs and submits a tx that
 *      errored on-chain (insufficient funds, simulation pass / execution
 *      fail, account already exists, etc.).
 */
export async function expectExampleLogsSignature(
  importExample: () => Promise<unknown>,
): Promise<void> {
  const logSpy = vi.spyOn(console, "log");
  let logged = "";
  try {
    await importExample();
    logged = logSpy.mock.calls
      .map((args) => args.map((a) => String(a)).join(" "))
      .join("\n");
  } finally {
    logSpy.mockRestore();
  }

  const matches = [...logged.matchAll(SIGNATURE_RE)].map((m) => m[0]);
  expect(
    matches.length,
    `expected example to log a base58 signature, got:\n${logged}`,
  ).toBeGreaterThan(0);

  for (const raw of matches) {
    const sig = signature(raw);
    const tx = await fetchTxWithRetry(sig);
    expect(
      tx.meta?.err,
      `tx ${sig} landed but errored: ${JSON.stringify(tx.meta?.err)}`,
    ).toBeNull();
  }
}

async function fetchTxWithRetry(sig: Signature) {
  for (let i = 0; i < 20; i++) {
    const tx = await rpc
      .getTransaction(sig, {
        commitment: "confirmed",
        encoding: "json",
        maxSupportedTransactionVersion: 0,
      })
      .send();
    if (tx) return tx;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`tx ${sig} not found on local RPC after 10s`);
}
