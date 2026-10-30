/**
 * The tokenization tutorials (issue a gated token, hold it as a custodian,
 * prepare a vault) run as standalone scripts that read key files from
 * ~/.config/solana and $MINT / $LIST from the environment, as readers run
 * them. This test runs every script as a subprocess, in tutorial order, once
 * per implementation (Mosaic SDK, Kit, Web3.js v3, Rust), each against a mint
 * it creates, and records what each one printed.
 *
 * It starts its own Surfnet from Surfpool 1.6: the Mosaic SDK reads mints
 * through the RPC's jsonParsed encoding, and Surfpool 1.5 (the rest of the
 * suite) cannot decode the Permissioned Burn extension these mints carry. The
 * Surfnet runs offline, with the Token ACL and gate programs copied from
 * mainnet at startup, so a step never waits on the public datasource (under
 * the suite's load, lazy fetches from it fail intermittently).
 *
 * Checks: a step expected to succeed exits 0 and every signature it prints
 * succeeded onchain; a step expected to fail exits non-zero, prints the
 * program error, and prints no signature.
 */
import { spawn, spawnSync } from "node:child_process";
import { generateKeyPairSync } from "node:crypto";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  getBase58Decoder,
  signature as toSignature,
  type Address,
} from "@solana/kit";
import { Surfnet } from "@solana/surfpool-1.6";
import { findMintConfigPda } from "@solana/token-acl-sdk";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { recordText } from "../../../test/record";

const here = dirname(fileURLToPath(import.meta.url));
const SIGNATURE_RE = /[1-9A-HJ-NP-Za-km-z]{87,88}/g;

let net: Surfnet;
let rpcUrl: string;
let wsUrl: string;

type Role =
  | "tokenization-demo"
  | "demo-authorities/metadata"
  | "demo-authorities/pause"
  | "demo-authorities/delegate"
  | "demo-authorities/burn"
  | "demo-holder"
  | "demo-outsider"
  | "demo-custodian"
  | "demo-vault";
const ROLES: Role[] = [
  "tokenization-demo",
  "demo-authorities/metadata",
  "demo-authorities/pause",
  "demo-authorities/delegate",
  "demo-authorities/burn",
  "demo-holder",
  "demo-outsider",
  "demo-custodian",
  "demo-vault",
];

/** A HOME with a fresh set of key files, as solana-keygen writes them. */
async function makeHome() {
  const home = mkdtempSync(join(tmpdir(), "gated-token-"));
  const keys = {} as Record<Role, Address>;
  for (const role of ROLES) {
    const { privateKey, publicKey } = generateKeyPairSync("ed25519");
    const bytes = new Uint8Array([
      ...privateKey.export({ format: "der", type: "pkcs8" }).subarray(-32),
      ...publicKey.export({ format: "der", type: "spki" }).subarray(-32),
    ]);
    const path = join(home, ".config", "solana", `${role}.json`);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify([...bytes]), { mode: 0o600 });
    keys[role] = (await createKeyPairSignerFromBytes(bytes)).address;
  }
  // Fees for the payer and for the wallets that sign their own transactions.
  for (const role of [
    "tokenization-demo",
    "demo-holder",
    "demo-outsider",
    "demo-custodian",
    "demo-vault",
  ] as const)
    net.fundSol(keys[role], 2_000_000_000);
  return { home, keys };
}

interface Run {
  /** What the step printed to stdout: the recorded output. */
  text: string;
  /** stdout and stderr, for failure messages. */
  all: string;
  code: number;
}

function spawnText(
  cmd: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv,
): Promise<Run> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, env });
    let text = "";
    let all = "";
    child.stdout.on("data", (d) => {
      text += d;
      all += d;
    });
    child.stderr.on("data", (d) => (all += d));
    child.on("error", reject);
    child.on("close", (code) =>
      resolve({ text: text.replace(/\s+$/, ""), all, code: code ?? 1 }),
    );
  });
}

