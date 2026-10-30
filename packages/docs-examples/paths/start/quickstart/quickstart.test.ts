import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  address,
  createKeyPairSignerFromBytes,
  isSolanaError,
  SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM,
} from "@solana/kit";
import {
  AccountState,
  fetchMint,
  fetchToken,
  findAssociatedTokenPda,
  TOKEN_2022_ERROR__ACCOUNT_FROZEN,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { describe, expect, it } from "vitest";
import {
  AIRDROP_LAMPORTS,
  stubAirdropFetch,
} from "../../../test/fixtures/airdrop";
import { setTokenBalance } from "../../../test/fixtures/fund";
import { runExample } from "../../../test/record";

// Each step is a script a reader runs with `npx tsx <file>` in one folder;
// importing it runs it once. The scripts keep their state (wallet.json,
// asset.json, holder.json) in the working directory, so run them in a fresh
// one: step 1 always takes the airdrop branch.
process.chdir(mkdtempSync(join(tmpdir(), "quickstart-")));
// Step 1's airdrop request to solana.com lands on the local Surfnet instead.
stubAirdropFetch();

const out = (name: string) => new URL(`./${name}.output.txt`, import.meta.url);
const client = async () => (await import("./client")).client;
const exf = (text: string) =>
  address(text.match(/^Asset \(mint\): (\w+)$/m)![1]!);

/** The custom program error code anywhere in an error's cause chain. */
function customCode(error: unknown): number | undefined {
  for (let e = error; e; e = (e as { cause?: unknown }).cause)
    if (isSolanaError(e, SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM))
      return e.context.code;
  return undefined;
}

describe("paths/start/quickstart", () => {
  let mint: ReturnType<typeof address>;
  let holder: ReturnType<typeof address>;

  it("1: checks the balance, gets devnet SOL, and points to devnet USDC", async () => {
    const r = await runExample(() => import("./balance"), {
      output: out("balance"),
    });
    expect(r.text).toMatch(
      /^Wallet: \w+\nAirdrop: \w+\nBalance: 0\.02 SOL\nUSDC: 0\nGet free devnet USDC for \w+ at https:\/\/faucet\.circle\.com \(pick Solana Devnet\)\.$/,
    );
  });

  it("2: sends 1 USDC to a new address", async () => {
    // Stands in for Circle's devnet faucet: 10 USDC in the reader's wallet.
    const { identity } = await client();
    await setTokenBalance(identity.address, 10_000_000n);

    const r = await runExample(() => import("./send-dollars"), {
      output: out("send-dollars"),
    });
    expect(r.text).toContain("Recipient balance: 1 USDC");
    const { tokenBalance } = await import("./client");
    expect(await tokenBalance(identity.address)).toBe("9");
    expect(r.text).toMatch(
      /^Explorer: https:\/\/explorer\.solana\.com\/tx\/\w+\?cluster=devnet$/m,
    );
  });

  it("3: creates an asset with onchain metadata and a freeze authority, and mints 1,000", async () => {
    const r = await runExample(() => import("./create-asset"), {
      output: out("create-asset"),
    });
    expect(r.text).toContain("Name: Example Fund (EXF)");
    expect(r.text).toContain("Supply: 1000 EXF");
    expect(r.text).toMatch(
      /^Explorer: https:\/\/explorer\.solana\.com\/address\/\w+\?cluster=devnet$/m,
    );
    mint = exf(r.text);
    const c = await client();
    const { data } = await fetchMint(c.rpc, mint);
    expect(data.freezeAuthority).toEqual({
      __option: "Some",
      value: c.identity.address,
    });
    // All 1,000 went to the reader's own token account.
    const { tokenBalance } = await import("./client");
    expect(await tokenBalance(c.identity.address, mint)).toBe("1000");
  });

  it("4: sends 100 EXF to a new holder", async () => {
    const r = await runExample(() => import("./send-asset"), {
      output: out("send-asset"),
    });
    expect(r.text).toContain("Holder balance: 100 EXF");
    holder = address(r.text.match(/^Sent 100 EXF to (\w+)$/m)![1]!);
    const { tokenBalance } = await import("./client");
    expect(await tokenBalance((await client()).identity.address, mint)).toBe(
      "900",
    );
  });

  it("5: freezes the holder, the transfer is blocked, then thaws", async () => {
    const r = await runExample(() => import("./freeze-holder"), {
      output: out("freeze-holder"),
    });
    expect(r.text).toMatch(
      /^Froze the holder's EXF account\nTransfer blocked: account is frozen\nThawed\. Transfer sent: \w+\nHolder balance: 90 EXF$/,
    );
    // Thawed again at the end, and the blocked transfer moved nothing.
    const c = await client();
    const { tokenBalance } = await import("./client");
    expect(await tokenBalance(c.identity.address, mint)).toBe("910");
    const [holderAccount] = await findAssociatedTokenPda({
      mint,
      owner: holder,
      tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
    });
    const account = await fetchToken(c.rpc, holderAccount);
    expect(account.data.state).toBe(AccountState.Initialized);

    // The blocked line is the freeze's doing: frozen again, the same
    // transfer fails with Token-2022's AccountFrozen error.
    const { getFreezeAccountInstruction, getThawAccountInstruction } =
      await import("@solana-program/token-2022");
    const holderKey = await createKeyPairSignerFromBytes(
      new Uint8Array(JSON.parse(readFileSync("holder.json", "utf8"))),
    );
    const ix = { account: account.address, mint, owner: c.identity };
    await c.sendTransaction([getFreezeAccountInstruction(ix)]);
    const error = await c.token2022.instructions
      .transferToATA({
        mint,
        authority: holderKey,
        recipient: c.identity.address,
        amount: 1_000n,
        decimals: 2,
      })
      .sendTransaction()
      .then(
        () => undefined,
        (e: unknown) => e,
      );
    expect(customCode(error)).toBe(TOKEN_2022_ERROR__ACCOUNT_FROZEN);
    await c.sendTransaction([getThawAccountInstruction(ix)]);
  });

  it("spends under half of the faucet's 0.02 SOL across all five steps", async () => {
    // Fees plus the deposits for the USDC account, the EXF mint with its
    // metadata, and two EXF accounts: about 0.0099 SOL. The rest is room to
    // rerun a step; the faucet funds each wallet only once.
    const c = await client();
    const { value } = await c.rpc.getBalance(c.identity.address).send();
    expect(AIRDROP_LAMPORTS - value).toBeLessThan(AIRDROP_LAMPORTS / 2n);
  });
});
