# #region pay-fees
from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed
from solders.keypair import Keypair
from solders.message import Message
from solders.transaction import Transaction
from spl.token.client import Token
from spl.token.constants import TOKEN_PROGRAM_ID
from spl.token.instructions import TransferCheckedParams, transfer_checked

client = Client("http://localhost:8899", commitment=Confirmed)

fee_payer = Keypair()  # pays the SOL fee, gets paid back in tokens
sender = Keypair()  # holds tokens but no SOL
recipient = Keypair()

airdrop = client.request_airdrop(fee_payer.pubkey(), 1_000_000_000)
client.confirm_transaction(airdrop.value)

# Setup: a mint with 2 decimals, and 1.00 token in the sender's account.
token = Token.create_mint(client, fee_payer, fee_payer.pubkey(), 2, TOKEN_PROGRAM_ID)
sender_ata = token.create_associated_token_account(sender.pubkey())
recipient_ata = token.create_associated_token_account(recipient.pubkey())
fee_payer_ata = token.create_associated_token_account(fee_payer.pubkey())
minted = token.mint_to(sender_ata, fee_payer, 100)
client.confirm_transaction(minted.value)

# One transaction: 0.50 token to the recipient, and 0.50 token to the fee payer
# to cover the SOL fee it pays.
instructions = [
    transfer_checked(
        TransferCheckedParams(
            program_id=TOKEN_PROGRAM_ID,
            source=sender_ata,
            mint=token.pubkey,
            dest=dest,
            owner=sender.pubkey(),
            amount=50,
            decimals=2,
        )
    )
    for dest in (recipient_ata, fee_payer_ata)
]
blockhash = client.get_latest_blockhash().value.blockhash
transaction = Transaction(
    [fee_payer, sender], Message(instructions, fee_payer.pubkey()), blockhash
)

signature = client.send_transaction(transaction).value
print("Transaction Signature:", signature)
# #endregion pay-fees
