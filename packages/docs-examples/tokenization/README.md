# Tokenization tutorial examples

Command output and example scripts for `/docs/tokenization/tutorials/*`.

- `*.output.txt` files are the recorded outputs. CLI fences name theirs with
  `output=<path>`; script fences pick up `<script>.output.txt` next to the
  script, or name a variant such as `transfer-kit.blocked.output.txt` where one
  script serves steps with different outcomes. Rendered by
  `apps/docs/src/lib/remark-example-output.mjs`.
- Most tutorial steps carry five tabs (the `spl-token` read steps carry four),
  transcluded with `file=<path>#region=<name>` by
  `@devrelkit/remark-include-code`:

  | Tab        | Files                                          | Builds the transaction with                                                                                                          |
  | ---------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
  | Mosaic CLI | inline command                                 | `@solana/mosaic-cli@0.2.0`                                                                                                           |
  | Mosaic SDK | `issuing/<step>.ts`                            | `@solana/mosaic-sdk@0.2.0` on a `@solana/kit` client                                                                                 |
  | Kit        | `issuing/<step>-kit.ts`, `custodian/<step>.ts` | `@solana-program/token-2022` plus the generated `@solana/token-acl-sdk` and `@solana/token-acl-gate-sdk` clients, on `@solana/kit` 8 |
  | Legacy     | `*-legacy.ts`                                  | `@solana/web3.js` 1.x and `@solana/spl-token`; Token ACL and gate instructions encoded directly                                      |
  | Rust       | `rust/src/bin/<step>.rs`                       | `spl-token-2022-interface` 3.x on `solana-sdk` 4; Token ACL and gate instructions encoded directly                                   |

  Every script reads the same keypair files and the `$MINT` and `$LIST`
  variables the CLI tabs export, and takes the holder address and any amount as
  command-line arguments, so all five tabs act on one mint. The Kit, Legacy, and
  Rust scripts reproduce the instruction sequence the Mosaic SDK sends: create
  the token account, thaw it through the gate, then mint or transfer; remove
  from the allowlist and freeze the existing account in one transaction;
  permissioned burn with the burn authority co-signing.

- `capture.sh` runs the whole chain in tutorial order for one implementation
  (`IMPL=sdk|kit|legacy|rust`) and rewrites that implementation's outputs. It is
  the record of how the outputs were produced.

## Why the Legacy and Rust tabs encode Token ACL and gate instructions

No web3.js client exists for either program; the `clients/js-legacy` directory
in the token-acl repository contains only empty placeholder files and is not
published. The Rust clients exist (`token-acl-client` and
`token-acl-gate-client` 0.3.0) but pin `spl-token-2022-interface` 2.x (the gate
client also pins exact 3.x Solana crates), and the 2.x interface predates the
Permissioned Burn extension this mint carries. Both tabs therefore build the
instructions from their published layout: a one-byte discriminator and an
account list, verified against the transactions the Mosaic SDK sent on devnet
(`solana confirm -v`). The Kit tab uses the generated clients. They and the
Mosaic SDK declare `@solana/kit` 6 as a regular dependency;
`pnpm-workspace.yaml` resolves them onto this package's single Kit 8 copy,
because a second Kit copy rebrands the nominal RPC types and the scripts stop
type-checking. The Mosaic SDK scripts use a plain `createSolanaRpc` /
`createSolanaRpcSubscriptions` pair rather than the RPC plugin client, whose
object type does not satisfy the SDK's RPC parameter on Kit 8.

Ten of the sixteen steps encode a Token ACL or gate instruction in the Legacy
and Rust tabs (create config, set gating program, freeze, thaw, permissionless
thaw, toggle; create list, add wallet, remove wallet, set up extra metas), plus
the list account layout read. Both programs are pre-1.0 and sRFC-37 is not
finalized, so revisit those two tabs after a program upgrade.

## The Rust crate

`rust/` is a standalone crate outside the docs-examples Cargo workspace (listed
under `exclude` in `../Cargo.toml`) because it needs a different dependency line
from the cookbook crates and because the CI runner executes every workspace
binary against surfpool with no arguments. Build it with `cargo build --release`
in `rust/`; `capture.sh` does that once per run.

## Status as of 2026-09-11

