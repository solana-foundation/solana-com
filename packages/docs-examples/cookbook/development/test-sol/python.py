# #region airdrop
from solana.rpc.api import Client
from solders.keypair import Keypair

LAMPORTS_PER_SOL = 1_000_000_000

client = Client("http://localhost:8899")

wallet = Keypair()
signature = client.request_airdrop(wallet.pubkey(), LAMPORTS_PER_SOL).value  # 1 SOL
print("Airdrop Signature:", signature)
# #endregion airdrop
