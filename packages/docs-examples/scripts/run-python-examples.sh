#!/usr/bin/env bash
# Spawns surfpool, makes sure ~/.config/solana/id.json exists, and runs every
# Python example in the cookbook tree once against the local validator.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RPC_URL="http://localhost:8899"
KEYPAIR_PATH="$HOME/.config/solana/id.json"
PYTHON="${PYTHON:-python3}"

# 1. Make sure the fixture keypair exists.
if [ ! -f "$KEYPAIR_PATH" ]; then
  mkdir -p "$(dirname "$KEYPAIR_PATH")"
  solana-keygen new --no-bip39-passphrase --silent --outfile "$KEYPAIR_PATH"
fi

# 2. Spawn surfpool in the background.
SURFPOOL_LOG="$(mktemp -t surfpool.log.XXXXXX)"
surfpool start --no-tui --no-studio --no-deploy --network mainnet --log-level warn -y \
  >"$SURFPOOL_LOG" 2>&1 &
SURFPOOL_PID=$!
trap 'kill "$SURFPOOL_PID" 2>/dev/null || true' EXIT

# 3. Wait for the RPC to come up.
echo "waiting for surfpool RPC at $RPC_URL ..."
for _ in $(seq 1 180); do
  if curl -sf -o /dev/null -X POST "$RPC_URL" \
    -H "content-type: application/json" \
    -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'; then
    echo "ready"
    break
  fi
  sleep 0.5
done
if ! curl -sf -o /dev/null -X POST "$RPC_URL" \
  -H "content-type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'; then
  echo "surfpool failed to come up; log follows:"
  cat "$SURFPOOL_LOG"
  exit 1
fi

# 4. Run every main.py in the cookbook tree.
fail=0
while IFS= read -r script; do
  rel="${script#"$ROOT/"}"
  echo "::group::$rel"
  if ! "$PYTHON" "$script"; then
    echo "::error::$rel exited non-zero"
    fail=1
  fi
  echo "::endgroup::"
done < <(find "$ROOT/cookbook" -name 'main.py' -path '*/python/*' | sort)

exit "$fail"
