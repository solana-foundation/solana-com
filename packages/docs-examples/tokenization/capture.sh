#!/usr/bin/env bash
# Runs the tokenization tutorial chain end to end and records the outputs the
# tutorials embed. One run covers one implementation and creates its own mint:
#
#   IMPL=sdk    ./capture.sh   # Mosaic CLI + Mosaic SDK tabs (also the spl-token captures)
#   IMPL=kit    ./capture.sh   # Kit tabs (*-kit.ts)
#   IMPL=legacy ./capture.sh   # Legacy web3.js tabs (*-legacy.ts)
#   IMPL=rust   ./capture.sh   # Rust tabs (rust/src/bin/*.rs)
#
#   RPC=https://api.devnet.solana.com   (default) or a local validator, see README.
#
# Script outputs land next to the script as <name>.output.txt, or as
# <name>.<variant>.output.txt where one script serves steps with different
# outcomes (transfer: blocked, frozen, vault-blocked; read-account: thawed,
# frozen, finalized, offboarded). The docs discover the first form and name the
# second with output= on the fence.
#
# Requires: solana, spl-token, `npx tsx` from this package, cargo for IMPL=rust,
# and a `mosaic` command for IMPL=sdk (see README for the 0.2.0 workarounds).
# Keypairs are the tutorial's: ~/.config/solana/tokenization-demo.json (funded),
# demo-holder, demo-outsider, demo-custodian, demo-vault, and
# demo-authorities/{metadata,pause,delegate,burn}.
set -u
RPC=${RPC:-https://api.devnet.solana.com}
IMPL=${IMPL:-sdk}
HERE=$(cd "$(dirname "$0")" && pwd)
MOSAIC=${MOSAIC:-mosaic}
K=~/.config/solana
PAYER=$K/tokenization-demo.json
# SCRIPTS points at copies of the scripts for a local runner (see README); outputs still land here.
SCRIPTS=${SCRIPTS:-$HERE}
LOG=${LOG:-$HERE/capture-$IMPL.log}; : > "$LOG"
export NODE_NO_WARNINGS=1 FORCE_COLOR=0 NO_COLOR=1

say(){ echo; echo "### $*" | tee -a "$LOG"; }
run(){ echo "\$ $*" >> "$LOG"; "$@" 2>&1 | tee -a "$LOG"; echo "[exit ${PIPESTATUS[0]}]" | tee -a "$LOG"; }
# The Mosaic CLI makes many RPC calls per command; the public devnet endpoint answers bursts
# with HTTP 429. cli() retries once after a pause and paces the next command.
cli(){ local tmp rc; tmp=$(mktemp); echo "\$ $*" >> "$LOG"; "$@" > "$tmp" 2>&1; rc=$?
       if grep -q "429" "$tmp"; then echo "[429, retrying in 20s]" | tee -a "$LOG"; sleep 20; "$@" > "$tmp" 2>&1; rc=$?; fi
       cat "$tmp" | tee -a "$LOG"; echo "[exit $rc]" | tee -a "$LOG"; rm -f "$tmp"; sleep 3; }
scrub(){ sed -i.bak -e 's|/Users/[^/]*/[^ ]*node_modules|/usr/local/lib/node_modules|g' -e "s|$HERE|packages/docs-examples/tokenization|g" "$1" && rm -f "$1.bak"; }
cap(){ local out=$HERE/$1.output.txt; shift; echo "\$ $*  -> $out" >> "$LOG"; "$@" > "$out" 2>&1; local rc=$?
       if grep -q "429" "$out"; then echo "[429, retrying in 20s]" | tee -a "$LOG"; sleep 20; "$@" > "$out" 2>&1; rc=$?; fi
       scrub "$out"; cat "$out" | tee -a "$LOG"; echo "[exit $rc] captured $out" | tee -a "$LOG"; }
pub(){ solana-keygen pubkey "$1"; }
# Derived offline with the Kit derive-ata script, so a rate-limited RPC cannot return an empty address.
ata(){ (cd "$HERE/.." && MINT=$MINT npx tsx tokenization/custodian/derive-ata.ts "$1") | awk '/Associated token address/ {print $NF}'; }
sdkmode(){ [ "$IMPL" = sdk ]; }

# Resolves a step (issuing/mint, custodian/read-account) to the file for $IMPL.
# derive-ata and read-account are Kit scripts with no suffix; both sdk and kit use them.
script(){ local step=$1 f
  case $IMPL in
    sdk)    f=$step.ts ;;
    kit)    f=$step-kit.ts; [ -f "$HERE/$f" ] || f=$step.ts ;;
    legacy) f=$step-legacy.ts ;;
    rust)   f=rust/src/bin/$(basename "$step").rs ;;
  esac; echo "$f"; }
