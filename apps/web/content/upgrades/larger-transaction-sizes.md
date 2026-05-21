# Larger Transaction Sizes

**June, 2026** • Solana Foundation

A major upcoming upgrade to Solana raises the maximum transaction size from 1232
bytes to 4096 bytes. The size increase is defined in
[SIMD-0296](https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0296-larger-transactions.md)
and delivered through the v1 transaction format introduced in
[SIMD-0385](https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0385-transaction-v1.md).
It unlocks workloads that previously could not fit inside a single transaction,
including ZK proofs, large multisigs, and some onchain signature schemes.

The existing `v0` and `legacy` transaction formats continue to work as they do
today, so applications and wallets that don't need the larger size will be
unaffected. Applications that want to take advantage of it will need to update
to `v1` transactions.

|                                  |           |
| -------------------------------- | --------- |
| Expected Mainnet Activation Date | June 2026 |
| Devnet Activation                | Not yet   |
| Breaking Change?                 | No        |
| Indexing Changes Required?       | Yes       |

## Technical Details

### Size Limit

The new per-transaction size limit is 4096 bytes, up from 1232. The previous
limit was set by Solana's conservative use of a 1280-byte MTU (Maximum
Transmission Unit), which after overhead left 1232 bytes for transaction
payload.

In 2022, QUIC became the default transaction ingestion protocol, which does not
specify a maximum stream size, so the maximum transaction size can be raised.

The ceiling stays at 4096 rather than going larger as this matches the standard
4 KiB memory page used by validator hardware, which keeps per-transaction memory
handling cheap and avoids forcing a single transaction to span multiple pages.

Once a transaction exceeds the MTU, it has to be split across multiple QUIC
frames, and a single dropped frame triggers a retransmit of the whole set. This
makes larger transactions more expensive to receive reliably and puts more
pressure on validator in-flight buffers. Keeping the transaction size under 4096
avoids this problem.

A 4096-byte ceiling covers a meaningful share of the use cases that have relied
on bundles, letting developers land them as individual atomic transactions
instead. Because larger transactions consume more validator bandwidth, the
scheduler is expected to require higher priority fees to land them than smaller
transactions of equivalent priority.

### v1 Format Requirement

The larger size is only available in the `v1` transaction format. `v1`
transactions are identified by a leading version byte of `129` and replace the
`ComputeBudgetProgram` instructions with a configuration mask carried directly
in the transaction header. `v1` does not support address lookup tables, but at
4096 bytes the full address list can be included directly in most cases anyway.
The full format is specified in
[SIMD-0385](https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0385-transaction-v1.md).

The larger size enables transaction-level workloads that did not fit inside 1232
bytes, including ZK proofs such as those used by
[Confidential Transfers](https://solana.com/docs/tokens/extensions/confidential-transfer),
Winternitz one-time signatures, nested multisigs often used by institutions, and
signature schemes like BLS.

### Indexing Updates

The v1 format changes the byte layout of every field after the version byte. Any
indexer or client that decodes raw transaction bytes will need to recognize the
`129` version prefix and parse the new layout.

Transactions sent in `v0` or `legacy` formats continue to deserialize as they do
today.

---

## About This Upgrade

Larger transaction sizes is a huge usability improvement for Solana developers.
By raising the per-transaction byte limit to 4096 bytes, this upgrade lets
developers land previously oversized workloads as single atomic transactions
instead of stitching them together with address lookup tables or Jito bundles.
In practice this also lowers cost and latency - there are fewer signatures to
pay and one single confirmation rather than several chained transactions.

This upgrade addresses a practical ceiling that application teams have had to
design around since the early days of Solana, and brings a whole new class of
capabilities that we're looking forward to support.

**Learn more:** [Solana Upgrades](/upgrades)
