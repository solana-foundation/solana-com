/**
 * RPC "Try it" (/docs-assets/scripts/rpc-try-it.js, src/verify/rpc-try-it.ts):
 *
 * - the script's own extraction (run in a VM) on hand-written inputs: page
 *   URL matching, cURL body, the method/slug rule, u64-safe re-indenting;
 * - corpus: every English RPC method page with a request example (53 HTTP
 *   methods + 9 subscriptions) gets the panel, unsubscribe pages do not;
 *   translated pages are reported only.
 */
import { describe, expect, it } from "vitest";
import {
  firstRequestFence,
  loadTryItScript,
  scanRpcTryIt,
} from "../src/verify/rpc-try-it.ts";

const api = loadTryItScript();

describe("rpc-try-it.js page matching", () => {
  it("matches HTTP methods and subscriptions, with or without a locale", () => {
    expect(api.pageInfo("/developers/docs/rpc/http/getbalance")).toMatchObject({
      kind: "http",
      slug: "getbalance",
    });
    expect(
      api.pageInfo("/ja/developers/docs/rpc/http/getBalance/"),
    ).toMatchObject({
      kind: "http",
      slug: "getbalance",
    });
    expect(
      api.pageInfo("/developers/docs/rpc/websocket/slotsubscribe"),
    ).toMatchObject({
      kind: "ws",
      slug: "slotsubscribe",
    });
  });

  it("skips unsubscribe, index, deprecated and non-RPC pages", () => {
    for (const p of [
      "/developers/docs/rpc/websocket/slotunsubscribe",
      "/developers/docs/rpc/http",
      "/developers/docs/rpc",
      "/developers/docs/rpc/deprecated/getfees",
      "/developers/docs/core/accounts",
      "/developers/cookbook/rpc/http/getbalance",
    ])
      expect(api.pageInfo(p), p).toBeNull();
  });
});

describe("rpc-try-it.js request extraction", () => {
  const curl = `curl https://api.devnet.solana.com -s -X POST \\
  -H "Content-Type: application/json" \\
  -d '
  {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getBalance",
    "params": ["83astBRguLMdt2h5U1Tpdq5tjFoJ6noeGwaY3mDLVcri"]
  }
'`;

  it("reads the JSON body of the cURL command, dedented", () => {
    const req = api.requestFromText("http", "getbalance", curl);
    expect(req?.method).toBe("getBalance");
    expect(req?.body.split("\n")[0]).toBe("{");
    expect(req?.body.split("\n")[1]).toBe('  "jsonrpc": "2.0",');
    expect(JSON.parse(req!.body).params).toHaveLength(1);
  });

  it("rejects another method, responses and non-cURL text", () => {
    expect(api.requestFromText("http", "getblock", curl)).toBeNull();
    expect(
      api.requestFromText(
        "ws",
        "slotsubscribe",
        '{"jsonrpc":"2.0","result":1,"id":1,"method":"slotSubscribe"}',
      ),
    ).toBeNull();
    expect(api.curlBody('{"jsonrpc":"2.0"}')).toBeNull();
    expect(
      api.requestFromText("http", "getbalance", "curl https://x -d 'not json'"),
    ).toBeNull();
  });

  it("takes a WebSocket message as is", () => {
    const req = api.requestFromText(
      "ws",
      "slotsubscribe",
      '{\n  "jsonrpc": "2.0",\n  "id": 1,\n  "method": "slotSubscribe"\n}',
    );
    expect(req?.method).toBe("slotSubscribe");
  });

  it("re-indents responses without losing u64 precision", () => {
    const raw =
      '{"jsonrpc":"2.0","result":{"value":{"total":18446744073709551615,"memo":"a, {b}: \\"c\\"","list":[],"o":{}}},"id":1}';
    const pretty = api.prettyJson(raw);
    expect(pretty).toContain('"total": 18446744073709551615');
    expect(pretty).toContain('"memo": "a, {b}: \\"c\\""');
    expect(pretty).toContain('"list": []');
    expect(pretty.split("\n")).toHaveLength(12);
    expect(pretty.replace(/\s+/g, "")).toBe(raw.replace(/\s+/g, ""));
    // Unbalanced input comes back unchanged.
    expect(api.prettyJson('{"a": [1, 2')).toBe('{"a": [1, 2');
  });
});

describe("firstRequestFence", () => {
  it("returns the first fence inside <RequestExample>, dedented", () => {
    const src = [
      "```json Elsewhere",
      "{}",
      "```",
      "",
      "<RequestExample>",
      "  ```bash cURL",
      "  curl https://x -d '",
      "    {}",
      "  '",
      "  ```",
      "",
      "  ```ts Kit",
      "  const a = 1;",
      "  ```",
      "</RequestExample>",
    ].join("\n");
    expect(firstRequestFence(src)).toBe("curl https://x -d '\n  {}\n'");
    expect(firstRequestFence("no examples")).toBeNull();
  });
});

describe("RPC Try it corpus", () => {
  const scan = scanRpcTryIt(api);

  it("every English RPC method page keeps a sendable example", () => {
    expect(scan.failures).toEqual([]);
  });

  it("English has 62 panels: 53 HTTP + 9 subscriptions", () => {
    expect(scan.counts.get("en http")).toBe(53);
    expect(scan.counts.get("en ws")).toBe(9);
    const en = scan.pages.filter((p) =>
      p.startsWith("apps/docs/content/docs/en/"),
    );
    expect(en).toContain("apps/docs/content/docs/en/rpc/http/getbalance.mdx");
    expect(en).toContain(
      "apps/docs/content/docs/en/rpc/http/sendtransaction.mdx",
    );
    expect(en).toContain(
      "apps/docs/content/docs/en/rpc/websocket/accountsubscribe.mdx",
    );
    expect(en.some((p) => /unsubscribe\.mdx$/.test(p))).toBe(false);
  });
});
