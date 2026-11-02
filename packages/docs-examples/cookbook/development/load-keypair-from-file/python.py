from pathlib import Path

from solders.keypair import Keypair

# Seeds `~/.config/solana/id.json` if it doesn't already exist so this example
# runs end-to-end without a prior `solana-keygen new`. Outside the docs region
# because real users will have generated this file themselves.
_default_path = Path.home() / ".config" / "solana" / "id.json"
if not _default_path.exists():
    _default_path.parent.mkdir(parents=True, exist_ok=True)
    _default_path.touch(mode=0o600)
    _default_path.write_text(Keypair().to_json())

# #region load
from pathlib import Path

from solders.keypair import Keypair

keypair_path = Path.home() / ".config" / "solana" / "id.json"
keypair = Keypair.from_json(keypair_path.read_text())

print(keypair.pubkey())
# #endregion load
