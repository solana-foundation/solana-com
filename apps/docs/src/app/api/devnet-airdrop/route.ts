import {
  appendTransactionMessageInstructions,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createTransactionMessage,
  getBase64EncodedWireTransaction,
  getSignatureFromTransaction,
  isAddress,
  lamports,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type Address,
  type KeyPairSigner,
  type Signature,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import { allow, clientKey, ipKey } from "@/lib/docs-demo/rate-limit";
import {
  dailyCapReached,
  envNumber,
  memoInstruction,
  MEMOS,
} from "@/lib/docs-demo/onchainLimits";

/**
 * POST /api/devnet-airdrop: 0.02 devnet SOL for a new Quickstart wallet, sent
 * from a small server-held devnet faucet wallet. Takes `{ "address": "..." }`
 * as JSON or a form body (so the CLI tab can use `curl -d address=...`), waits
 * for the transfer to confirm, and returns `{ signature }` or `{ error }`.
 *
 * Each wallet is funded once, enforced onchain rather than in a database: the
 * recipient must have a zero balance and no transaction history. The transfer
 * itself gives it history, so it can never be funded again. In-memory limits
 * per IP, per address, and per instance (see rate-limit.ts) are a cheap first
 * layer. Across all instances, each transfer carries a memo and the faucet
 * wallet's own history caps them at AIRDROP_DAILY_CAP a day (default 1000, see
 * onchainLimits.ts), and it never sends below AIRDROP_RESERVE_SOL (default 5),
 * which keeps the demos running. The amount is fixed here, never read from
 * the request, so the worst case is the cap times 0.02 SOL a day.
 *
 * 0.02 SOL is about twice what the Quickstart's five steps spend: the
 * TypeScript tabs use 0.0098 SOL (fees, plus deposits for the recipient's USDC
 * account, the EXF Token-2022 mint with its metadata, and two EXF token
 * accounts), the CLI tabs 0.0076 SOL. The docs-examples tests check it.
 *
 * The faucet is the "Solana in action" demo payer (DEMO_PAYER_SECRET_KEY),
 * which is funded with plenty of devnet SOL; DEVNET_FAUCET_SECRET_KEY, if set,
 * overrides it with a separate wallet. Both are 64-byte secret keys as a JSON
 * array (solana-keygen's format), set per Vercel environment. Without either
 * (local dev) the route answers 503 and points to faucet.solana.com.
 * HELIUS_API_KEY, when set, picks Helius's devnet RPC over public devnet.
 * Neither the key nor the keyed RPC URL ever leaves the server.
 */
export const runtime = "nodejs";

const AMOUNT = 20_000_000n; // 0.02 SOL
const LAMPORTS_PER_SOL = 1_000_000_000;
/** Airdrops a day across every instance, counted onchain. */
const dailyCap = () => envNumber("AIRDROP_DAILY_CAP", 1000);
/** SOL the faucet wallet always keeps, so the demos it pays for keep working. */
const reserve = () =>
  BigInt(Math.round(envNumber("AIRDROP_RESERVE_SOL", 5) * LAMPORTS_PER_SOL));
const HOUR = 60 * 60 * 1000;
const PER_ADDRESS = { limit: 1, windowMs: 24 * HOUR };
const PER_IP = { limit: 1, windowMs: 24 * HOUR };
const GLOBAL = { limit: 100, windowMs: HOUR };
const FAUCET = "https://faucet.solana.com";
const ELSEWHERE = `Get devnet SOL at ${FAUCET} instead.`;

/** JSON with a trailing newline, so curl output ends cleanly. */
function json(body: Record<string, string>, status = 200) {
  return new Response(`${JSON.stringify(body)}\n`, {
    status,
    headers: { "content-type": "application/json" },
  });
}

const unavailable = () =>
  json({ error: `This faucet is not available here. ${ELSEWHERE}` }, 503);

async function readAddress(request: Request): Promise<unknown> {
  try {
    if (request.headers.get("content-type")?.includes("json")) {
      return ((await request.json()) as { address?: unknown })?.address;
    }
    return (await request.formData()).get("address");
  } catch {
    return undefined;
  }
}

async function faucetSigner(raw: string): Promise<KeyPairSigner | undefined> {
  try {
    return await createKeyPairSignerFromBytes(
      Uint8Array.from(JSON.parse(raw) as number[]),
    );
  } catch {
    return undefined;
  }
}

function devnetRpcUrl(): string {
  const key = process.env.HELIUS_API_KEY;
  return key
    ? `https://devnet.helius-rpc.com/?api-key=${key}`
    : "https://api.devnet.solana.com";
}

type DevnetRpc = ReturnType<typeof createSolanaRpc>;

/** True when the wallet has never held SOL or signed anything. */
async function isNewWallet(rpc: DevnetRpc, wallet: Address) {
  const [{ value: balance }, history] = await Promise.all([
    rpc.getBalance(wallet, { commitment: "confirmed" }).send(),
    rpc
      .getSignaturesForAddress(wallet, { limit: 1, commitment: "confirmed" })
      .send(),
  ]);
  return balance === 0n && history.length === 0;
}

async function confirm(rpc: DevnetRpc, signature: Signature) {
  for (let i = 0; i < 60; i++) {
    const { value } = await rpc.getSignatureStatuses([signature]).send();
    const status = value[0];
    if (status?.err) throw new Error("transfer failed");
    if (
      status?.confirmationStatus === "confirmed" ||
      status?.confirmationStatus === "finalized"
    ) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("transfer not confirmed");
}

async function send(rpc: DevnetRpc, faucet: KeyPairSigner, to: Address) {
  const { value: blockhash } = await rpc
    .getLatestBlockhash({ commitment: "confirmed" })
    .send();
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(faucet, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(blockhash, m),
    (m) =>
      appendTransactionMessageInstructions(
        [
          getTransferSolInstruction({
            source: faucet,
            destination: to,
            amount: lamports(AMOUNT),
          }),
          memoInstruction(MEMOS.airdrop),
        ],
        m,
      ),
  );
  const signed = await signTransactionMessageWithSigners(message);
  const signature = getSignatureFromTransaction(signed);
  await rpc
    .sendTransaction(getBase64EncodedWireTransaction(signed), {
      encoding: "base64",
      preflightCommitment: "confirmed",
    })
    .send();
  await confirm(rpc, signature);
  return signature;
}

export async function POST(request: Request) {
  const secret =
    process.env.DEVNET_FAUCET_SECRET_KEY || process.env.DEMO_PAYER_SECRET_KEY;
  if (!secret) return unavailable();

  const address = await readAddress(request);
  if (typeof address !== "string" || !isAddress(address)) {
    return json({ error: "Send a base58 Solana address as `address`." }, 400);
  }

  if (
    !allow(
      `airdrop:ip:${ipKey(clientKey(request))}`,
      PER_IP.limit,
      PER_IP.windowMs,
    ) ||
    !allow(
      `airdrop:address:${address}`,
      PER_ADDRESS.limit,
      PER_ADDRESS.windowMs,
    ) ||
    !allow("airdrop:global", GLOBAL.limit, GLOBAL.windowMs)
  ) {
    return json({ error: `Airdrop limit reached. ${ELSEWHERE}` }, 429);
  }

  const faucet = await faucetSigner(secret);
  if (!faucet) return unavailable();

  // Never echo an upstream error: it can carry the keyed RPC URL.
  try {
    const rpc = createSolanaRpc(devnetRpcUrl());
    if (!(await isNewWallet(rpc, address))) {
      return json(
        {
          error: `This wallet already has devnet SOL or history. Get more at ${FAUCET}.`,
        },
        409,
      );
    }
    const [{ value: left }, capped] = await Promise.all([
      rpc.getBalance(faucet.address, { commitment: "confirmed" }).send(),
      dailyCapReached(rpc, faucet.address, MEMOS.airdrop, dailyCap()),
    ]);
    if (left < AMOUNT + reserve()) {
      return unavailable(); // down to the reserve: refill from faucet.solana.com
    }
    if (capped) {
      return json({ error: `Airdrop limit reached. ${ELSEWHERE}` }, 429);
    }
    return json({ signature: await send(rpc, faucet, address) });
  } catch {
    return json({ error: `Airdrop failed. ${ELSEWHERE}` }, 502);
  }
}
