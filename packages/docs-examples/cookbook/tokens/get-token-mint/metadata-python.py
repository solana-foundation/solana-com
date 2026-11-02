# #region metadata
import struct

from solana.rpc.api import Client
from solders.pubkey import Pubkey

METADATA_PROGRAM_ID = Pubkey.from_string("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")

client = Client("http://localhost:8899")

# Example: USDC mint address
mint = Pubkey.from_string("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")

# The metadata account is a PDA derived from the mint address
metadata_address, _ = Pubkey.find_program_address(
    [b"metadata", bytes(METADATA_PROGRAM_ID), bytes(mint)], METADATA_PROGRAM_ID
)
data = client.get_account_info(metadata_address).value.data

# Layout: key (1 byte), update authority (32), mint (32), then name, symbol, uri
update_authority = Pubkey.from_bytes(data[1:33])
fields, offset = [], 65
for _ in range(3):
    (length,) = struct.unpack_from("<I", data, offset)
    fields.append(data[offset + 4 : offset + 4 + length].decode().rstrip("\x00"))
    offset += 4 + length
name, symbol, uri = fields

print("Token Name:", name)
print("Token Symbol:", symbol)
print("Metadata URI:", uri)
print("Update Authority:", update_authority)
# #endregion metadata
