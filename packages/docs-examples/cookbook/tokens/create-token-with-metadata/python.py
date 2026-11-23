# #region create
import struct

from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed
from solders.instruction import AccountMeta, Instruction
from solders.keypair import Keypair
from solders.message import Message
from solders.pubkey import Pubkey
from solders.system_program import ID as SYSTEM_PROGRAM_ID
from solders.sysvar import INSTRUCTIONS
from solders.transaction import Transaction
from spl.token.constants import TOKEN_PROGRAM_ID

METADATA_PROGRAM_ID = Pubkey.from_string("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")

client = Client("http://localhost:8899", commitment=Confirmed)

payer = Keypair()
mint = Keypair()

airdrop = client.request_airdrop(payer.pubkey(), 1_000_000_000)
client.confirm_transaction(airdrop.value)

metadata, _ = Pubkey.find_program_address(
    [b"metadata", bytes(METADATA_PROGRAM_ID), bytes(mint.pubkey())],
    METADATA_PROGRAM_ID,
)

# CreateV1 creates the mint and its metadata account in one instruction.
data = bytes([42, 0])  # CreateV1
for value in ["My Token", "MTK", "https://example.com/token-metadata.json"]:
    data += struct.pack("<I", len(value)) + value.encode()  # name, symbol, uri
data += struct.pack("<H", 0)  # seller fee basis points (0% royalty)
# creators: none, primary sale happened: false, is mutable: true,
# token standard: Fungible, collection, uses, collection details, rule set: none,
# decimals: 9, print supply: none
data += bytes([0, 0, 1, 2, 0, 0, 0, 0, 1, 9, 0])

create_instruction = Instruction(
    METADATA_PROGRAM_ID,
    data,
    [
        AccountMeta(metadata, is_signer=False, is_writable=True),
        AccountMeta(METADATA_PROGRAM_ID, is_signer=False, is_writable=False),  # no master edition
        AccountMeta(mint.pubkey(), is_signer=True, is_writable=True),
        AccountMeta(payer.pubkey(), is_signer=True, is_writable=False),  # mint authority
        AccountMeta(payer.pubkey(), is_signer=True, is_writable=True),  # payer
        AccountMeta(payer.pubkey(), is_signer=True, is_writable=False),  # update authority
        AccountMeta(SYSTEM_PROGRAM_ID, is_signer=False, is_writable=False),
        AccountMeta(INSTRUCTIONS, is_signer=False, is_writable=False),
        AccountMeta(TOKEN_PROGRAM_ID, is_signer=False, is_writable=False),
    ],
)

blockhash = client.get_latest_blockhash().value.blockhash
transaction = Transaction(
    [payer, mint], Message([create_instruction], payer.pubkey()), blockhash
)

signature = client.send_transaction(transaction).value
print("Transaction Signature:", signature)
print("Mint Address:", mint.pubkey())
# #endregion create