async function checkSignatures(text: string, ok: boolean) {
  const rpc = createSolanaRpc(rpcUrl);
  const sigs = [...text.matchAll(SIGNATURE_RE)].map((m) => m[0]);
  if (!ok) {
    expect(sigs, `a failing step printed a signature:\n${text}`).toEqual([]);
    return;
  }
  for (const sig of sigs) {
    let tx = null;
    for (let i = 0; i < 20 && !tx; i++) {
      tx = await rpc
        .getTransaction(toSignature(sig), {
          commitment: "confirmed",
          encoding: "json",
          maxSupportedTransactionVersion: 0,
        })
        .send();
      if (!tx) await new Promise((r) => setTimeout(r, 250));
    }
    expect(tx, `tx ${sig} not found`).not.toBeNull();
    expect(tx!.meta?.err, `tx ${sig} failed`).toBeNull();
  }
}

/**
 * One tutorial chain. `exec` runs a step of this implementation; the Mosaic
 * SDK chain borrows the Kit scripts for the custodian reads, which have no
 * SDK call.
 */
interface Impl {
  name: "mosaic" | "kit" | "web3v3" | "rust";
  exec: (step: string, args: string[], env: NodeJS.ProcessEnv) => Promise<Run>;
}

const tsImpl = (name: "mosaic" | "kit" | "web3v3"): Impl => ({
  name,
  exec: (step, args, env) =>
    spawnText(
      process.execPath,
      ["--import", "tsx", `${step}.ts`, ...args],
      join(here, name),
      env,
    ),
});

// The Rust tab: one release binary per step, built once in the test below.
const rustDir = join(here, "rust");
const rustImpl: Impl = {
  name: "rust",
  exec: (step, args, env) =>
    spawnText(join(rustDir, "target", "release", step), args, rustDir, env),
};
// spl-token, for the custodian-side reads. On PATH where the Solana CLI is
// installed (CI adds it); else the installer's default location.
const splToken = [
  "spl-token",
  join(
    process.env.HOME ?? "",
    ".local/share/solana/install/active_release/bin/spl-token",
  ),
].find(
  (cmd) => spawnSync(cmd, ["--version"], { stdio: "ignore" }).status === 0,
);

const hasCargo =
  spawnSync("cargo", ["--version"], { stdio: "ignore" }).status === 0;

