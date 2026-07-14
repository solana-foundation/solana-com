# Wallet Filter Taxonomy

Use these definitions when researching wallet functionality for
`packages/ecosystem-data/src/wallets`.

## Categories

- `consumer`: end-user wallet app, browser extension, desktop wallet, or mobile
  wallet.
- `hardware`: physical signing device or hardware-wallet product.
- `infrastructure`: APIs, SDKs, embedded wallet providers, key management, or
  wallet-as-a-service.
- `institutional`: custody, policy, multisig, treasury, or enterprise wallet
  workflows.
- `payments`: wallets or wallet infrastructure primarily positioned around
  payments, commerce, remittance, or card-like flows.

## Platforms

- `ios`: official iOS app.
- `android`: official Android app.
- `chrome`, `firefox`, `brave`, `edge`: official browser extension support.
- `desktop`: installed desktop app.
- `web`: web app or hosted wallet.
- `hardware`: physical wallet device.
- `api`: hosted API product.
- `sdk`: SDK/library product.

## Features

- `custodial`: provider controls user custody or account access.
- `non_custodial`: user controls keys, seed phrase, passkey-signing authority,
  or self-custody account access.
- `te`: explicit support for Solana Token Extensions.
- `blinks_and_actions`: explicit support for Solana Actions or Blinks.
- `solana_pay`: explicit support for Solana Pay.
- `buy_crypto`: fiat on-ramp, card/bank purchase, or integrated exchange buy.
- `sell_crypto`: fiat off-ramp, card/bank withdrawal, or integrated exchange
  sell.
- `hold_nfts`: displays, sends, receives, or manages NFTs/collectibles.
- `mpc`: explicit multi-party computation key management.
- `gas_abstraction`: sponsored fees, fee abstraction, gasless transactions, or
  paymaster-style fee handling.
- `social_recovery`: account recovery through guardians, social login, email,
  passkeys, or similar recovery flows.
- `staking`: SOL staking or staking account management.
- `spending_limits`: policy controls, spend caps, programmable limits, or
  threshold approvals.
- `open_source`: relevant wallet app, protocol, or SDK code is public.
- `hardware`: the wallet is hardware or integrates explicitly with hardware
  wallets.
- `private_key_infrastructure`: infrastructure for key custody, signing,
  embedded wallets, or wallet provisioning.
- `multi_chain`: explicit support for more than one blockchain network.
- `solana_native`: product is built primarily for Solana or markets itself as
  Solana-first.
- `multi_sig`: explicit multisig, threshold signature, or multi-approval account
  support.

## Evidence Standard

Use true only when a primary source explicitly supports it. Use false when the
feature is absent, ambiguous, only user-reported, or only implied by generic
chain support.
