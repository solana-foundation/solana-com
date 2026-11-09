// Starts the same embedded surfnet the TypeScript suite uses
// (test/global-setup.ts) for the Python and Go runners, and proxies the
// canonical 8899/8900 ports onto it. Runs until it receives SIGINT/SIGTERM.
//
// Used through scripts/start-surfpool.sh rather than the surfpool CLI so every
// suite runs against the @solana/surfpool version pinned in the lockfile.
import { createConnection, createServer } from "node:net";
import { Surfnet } from "@solana/surfpool";

const surfnet = Surfnet.startWithConfig({
  remoteRpcUrl:
    process.env.SURFPOOL_DATASOURCE_RPC_URL ??
    "https://api.mainnet-beta.solana.com",
  slotTimeMs: 1_200,
});

const servers = [proxy(8899, surfnet.rpcUrl), proxy(8900, surfnet.wsUrl)];

function proxy(listenPort, targetUrl) {
  const { hostname, port } = new URL(targetUrl);
  const server = createServer((client) => {
    const upstream = createConnection({ host: hostname, port: Number(port) });
    client.on("error", () => upstream.destroy());
    upstream.on("error", () => client.destroy());
    client.pipe(upstream).pipe(client);
  });
  server.listen(listenPort, "127.0.0.1");
  return server;
}

function shutdown() {
  for (const server of servers) server.close();
  surfnet.stop();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