async function runChain(
  impl: Impl,
  {
    readImpl = impl,
    withCli = false,
  }: { readImpl?: Impl; withCli?: boolean } = {},
) {
  const { home, keys } = await makeHome();
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    HOME: home,
    RPC_URL: rpcUrl,
    RPC_SUBSCRIPTIONS_URL: wsUrl,
  };

  async function step(
    script: string,
    args: string[],
    opts: { record?: string; fail?: boolean; by?: Impl } = {},
  ) {
    const run = await (opts.by ?? impl).exec(script, args, env);
    const label = `${impl.name} ${script} ${args.join(" ")}`;
    if (opts.fail) {
      expect(run.code, `${label} should fail:\n${run.all}`).not.toBe(0);
      expect(run.text).toContain("Failed:");
    } else {
      expect(run.code, `${label} failed:\n${run.all}`).toBe(0);
    }
    await checkSignatures(run.text, !opts.fail);
    // A borrowed step (the Mosaic chain's Kit reads) is recorded by the
    // chain it belongs to.
    if (opts.record && (opts.by ?? impl).name === impl.name) {
      recordText(
        new URL(`./${impl.name}/${opts.record}.output.txt`, import.meta.url),
        run.text,
      );
    }
    return run.text;
  }

  // The spl-token commands on the custodian, vault, and operate pages
  // (cli/commands.sh), run once, from the Kit chain, as shown on the page with
  // the devnet URL pointed at this Surfnet.
  async function cli(
    record: string | null,
    region: string,
    extra: NodeJS.ProcessEnv = {},
  ) {
    if (!withCli || !splToken) return;
    // The commands read $RPC_URL, which env points at this Surfnet.
    const script = sliceShellRegion(region);
    const run = await spawnText(
      "bash",
      ["-euo", "pipefail", "-c", script],
      home,
      {
        ...env,
        PATH: `${dirname(splToken)}:${env.PATH}`,
        CUSTODIAN: keys["demo-custodian"],
        OUTSIDER: keys["demo-outsider"],
        VAULT: keys["demo-vault"],
        ...extra,
      },
    );
    expect(run.code, `${region}:\n${run.all}`).toBe(0);
    if (record)
      recordText(
        new URL(`./cli/${record}.output.txt`, import.meta.url),
        run.text,
      );
  }

  // Issue a gated token: create the mint.
  const created = await step("create-the-mint", [], {
    record: "create-the-mint",
  });
  env.MINT = field(created, "Mint");
  env.LIST = field(created, "Allowlist");
  await step("inspect-mint", [], { record: "inspect-mint" });

  // Gate the holders.
  const holder = keys["demo-holder"];
  const outsider = keys["demo-outsider"];
  await step("allowlist-add", [holder], { record: "allowlist-add" });
  await step("fetch-list", [], { record: "fetch-list" });
  await step("mint", [holder, "1000"], { record: "mint" });
  await step("transfer", [outsider, "1"], {
    record: "transfer.blocked",
    fail: true,
  });
  await step("allowlist-add", [outsider]);
  await step("transfer", [outsider, "1"]);

  // Operate the token.
  await step("freeze", [holder], { record: "freeze" });
  await step("transfer", [outsider, "1"], {
    record: "transfer.frozen",
    fail: true,
  });
  await step("thaw", [holder], { record: "thaw" });
  await step("pause", [], { record: "pause" });
  await step("transfer", [outsider, "1"], {
    record: "transfer.paused",
    fail: true,
  });
  await step("resume", [], { record: "resume" });
  await step("force-transfer", [holder, outsider, "10"], {
    record: "force-transfer",
  });
  await step("burn", ["1"], { record: "burn" });
  await step("force-burn", [outsider, "1"], { record: "force-burn" });
  await step("allowlist-remove", [outsider], { record: "allowlist-remove" });
  const outsiderAta = field(
    await step("derive-ata", [outsider], { by: readImpl }),
    "Associated token address",
  );
  const offboarded = await step("read-account", [outsiderAta], {
    by: readImpl,
    record: "read-account.offboarded",
  });
  expect(offboarded).toContain("State: Frozen");
  await cli("address-outsider", "address-outsider");
  await cli("display.offboarded", "display-outsider", {
    OUTSIDER_ATA: outsiderAta,
  });

  // Hold it as a custodian.
  const custodian = keys["demo-custodian"];
  const custodyAta = field(
    await step("derive-ata", [custodian], {
      by: readImpl,
      record: "derive-ata",
    }),
    "Associated token address",
  );
  await cli("address", "address");
  await step("allowlist-add", [custodian]);
  await step("mint", [custodian, "500"]);
  await cli("display.thawed", "display", { CUSTODY_ATA: custodyAta });
  expect(
    await step("read-account", [custodyAta], {
      by: readImpl,
      record: "read-account.thawed",
    }),
  ).toContain("State: Initialized");
  await step("freeze", [custodian]);
  expect(
    await step("read-account", [custodyAta], {
      by: readImpl,
      record: "read-account.frozen",
    }),
  ).toContain("State: Frozen");
  await cli("display.frozen", "display-again", { CUSTODY_ATA: custodyAta });
  await step("thaw", [custodian]);
  await waitFinalized(custodyAta, "Initialized");
  await step("read-account", [custodyAta, "finalized"], {
    by: readImpl,
    record: "read-account.finalized",
  });
  await cli(null, "finalized-config");
  await cli("display.finalized", "display-finalized", {
    CUSTODY_ATA: custodyAta,
  });
  // Shown without output on the page; run so the commands are known to work.
  await cli(null, "solana-account", { CUSTODY_ATA: custodyAta });
  await cli(null, "position-listing");

  // Prepare a vault.
  const vault = keys["demo-vault"];
  await step("transfer", [vault, "1"], {
    record: "transfer.vault-blocked",
    fail: true,
  });
  await step("allowlist-add", [vault]);
  await step("transfer", [vault, "1"]);
  const vaultAta = field(
    await step("derive-ata", [vault], { by: readImpl }),
    "Associated token address",
  );
  await step("read-account", [vaultAta], {
    by: readImpl,
    record: "read-account.vault",
  });
  await cli("address-vault", "address-vault");
  await cli("display.vault", "display-vault", { VAULT_ATA: vaultAta });
  await step("pause", []);
  await step("transfer", [vault, "1"], {
    record: "transfer.vault-paused",
    fail: true,
  });
  await step("resume", []);

  rmSync(home, { recursive: true, force: true });
}

