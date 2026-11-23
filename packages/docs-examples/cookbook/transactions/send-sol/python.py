# #region transfer
from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed
from solders.keypair import Keypair
from solders.message import Message
from solders.system_program import TransferParams, transfer
from solders.transaction import Transaction

LAMPORTS_PER_SOL = 1_000_000_000

client = Client("http://localhost:8899", commitment=Confirmed)

sender = Keypair()
recipient = Keypair()

airdrop = client.request_airdrop(sender.pubkey(), LAMPORTS_PER_SOL)
client.confirm_transaction(airdrop.value)

transfer_instruction = transfer(
    TransferParams(
        from_pubkey=sender.pubkey(),
        to_pubkey=recipient.pubkey(),
        lamports=LAMPORTS_PER_SOL // 100,  # 0.01 SOL
    )
)

blockhash = client.get_latest_blockhash().value.blockhash
transaction = Transaction(
    [sender], Message([transfer_instruction], sender.pubkey()), blockhash
)

signature = client.send_transaction(transaction).value
print("Transaction Signature:", signature)
# #endregion transfer
