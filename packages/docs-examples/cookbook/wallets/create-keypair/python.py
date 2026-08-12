# #region create
from solders.keypair import Keypair

keypair = Keypair()
print(f"address: {keypair.pubkey()}")
print(f"secret: {keypair.secret()}")
# #endregion create