Every `*.output.txt` is a verbatim capture from a `capture.sh` run on
2026-09-11, one run per implementation, each against a mint that run created:

| Implementation     | Runner                                                | Mint                                           | Result                                     |
| ------------------ | ----------------------------------------------------- | ---------------------------------------------- | ------------------------------------------ |
| Mosaic CLI and SDK | devnet                                                | `6kYKjkRMThoiDuwyeSALzzPq8WPRg66C8DGWBEQ17m1N` | 39 commands succeeded, 6 expected failures |
| Kit                | devnet                                                | `33kEeYfLR11zKdi7uRU5fbw8yyp2xspLHopWJyCYYWz9` | 26 commands succeeded, 3 expected failures |
| Legacy             | devnet                                                | `DBxmHVhU9DbgrsrvkVid1vHmNFrSB4ybf53zXx9vqKt9` | 26 commands succeeded, 3 expected failures |
| Rust               | surfpool 1.5.0 with devnet as its datasource, locally | `6Hy2tU3GjWkwuSYNsCfHNJjRo5BTDwXsyj7kWixEAR4m` | 26 commands succeeded, 3 expected failures |

The expected failures are the tutorials' deliberate ones, once per tab in the
Mosaic run and once in the others: transfer to an unlisted wallet, transfer from
a frozen account, and deposit to an unlisted vault. One substitution is applied
to every capture: the machine-specific npm install path inside stack traces is
rewritten to `/usr/local/lib/node_modules`.

The Rust run used surfpool rather than devnet because the public devnet RPC
rate-limits bursts of requests (HTTP 429) and a rate-limited address lookup
mid-chain breaks the sequence. The Rust scripts decode account bytes directly,
so unlike the Mosaic SDK they do not depend on the runner's account decoder, and
the same chain passed on devnet up to the rate limit. The Mosaic run has to be
on devnet: the SDK reads mints through the RPC's `jsonParsed` encoding, which
surfpool 1.5.0 cannot produce for this mint (see below).

To refresh the outputs, fund `~/.config/solana/tokenization-demo.json` and the
four demo wallets on devnet, then run `IMPL=<impl> ./capture.sh` from this
directory for each implementation. Each run takes a few minutes and prints the
mint at the end. For a local runner, copy the scripts with the devnet URL
replaced (`solanaDevnetRpc()` becomes `solanaLocalRpc()` in the Kit and SDK
scripts) and point `SCRIPTS` at the copies.

### Running the chain locally

A local validator works with the three programs the tutorials depend on cloned
from devnet:

```bash
solana-test-validator --reset --url https://api.devnet.solana.com \
  --clone-upgradeable-program TACLkU6CiCdkQN2MjoyDkVg2yAH9zkxiHDsiztQ52TP \
  --clone-upgradeable-program GATEzzqxhJnsWF6vHRsgtixxSB8PaQdcqGEVTEHWiULz \
  --clone-upgradeable-program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
```

Two details matter. Agave 4.2 or later is required: the account decoder in
earlier releases does not know the Permissioned Burn extension, returns the mint
without its `extensions` array, and the SDK then omits the permissionless thaw
so every mint fails with `Account is frozen`. Token-2022 has to be cloned as
well, because the bundled build predates Permissioned Burn and rejects the mint
creation with `Invalid instruction`.

surfpool 1.5.0 has the same decoder gap (it builds against account decoder
4.1.2, which still carries the 2.x interface), so the chain fails at the first
mint there until surfpool moves to 4.2 crates. Create, inspect, allowlist
changes, list reads, and pause and resume pass on it. The Rust chain ran to
completion on surfpool 1.5.0 with devnet as the datasource, which is how the
Rust outputs were captured: those scripts decode account bytes directly and
never ask the RPC for a parsed mint.

## Toolchain the tutorials target

`@solana/mosaic-cli@0.2.0` and `@solana/mosaic-sdk@0.2.0`. The SDK works as
published. The published CLI has these defects, all reproduced on devnet on the
capture day and listed in the issuing tutorials overview:

