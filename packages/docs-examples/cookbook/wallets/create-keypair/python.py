# #region create
from solders.keypair import Keypair

keypair = Keypair()
address = keypair.pubkey()

print(f"address: {address}")
# #endregion create
