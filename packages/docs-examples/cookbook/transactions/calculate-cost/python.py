# #region cost
from solana.rpc.api import Client
from solders.instruction import Instruction
from solders.keypair import Keypair
from solders.message import Message
from solders.pubkey import Pubkey

MEMO_PROGRAM_ID = Pubkey.from_string("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")

client = Client("http://localhost:8899")
payer = Keypair()

memo_instruction = Instruction(MEMO_PROGRAM_ID, b"Hello, world!", [])
blockhash = client.get_latest_blockhash().value.blockhash
message = Message.new_with_blockhash([memo_instruction], payer.pubkey(), blockhash)

fee = client.get_fee_for_message(message).value
print(f"Transaction is estimated to cost {fee} lamports")
# #endregion cost
