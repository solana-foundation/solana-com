import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/dvp-demo/rpc/route";
import { makeRpc } from "@/lib/delivery-vs-payment/solana/rpc";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("DvP preview RPC", () => {
  it("gets a blockhash without a POST to the preview's blocked RPC path", async () => {
    vi.stubEnv("DVP_DEMO_RPC_URL", "https://devnet.example.test/rpc");
    const requests: string[] = [];
    vi.stubGlobal(
      "fetch",
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = new URL(String(input));
        if (url.pathname === "/api/dvp-demo/rpc") {
          requests.push(init?.method ?? "GET");
          if (init?.method === "POST")
            return new Response(null, { status: 403 });
          return GET(new Request(url));
        }

        expect(url.href).toBe("https://devnet.example.test/rpc");
        expect(init?.method).toBe("POST");
        const body = JSON.parse(String(init?.body));
        expect(body.method).toBe("getLatestBlockhash");
        return Response.json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            context: { slot: 12 },
            value: {
              blockhash: "11111111111111111111111111111111",
              lastValidBlockHeight: 34,
            },
          },
        });
      },
    );

    const { value } = await makeRpc()
      .getLatestBlockhash({ commitment: "confirmed" })
      .send();

    expect(requests).toEqual(["GET"]);
    expect(value.blockhash).toBe("11111111111111111111111111111111");
    expect(value.lastValidBlockHeight).toBe(34n);
  });
});
