import { spawn, ChildProcess } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const RPC_URL = "http://localhost:8899";
const READY_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 500;

let validator: ChildProcess | null = null;
let ledgerDir: string | null = null;

export async function setup(): Promise<void> {
  ledgerDir = mkdtempSync(join(tmpdir(), "docs-examples-ledger-"));

  validator = spawn(
    "solana-test-validator",
    ["--quiet", "--reset", "--ledger", ledgerDir, "--rpc-port", "8899"],
    { stdio: "ignore", detached: false },
  );

  validator.on("error", (err) => {
    throw new Error(
      `failed to spawn solana-test-validator: ${err.message}. ` +
        `Install the Solana CLI: sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"`,
    );
  });

  await waitForRpc(RPC_URL, READY_TIMEOUT_MS);
}

export async function teardown(): Promise<void> {
  if (validator && validator.pid !== undefined) {
    try {
      process.kill(validator.pid, "SIGTERM");
    } catch {
      // already gone
    }
  }
  if (ledgerDir) {
    try {
      rmSync(ledgerDir, { recursive: true, force: true });
    } catch {
      // best-effort cleanup; tmp dir gets reaped eventually
    }
  }
}

async function waitForRpc(url: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastErr: unknown = null;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getHealth",
        }),
      });
      if (res.ok) {
        const body = (await res.json()) as { result?: string };
        if (body.result === "ok") return;
      }
    } catch (err) {
      lastErr = err;
    }
    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error(
    `solana-test-validator did not become ready at ${url} within ${timeoutMs}ms` +
      (lastErr ? ` (last error: ${(lastErr as Error).message})` : ""),
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
