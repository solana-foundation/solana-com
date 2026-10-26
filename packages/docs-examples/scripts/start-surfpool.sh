# Sourced by the run-*-examples.sh scripts. Makes sure a validator is
# answering on $RPC_URL: reuses one that is already running, otherwise spawns
# surfpool in the background and stops it on exit. A reused validator must be
# a mainnet-backed surfpool (`surfpool start --network mainnet`), because
# several examples read real mainnet accounts that a plain
# `solana-test-validator` does not have.

RPC_URL="http://localhost:8899"

rpc_healthy() {
  curl -sf -o /dev/null -X POST "$RPC_URL" \
    -H "content-type: application/json" \
    -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
}

if rpc_healthy; then
  echo "reusing validator already running at $RPC_URL"
else
  SURFPOOL_LOG="$(mktemp -t surfpool.log.XXXXXX)"
  surfpool start --no-tui --no-studio --no-deploy --network mainnet --log-level warn -y \
    >"$SURFPOOL_LOG" 2>&1 &
  SURFPOOL_PID=$!
  trap 'kill "$SURFPOOL_PID" 2>/dev/null || true' EXIT

  echo "waiting for surfpool RPC at $RPC_URL ..."
  for _ in $(seq 1 180); do
    rpc_healthy && break
    sleep 0.5
  done
  if ! rpc_healthy; then
    echo "surfpool failed to come up; log follows:"
    cat "$SURFPOOL_LOG"
    exit 1
  fi
  echo "ready"
fi
