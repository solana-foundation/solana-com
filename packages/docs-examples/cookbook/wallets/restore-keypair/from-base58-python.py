# #region from-base58
from solders.keypair import Keypair

def main():
    keypair_base58 = "5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG"

    signer = Keypair.from_base58_string(keypair_base58)
    print(signer.pubkey())

if __name__ == "__main__":
    main()
# #endregion from-base58
