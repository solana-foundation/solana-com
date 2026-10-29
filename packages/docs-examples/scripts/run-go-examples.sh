#!/usr/bin/env bash
# Runs every Go example (cookbook/*/*/go and go-<variant>, one `package main`
# each, all in the packages/docs-examples Go module) once against a local
# validator.
#
# Used by CI (.github/workflows/docs-examples.yml) and reproducible locally.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ROOT/scripts/start-surfpool.sh"

( cd "$ROOT" && go vet ./... )

fail=0
for dir in "$ROOT"/cookbook/*/*/go*/; do
  dir="${dir%/}"
  name="${dir#"$ROOT/"}"
  echo "::group::$name"
  if ! ( cd "$ROOT" && go run "./$name" ); then
    echo "::error::$name exited non-zero"
    fail=1
  fi
  echo "::endgroup::"
done

exit "$fail"
