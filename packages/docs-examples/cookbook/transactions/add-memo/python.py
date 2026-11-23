# #region memo
from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed
from solders.instruction import Instruction
from solders.keypair import Keypair
from solders.message import Message
from solders.pubkey import Pubkey
from solders.transaction import Transaction

MEMO_PROGRAM_ID = Pubkey.from_string("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")

client = Client("http://localhost:8899", commitment=Confirmed)

sender = Keypair()
airdrop = client.request_airdrop(sender.pubkey(), 1_000_000_000)
client.confirm_transaction(airdrop.value)

memo_instruction = Instruction(MEMO_PROGRAM_ID, b"Hello, world!", [])

blockhash = client.get_latest_blockhash().value.blockhash
transaction = Transaction([sender], Message([memo_instruction], sender.pubkey()), blockhash)

signature = client.send_transaction(transaction).value
print("Transaction Signature:", signature)
# #endregion memo
