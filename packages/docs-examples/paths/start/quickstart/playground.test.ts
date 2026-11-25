import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { inflateRawSync } from "node:zlib";
import {
  address,
  createSolanaRpc,
  generateKeyPairSigner,
  writeKeyPairSigner,
} from "@solana/kit";
import {
  AccountState,
  fetchMint,
  fetchToken,
  findAssociatedTokenPda,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { describe, expect, it, vi } from "vitest";
import { fundSol, RPC_URL } from "../../../test/fixtures/fund";
import { runExample } from "../../../test/record";

// playground.ts is the Quickstart's Token-2022 steps (1, 3, 4, 5) in one file
// for Solana Playground, which opens it from the "Run in Playground" link on
// the Quickstart page (packages/docs-tooling gen:paths). It keeps the step
// files' names, amounts and output lines: this test compares its output with
// their recorded .output.txt files.
//
// It connects with solanaDevnetRpc() and nothing else (no process.env in
// Playground), so here devnet is the local Surfnet, as RPC_URL does for the
// other steps. The published file is unchanged.
//
// The run checks behaviour and the SOL budget on this package's versions;
// Playground loads its own (PLAYGROUND_PACKAGES in docs-tooling), so a change
// on either side also needs a live run in Playground.
vi.mock("@solana/kit-plugin-rpc", async (importOriginal) => {
  const rpc = await importOriginal<typeof import("@solana/kit-plugin-rpc")>();
  return {
    ...rpc,
    solanaDevnetRpc: (config?: Parameters<typeof rpc.solanaDevnetRpc>[0]) =>
      rpc.solanaDevnetRpc({ ...config, rpcUrl: process.env.RPC_URL }),
  };
});

const here = (rel: string) => new URL(rel, import.meta.url);
const read = (rel: string) => readFileSync(here(rel), "utf8");
const FILE = read("./playground.ts");

/**
 * docs-tooling's rules for a file opened from a Playground link
 * (src/examples/playground.ts), the ones gen:paths applies. CI runs this
 * package's tests when a file here changes; docs-tooling's own tests don't
 * run then. Imported by URL, as that package isn't a dependency of this one.
 */
const tooling = (await import(
  here("../../../../docs-tooling/src/examples/playground.ts").href
)) as {
  PLAYGROUND_SOL: string;
  playgroundScriptProblems: (code: string) => string[];
};

/** The Run link gen:paths wrote on the Quickstart page, decoded. */
function generatedLink() {
  const block = read(
    "../../../../../apps/docs/content/snippets/paths/en/quickstart/playground.mdx",
  );
  const href = /\bdata-pg-run="" href="([^"]+)"/.exec(block)![1]!;
  const params = new URLSearchParams(href.split("#")[1]);
  const code = inflateRawSync(
    Buffer.from(params.get("code")!, "base64url"),
  ).toString("utf8");
  return { params, code };
}

/** The Quickstart's step names, in order (paths.en.json). */
const STEP_NAMES = (
  JSON.parse(read("../../../../../apps/docs/content/paths/paths.en.json"))
    .quickstart.steps as [string, string, string][]
).map(([, name]) => name);

/** Base58 values (addresses, signatures) change every run; numbers don't. */
const b58 = (text: string) =>
  text.replace(/[1-9A-HJ-NP-Za-km-z]{32,88}/g, "<b58>").trimEnd();

/** The run's output under each "Step N: <name>" line, by step number. */
function steps(text: string) {
  const out = new Map<number, { name: string; body: string }>();
  for (const part of text.split(/\n+(?=Step \d+: )/)) {
    const m = /^Step (\d+): ([^\n]*)\n?([\s\S]*)$/.exec(part);
    expect(m, `not under a "Step N:" line:\n${part}`).not.toBeNull();
    out.set(Number(m![1]), { name: m![2]!, body: b58(m![3]!) });
  }
  return out;
}

const recorded = (stem: string) => b58(read(`./${stem}.output.txt`));

// In Playground, signerFromFile("wallet.json") is the reader's Playground
// wallet. Here it is a new keypair in wallet.json, funded with the link's sol.
process.chdir(mkdtempSync(join(tmpdir(), "quickstart-playground-")));

describe("paths/start/quickstart/playground.ts", () => {
  it("is what the Quickstart's Run in Playground link opens, and Playground can run it", () => {
    // Only packages Playground loads, no word it refuses, one file.
    expect(tooling.playgroundScriptProblems(FILE)).toEqual([]);
    // gen:paths ran after the last change to the file.
    const { params, code } = generatedLink();
    expect(code).toBe(FILE);
    expect(params.get("sol")).toBe(tooling.PLAYGROUND_SOL);
  });

  it("runs steps 1, 3, 4 and 5 with the step files' output and the link's SOL", async () => {
    const owner = await generateKeyPairSigner(true);
    await writeKeyPairSigner(owner, "wallet.json");
    const sol = Number(tooling.PLAYGROUND_SOL);
    await fundSol(owner.address, sol);

    const r = await runExample(() => import("./playground"));
    const out = steps(r.text);
    expect([...out.keys()]).toEqual([1, 2, 3, 4, 5]);
    // Each heading is the page's step name; step 2 is skipped.
    expect([...out.values()].map((s) => s.name)).toEqual(
      STEP_NAMES.map((name, i) =>
        i === 1 ? `${name} (skipped: it needs the local setup)` : name,
      ),
    );
    expect(out.get(2)!.body).toBe("");

    // Step 1: the wallet and balance lines of balance.ts (whose recorded
    // wallet got the faucet's 0.02 SOL, as the link asks for).
    expect(out.get(1)!.body).toBe(
      recorded("balance")
        .split("\n")
        .filter((l) => /^(Wallet|Balance): /.test(l))
        .join("\n"),
    );
    expect(r.text).toContain(`Wallet: ${owner.address}`);
    // Steps 3 to 5: exactly what the step files print.
    expect(out.get(3)!.body).toBe(recorded("create-asset"));
    expect(out.get(4)!.body).toBe(recorded("send-asset"));
    expect(out.get(5)!.body).toBe(recorded("freeze-holder"));

    // The asset can freeze holders, the holder is thawed at the end, and the
    // blocked transfer moved nothing: 1,000 - 100 + 10 back.
    const rpc = createSolanaRpc(RPC_URL);
    const mint = address(r.text.match(/^Asset \(mint\): (\w+)$/m)![1]!);
    const holder = address(r.text.match(/^Sent 100 EXF to (\w+)$/m)![1]!);
    const { data } = await fetchMint(rpc, mint);
    expect(data.freezeAuthority).toEqual({
      __option: "Some",
      value: owner.address,
    });
    const balanceOf = async (who: typeof holder) => {
      const [ata] = await findAssociatedTokenPda({
        mint,
        owner: who,
        tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
      });
      return fetchToken(rpc, ata);
    };
    expect((await balanceOf(owner.address)).data.amount).toBe(91_000n);
    const held = await balanceOf(holder);
    expect(held.data.amount).toBe(9_000n);
    expect(held.data.state).toBe(AccountState.Initialized);

    // Fees and the deposits for the mint and two token accounts came out of
    // the SOL the link asks for.
    const { value } = await rpc.getBalance(owner.address).send();
    expect(value).toBeGreaterThan(0n);
  });
});
