# #region create
import asyncio
import struct

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solders.address_lookup_table_account import (
    ID as LOOKUP_TABLE_PROGRAM_ID,
    AddressLookupTable,
    AddressLookupTableAccount,
    derive_lookup_table_address,
)
from solders.instruction import AccountMeta, Instruction
from solders.keypair import Keypair
from solders.message import MessageV0
from solders.system_program import ID as SYSTEM_PROGRAM_ID, TransferParams, transfer
from solders.transaction import VersionedTransaction


async def main():
    async with AsyncClient("http://localhost:8899", commitment=Confirmed) as client:
        payer = Keypair()
        airdrop = await client.request_airdrop(payer.pubkey(), 1_000_000_000)
        await client.confirm_transaction(airdrop.value)

        async def send(instructions):
            blockhash = (await client.get_latest_blockhash()).value.blockhash
            message = MessageV0.try_compile(payer.pubkey(), instructions, [], blockhash)
            tx = VersionedTransaction(message, [payer])
            signature = (await client.send_transaction(tx)).value
            await client.confirm_transaction(signature)
            return signature

        def table_accounts(table):
            return [
                AccountMeta(table, is_signer=False, is_writable=True),
                AccountMeta(payer.pubkey(), is_signer=True, is_writable=False),  # authority
                AccountMeta(payer.pubkey(), is_signer=True, is_writable=True),  # payer
                AccountMeta(SYSTEM_PROGRAM_ID, is_signer=False, is_writable=False),
            ]

        slot = (await client.get_slot()).value
        lookup_table_address, bump = derive_lookup_table_address(payer.pubkey(), slot)

        # CreateLookupTable: instruction index 0, recent slot, bump seed
        create_instruction = Instruction(
            LOOKUP_TABLE_PROGRAM_ID,
            struct.pack("<IQB", 0, slot, bump),
            table_accounts(lookup_table_address),
        )
        await send([create_instruction])
        print("lookup table address:", lookup_table_address)

        # The next steps run here, inside main()
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
        await send([extend_instruction])
        # #endregion extend

        # #region fetch
        account = (await client.get_account_info(lookup_table_address)).value
        lookup_table = AddressLookupTable.deserialize(account.data)
        print("Table address from cluster:", lookup_table_address)
        # #endregion fetch

        # #region list
        for i, address in enumerate(lookup_table.addresses):
            print(i, address)
        # #endregion list

        # #region use
        # New addresses become usable one slot after they are added.
        await asyncio.sleep(2)

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

        blockhash = (await client.get_latest_blockhash()).value.blockhash
        message = MessageV0.try_compile(
            payer.pubkey(), instructions, [lookup_table_account], blockhash
        )
        transaction = VersionedTransaction(message, [payer])

        signature = (await client.send_transaction(transaction)).value
        print("Transaction:", signature)
        # #endregion use


# #region create
asyncio.run(main())
# #endregion create
