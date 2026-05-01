# #region sign
import asyncio
from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair
from solders.system_program import transfer, TransferParams
from solders.transaction import VersionedTransaction
from solders.message import MessageV0
import nacl.signing
import nacl.exceptions
import base58


async def main():
    # Create connection
    connection = AsyncClient("http://localhost:8899")

    # Create an example tx, alice transfer to bob and feePayer is `fee_payer`
    # alice and fee_payer are signers in this tx
    fee_payer = Keypair()

    # Airdrop to fee_payer
    airdrop_resp = await connection.request_airdrop(fee_payer.pubkey(), 1_000_000_000)
    await connection.confirm_transaction(airdrop_resp.value)

    alice = Keypair()
    # Airdrop to alice
    airdrop_resp = await connection.request_airdrop(alice.pubkey(), 1_000_000_000)
    await connection.confirm_transaction(airdrop_resp.value)

    bob = Keypair()

    # 1. Create Transaction
    transfer_instruction = transfer(
        TransferParams(
            from_pubkey=alice.pubkey(),
            to_pubkey=bob.pubkey(),
            lamports=int(0.1 * 1_000_000_000)  # 0.1 SOL
        )
    )

    # Get recent blockhash
    recent_blockhash_resp = await connection.get_latest_blockhash()
    recent_blockhash = recent_blockhash_resp.value.blockhash

    # Create transaction message
    message = MessageV0.try_compile(
        payer=fee_payer.pubkey(),
        instructions=[transfer_instruction],
        address_lookup_table_accounts=[],
        recent_blockhash=recent_blockhash
    )

    # Serialize the message that needs to be signed
    message_bytes = bytes(message)
    print(f"Message to sign (length: {len(message_bytes)} bytes)")

    # 2. Sign Transaction
    # Use nacl to sign the message
    fee_payer_signing_key = nacl.signing.SigningKey(bytes(fee_payer)[0:32])
    fee_payer_signature = fee_payer_signing_key.sign(message_bytes).signature

    alice_signing_key = nacl.signing.SigningKey(bytes(alice)[0:32])
    alice_signature = alice_signing_key.sign(message_bytes).signature

    print(f"Fee payer signature: {base58.b58encode(fee_payer_signature).decode()}")
    print(f"Alice signature: {base58.b58encode(alice_signature).decode()}")

    # 3. Recover Transaction

    # You can verify signatures before recovering the transaction
    fee_payer_verify_key = nacl.signing.VerifyKey(bytes(fee_payer.pubkey()))
    try:
        fee_payer_verify_key.verify(message_bytes, fee_payer_signature)
        print("OK Fee payer signature verified")
    except nacl.exceptions.BadSignatureError:
        print("FAIL Fee payer signature verification failed")

    alice_verify_key = nacl.signing.VerifyKey(bytes(alice.pubkey()))
    try:
        alice_verify_key.verify(message_bytes, alice_signature)
        print("OK Alice signature verified")
    except nacl.exceptions.BadSignatureError:
        print("FAIL Alice signature verification failed")

    # 3. Recover Transaction
    print("\n=== Recover and Send Transaction ===")
    recover_tx = VersionedTransaction(message, [fee_payer, alice])

    # 4. Send transaction
    try:
        txhash = await connection.send_raw_transaction(bytes(recover_tx))
        print(f"Transaction hash: {txhash}")

        # Confirm transaction
        await connection.confirm_transaction(txhash.value)
        print("OK Transaction confirmed")
    except Exception as e:
        print(f"Transaction failed: {e}")

    # Serialize for transmission
    serialized_tx = bytes(recover_tx)
    print(f"Serialized transaction: {base58.b58encode(serialized_tx).decode()[:100]}...")

    print("\n=== Note ===")
    print("If this process takes too long, your recent blockhash will expire (after 150 blocks).")
    print("You can use 'durable nonce' to avoid blockhash expiration.")

    await connection.close()


if __name__ == "__main__":
    asyncio.run(main())
# #endregion sign
