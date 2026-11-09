#!/usr/bin/env bash
# The spl-token commands on the custodian, vault, and operate-the-token pages.
# They use $RPC_URL when it is set (a local Surfpool) and devnet otherwise.
# gated-token.test.ts runs each region against a local Surfnet and records what
# it printed.

# #region address
spl-token address --token $MINT --owner $CUSTODIAN --verbose \
  --url ${RPC_URL:-devnet}
# #endregion address

# #region display
spl-token display $CUSTODY_ATA --url ${RPC_URL:-devnet}
# #endregion display

# #region display-again
spl-token display $CUSTODY_ATA --url ${RPC_URL:-devnet}
# #endregion display-again

# #region finalized-config
cat > ~/.config/solana/finalized.yml <<YAML
json_rpc_url: ${RPC_URL:-https://api.devnet.solana.com}
websocket_url: ""
keypair_path: ~/.config/solana/demo-custodian.json
commitment: finalized
YAML
# #endregion finalized-config

# #region display-finalized
spl-token display $CUSTODY_ATA -C ~/.config/solana/finalized.yml
# #endregion display-finalized

# #region address-outsider
spl-token address --token $MINT --owner $OUTSIDER --verbose \
  --url ${RPC_URL:-devnet}
# #endregion address-outsider

# #region display-outsider
spl-token display $OUTSIDER_ATA --url ${RPC_URL:-devnet}
# #endregion display-outsider

# #region address-vault
spl-token address --token $MINT --owner $VAULT --verbose \
  --url ${RPC_URL:-devnet}
# #endregion address-vault

# #region display-vault
spl-token display $VAULT_ATA --url ${RPC_URL:-devnet}
# #endregion display-vault

# #region solana-account
solana account $CUSTODY_ATA --url ${RPC_URL:-devnet} \
  --commitment finalized --output json
# #endregion solana-account

# #region position-listing
spl-token accounts --owner $CUSTODIAN --url ${RPC_URL:-devnet}
# #endregion position-listing
