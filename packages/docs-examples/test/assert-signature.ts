import { expect, vi } from "vitest";
import { signature } from "@solana/kit";

// Base58 signatures are 87 or 88 chars; the alphabet excludes 0 O I l.
const SIGNATURE_RE = /[1-9A-HJ-NP-Za-km-z]{87,88}/;

/**
 * Run a cookbook example and assert that the signature it logs is real.
 * Use this for any example that ends with `console.log("...:", signature)`.
 *
 * Pass a thunk so the dynamic import resolves relative to the test file,
 * not this helper.
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

  const match = logged.match(SIGNATURE_RE);
  expect(match, `expected example to log a base58 signature, got:\n${logged}`)
    .not.toBeNull();
  expect(() => signature(match![0])).not.toThrow();
}
