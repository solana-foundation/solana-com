# #region check
from solders.pubkey import Pubkey

def main():
    # on curve address
    key = Pubkey.from_string("5oNDL3swdJJF1g9DzJiZ4ynHXgszjAEpUkxVYejchzrY")
    print(key.is_on_curve())

    off_curve_address = Pubkey.from_string("4BJXYkfvg37zEmBbsacZjeQDpTNx91KppxFJxRqrz48e")
    print(off_curve_address.is_on_curve())

if __name__ == "__main__":
    main()
# #endregion check
