# #region bip44
from mnemonic import Mnemonic
from solders.keypair import Keypair

mnemonic = "neither lonely flavor argue grass remind eye tag avocado spot unusual intact"
seed = Mnemonic.to_seed(mnemonic)

for i in range(10):
    path = f"m/44'/501'/{i}'/0'"
    keypair = Keypair.from_seed_and_derivation_path(seed, path)
    print(f"{path} => {keypair.pubkey()}")
# #endregion bip44
