import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "vitest";
import { expectExampleLogsSignature } from "../../../test/assert-signature";

describe("cookbook/transactions/versioned-transaction-alt/legacy", () => {
  it("creates and uses an address lookup table", async () => {
    const ledger = await mkdtemp(join(tmpdir(), "docs-alt-validator-"));
    const rpcUrl = "http://127.0.0.1:18999";
    const validator = spawn(
      "solana-test-validator",
      [
        "--reset",
        "--quiet",
        "--ledger",
        ledger,
        "--rpc-port",
        "18999",
        "--faucet-port",
        "19001",
        "--gossip-port",
        "19002",
        "--dynamic-port-range",
        "19003-19103",
      ],
      { stdio: "ignore" },
    );

    try {
      await waitForRpc(rpcUrl, validator);
      process.env.SOLANA_RPC_URL = rpcUrl;
      await expectExampleLogsSignature(() => import("./legacy"));
    } finally {
      delete process.env.SOLANA_RPC_URL;
      await stopValidator(validator);
      await rm(ledger, { force: true, recursive: true });
    }
  }, 60_000);
});

async function waitForRpc(
  rpcUrl: string,
  validator: ReturnType<typeof spawn>,
): Promise<void> {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (validator.exitCode !== null) {
      throw new Error(`test validator exited with code ${validator.exitCode}`);
    }

    try {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getHealth",
        }),
      });
      if (response.ok) return;
    } catch {
      // The validator is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error("test validator did not become ready");
}

function stopValidator(validator: ReturnType<typeof spawn>): Promise<void> {
  if (validator.exitCode !== null) return Promise.resolve();

  return new Promise((resolve) => {
    validator.once("exit", () => resolve());
    validator.kill("SIGTERM");
  });
}
