import { spawn, ChildProcess } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const RPC_URL = "http://localhost:8899";
const READY_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 500;

let surfpool: ChildProcess | null = null;
let workDir: string | null = null;

export async function setup(): Promise<void> {
  // surfpool writes ./.surfpool/logs by default; give it a throwaway cwd so
  // these artifacts don't end up in the package directory.
  workDir = mkdtempSync(join(tmpdir(), "docs-examples-surfpool-"));

  surfpool = spawn(
    "surfpool",
    [
      "start",
      "--no-tui",
      "--no-studio",
      "--no-deploy",
      "--offline",
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
