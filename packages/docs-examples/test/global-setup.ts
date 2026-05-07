import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { createConnection, createServer, type Server, type Socket } from "node:net";
import { homedir } from "node:os";
import { join } from "node:path";
import { Surfnet } from "surfpool-sdk";

const RPC_PORT = 8899;
const WS_PORT = 8900;

let surfnet: Surfnet | null = null;
let rpcProxy: Server | null = null;
let wsProxy: Server | null = null;

export async function setup(): Promise<void> {
  ensureCliKeypair();

  // Mainnet datasource so cookbook examples that look up real accounts
  // (USDC mint, Token Program, Metaplex Token Metadata, etc.) resolve via
  // surfpool's lazy account cloning.
  surfnet = Surfnet.startWithConfig({
    remoteRpcUrl:
      process.env.SURFPOOL_DATASOURCE_RPC_URL ??
      "https://api.mainnet-beta.solana.com",
  });

  // The SDK binds dynamic ports. Examples in the cookbook hardcode 8899/8900
  // because that is what a reader would type. Proxy the canonical ports onto
  // the SDK's actual ports so example code runs as-shipped.
  const { host: rpcHost, port: rpcPort } = parseUrl(surfnet.rpcUrl);
  const { host: wsHost, port: wsPort } = parseUrl(surfnet.wsUrl);
  rpcProxy = await startProxy(RPC_PORT, rpcHost, rpcPort);
  wsProxy = await startProxy(WS_PORT, wsHost, wsPort);
}

export async function teardown(): Promise<void> {
  await Promise.all([closeServer(rpcProxy), closeServer(wsProxy)]);
  rpcProxy = null;
  wsProxy = null;
  surfnet = null;
}

function startProxy(
  listenPort: number,
  targetHost: string,
  targetPort: number,
): Promise<Server> {
  const server = createServer((client: Socket) => {
    const upstream = createConnection({ host: targetHost, port: targetPort });
    client.on("error", () => upstream.destroy());
    upstream.on("error", () => client.destroy());
    client.pipe(upstream).pipe(client);
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(listenPort, "127.0.0.1", () => {
      server.removeListener("error", reject);
      resolve(server);
    });
  });
}

function closeServer(server: Server | null): Promise<void> {
  if (!server) return Promise.resolve();
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}

function parseUrl(url: string): { host: string; port: number } {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: Number(u.port),
  };
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
