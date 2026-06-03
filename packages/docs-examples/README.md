# @workspace/docs-examples

Source of truth for the Kit and Legacy code snippets shown on
[solana.com cookbook pages](../../apps/docs/content/cookbook). Every file under
`cookbook/` is real, runnable, and exercised against a local
[surfpool](https://github.com/txtx/surfpool) instance on every PR — so SDK
renames or signature changes turn into red CI runs instead of rotted
documentation.

The MDX pages in `apps/docs` pull slices from here at build time via
[`@devrelkit/remark-include-code`](https://www.npmjs.com/package/@devrelkit/remark-include-code).

## Adding a snippet

See
[`apps/docs/CONTRIBUTING.md`](../../apps/docs/CONTRIBUTING.md#cookbook-code-examples)
— short version: drop a runnable file under
`cookbook/<section>/<page>/<flavour>.ts`, wrap the part you want rendered in
`// #region <name>` / `// #endregion <name>` markers, add a sibling
`<flavour>.test.ts` that imports the file, then reference it from MDX with
`file=...#region=...`.

## Running the suite

```sh
pnpm --filter @workspace/docs-examples test
```

Requires the `surfpool` CLI on `$PATH`:

```sh
cargo install --git https://github.com/txtx/surfpool --locked surfpool-cli
```

The first run starts surfpool with `--network mainnet` so cookbook examples that
look up real accounts (USDC mint, Token Program, Metaplex Token Metadata, etc.)
resolve via lazy account cloning. Tests that don't need network state still run
hermetically against the same instance.