# ex <step> [args]: run the step and capture <script>.output.txt
# ex_as <variant> <step> [args]: capture <script>.<variant>.output.txt
# ex_quiet <step> [args]: run without capturing
_exec(){ local f=$1; shift
  case $f in
    *.rs) cargo run --quiet --release --manifest-path "$SCRIPTS/rust/Cargo.toml" --bin "$(basename "$f" .rs)" -- "$@" ;;
    *)    (cd "$HERE/.." && npx tsx "$SCRIPTS/$f" "$@") ;;
  esac; }
ex(){ local f; f=$(script "$1"); shift; cap "${f%.*}" _exec "$f" "$@"; }
ex_as(){ local v=$1 f; f=$(script "$2"); shift 2; cap "${f%.*}.$v" _exec "$f" "$@"; }
ex_quiet(){ local f; f=$(script "$1"); shift; run _exec "$f" "$@"; }
# The Kit read scripts have no suffix and are captured by the sdk run, so their
# outputs share the CLI captures' mint; the kit run only exercises them.
ex_read(){ if [ "$IMPL" = kit ]; then local v=$1; shift; ex_quiet "$@"; else ex_as "$@"; fi; }

export HOLDER=$(pub $K/demo-holder.json) OUTSIDER=$(pub $K/demo-outsider.json) CUSTODIAN=$(pub $K/demo-custodian.json) VAULT=$(pub $K/demo-vault.json)
META=$(pub $K/demo-authorities/metadata.json)
[ "$IMPL" = rust ] && { say "build the Rust examples once"; run cargo build --quiet --release --manifest-path "$SCRIPTS/rust/Cargo.toml"; }

say "create the mint ($IMPL; the 0.2.0 CLI create fails before sending)"
ex issuing/create-the-mint
CREATED=$HERE/$(script issuing/create-the-mint); CREATED=${CREATED%.*}.output.txt
export MINT=$(awk '/^Mint:/ {print $NF}' "$CREATED") LIST=$(awk '/^Allowlist:/ {print $NF}' "$CREATED") MINT_CONFIG=$(awk '/^Freeze authority/ {print $NF}' "$CREATED")
echo "MINT=$MINT LIST=$LIST MINT_CONFIG=$MINT_CONFIG" | tee -a "$LOG"; [ -z "$MINT" ] && exit 1

say "create-the-mint: confirm what you built"
sdkmode && cap issuing/inspect-mint-created $MOSAIC inspect-mint --mint-address $MINT --rpc-url $RPC
ex issuing/inspect-mint
say "gate-the-holders: confirm the gate"
sdkmode && cap issuing/inspect-mint-gated $MOSAIC inspect-mint --mint-address $MINT --rpc-url $RPC

say "gate-the-holders: add the holder, read the list"
if sdkmode; then cli $MOSAIC allowlist add --mint-address $MINT --account $HOLDER --keypair $PAYER --rpc-url $RPC
else ex issuing/allowlist-add $HOLDER; fi
sdkmode && cap issuing/abl-fetch-list $MOSAIC abl fetch-list --list $LIST --rpc-url $RPC
ex issuing/fetch-list
# The SDK tab of allowlist-add is exercised on the metadata authority only after
# the list has been read, so the recorded list matches the tutorial state.
sdkmode && ex issuing/allowlist-add $META

say "gate-the-holders: mint to the holder"
if sdkmode; then cli $MOSAIC mint --mint-address $MINT --recipient $HOLDER --amount 1000 --keypair $PAYER --rpc-url $RPC; ex issuing/mint $HOLDER 100
else ex issuing/mint $HOLDER 1000; fi

say "gate-the-holders: transfer to an unlisted wallet (expected failure)"
sdkmode && cap issuing/transfer-blocked $MOSAIC transfer --mint-address $MINT --recipient $OUTSIDER --amount 1 --keypair $K/demo-holder.json --rpc-url $RPC
ex_as blocked issuing/transfer $OUTSIDER 1

say "gate-the-holders: list the outsider, transfer again"
if sdkmode; then cli $MOSAIC allowlist add --mint-address $MINT --account $OUTSIDER --keypair $PAYER --rpc-url $RPC
  cli $MOSAIC transfer --mint-address $MINT --recipient $OUTSIDER --amount 1 --keypair $K/demo-holder.json --rpc-url $RPC
  ex issuing/allowlist-remove $META
else ex_quiet issuing/allowlist-add $OUTSIDER; fi
ex issuing/transfer $OUTSIDER 1

say "operate-the-token: freeze the holder, transfer from the frozen account (expected failure), thaw"
ex issuing/freeze $HOLDER
sdkmode && cap issuing/transfer-frozen $MOSAIC transfer --mint-address $MINT --recipient $OUTSIDER --amount 1 --keypair $K/demo-holder.json --rpc-url $RPC
ex_as frozen issuing/transfer $OUTSIDER 1
ex issuing/thaw $HOLDER

