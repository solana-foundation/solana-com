# #region sponsor
from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed
from solders.keypair import Keypair
from solders.message import Message
from solders.transaction import Transaction
from spl.token.client import Token
from spl.token.constants import TOKEN_PROGRAM_ID
from spl.token.instructions import TransferCheckedParams, transfer_checked

client = Client("http://localhost:8899", commitment=Confirmed)

fee_payer = Keypair()  # pays every fee
sender = Keypair()  # holds tokens but no SOL
recipient = Keypair()

airdrop = client.request_airdrop(fee_payer.pubkey(), 1_000_000_000)
client.confirm_transaction(airdrop.value)

# Setup: a mint with 2 decimals, and 1.00 token in the sender's account.
token = Token.create_mint(client, fee_payer, fee_payer.pubkey(), 2, TOKEN_PROGRAM_ID)
sender_ata = token.create_associated_token_account(sender.pubkey())
recipient_ata = token.create_associated_token_account(recipient.pubkey())
minted = token.mint_to(sender_ata, fee_payer, 100)
client.confirm_transaction(minted.value)

# Sender transfers 0.50 token; fee_payer is the transaction's fee payer.
transfer_ix = transfer_checked(
    TransferCheckedParams(
        program_id=TOKEN_PROGRAM_ID,
        source=sender_ata,
        mint=token.pubkey,
        dest=recipient_ata,
        owner=sender.pubkey(),
        amount=50,
        decimals=2,
    )
)
blockhash = client.get_latest_blockhash().value.blockhash
transaction = Transaction(
    [fee_payer, sender], Message([transfer_ix], fee_payer.pubkey()), blockhash
)

signature = client.send_transaction(transaction).value
print("Transaction Signature:", signature)
# #endregion sponsor
