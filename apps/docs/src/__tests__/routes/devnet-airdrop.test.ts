import { generateKeyPairSync } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createKeyPairSignerFromBytes,
  getBase64Encoder,
  getCompiledTransactionMessageDecoder,
  getTransactionDecoder,
  getU64Decoder,
} from "@solana/kit";
import { POST } from "@/app/api/devnet-airdrop/route";
import { clientKey, ipKey } from "@/lib/docs-demo/rate-limit";

const mocks = vi.hoisted(() => ({
  createSolanaRpc: vi.fn(),
  balances: new Map<string, bigint>(),
  history: new Set<string>(),
  sent: [] as string[],
  sendError: undefined as Error | undefined,
  /** The faucet wallet's recent signatures, newest first. */
  faucetSigs: [] as { memo: string | null; blockTime: bigint | null }[],
}));
vi.mock("@solana/kit", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@solana/kit")>()),
  createSolanaRpc: mocks.createSolanaRpc,
}));

const FAKE_HELIUS_KEY = "test-helius-key";
const FAUCET_SOL = 100_000_000_000n; // 100 SOL
const MEMO = "solana.com quickstart airdrop";
const now = () => BigInt(Math.floor(Date.now() / 1000));
/** `n` signatures the faucet sent `ageSeconds` ago, memo as the RPC shows it. */
const faucetSigs = (n: number, memo: string | null, ageSeconds = 60) =>
  Array.from({ length: n }, () => ({
    memo: memo && `[${memo.length}] ${memo}`,
    blockTime: now() - BigInt(ageSeconds),
  }));

/** A throwaway keypair in solana-keygen's JSON format (test only). */
function keypairJson(): string {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const pub = publicKey.export({ format: "der", type: "spki" }).subarray(-32);
  const priv = privateKey
    .export({ format: "der", type: "pkcs8" })
    .subarray(-32);
  return JSON.stringify([...priv, ...pub]);
}

let faucetSecret = "";
let faucetAddress = "";

/** One getSignaturesForAddress page, newest first, honouring limit and before. */
const sigPage = <T>(
  list: T[],
  { limit = 1000, before }: { limit?: number; before?: string } = {},
) => {
  const start = before ? Number(before) + 1 : 0;
  return list
    .slice(start, start + limit)
    .map((tx, i) => ({ ...tx, signature: String(start + i) }));
};

function fakeRpc() {
  return {
    getBalance: (address: string) => ({
      send: async () => ({ value: mocks.balances.get(address) ?? 0n }),
    }),
    getSignaturesForAddress: (
      address: string,
      opts?: { limit?: number; before?: string },
    ) => ({
      send: async () =>
        address === faucetAddress
          ? sigPage(mocks.faucetSigs, opts)
          : mocks.history.has(address)
            ? [{ signature: "1".repeat(88) }]
            : [],
    }),
    getLatestBlockhash: () => ({
      send: async () => ({
        value: {
          blockhash: "EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N",
          lastValidBlockHeight: 100n,
        },
      }),
    }),
    sendTransaction: (wire: string) => ({
      send: async () => {
        if (mocks.sendError) throw mocks.sendError;
        mocks.sent.push(wire);
        return "sig";
      },
    }),
    getSignatureStatuses: () => ({
      send: async () => ({
        value: [{ confirmationStatus: "confirmed", err: null }],
      }),
    }),
  };
}

/** The last transaction the route sent: its accounts and lamports moved. */
function lastTransfer() {
  const tx = getTransactionDecoder().decode(
    getBase64Encoder().encode(mocks.sent.at(-1)!),
  );
  const msg = getCompiledTransactionMessageDecoder().decode(tx.messageBytes);
  if (msg.version === 1) throw new Error("unexpected v1 message");
  const [ix, memo] = msg.instructions;
  const accounts = ix!.accountIndices!.map((i) => msg.staticAccounts[i]);
  // System Program Transfer: u32 instruction index 2, then u64 lamports.
  const amount = getU64Decoder().decode(ix!.data!.subarray(4));
  return {
    feePayer: msg.staticAccounts[0],
    accounts,
    amount,
    instructions: msg.instructions.length,
    memoProgram: memo && msg.staticAccounts[memo.programAddressIndex],
    memo: memo && new TextDecoder().decode(memo.data),
  };
}

