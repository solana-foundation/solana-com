# #region create
from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed
from solders.keypair import Keypair
from solders.message import Message
from solders.system_program import ID as SYSTEM_PROGRAM_ID
from solders.system_program import CreateAccountParams, create_account
from solders.transaction import Transaction

LAMPORTS_PER_SOL = 1_000_000_000

client = Client("http://localhost:8899", commitment=Confirmed)

sender = Keypair()
airdrop = client.request_airdrop(sender.pubkey(), LAMPORTS_PER_SOL)
client.confirm_transaction(airdrop.value)

new_account = Keypair()
space = 0
rent_lamports = client.get_minimum_balance_for_rent_exemption(space).value

create_account_instruction = create_account(
    CreateAccountParams(
        from_pubkey=sender.pubkey(),
        to_pubkey=new_account.pubkey(),
        lamports=rent_lamports,
        space=space,
        owner=SYSTEM_PROGRAM_ID,
    )
)

blockhash = client.get_latest_blockhash().value.blockhash
transaction = Transaction(
    [sender, new_account],
    Message([create_account_instruction], sender.pubkey()),
    blockhash,
)

signature = client.send_transaction(transaction).value
print("Transaction Signature for create account:", signature)
# #endregion create