| Defect                                                                                                     | Effect                                                                                                                | Upstream state                        |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Root option `--raw-tx <encoding>` declared with default `'b64'` (`dist/index.js`)                          | Every write command runs in raw-transaction mode: prints an unsigned transaction, or crashes reading `.address`       | Default removed on `main`, unreleased |
| `create tokenized-security` passes `mintAuthority` as an `Address`                                         | SDK throws `mintAuthority must be a TransactionSigner<string> (or undefined) when TokenMetadata extension is present` | Same in `main` source on 2026-09-10   |
| `force-transfer` passes `authority.address` and `payer.address`                                            | `Transaction is missing signatures for addresses: <delegate>`                                                         | Same in `main` source on 2026-09-10   |
| `token-acl freeze` and `token-acl thaw` not registered in `commands/token-acl/index.js`                    | Unknown command                                                                                                       | Fixed on `main`, unreleased           |
| Build imports without `.js` extensions                                                                     | `mosaic` fails under Node's ESM loader with `ERR_MODULE_NOT_FOUND`; runs via `tsx`                                    | Same at 0.2.0                         |
| `--version` prints `0.1.2`                                                                                 | Cosmetic                                                                                                              | Fixed on `main`, unreleased           |
| `mosaic transfer` prints a decoded mint config object and a list address before the error on the thaw path | Debug output in `transfer-blocked` captures; kept verbatim                                                            | Same at 0.2.0                         |
| `control pause` prints literal `\n` sequences                                                              | Visible in `control-status-paused.output.txt`; kept verbatim                                                          | Same at 0.2.0                         |

The CLI captures were made with the `--raw-tx` default removed from the
installed `dist/index.js`, the one-line change already on `main`. Read-only
commands (`inspect-mint`, `abl fetch-list`, `control status`) run unmodified.

Behaviour the tutorials now state because the run showed it:

- `allowlist remove` also freezes the wallet's associated token account when it
  is initialized and thawed (`getRemoveFromAllowlistInstructions`), and
  `allowlist add` thaws it again. Offboarding is one operation.
- `mosaic transfer`, `force-transfer`, `force-burn`, and `mint` insert a
  permissionless thaw for a new or frozen account. The gate rejects it for an
  unlisted wallet with `#4098`, so those operations fail against an offboarded
  wallet until it is re-listed.
- `control pause` without `--skip-warning` prints a warning and exits without
  pausing.

## Capture table

| File                                       | Tutorial step                                       | Command                                                                       |
| ------------------------------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------- |
| `issuing/inspect-mint-created.output.txt`  | Create the mint - "Confirm what you built"          | `mosaic inspect-mint --mint-address $MINT`                                    |
| `issuing/inspect-mint-gated.output.txt`    | Gate the holders - confirm the gate                 | same command, before any holder is added                                      |
| `issuing/abl-fetch-list.output.txt`        | Gate the holders - read the list back               | `mosaic abl fetch-list --list $LIST`                                          |
| `issuing/transfer-blocked.output.txt`      | Gate the holders - transfer to a non-listed address | `mosaic transfer ... --recipient $OUTSIDER` before listing                    |
| `issuing/transfer-frozen.output.txt`       | Operate the token - transfer from a frozen account  | `issuing/freeze.ts $HOLDER`, then `mosaic transfer ... --recipient $OUTSIDER` |
| `issuing/control-status-paused.output.txt` | Operate the token - pause the mint                  | `mosaic control pause --skip-warning ...` then `mosaic control status ...`    |
| `issuing/display-offboarded.output.txt`    | Operate the token - offboard a holder               | `mosaic allowlist remove ... --account $OUTSIDER`, then `spl-token display`   |
| `custodian/display-thawed.output.txt`      | Custodian - confirm what you hold                   | `spl-token display $CUSTODY_ATA`                                              |
| `custodian/display-frozen.output.txt`      | Custodian - observe a freeze                        | `issuing/freeze.ts $CUSTODIAN`, then the same `spl-token display`             |
| `vault/transfer-blocked.output.txt`        | Vault - blocked deposit                             | `mosaic transfer ... --recipient $VAULT` before listing                       |

## Verifying the scripts

`pnpm --filter @workspace/docs-examples check-types` covers the TypeScript
scripts in CI, and `cargo build --release` in `rust/` covers the Rust ones. None
are in the vitest or Rust CI runs: those include `cookbook/**` only, and the
tutorial chain needs the tutorial's keypairs, a funded payer, and `$MINT`.
`capture.sh` runs each once; confirm a logged signature with
`solana confirm -v <signature> --url <rpc>`.
