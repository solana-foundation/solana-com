/**
 * Run an example, capture what it prints, check every signature it logs, and
 * record (RECORD_OUTPUT=1) or shape-check its committed `.output.txt`.
 *
 *   await runExample(() => import("./pay"), {
 *     output: new URL("./pay.output.txt", import.meta.url),
 *   });
 *
 * - Capture: console.log/info/warn/error, formatted with util.format exactly
 *   like Node prints them (bigints, objects, multiple args).
 * - Signatures (base58, 87-88 chars) must be real transactions on the local
 *   RPC. A signature on a line matching `failedLabel` must have FAILED
 *   (meta.err set); every other one must have succeeded.
 * - Recording: with RECORD_OUTPUT=1 the output file is (re)written. Otherwise
 *   the committed file must exist and match the run after normalizing base58
 *   strings to <b58> and numbers to <n> (signatures change every run; the
 *   format may not drift silently).
 *
 * The docs site embeds these files as "recorded output" (packages/docs-tooling
 * examples build), so they are always produced by a real Surfpool run.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { format } from "node:util";
import { expect, vi } from "vitest";
import {
  createSolanaRpc,
  signature as toSignature,
  type Signature,
} from "@solana/kit";

const SIGNATURE_RE = /[1-9A-HJ-NP-Za-km-z]{87,88}/g;

export interface RunExampleOptions {
  /** Where the recorded output lives (sibling `<file>.output.txt`). */
  output?: URL;
  /** "none" skips signature checks (pure examples). Default: "check". */
  signatures?: "check" | "none";
  /** Lines matching this hold signatures that must have failed onchain. */
  failedLabel?: RegExp;
  /** Require at least one signature in the output. Default true when checking. */
  requireSignature?: boolean;
}

export interface RunExampleResult<T> {
  value: T;
  text: string;
  /** The raw arguments of every captured console call, in order. */
  calls: unknown[][];
  succeeded: Signature[];
  failed: Signature[];
}

export function normalizeShape(text: string): string {
  return text
    .replace(/[1-9A-HJ-NP-Za-km-z]{32,88}/g, "<b58>")
    .replace(/\d+/g, "<n>")
    .replace(/[ \t]+$/gm, "")
    .trimEnd();
}

export async function runExample<T>(
  run: () => Promise<T> | T,
  opts: RunExampleOptions = {},
): Promise<RunExampleResult<T>> {
  const lines: string[] = [];
  const calls: unknown[][] = [];
  const methods = ["log", "info", "warn", "error"] as const;
  const spies = methods.map((m) =>
    vi.spyOn(console, m).mockImplementation((...args: unknown[]) => {
      calls.push(args);
      lines.push(format(...args));
    }),
  );
  let value: T;
  try {
    value = await run();
  } finally {
    for (const s of spies) s.mockRestore();
  }
  const text = lines.join("\n").replace(/\s+$/, "");

  const succeeded: Signature[] = [];
  const failed: Signature[] = [];
  if (opts.signatures !== "none") {
    for (const line of text.split("\n")) {
      for (const m of line.matchAll(SIGNATURE_RE)) {
        const sig = toSignature(m[0]);
        const tx = await fetchTx(sig);
        if (opts.failedLabel?.test(line)) {
          expect(
            tx.meta?.err,
            `expected ${sig} to fail onchain`,
          ).not.toBeNull();
          failed.push(sig);
        } else {
          expect(
            tx.meta?.err,
            `tx ${sig} errored: ${JSON.stringify(tx.meta?.err, bigintJson)}`,
          ).toBeNull();
          succeeded.push(sig);
        }
      }
    }
    if (opts.requireSignature ?? true)
      expect(
        succeeded.length + failed.length,
        `no signature logged:\n${text}`,
      ).toBeGreaterThan(0);
  }

  if (opts.output) {
    const path = fileURLToPath(opts.output);
    if (process.env.RECORD_OUTPUT === "1") {
      writeFileSync(path, `${text}\n`);
    } else {
      expect(
        existsSync(path),
        `${path} is missing; record it with RECORD_OUTPUT=1`,
      ).toBe(true);
      expect(
        normalizeShape(text),
        `output shape drifted from ${path}; re-record with RECORD_OUTPUT=1`,
      ).toBe(normalizeShape(readFileSync(path, "utf8")));
    }
  }
  return { value: value!, text, calls, succeeded, failed };
}

function bigintJson(_k: string, v: unknown) {
  return typeof v === "bigint" ? v.toString() : v;
}

export async function fetchTx(sig: Signature) {
  const rpc = createSolanaRpc(process.env.RPC_URL ?? "http://127.0.0.1:8899");
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

/** Record or shape-check output that did not come from console (e.g. a subprocess). */
export function recordText(output: URL, text: string): void {
  const path = fileURLToPath(output);
  const body = text.replace(/\s+$/, "");
  if (process.env.RECORD_OUTPUT === "1") {
    writeFileSync(path, `${body}\n`);
    return;
  }
  expect(
    existsSync(path),
    `${path} is missing; record it with RECORD_OUTPUT=1`,
  ).toBe(true);
  expect(normalizeShape(body)).toBe(normalizeShape(readFileSync(path, "utf8")));
}
