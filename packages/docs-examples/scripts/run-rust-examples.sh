#!/usr/bin/env bash
# Spawns surfpool, makes sure ~/.config/solana/id.json exists, and runs every
# Rust binary in the workspace once against the local validator.
#
# Used by CI (.github/workflows/docs-examples.yml) and reproducible locally.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RPC_URL="http://localhost:8899"
KEYPAIR_PATH="$HOME/.config/solana/id.json"

# 1. Make sure the fixture keypair exists (load-keypair-from-file reads it).
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

# 4. Build everything once. Faster than letting `cargo run` rebuild each time.
( cd "$ROOT" && cargo build --workspace --release )

# 5. Run every binary in the workspace, one after another.
fail=0
while IFS=" " read -r pkg bin; do
  [ -z "$bin" ] && continue
  echo "::group::$bin"
  if ! ( cd "$ROOT" && cargo run --release --quiet -p "$pkg" --bin "$bin" ); then
    echo "::error::$bin exited non-zero"
    fail=1
  fi
  echo "::endgroup::"
done < <(cd "$ROOT" && cargo metadata --no-deps --format-version=1 \
          | node -e "const m = JSON.parse(require('fs').readFileSync(0,'utf8')); for (const p of m.packages) for (const t of p.targets) if (t.kind.includes('bin')) console.log(p.name + ' ' + t.name);")

exit "$fail"
