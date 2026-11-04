/**
 * Test-only stand-in for solana.com's devnet faucet (POST /api/devnet-airdrop,
 * apps/docs), which airdrops on real devnet. Here the airdrop lands on the
 * local Surfnet instead, so the Quickstart's airdrop branch runs end to end.
 */
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import {
  address,
  createSolanaRpc,
  lamports,
  type Signature,
} from "@solana/kit";
import { vi } from "vitest";
import { RPC_URL } from "./fund";

export const AIRDROP_URL = "https://solana.com/api/devnet-airdrop";

const rpc = createSolanaRpc(RPC_URL);

/** The endpoint's amount: 0.02 SOL (apps/docs/src/app/api/devnet-airdrop). */
export const AIRDROP_LAMPORTS = 20_000_000n;

/** What the endpoint does: 0.02 SOL to the form's `address`, once confirmed. */
async function airdrop(form: string): Promise<{ signature: Signature }> {
  const to = address(new URLSearchParams(form).get("address") ?? "");
  const signature = await rpc
    .requestAirdrop(to, lamports(AIRDROP_LAMPORTS))
    .send();
  for (let i = 0; i < 40; i++) {
    const { value } = await rpc.getSignatureStatuses([signature]).send();
    if (value[0]?.confirmationStatus) return { signature };
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`airdrop ${signature} did not land`);
}

/** Route fetch() calls to AIRDROP_URL to the Surfnet; others pass through. */
export function stubAirdropFetch(): void {
  const realFetch = globalThis.fetch;
  vi.stubGlobal(
    "fetch",
    async (input: string | URL | Request, init?: RequestInit) => {
      if (String(input) !== AIRDROP_URL) return realFetch(input, init);
      return Response.json(await airdrop(String(init?.body ?? "")));
    },
  );
}

/** A local HTTP server for curl, standing in for AIRDROP_URL. */
export async function startAirdropServer(): Promise<{
  url: string;
  close: () => void;
}> {
  const server = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    res.setHeader("content-type", "application/json");
    res.end(`${JSON.stringify(await airdrop(body))}\n`);
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const { port } = server.address() as AddressInfo;
  return { url: `http://127.0.0.1:${port}`, close: () => server.close() };
}
