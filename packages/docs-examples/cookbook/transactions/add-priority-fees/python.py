# #region priority
from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed
from solders.compute_budget import set_compute_unit_limit, set_compute_unit_price
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

instructions = [
    set_compute_unit_limit(200_000),  # max compute units the transaction may use
    set_compute_unit_price(5_000),  # priority fee in micro-lamports per compute unit
    Instruction(MEMO_PROGRAM_ID, b"Hello, world!", []),
]

blockhash = client.get_latest_blockhash().value.blockhash
transaction = Transaction([sender], Message(instructions, sender.pubkey()), blockhash)

signature = client.send_transaction(transaction).value
print("Transaction Signature:", signature)
# #endregion priority
