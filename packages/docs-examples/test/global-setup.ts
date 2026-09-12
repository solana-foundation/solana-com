import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// Cookbook examples hardcode these ports because that is what a reader would
// type, so surfpool is bound to them directly.
const RPC_PORT = 8899;
const WS_PORT = 8900;

const READY_TIMEOUT_MS = 120_000;

let surfpool: ChildProcess | null = null;

export async function setup(): Promise<void> {
  ensureCliKeypair();

  // Mainnet datasource so cookbook examples that look up real accounts
  // (USDC mint, Token Program, Metaplex Token Metadata, etc.) resolve via
  // surfpool's lazy account cloning.
  //
  // The forked cluster also supplies the feature set, which is what makes
  // transaction v1 examples executable: surfpool reports a feature gate as
  // active exactly when the cluster it forks does.
  const datasourceRpcUrl =
    process.env.SURFPOOL_DATASOURCE_RPC_URL ??
    "https://api.mainnet-beta.solana.com";

  surfpool = spawn(
    "surfpool",
    [
      "start",
      "--no-tui",
      "--port",
      String(RPC_PORT),
      "--ws-port",
      String(WS_PORT),
      "--rpc-url",
      datasourceRpcUrl,
    ],
    { stdio: "ignore" },
  );

  surfpool.once("exit", (code) => {
    if (surfpool !== null) {
      throw new Error(`surfpool exited before teardown with code ${code}`);
    }
  });

  await waitForRpc();
}

export async function teardown(): Promise<void> {
  const child = surfpool;
  surfpool = null;
  if (child === null) return;

  child.kill("SIGTERM");
  await new Promise<void>((resolve) => {
    child.once("exit", () => resolve());
    setTimeout(() => {
      child.kill("SIGKILL");
      resolve();
    }, 5_000).unref();
  });
}

/** Polls `getHealth` until surfpool serves RPC, so examples never race startup. */
async function waitForRpc(): Promise<void> {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${RPC_PORT}`, {
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "getHealth",
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      if (response.ok) return;
    } catch {
      // Connection refused until the listener is bound; keep polling.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(
    `surfpool did not serve RPC on port ${RPC_PORT} within ${READY_TIMEOUT_MS}ms. Install the CLI: cargo install --git https://github.com/txtx/surfpool --locked surfpool-cli`,
  );
}

/**
 * Cookbook examples assume a Solana CLI keypair exists at the default path.
 * On a dev machine `solana-keygen new` would have set this up; in CI we shell
 * out to the same command so the file is written exactly the way a real user
 * would have produced it.
 */
function ensureCliKeypair(): void {
  const dir = join(homedir(), ".config", "solana");
  const path = join(dir, "id.json");
  if (existsSync(path)) return;

  mkdirSync(dir, { recursive: true });
  const result = spawnSync(
    "solana-keygen",
    ["new", "--no-bip39-passphrase", "--silent", "--outfile", path],
    { stdio: "ignore" },
  );
  if (result.status !== 0) {
    throw new Error(
      `failed to generate fixture keypair at ${path}. Install the Solana CLI: sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"`,
    );
  }
}
