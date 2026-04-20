# Optimized Token Program

**April 1, 2026** • Solana Foundation

A major upcoming upgrade to Solana is the optimized token program, also known as
P-token. This upgrade as outlined in
[SIMD-0266](https://github.com/solana-foundation/solana-improvement-documents/pull/266)
dramatically improves the efficiency of all token usage on the network, leading
to a ~10% reduction in total block space usage and opening up the potential to
support more complex transactions on the network.

The current token program's instruction set is fully backwards compatible with
p-token, meaning current existing applications and wallets will continue to work
as expected.

|                                  |           |
| -------------------------------- | --------- |
| Expected Mainnet Activation Date | May 2026  |
| Devnet Activation                | Completed |
| Breaking Change?                 | No        |
| Indexing Changes Required?       | Yes       |

## Technical Details

### Additional Instructions

SPL-Token's instruction set is fully backwards compatible with p-token, meaning
current existing applications and wallets will continue to work as expected.

There are three new instructions added in p-token:

| Instruction                | Description                                                                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `withdraw_excess_lamports` | Allow recovering "bricked" SOL from mint (e.g., USDC mint as ~323 SOL in excess) and multisig accounts.           |
| `batch`                    | Enable efficient CPI interaction with the Token program by batching multiple transfers into a single instruction. |
| `unwrap_lamports`          | Allow transferring out lamports from native SOL token accounts directly to any destination account.               |

### Indexing Updates

The new `batch`, `withdraw_excess_lamports`, and `unwrap_lamports` instructions
add additional indexing requirements for normal token transfers. To support
these new instructions, you have to update your indexing pipeline to parse the
new instruction data.

The new IDL for parsing the data is
[available in the solan-program repository](https://github.com/solana-program/token/blob/main/program/idl.json).
If you're using an indexer like
[Carbon](https://github.com/sevenlabs-hq/carbon), you will be able to update
your indexer with the new IDL. If you use the Solana SDKs for indexing, you will
either need to update your SDK to use `@solana-program/token@0.13` or
`spl-token-client@0.19.0`.

### Token Compute Cost Comparison (P-Token vs. SPL Token)

The main impact is freeing up block CUs, allowing more transactions to be packed
in a block; application developers benefit since interacting with the Token
program will consume significantly less CUs.

Below is a sample of the CUs efficiency gained by `p-token` compared to the
current SPL Token program, including the percentage of CUs used in relation to
the current SPL Token consumption — the lower the percentage, the better the
gains in CUs consumption.

| **Instruction**            | **spl token** | **p-token** | **% of spl-token** |
| -------------------------- | ------------- | ----------- | ------------------ |
| `Approve`                  | 2904          | 124         | 4.2%               |
| `ApproveChecked`           | 4458          | 164         | 3.6%               |
| `Burn`                     | 4753          | 126         | 2.6%               |
| `BurnChecked`              | 4754          | 129         | 2.7%               |
| `CloseAccount`             | 2916          | 120         | 4.1%               |
| `FreezeAccount`            | 4265          | 146         | 3.4%               |
| `InitializeAccount`        | 4527          | 154         | 3.4%               |
| `InitializeAccount2`       | 4388          | 171         | 3.8%               |
| `InitializeAccount3`       | 4240          | 248         | 5.8%               |
| `InitializeImmutableOwner` | 1404          | 38          | 2.7%               |
| `InitializeMint`           | 2967          | 105         | 3.5%               |
| `InitializeMint2`          | 2827          | 228         | 8.0%               |
| `InitializeMultisig`       | 2973          | 193         | 6.4%               |
| `InitializeMultisig2`      | 2826          | 318         | 11.2%              |
| `MintTo`                   | 4538          | 119         | 2.6%               |
| `MintToChecked`            | 4545          | 169         | 3.7%               |
| `Revoke`                   | 2677          | 97          | 3.6%               |
| `SetAuthority`             | 3167          | 123         | 3.8%               |
| `SyncNative`               | 3045          | 61          | 2.0%               |
| `ThawAccount`              | 4267          | 142         | 3.3%               |
| `Transfer`                 | 4645          | 76          | 1.6%               |
| `TransferChecked`          | 6200          | 105         | 1.6%               |

---

## About This Upgrade

P-Token represents one of the most significant efficiency improvements in
Solana's history. By optimizing the network's most frequently used program,
P-Token frees up substantial resources for other applications while reducing
costs for users.

This upgrade demonstrates Solana's commitment to continuous improvement and sets
the foundation for even greater scalability as the network grows.

**Learn more:** [Solana Upgrades](/upgrades)
