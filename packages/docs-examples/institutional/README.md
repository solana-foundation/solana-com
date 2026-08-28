# Institutional tutorial command output

Console output for the runnable command blocks in
`/docs/institutional/tutorials/*`. Each `.output.txt` is attached to a fence in
the MDX with `output=<path>` and rendered by
`apps/docs/src/lib/remark-example-output.mjs`.

> [!IMPORTANT] Every file in this directory is currently a **placeholder**. None
> of it has been captured from a real devnet run. Do not treat these values as
> verified behaviour, and do not merge the institutional tutorials to production
> docs until they are replaced.

## Why placeholders exist

The tutorials shipped with `{/* TODO(devnet): paste the real output here */}`
comments, which render invisibly — a reader saw prose promising output that
never appeared. Wiring the real mechanism now means the layout, the Run button,
and the build-time guard are all in place, so replacing a placeholder is a
one-file change with no MDX edit.

`remark-example-output` throws a build error if a referenced path is missing, so
these files cannot silently disappear.

## Replacing a placeholder

Run the tutorial step against devnet with the pinned CLI
(`@solana/mosaic-cli@0.1.2`), copy the terminal output verbatim, and overwrite
the file. Keep it verbatim — do not tidy addresses or reflow it.

| File                                       | Tutorial step                                       | Command to capture                                                                                            |
| ------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `issuing/inspect-mint-created.output.txt`  | Create the Mint — "Confirm what you built"          | `mosaic inspect-mint --mint-address $MINT --rpc-url https://api.devnet.solana.com`                            |
| `issuing/inspect-mint-gated.output.txt`    | Gate the Holders — confirm the gate                 | `mosaic inspect-mint --mint-address $MINT --rpc-url https://api.devnet.solana.com`                            |
| `issuing/abl-fetch-list.output.txt`        | Gate the Holders — read the list back               | `mosaic abl fetch-list --list $LIST --rpc-url https://api.devnet.solana.com`                                  |
| `issuing/transfer-blocked.output.txt`      | Gate the Holders — transfer to a non-listed address | `mosaic transfer --mint-address $MINT --recipient $OUTSIDER --amount 1 ...`                                   |
| `issuing/transfer-frozen.output.txt`       | Operate the Token — transfer from a frozen account  | `mosaic transfer --mint-address $MINT --recipient $HOLDER --amount 1 ...`                                     |
| `issuing/control-status-paused.output.txt` | Operate the Token — pause the mint                  | `mosaic control pause ...` then `mosaic control status ...` - capture both, including the confirmation prompt |
| `custodian/display-thawed.output.txt`      | Custodian — confirm what you hold                   | `spl-token display $CUSTODY_ATA --url https://api.devnet.solana.com`                                          |
| `custodian/display-frozen.output.txt`      | Custodian — observe a freeze                        | `spl-token display $CUSTODY_ATA --url https://api.devnet.solana.com`                                          |
| `vault/transfer-blocked.output.txt`        | Vault — blocked deposit                             | `mosaic transfer --mint-address $MINT --recipient $VAULT --amount 1 ...`                                      |

The placeholders share one consistent set of demo values (mint
`7Nf3XQrmCJ8kVvHxWqLbYd2ZpToaGm4RsUeJc6VnAkPq`, Token ACL program
`TACLkU6CiCdkQN2MjoyDkVg2yAH9zkxiHDsiztQ52TP`) so the chain reads coherently
until real output replaces them. A real capture will not match those values, and
does not need to.
