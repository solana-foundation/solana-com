import { spawn, ChildProcess, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";

const RPC_URL = "http://localhost:8899";
const READY_TIMEOUT_MS = 90_000;
const POLL_INTERVAL_MS = 500;

let surfpool: ChildProcess | null = null;
let workDir: string | null = null;

export async function setup(): Promise<void> {
  ensureCliKeypair();

  workDir = mkdtempSync(join(tmpdir(), "docs-examples-surfpool-"));

  // Mainnet datasource so cookbook examples that look up real accounts
  // (USDC mint, Token Program, Metaplex Token Metadata, etc.) resolve via
  // surfpool's lazy account cloning. Override the upstream RPC by setting
  // SURFPOOL_DATASOURCE_RPC_URL if you have a paid endpoint.
  surfpool = spawn(
    "surfpool",
    [
      "start",
      "--no-tui",
      "--no-studio",
      "--no-deploy",
      "--network",
      "mainnet",
      "--log-level",
      "warn",
      "-y",
    ],
    { cwd: workDir, stdio: "ignore", detached: false },
  );

  surfpool.on("error", (err) => {
    throw new Error(
      `failed to spawn surfpool: ${err.message}. Install with: cargo install --git https://github.com/txtx/surfpool --locked surfpool-cli`,
    );
  });

  await waitForRpc(RPC_URL, READY_TIMEOUT_MS);
}

export async function teardown(): Promise<void> {
  if (surfpool && surfpool.pid !== undefined) {
    try {
      process.kill(surfpool.pid, "SIGTERM");
    } catch {
      // already gone
    }
  }
  if (workDir) {
    try {
      rmSync(workDir, { recursive: true, force: true });
    } catch {
      // best-effort cleanup
    }
  }
}

/**
 * Cookbook examples assume a Solana CLI keypair exists at the default path.
 * On a dev machine `solana-keygen new` would have set this up; in CI we
 * generate a throwaway one so load-keypair-from-file etc. have something
 * real to read.
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
      `failed to generate fixture keypair at ${path}. Either install the Solana CLI or pre-create the file.`,
    );
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
    `surfpool did not become ready at ${url} within ${timeoutMs}ms` +
      (lastErr ? ` (last error: ${(lastErr as Error).message})` : ""),
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