function request(body: string, contentType: string, ip: string) {
  return new Request("http://localhost/api/devnet-airdrop", {
    method: "POST",
    headers: { "content-type": contentType, "x-forwarded-for": ip },
    body,
  });
}
let ip = 0;
const jsonRequest = (address: unknown, from = `10.0.0.${++ip}`) =>
  request(JSON.stringify({ address }), "application/json", from);

beforeEach(async () => {
  faucetSecret = keypairJson();
  faucetAddress = (
    await createKeyPairSignerFromBytes(
      Uint8Array.from(JSON.parse(faucetSecret) as number[]),
    )
  ).address;
  vi.stubEnv("DEVNET_FAUCET_SECRET_KEY", faucetSecret);
  vi.stubEnv("HELIUS_API_KEY", FAKE_HELIUS_KEY);
  mocks.balances = new Map([[faucetAddress, FAUCET_SOL]]);
  mocks.history = new Set([faucetAddress]);
  mocks.sent = [];
  mocks.sendError = undefined;
  mocks.faucetSigs = [];
  mocks.createSolanaRpc.mockImplementation(fakeRpc);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("devnet airdrop route", () => {
  it("sends 0.02 SOL from the faucet wallet to a new wallet over Helius devnet", async () => {
    const address = "So11111111111111111111111111111111111111112";
    const response = await POST(jsonRequest(address));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      signature: expect.stringMatching(/^\w{87,88}$/),
    });
    expect(mocks.createSolanaRpc).toHaveBeenCalledWith(
      `https://devnet.helius-rpc.com/?api-key=${FAKE_HELIUS_KEY}`,
    );
    const transfer = lastTransfer();
    expect(transfer.feePayer).toBe(faucetAddress);
    expect(transfer.accounts).toEqual([faucetAddress, address]);
    expect(transfer.amount).toBe(20_000_000n);
    expect(transfer.instructions).toBe(2);
    expect(transfer.memoProgram).toBe(
      "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
    );
    expect(transfer.memo).toBe(MEMO);
  });

  it("caps airdrops across all instances at 1000 a day, counted from the faucet's tagged transfers", async () => {
    // 999 airdrops today across two pages, plus demo transfers and older
    // airdrops that don't count.
    mocks.faucetSigs = [
      ...faucetSigs(600, MEMO),
      ...faucetSigs(900, "solana.com docs demo"),
      ...faucetSigs(399, MEMO, 23 * 60 * 60),
      ...faucetSigs(5, null),
      ...faucetSigs(100, MEMO, 25 * 60 * 60),
    ];
    expect(
      (await POST(jsonRequest("SysvarS1otHashes111111111111111111111111111")))
        .status,
    ).toBe(200);
    expect(mocks.sent).toHaveLength(1);

    mocks.faucetSigs = [...faucetSigs(1, MEMO), ...mocks.faucetSigs];
    const response = await POST(
      jsonRequest("SysvarStakeHistory1111111111111111111111111"),
    );
    expect(response.status).toBe(429);
    expect((await response.json()).error).toBe(
      "Airdrop limit reached. Get devnet SOL at https://faucet.solana.com instead.",
    );
    expect(mocks.sent).toHaveLength(1);
  });

  it("reads the daily cap from AIRDROP_DAILY_CAP", async () => {
    vi.stubEnv("AIRDROP_DAILY_CAP", "2");
    mocks.faucetSigs = faucetSigs(2, MEMO);
    const response = await POST(
      jsonRequest("SysvarEpochSchedu1e111111111111111111111111"),
    );
    expect(response.status).toBe(429);
    expect(mocks.sent).toHaveLength(0);
  });

  it("fails closed when every page it reads is inside the last day", async () => {
    mocks.faucetSigs = faucetSigs(4000, null);
    const response = await POST(
      jsonRequest("SysvarFees111111111111111111111111111111111"),
    );
    expect(response.status).toBe(429);
    expect(mocks.sent).toHaveLength(0);
  });

  it("keeps a 5 SOL reserve in the faucet wallet (503, pointing to faucet.solana.com)", async () => {
    mocks.balances.set(faucetAddress, 5_019_999_999n);
    const response = await POST(
      jsonRequest("SysvarRewards111111111111111111111111111111"),
    );
    expect(response.status).toBe(503);
    expect((await response.json()).error).toContain(
      "https://faucet.solana.com",
    );
    expect(mocks.sent).toHaveLength(0);

    mocks.balances.set(faucetAddress, 5_020_000_000n);
    expect(
      (await POST(jsonRequest("AddressLookupTab1e1111111111111111111111111")))
        .status,
    ).toBe(200);
  });

  it("uses public devnet without a Helius key", async () => {
    vi.stubEnv("HELIUS_API_KEY", "");
    const response = await POST(
      jsonRequest("Config1111111111111111111111111111111111111"),
    );
    expect(response.status).toBe(200);
    expect(mocks.createSolanaRpc).toHaveBeenCalledWith(
      "https://api.devnet.solana.com",
    );
  });

  it("accepts a form body, as curl -d sends", async () => {
    const response = await POST(
      request(
        "address=TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        "application/x-www-form-urlencoded",
        "10.1.0.1",
      ),
    );
    expect(response.status).toBe(200);
    expect(await response.text()).toMatch(/^\{"signature":"\w+"\}\n$/);
  });

  it("rejects missing and invalid addresses", async () => {
    for (const address of [undefined, "", "not-an-address", 42]) {
      const response = await POST(jsonRequest(address, "10.1.0.2"));
      expect(response.status).toBe(400);
    }
    expect(
      (await POST(request("{", "application/json", "10.1.0.2"))).status,
    ).toBe(400);
    expect(mocks.sent).toHaveLength(0);
  });

  it("refuses a wallet that has transaction history (409)", async () => {
    const address = "Stake11111111111111111111111111111111111111";
    mocks.history.add(address);
    const response = await POST(jsonRequest(address));
    expect(response.status).toBe(409);
    expect((await response.json()).error).toBe(
      "This wallet already has devnet SOL or history. Get more at https://faucet.solana.com.",
    );
    expect(mocks.sent).toHaveLength(0);
  });

  it("refuses a wallet that already holds SOL (409)", async () => {
    const address = "Vote111111111111111111111111111111111111111";
    mocks.balances.set(address, 1n);
    const response = await POST(jsonRequest(address));
    expect(response.status).toBe(409);
    expect(mocks.sent).toHaveLength(0);
  });

  it("funds each wallet once: after the transfer it has history", async () => {
    const address = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
    expect((await POST(jsonRequest(address))).status).toBe(200);
    // What devnet now shows for it.
    mocks.balances.set(address, 20_000_000n);
    mocks.history.add(address);
    const again = await POST(jsonRequest(address));
    expect([409, 429]).toContain(again.status);
    expect(mocks.sent).toHaveLength(1);
  });

  it("allows one request per IP a day", async () => {
    const statuses = [];
    for (const address of [
      "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
      "ComputeBudget111111111111111111111111111111",
    ]) {
      statuses.push((await POST(jsonRequest(address, "10.1.0.3"))).status);
    }
    expect(statuses).toEqual([200, 429]);
    expect(mocks.sent).toHaveLength(1);
  });

  it("keys IPv6 callers by their /64, so rotating within it doesn't help", async () => {
    expect(ipKey("2001:db8:1:2:aaaa::1")).toBe("2001:db8:1:2::/64");
    expect(ipKey("2001:0db8:0001:0002:ffff:1:2:3")).toBe("2001:db8:1:2::/64");
    expect(ipKey("2001:db8::1")).toBe("2001:db8:0:0::/64");
    expect(ipKey("::ffff:192.0.2.7")).toBe("192.0.2.7");
    expect(ipKey("192.0.2.7")).toBe("192.0.2.7");

    const first = await POST(
      jsonRequest(
        "SysvarLastRestartS1ot1111111111111111111111",
        "2001:db8:1:2::10",
      ),
    );
    const sameSlash64 = await POST(
      jsonRequest(
        "Feature111111111111111111111111111111111111",
        "2001:db8:1:2:dead:beef:0:1",
      ),
    );
    const otherSlash64 = await POST(
      jsonRequest(
        "NativeLoader1111111111111111111111111111111",
        "2001:db8:1:3::10",
      ),
    );
    expect([first.status, sameSlash64.status, otherSlash64.status]).toEqual([
      200, 429, 200,
    ]);
    // IPv4 neighbours stay separate.
    expect(
      (
        await POST(
          jsonRequest(
            "BPFLoader2111111111111111111111111111111111",
            "10.9.0.1",
          ),
        )
      ).status,
    ).toBe(200);
    expect(
      (
        await POST(
          jsonRequest(
            "BPFLoader1111111111111111111111111111111111",
            "10.9.0.2",
          ),
        )
      ).status,
    ).toBe(200);
  });

  it("keys callers by x-vercel-forwarded-for, which a client can't spoof", async () => {
    const from = (headers: Record<string, string>) =>
      new Request("http://localhost/api/devnet-airdrop", { headers });
    expect(
      ipKey(
        clientKey(
          from({
            "x-vercel-forwarded-for": "192.0.2.7",
            "x-real-ip": "192.0.2.8",
            "x-forwarded-for": "198.51.100.1, 192.0.2.9",
          }),
        ),
      ),
    ).toBe("192.0.2.7");
    expect(
      clientKey(
        from({ "x-real-ip": "192.0.2.8", "x-forwarded-for": "192.0.2.9" }),
      ),
    ).toBe("192.0.2.8");
    expect(
      clientKey(from({ "x-forwarded-for": "198.51.100.1, 192.0.2.9" })),
    ).toBe("198.51.100.1");
    expect(clientKey(from({}))).toBe("unknown");

    // A new x-forwarded-for on each request doesn't get round the limit.
    const statuses = [];
    for (const [address, spoofed] of [
      ["BPFLoaderUpgradeab1e11111111111111111111111", "203.0.113.1"],
      ["Ed25519SigVerify111111111111111111111111111", "203.0.113.2"],
    ]) {
      const response = await POST(
        new Request("http://localhost/api/devnet-airdrop", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-vercel-forwarded-for": "10.3.0.1",
            "x-forwarded-for": spoofed!,
          },
          body: JSON.stringify({ address }),
        }),
      );
      statuses.push(response.status);
    }
    expect(statuses).toEqual([200, 429]);
  });

  it("answers 503, pointing to faucet.solana.com, when the faucet wallet is out of SOL", async () => {
    mocks.balances.set(faucetAddress, 20_500_000n);
    const response = await POST(
      jsonRequest("SysvarC1ock11111111111111111111111111111111"),
    );
    expect(response.status).toBe(503);
    const text = await response.text();
    expect(text).toContain("https://faucet.solana.com");
    expect(text).not.toContain(faucetAddress);
    expect(mocks.sent).toHaveLength(0);
  });

  it("is off (503, pointing to faucet.solana.com) without a faucet key", async () => {
    vi.stubEnv("DEVNET_FAUCET_SECRET_KEY", "");
    vi.stubEnv("DEMO_PAYER_SECRET_KEY", "");
    const response = await POST(
      jsonRequest("11111111111111111111111111111111"),
    );
    expect(response.status).toBe(503);
    expect((await response.json()).error).toContain(
      "https://faucet.solana.com",
    );
    expect(mocks.createSolanaRpc).not.toHaveBeenCalled();
  });

  it("is off in production, where the preview faucet key is not set", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("DEVNET_FAUCET_SECRET_KEY", undefined);
    vi.stubEnv("DEMO_PAYER_SECRET_KEY", undefined);
    const response = await POST(
      jsonRequest("11111111111111111111111111111111"),
    );
    expect(response.status).toBe(503);
    expect(mocks.createSolanaRpc).not.toHaveBeenCalled();
  });

  it("is off, without details, when the faucet key is malformed", async () => {
    vi.stubEnv("DEVNET_FAUCET_SECRET_KEY", "[1,2,3]");
    const response = await POST(
      jsonRequest("SysvarRecentB1ockHashes11111111111111111111"),
    );
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("1,2,3");
    expect(mocks.createSolanaRpc).not.toHaveBeenCalled();
  });

  it("returns a generic error when sending fails, never a secret or the upstream message", async () => {
    mocks.sendError = new Error(
      `HTTP 429 https://devnet.helius-rpc.com/?api-key=${FAKE_HELIUS_KEY} ${faucetSecret}`,
    );
    const response = await POST(
      jsonRequest("SysvarRent111111111111111111111111111111111"),
    );
    expect(response.status).toBe(502);
    const text = await response.text();
    expect(text).not.toContain(FAKE_HELIUS_KEY);
    expect(text).not.toContain(faucetSecret);
    expect(text).not.toContain("HTTP 429");
    expect(text).toContain("faucet.solana.com");
  });
  it("sends from the demo payer wallet when no separate faucet key is set", async () => {
    vi.stubEnv("DEVNET_FAUCET_SECRET_KEY", "");
    vi.stubEnv("DEMO_PAYER_SECRET_KEY", faucetSecret);
    const response = await POST(
      jsonRequest(
        "Sysvar1nstructions1111111111111111111111111",
        "203.0.113.77",
      ),
    );
    expect(response.status).toBe(200);
    expect(lastTransfer().feePayer).toBe(faucetAddress);
  });
});