/** One `# #region <name>` of cli/commands.sh, as the docs page shows it. */
function sliceShellRegion(name: string): string {
  const source = readFileSync(join(here, "cli", "commands.sh"), "utf8");
  const match = source.match(
    new RegExp(`# #region ${name}\\n([\\s\\S]*?)# #endregion`),
  );
  if (!match?.[1]) throw new Error(`no region ${name} in cli/commands.sh`);
  return match[1];
}

/** The value after `label: ` in a step's output. */
function field(text: string, label: string): string {
  const value = text.match(new RegExp(`${label}: (\\S+)`))?.[1];
  if (!value) throw new Error(`no "${label}" in:\n${text}`);
  return value;
}

/** Wait until the token account shows `state` at finalized commitment. */
async function waitFinalized(account: string, state: string) {
  const rpc = createSolanaRpc(rpcUrl);
  for (let i = 0; i < 120; i++) {
    const { value } = await rpc
      .getAccountInfo(account as Address, {
        commitment: "finalized",
        encoding: "jsonParsed",
      })
      .send();
    const parsed = value?.data as
      | { parsed?: { info?: { state?: string } } }
      | undefined;
    if (parsed?.parsed?.info?.state?.toLowerCase() === state.toLowerCase())
      return;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`${account} not ${state} at finalized`);
}

const PROGRAMS = [
  "TACLkU6CiCdkQN2MjoyDkVg2yAH9zkxiHDsiztQ52TP", // Token ACL
  "GATEzzqxhJnsWF6vHRsgtixxSB8PaQdcqGEVTEHWiULz", // Token ACL gate
];

