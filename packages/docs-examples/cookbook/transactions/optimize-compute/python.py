# #region optimize
from solana.rpc.api import Client
from solana.rpc.commitment import Confirmed
from solders.compute_budget import set_compute_unit_limit
from solders.keypair import Keypair
from solders.message import Message
from solders.system_program import TransferParams, transfer
from solders.transaction import Transaction

client = Client("http://localhost:8899", commitment=Confirmed)

sender = Keypair()
recipient = Keypair()
airdrop = client.request_airdrop(sender.pubkey(), 1_000_000_000)
client.confirm_transaction(airdrop.value)

transfer_instruction = transfer(
    TransferParams(
        from_pubkey=sender.pubkey(), to_pubkey=recipient.pubkey(), lamports=500_000_000
    )
)
blockhash = client.get_latest_blockhash().value.blockhash

# Simulate with the maximum limit to measure the compute units actually used.
simulation = client.simulate_transaction(
    Transaction(
        [sender],
        Message([set_compute_unit_limit(1_400_000), transfer_instruction], sender.pubkey()),
        blockhash,
    )
)
units = int(simulation.value.units_consumed * 1.1)  # add a 10% margin
print("Compute unit limit:", units)

# Request only that many compute units.
transaction = Transaction(
    [sender],
    Message([set_compute_unit_limit(units), transfer_instruction], sender.pubkey()),
    blockhash,
)
signature = client.send_transaction(transaction).value
print("Transaction Signature:", signature)
# #endregion optimize
