#!/usr/bin/env bash
# Runs every Python example (cookbook/*/*/*python*.py) once against a local
# validator. Dependencies are pinned in requirements.txt:
#
#   pip install -r packages/docs-examples/requirements.txt
#
# Used by CI (.github/workflows/docs-examples.yml) and reproducible locally.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ROOT/scripts/start-surfpool.sh"

fail=0
for example in "$ROOT"/cookbook/*/*/*python*.py; do
  name="${example#"$ROOT/"}"
  echo "::group::$name"
  if ! python3 -I "$example"; then
    echo "::error::$name exited non-zero"
    fail=1
  fi
  echo "::endgroup::"
done

exit "$fail"
