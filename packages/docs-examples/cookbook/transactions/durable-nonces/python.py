# #region authority
import base64

from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed
from solders.hash import Hash
from solders.keypair import Keypair
from solders.message import Message
from solders.system_program import (
    AdvanceNonceAccountParams,
    TransferParams,
    advance_nonce_account,
    create_nonce_account,
    transfer,
)
from solders.transaction import Transaction

client = Client("http://localhost:8899", commitment=Confirmed)

nonce_authority = Keypair()
client.confirm_transaction(
    client.request_airdrop(nonce_authority.pubkey(), 1_000_000_000).value
)
# #endregion authority

# #region create
nonce_keypair = Keypair()

# create the nonce account (80 bytes) and initialize it with its authority
instructions = create_nonce_account(
    nonce_authority.pubkey(),  # pays for the account
    nonce_keypair.pubkey(),
    nonce_authority.pubkey(),  # authority of the nonce
    client.get_minimum_balance_for_rent_exemption(80).value,
)

blockhash = client.get_latest_blockhash().value.blockhash
tx = Transaction(
    [nonce_authority, nonce_keypair],
    Message(list(instructions), nonce_authority.pubkey()),
    blockhash,
)
signature = client.send_transaction(tx).value
client.confirm_transaction(signature)
print("Nonce initiated:", signature)
# #endregion create

# #region fetch
nonce_info = client.get_account_info_json_parsed(nonce_keypair.pubkey()).value
nonce = Hash.from_string(nonce_info.data.parsed["info"]["blockhash"])
# #endregion fetch

# #region use
payer = nonce_authority

# advancing the nonce must be the first instruction
advance_instruction = advance_nonce_account(
    AdvanceNonceAccountParams(
        nonce_pubkey=nonce_keypair.pubkey(),
        authorized_pubkey=nonce_authority.pubkey(),
    )
)
transfer_instruction = transfer(
    TransferParams(from_pubkey=payer.pubkey(), to_pubkey=payer.pubkey(), lamports=100)
)

# use the stored nonce as the recent blockhash
durable_tx = Transaction(
    [payer],
    Message([advance_instruction, transfer_instruction], payer.pubkey()),
    nonce,
)

# the signed transaction doesn't expire: store it and submit it later
serialized_tx = base64.b64encode(bytes(durable_tx)).decode()
print("Signed Durable Transaction:", serialized_tx)
# #endregion use
