# #region sign
from solders.keypair import Keypair
import nacl.signing

def main():
    # Create a keypair
    keypair = Keypair()
    message = b"Hello, Solana!"

    # Sign the message
    signature = keypair.sign_message(message)

    print(f"Message: {message}")
    print(f"Signature: {signature}")
    print(f"Public Key: {keypair.pubkey()}")

    # Verify the signature
    try:
        # Use nacl to verify the signature
        verify_key = nacl.signing.VerifyKey(keypair.pubkey().__bytes__())
        verify_key.verify(message, signature.__bytes__())
        print("Signature is valid: True")
    except Exception as e:
        print(f"Signature is valid: False - {e}")

if __name__ == "__main__":
    main()
# #endregion sign