say "operate-the-token: pause, status, resume"
if sdkmode; then
  { $MOSAIC control pause --mint-address $MINT --skip-warning --keypair $K/demo-authorities/pause.json --rpc-url $RPC; echo; $MOSAIC control status --mint-address $MINT --rpc-url $RPC; } > "$HERE/issuing/control-status-paused.output.txt" 2>&1; cat "$HERE/issuing/control-status-paused.output.txt" | tee -a "$LOG"
  cli $MOSAIC control resume --mint-address $MINT --keypair $K/demo-authorities/pause.json --rpc-url $RPC
fi
ex issuing/pause; ex issuing/resume

say "operate-the-token: force transfer, burn, force burn"
ex issuing/force-transfer $HOLDER $OUTSIDER 10
sdkmode && cli $MOSAIC burn --mint-address $MINT --amount 1 --keypair $K/demo-holder.json --permissioned-burn-keypair $K/demo-authorities/burn.json --rpc-url $RPC
ex issuing/burn 1
sdkmode && cli $MOSAIC force-burn --mint-address $MINT --from-account $OUTSIDER --amount 1 --keypair $K/demo-authorities/delegate.json --permissioned-burn-keypair $K/demo-authorities/burn.json --rpc-url $RPC
ex issuing/force-burn $OUTSIDER 1

say "custodian: derive, allowlist, receive, display, freeze, display, thaw"
if sdkmode; then ex custodian/derive-ata $CUSTODIAN
  cli $MOSAIC allowlist add --mint-address $MINT --account $CUSTODIAN --keypair $PAYER --rpc-url $RPC
  cli $MOSAIC mint --mint-address $MINT --recipient $CUSTODIAN --amount 500 --keypair $PAYER --rpc-url $RPC
else [ "$IMPL" = kit ] && ex_quiet custodian/derive-ata $CUSTODIAN || ex custodian/derive-ata $CUSTODIAN
  ex_quiet issuing/allowlist-add $CUSTODIAN; ex_quiet issuing/mint $CUSTODIAN 500; fi
export CUSTODY_ATA=$(ata $CUSTODIAN)
sdkmode && cap custodian/display-thawed spl-token display $CUSTODY_ATA --url $RPC
ex_read thawed custodian/read-account $CUSTODY_ATA
ex_quiet issuing/freeze $CUSTODIAN
sdkmode && cap custodian/display-frozen spl-token display $CUSTODY_ATA --url $RPC
ex_read frozen custodian/read-account $CUSTODY_ATA
ex_quiet issuing/thaw $CUSTODIAN
# Wait until the thaw itself is visible at finalized, otherwise the read lands on a pre-thaw slot.
for i in $(seq 1 60); do _exec "$(script custodian/read-account)" $CUSTODY_ATA finalized 2>/dev/null | grep -q "State: Initialized" && break; sleep 2; done
ex_read finalized custodian/read-account $CUSTODY_ATA finalized

say "vault: blocked deposit (expected failure), allowlist, deposit"
sdkmode && cap vault/transfer-blocked $MOSAIC transfer --mint-address $MINT --recipient $VAULT --amount 1 --keypair $K/demo-holder.json --rpc-url $RPC
ex_as vault-blocked issuing/transfer $VAULT 1
if sdkmode; then cli $MOSAIC allowlist add --mint-address $MINT --account $VAULT --keypair $PAYER --rpc-url $RPC
  cli $MOSAIC transfer --mint-address $MINT --recipient $VAULT --amount 1 --keypair $K/demo-holder.json --rpc-url $RPC
else ex_quiet issuing/allowlist-add $VAULT; ex_quiet issuing/transfer $VAULT 1; fi
say "vault: verify the gate state of the vault's account"
export VAULT_ATA=$(ata $VAULT)
sdkmode && cap vault/display-vault spl-token display $VAULT_ATA --url $RPC
ex_read vault custodian/read-account $VAULT_ATA

say "operate-the-token: offboard the outsider (remove also freezes the account)"
if sdkmode; then cli $MOSAIC allowlist remove --mint-address $MINT --account $OUTSIDER --keypair $PAYER --rpc-url $RPC
  cap issuing/display-offboarded spl-token display $(ata $OUTSIDER) --url $RPC
else ex issuing/allowlist-remove $OUTSIDER; fi
ex_read offboarded custodian/read-account $(ata $OUTSIDER)

EXPECTED=3; sdkmode && EXPECTED=6  # CLI and SDK variants of each deliberate failure
say "done ($IMPL): $(grep -c '\[exit 0\]' "$LOG") commands succeeded, $(grep -cE '^\[exit [1-9]' "$LOG") failed ($EXPECTED expected: transfer blocked, transfer frozen, vault transfer blocked)"
echo "mint $MINT" | tee -a "$LOG"
