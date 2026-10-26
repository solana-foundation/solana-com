# #region load
from pathlib import Path

from solders.keypair import Keypair

keypair_path = Path.home() / ".config" / "solana" / "id.json"
keypair = Keypair.from_json(keypair_path.read_text())

print(keypair.pubkey())
# #endregion load
