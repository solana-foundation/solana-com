/**
 * The CLI tab of the Quickstart (cli.sh): each step's region runs in order in
 * one folder, with a fresh HOME (so `solana-keygen new` writes a new wallet)
 * and `--url devnet` pointed at the local Surfnet. Needs the Solana CLI
 * (`solana`, `solana-keygen`, `spl-token`); skipped when it isn't installed.
 */
import { execFile, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  address,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
} from "@solana/kit";
import {
  AccountState,
  fetchMint,
  fetchToken,
  findAssociatedTokenPda,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { afterAll, describe, expect, it } from "vitest";
import {
  AIRDROP_LAMPORTS,
  AIRDROP_URL,
  startAirdropServer,
} from "../../../test/fixtures/airdrop";
import { RPC_URL, setTokenBalance } from "../../../test/fixtures/fund";

const here = dirname(fileURLToPath(import.meta.url));

// On PATH where the Solana CLI is installed (CI adds it); else the
// installer's default location.
const cli = [
  "spl-token",
  join(
    process.env.HOME ?? "",
    ".local/share/solana/install/active_release/bin/spl-token",
  ),
].find(
  (cmd) => spawnSync(cmd, ["--version"], { stdio: "ignore" }).status === 0,
);

/** One `# #region <name>` of cli.sh, as the docs page shows it. */
function region(name: string): string {
  const source = readFileSync(join(here, "cli.sh"), "utf8");
  const match = source.match(
    new RegExp(`# #region ${name}\\n([\\s\\S]*?)# #endregion ${name}\\n`),
  );
  if (!match?.[1]) throw new Error(`no region ${name} in cli.sh`);
  return match[1];
}

const home = mkdtempSync(join(tmpdir(), "quickstart-cli-"));
const env = {
  ...process.env,
  HOME: home,
  PATH: cli ? `${dirname(cli)}:${process.env.PATH}` : process.env.PATH,
};

/** Run a script in the reader's folder (the temp HOME). */
function run(script: string, { strict = true } = {}) {
  const r = spawnSync(
    "bash",
    [strict ? "-euo" : "-uo", "pipefail", "-c", script],
    { cwd: home, env, encoding: "utf8" },
  );
  const all = `${r.stdout}${r.stderr}`;
  if (strict) expect(r.status, all).toBe(0);
  return { out: r.stdout, all, status: r.status };
}

/** Like run(), without blocking the event loop (for the local faucet). */
function runAsync(script: string) {
  return new Promise<{ out: string }>((resolve) =>
    execFile(
      "bash",
      ["-euo", "pipefail", "-c", script],
      { cwd: home, env, encoding: "utf8" },
      (error, stdout, stderr) => {
        expect(error, `${stdout}${stderr}`).toBeNull();
        resolve({ out: stdout });
      },
    ),
  );
}

const spl = (args: string) => run(`spl-token ${args}`).out.trim();
const rpc = createSolanaRpc(RPC_URL);

afterAll(() => rmSync(home, { recursive: true, force: true }));

describe.skipIf(!cli)("paths/start/quickstart (CLI)", () => {
  let wallet: ReturnType<typeof address>;
  let mint: ReturnType<typeof address>;

  it("1: creates a wallet, gets SOL, and reads the USDC balance", async () => {
    // The page points the CLI at devnet and solana.com's devnet faucet; here,
    // at this Surfnet and a local stand-in for the faucet.
    const faucet = await startAirdropServer();
    const [before, after] = region("balance")
      .replace("--url devnet", `--url ${RPC_URL}`)
      .replace(AIRDROP_URL, faucet.url)
      .split(/^# After the Circle faucet.*$/m);
    const first = await runAsync(before!).finally(faucet.close);
    wallet = address(run("solana address").out.trim());
    expect(first.out).toContain("0.02 SOL");
    // Stands in for Circle's devnet faucet: 10 USDC in the reader's wallet.
    await setTokenBalance(wallet, 10_000_000n);
    expect(run(after!).out.trim()).toBe("10");
  });

  it("2: sends 1 USDC to a new address", () => {
    expect(run(region("send")).out.trim().split("\n").at(-1)).toBe("1");
    expect(spl("balance 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU")).toBe(
      "9",
    );
  });

  it("3: creates the asset with metadata and a freeze authority, and mints 1,000", async () => {
    run(region("asset"));
    mint = address(run("solana address -k exf.json").out.trim());
    const { data } = await fetchMint(rpc, mint, { commitment: "confirmed" });
    expect(data.decimals).toBe(2);
    expect(data.supply).toBe(100_000n);
    expect(data.freezeAuthority).toEqual({ __option: "Some", value: wallet });
    expect(spl(`display ${mint}`)).toMatch(
      /Name: Example Fund\n\s+Symbol: EXF/,
    );
    expect(spl(`balance ${mint}`)).toBe("1000");
  });

  it("4: sends 100 EXF to a new holder", () => {
    expect(run(region("send-asset")).out.trim().split("\n").at(-1)).toBe("100");
    expect(spl(`balance ${mint}`)).toBe("900");
  });

  it("5: freezes the holder, the transfer is blocked, then thaws", async () => {
    const r = run(region("freeze"), { strict: false });
    // Only the transfer while frozen fails, with Token-2022's AccountFrozen.
    expect(r.status, r.all).toBe(0);
    expect(r.all.match(/^Error: /gm), r.all).toHaveLength(1);
    expect(r.all).toContain("Error: Account is frozen");
    expect(r.out.match(/^Signature: \w+$/gm), r.all).toHaveLength(3);
    expect(spl(`balance ${mint} --owner holder.json`)).toBe("90");
    expect(spl(`balance ${mint}`)).toBe("910");
    const holder = await createKeyPairSignerFromBytes(
      new Uint8Array(
        JSON.parse(readFileSync(join(home, "holder.json"), "utf8")),
      ),
    );
    const [account] = await findAssociatedTokenPda({
      mint,
      owner: holder.address,
      tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
    });
    const { data } = await fetchToken(rpc, account, {
      commitment: "confirmed",
    });
    expect(data.state).toBe(AccountState.Initialized);
  });

  it("spends under half of the faucet's 0.02 SOL across all five steps", async () => {
    const { value } = await rpc
      .getBalance(wallet, { commitment: "confirmed" })
      .send();
    expect(AIRDROP_LAMPORTS - value).toBeLessThan(AIRDROP_LAMPORTS / 2n);
  });
});
