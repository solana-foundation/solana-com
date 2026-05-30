# Alpenglow

**TBD** • Solana Foundation

Solana is replacing its TowerBFT consensus algorithm with a new protocol called
Alpenglow. It aims to simplify consensus on Solana given its scale and improve
performance. This change hopes to achieve block consensus in 150ms compared to
Solana's current confirmation times of 400ms and finality of 12.8ms.

It was first
[announced by Anza](https://www.anza.xyz/blog/alpenglow-a-new-consensus-for-solana)
in May 19, 2025, and
[announced further](https://www.youtube.com/watch?v=x1sxtm-dvyE) in Solana
Accelerate 2025 Scale or Die. It was formally proposed in
[SIMD-0326](https://github.com/solana-foundation/solana-improvement-documents/pull/326)
with further SIMDs improving on the implementation details.

|                                  |     |
| -------------------------------- | --- |
| Expected Mainnet Activation Date | TBD |
| Devnet Activation                | TBD |
| Breaking Change?                 | Yes |
| Indexing Changes Required?       | TBD |

## Technical Details

### Rotor

Alpenglow replaces Solana Turbine with a new block distribution service called
Rotor. It uses the same erasure coding idea behind Turbine, but adjusts its
bandwidth based on validator stake. Validators with larger stake will be
responsible for more of the outgoing bandwidth. This increases bandwidth for
everyone and allows for more blockspace over the network.

### Votor

Voting on Alpenglow will work with a new voting algorithm called Votor. It can
handle 20% of adversial stake plus 20% of offline stake while still achieving
consensus across the network.

TowerBFT needs a supermajority of greater than two-thirds of stake to achieve a
confirmed status. Alpenglow is a marked improvement in terms of the overhead
required to finalize a block.

### Votes and Certificates

Alpenglow will no longer have vote transactions. State of votes is kept in a
separate data structure called Pool and kept together in a service called
Blockstor. There vote messages a validator can make:

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
already issues that were identified by the initiative and core devsare working
ensure that the network does not experience downtime during the transition.

### Further SIMDs

The following SIMDs were added to further extend the original Alpenglow
proposal:

|                                                                                         |                                            |
| --------------------------------------------------------------------------------------- | ------------------------------------------ |
| [SIMD-0337](https://github.com/solana-foundation/solana-improvement-documents/pull/337) | Markers for Alpenglow Fast Leader Handover |
| [SIMD-0357](https://github.com/solana-foundation/solana-improvement-documents/pull/357) | Alpenglow VAT implementation               |
| [SIMD-0363](https://github.com/solana-foundation/solana-improvement-documents/pull/363) | Simple Alpenglow Clock                     |
| [SIMD-0384](https://github.com/solana-foundation/solana-improvement-documents/pull/384) | Alpenglow Migration                        |
| [SIMD-0387](https://github.com/solana-foundation/solana-improvement-documents/pull/387) | BLS Pubkey Management in Vote Account      |

---

## About This Upgrade

Alpenglow is the biggest change to Solana in recent years. Not only does it
improve on TowerBFT, but it makes the network is competitive while also being
safe.

This is a collaborative effort on the part of validators and core developers to
ensure that the chain continues to deliver for users.

Alpenglow makes changes to how Solana thinks about blockspace, finality, voting,
and rewards. Once the migration is complete, Solana will be a very different
protocol.

**Learn more:** [Solana Upgrades](/upgrades)