/** The executable bytes of an upgradeable program, read from mainnet. */
async function programElf(programId: string): Promise<Uint8Array> {
  const datasource =
    process.env.SURFPOOL_DATASOURCE_RPC_URL ??
    "https://api.mainnet-beta.solana.com";
  const rpc = createSolanaRpc(datasource);
  for (let attempt = 1; ; attempt++) {
    try {
      const { value: program } = await rpc
        .getAccountInfo(programId as Address, { encoding: "base64" })
        .send();
      const programData = getBase58Decoder().decode(
        Buffer.from(program!.data[0], "base64").subarray(4, 36),
      ) as Address;
      const { value } = await rpc
        .getAccountInfo(programData, { encoding: "base64" })
        .send();
      // ProgramData: 4-byte tag, 8-byte slot, 33-byte optional authority.
      return Buffer.from(value!.data[0], "base64").subarray(45);
    } catch (error) {
      if (attempt >= 5) throw error;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

beforeAll(async () => {
  // Offline, so no step depends on the public datasource answering under
  // load; the two Token ACL programs are copied from mainnet once.
  net = Surfnet.startWithConfig({ offline: true, slotTimeMs: 400 });
  rpcUrl = net.rpcUrl;
  wsUrl = net.wsUrl;
  for (const programId of PROGRAMS)
    net.deploy({ programId, soBytes: await programElf(programId) });
});

afterAll(() => net?.stop());

describe("paths/assets/gated-token (tokenization tutorials)", () => {
  it("Mosaic SDK", { timeout: 900_000 }, async () => {
    await runChain(tsImpl("mosaic"), { readImpl: tsImpl("kit") });
  });

  // The recovery on the gate-the-holders page: a mint created frozen by
  // default but without Token ACL gets the gate wired by wire-gate.ts while its
  // freeze authority is still a key; once the freeze authority has been moved
  // by hand (spl-token authorize), nothing can sign for it and wire-gate fails.
  it.skipIf(!splToken)(
    "Mosaic SDK: wire the gate on an existing mint",
    { timeout: 300_000 },
    async () => {
      const { home, keys } = await makeHome();
      const env: NodeJS.ProcessEnv = {
        ...process.env,
        HOME: home,
        RPC_URL: rpcUrl,
        RPC_SUBSCRIPTIONS_URL: wsUrl,
      };
      const payerFile = join(home, ".config/solana/tokenization-demo.json");
      const splTokenRun = async (args: string[]) => {
        const run = await spawnText(
          splToken!,
          [...args, "--fee-payer", payerFile, "--url", rpcUrl],
          home,
          env,
        );
        expect(run.code, `spl-token ${args.join(" ")}:\n${run.all}`).toBe(0);
        return run.text;
      };
      // A mint without the gate: accounts open frozen and the freeze
      // authority is the fee payer's key.
      const ungatedMint = async () => {
        const created = await splTokenRun([
          "create-token",
          "--program-2022",
          "--enable-freeze",
          "--default-account-state",
          "frozen",
          "--decimals",
          "6",
          "--mint-authority",
          keys["tokenization-demo"],
        ]);
        const mint = created.match(/Address:\s+(\S+)/)?.[1];
        expect(mint, created).toBeDefined();
        return mint!;
      };
      const mosaic = tsImpl("mosaic");

      const mint = await ungatedMint();
      const wired = await mosaic.exec("wire-gate", [], { ...env, MINT: mint });
      expect(wired.code, wired.all).toBe(0);
      await checkSignatures(wired.text, true);
      recordText(
        new URL("./mosaic/wire-gate.output.txt", import.meta.url),
        wired.text,
      );
      const mintConfig = field(
        wired.text,
        "Freeze authority \\(Token ACL mint config\\)",
      );
      const inspected = await mosaic.exec("inspect-mint", [], {
        ...env,
        MINT: mint,
      });
      expect(inspected.text).toContain(`freezeAuthority: '${mintConfig}'`);
      expect(inspected.text).toContain("tokenAcl: true");
      // The gate works: an allowlisted holder's account opens through it.
      const listEnv = {
        ...env,
        MINT: mint,
        LIST: field(wired.text, "Allowlist"),
      };
      const holder = keys["demo-holder"];
      for (const [script, args] of [
        ["allowlist-add", [holder]],
        ["mint", [holder, "5"]],
      ] as const) {
        const run = await mosaic.exec(script, [...args], listEnv);
        expect(run.code, run.all).toBe(0);
        await checkSignatures(run.text, true);
      }

      // Moved by hand to the mint config address: unrecoverable.
      const stuck = await ungatedMint();
      const [stuckConfig] = await findMintConfigPda({
        mint: stuck as Address,
      });
      await splTokenRun([
        "authorize",
        stuck,
        "freeze",
        stuckConfig,
        "--authority",
        payerFile,
      ]);
      const failed = await mosaic.exec("wire-gate", [], {
        ...env,
        MINT: stuck,
      });
      expect(failed.code).not.toBe(0);
      expect(failed.text).toContain("Failed:");
      await checkSignatures(failed.text, false);
      rmSync(home, { recursive: true, force: true });
    },
  );

  it("Kit", { timeout: 900_000 }, async () => {
    await runChain(tsImpl("kit"), { withCli: true });
  });

  it("Web3.js v3", { timeout: 900_000 }, async () => {
    await runChain(tsImpl("web3v3"));
  });

  // Needs a Rust toolchain; skipped where cargo is not installed.
  it.skipIf(!hasCargo)("Rust", { timeout: 1_800_000 }, async () => {
    const build = spawnSync("cargo", ["build", "--release", "--quiet"], {
      cwd: rustDir,
      stdio: "inherit",
    });
    expect(build.status, "cargo build failed").toBe(0);
    await runChain(rustImpl);
  });
});
