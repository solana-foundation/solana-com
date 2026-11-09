#!/usr/bin/env bash
# The CLI tab of each Quickstart step: the same five steps with the Solana CLI
# and spl-token, run from one folder. cli.test.ts runs every region in order
# against a local Surfnet (with `--url devnet` pointed at it).

# #region balance
solana config set --url devnet
solana-keygen new --no-bip39-passphrase  # your wallet; skip if you have one
solana address    # your address, for the faucets
# 0.02 free test SOL for a new wallet, enough for every step.
# Refused? Use https://faucet.solana.com
curl -d address=$(solana address) https://solana.com/api/devnet-airdrop
solana balance
# After the Circle faucet sends you test USDC:
spl-token balance 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
# #endregion balance

# #region send
USDC=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
solana-keygen new --no-bip39-passphrase -o recipient.json  # a new address
# Opens the recipient's USDC token account, then sends 1 USDC
spl-token transfer $USDC 1 recipient.json \
  --fund-recipient --allow-unfunded-recipient
spl-token balance $USDC --owner recipient.json
# #endregion send

# #region asset
solana-keygen new --no-bip39-passphrase -o exf.json  # the asset's address
spl-token create-token exf.json --program-2022 --decimals 2 \
  --enable-freeze --enable-metadata
MINT=$(solana address -k exf.json)
spl-token initialize-metadata $MINT \
  "Example Fund" EXF https://example.com/exf.json
spl-token create-account $MINT  # your token account for EXF
spl-token mint $MINT 1000
# #endregion asset

# #region send-asset
MINT=$(solana address -k exf.json)
solana-keygen new --no-bip39-passphrase -o holder.json  # the holder's wallet
spl-token transfer $MINT 100 holder.json \
  --fund-recipient --allow-unfunded-recipient
spl-token balance $MINT --owner holder.json
# #endregion send-asset

# #region freeze
MINT=$(solana address -k exf.json)
# The holder's EXF token account (step 4 opened it)
ACCOUNT=$(spl-token address --verbose --token $MINT --owner holder.json \
  | awk '/Associated/ {print $NF}')
spl-token freeze $ACCOUNT
# The holder sends 10 EXF back (you pay the fee). Fails: Account is frozen
spl-token transfer $MINT 10 $(solana address) \
  --owner holder.json --fee-payer ~/.config/solana/id.json
spl-token thaw $ACCOUNT
# The same transfer now goes through
spl-token transfer $MINT 10 $(solana address) \
  --owner holder.json --fee-payer ~/.config/solana/id.json
# #endregion freeze
