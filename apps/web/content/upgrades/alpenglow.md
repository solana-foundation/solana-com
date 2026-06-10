# Alpenglow Phase 1 (Votor)

**TBD** • Solana Foundation

Solana is replacing its consensus and block propagation protocols with a new
protocol called Alpenglow. It aims to simplify consensus on Solana given its
scale and improve performance. This change aims to achieve block consensus in
150ms compared to Solana's current confirmation times of 400ms and finality of
12.8ms.

|                                  |     |
| -------------------------------- | --- |
| Expected Mainnet Activation Date | TBD |
| Devnet Activation                | TBD |
| Breaking Change?                 | Yes |
| Indexing Changes Required?       | Yes |

## Technical Details

### Votor

Voting on Alpenglow will work with a new voting algorithm called Votor. It can
handle 20% of adversarial stake plus 20% of offline stake while still achieving
consensus across the network.

TowerBFT needs a supermajority of greater than two-thirds of stake to achieve a
confirmed status. Alpenglow is a marked improvement in terms of the overhead
required to finalize a block.

### Votes and Certificates

Alpenglow will no longer have vote transactions. State of votes is kept in a
separate data structure called Pool and kept together in a service called
Blockstor. There are five vote messages a validator can make:

- Notarization - Voting yes for the block
- Notarization fallback - Voting yes for the previous block
- Skip - Voting skip for the current block
- Skip fallback - Voting skip for the previous block
- Final - Finalizing the block

Alpenglow creates quorum certificates from among the following:

- Fast finalization - >= 80% of stake votes to notarize
- Notarization - >= 60% of stake votes to notarize
- Notarization fallback - >= 60% of stake votes to either notarize or notarize
  the fallback block
- Skip - >= 60% of stake votes to either skip or skip the fallback block
- Finalization - >= 60% of stake votes to finalize the block

### Alpenglow community cluster

After running several tests for months, validators and the core development team
are testing the new consensus algorithm on a community cluster. This will ensure
a smooth migration from the old consensus protocol to the new one. There are
already issues that were identified by the initiative and core devs are working
to ensure that the network does not experience downtime during the transition.

### Alpenglow SIMDs

Alpenglow is defined across several SIMDs. The original proposal introduces the
new consensus protocol, while the follow-up SIMDs cover migration, vote account
changes, clock behavior, leader handoff markers, and VAT implementation details.

|                                                                                         |                                            |
| --------------------------------------------------------------------------------------- | ------------------------------------------ |
| [SIMD-0326](https://github.com/solana-foundation/solana-improvement-documents/pull/326) | Alpenglow Consensus Protocol               |
| [SIMD-0337](https://github.com/solana-foundation/solana-improvement-documents/pull/337) | Markers for Alpenglow Fast Leader Handover |
| [SIMD-0357](https://github.com/solana-foundation/solana-improvement-documents/pull/357) | Alpenglow VAT implementation               |
| [SIMD-0363](https://github.com/solana-foundation/solana-improvement-documents/pull/363) | Simple Alpenglow Clock                     |
| [SIMD-0384](https://github.com/solana-foundation/solana-improvement-documents/pull/384) | Alpenglow Migration                        |
| [SIMD-0387](https://github.com/solana-foundation/solana-improvement-documents/pull/387) | BLS Pubkey Management in Vote Account      |

---

### Phase 2 (Rotor)

Alpenglow in its next phase will replace Solana Turbine with a new block
propagation service called Rotor. It uses the same erasure coding idea and
validator stake-adjusted bandwith from Turbine. Rotor changes the block
propagation plan from a tree of nodes to a single relay layer to minimize
network latency.

## About This Upgrade

Alpenglow is the biggest change to Solana in recent years. Not only does it
improve on TowerBFT, but it makes the network competitive while also being safe.

This is a collaborative effort on the part of validators and core developers to
ensure that the chain continues to deliver for users.

Alpenglow makes changes to how Solana thinks about blockspace, finality, voting,
and rewards. Once the migration is complete, Solana will be a very different
protocol.

**Learn more:** [Solana Upgrades](/upgrades)
