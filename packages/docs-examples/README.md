# @workspace/docs-examples

Source of truth for the Kit, web3.js v3, and web3.js (legacy) code snippets
shown on [solana.com cookbook pages](../../apps/docs/content/cookbook). Every
file under `cookbook/` is real, runnable, and exercised against a local
[surfpool](https://github.com/solana-foundation/surfpool) instance on every PR —
so SDK renames or signature changes turn into red CI runs instead of rotted
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

The suite boots its own surfpool through `@solana/surfpool`, so no CLI install
is needed. The instance uses a mainnet datasource so cookbook examples that look
up real accounts (USDC mint, Token Program, Metaplex Token Metadata, etc.)
resolve via lazy account cloning. Tests that don't need network state still run
hermetically against the same instance.

The Rust examples are driven by `scripts/run-rust-examples.sh`, which does need
the `surfpool` CLI on `$PATH`:

```sh
cargo install --git https://github.com/solana-foundation/surfpool --locked surfpool-cli
```

The Python and Go examples are driven the same way by
`scripts/run-python-examples.sh` and `scripts/run-go-examples.sh`. Both reuse a
validator that is already listening on `localhost:8899` (for example
`solana-test-validator`) and otherwise spawn surfpool:

```sh
pip install -r requirements.txt
bash scripts/run-python-examples.sh
bash scripts/run-go-examples.sh
```

Python examples live at `cookbook/<section>/<page>/python.py` (or
`<variant>-python.py`) and use `# #region <name>` markers; Go examples live at
`cookbook/<section>/<page>/go/main.go` (or `go-<variant>/main.go`) inside this
directory's Go module.
