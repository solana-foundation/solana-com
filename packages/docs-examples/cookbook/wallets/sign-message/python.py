# #region sign
from solders.keypair import Keypair

keys = Keypair()
message = "Hello, World!".encode("utf-8")
signed_bytes = keys.sign_message(message)

print("Signature:", signed_bytes)

verified = signed_bytes.verify(keys.pubkey(), message)
print("Verified:", verified)
# #endregion sign
