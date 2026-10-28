# #region create
import struct
import time

from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed
from solders.address_lookup_table_account import (
    ID as LOOKUP_TABLE_PROGRAM_ID,
    AddressLookupTable,
    AddressLookupTableAccount,
    derive_lookup_table_address,
)
from solders.instruction import AccountMeta, Instruction
from solders.keypair import Keypair
from solders.message import Message, MessageV0
from solders.system_program import ID as SYSTEM_PROGRAM_ID, TransferParams, transfer
from solders.transaction import Transaction, VersionedTransaction

client = Client("http://localhost:8899", commitment=Confirmed)

payer = Keypair()
client.confirm_transaction(client.request_airdrop(payer.pubkey(), 1_000_000_000).value)


def send(instructions):
    blockhash = client.get_latest_blockhash().value.blockhash
    tx = Transaction([payer], Message(instructions, payer.pubkey()), blockhash)
    signature = client.send_transaction(tx).value
    client.confirm_transaction(signature)
    return signature


def table_accounts(table):
    return [
        AccountMeta(table, is_signer=False, is_writable=True),
        AccountMeta(payer.pubkey(), is_signer=True, is_writable=False),  # authority
        AccountMeta(payer.pubkey(), is_signer=True, is_writable=True),  # payer
        AccountMeta(SYSTEM_PROGRAM_ID, is_signer=False, is_writable=False),
    ]


slot = client.get_slot().value
lookup_table_address, bump = derive_lookup_table_address(payer.pubkey(), slot)

# CreateLookupTable: instruction index 0, recent slot, bump seed
create_instruction = Instruction(
    LOOKUP_TABLE_PROGRAM_ID,
    struct.pack("<IQB", 0, slot, bump),
    table_accounts(lookup_table_address),
)
send([create_instruction])
print("lookup table address:", lookup_table_address)
# #endregion create

# #region extend
recipient = Keypair().pubkey()
addresses = [recipient, SYSTEM_PROGRAM_ID]

# ExtendLookupTable: instruction index 2, number of addresses, addresses
extend_instruction = Instruction(
    LOOKUP_TABLE_PROGRAM_ID,
    struct.pack("<IQ", 2, len(addresses)) + b"".join(bytes(a) for a in addresses),
    table_accounts(lookup_table_address),
)
send([extend_instruction])
# #endregion extend

# #region fetch
account = client.get_account_info(lookup_table_address).value
lookup_table = AddressLookupTable.deserialize(account.data)
print("Table address from cluster:", lookup_table_address)
# #endregion fetch

# #region list
for i, address in enumerate(lookup_table.addresses):
    print(i, address)
# #endregion list

# #region use
# New addresses become usable one slot after they are added.
time.sleep(2)

lookup_table_account = AddressLookupTableAccount(
    lookup_table_address, list(lookup_table.addresses)
)
instructions = [
    transfer(
        TransferParams(
            from_pubkey=payer.pubkey(), to_pubkey=recipient, lamports=1_000_000
        )
    )
]

blockhash = client.get_latest_blockhash().value.blockhash
message = MessageV0.try_compile(
    payer.pubkey(), instructions, [lookup_table_account], blockhash
)
transaction = VersionedTransaction(message, [payer])

signature = client.send_transaction(transaction).value
print("Transaction:", signature)
# #endregion use
