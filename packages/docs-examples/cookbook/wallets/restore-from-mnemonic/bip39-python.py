# #region bip39
from solders.keypair import Keypair

mnemonic = "pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter"

keypair = Keypair.from_seed_phrase_and_passphrase(mnemonic, "")
print(keypair.pubkey())
# #endregion bip39
