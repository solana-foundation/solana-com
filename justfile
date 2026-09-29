# Most recipes take an optional target: an app/package dir name (web, docs,
# media, templates, accelerate/acc, breakpoint/bp, ui, i18n, ...) or any raw
# turbo filter. Omit it to run across the whole monorepo.

set positional-arguments := true

turbo := "pnpm exec turbo run"
flags := "--framework-inference=false"

default:
    @just --list

# Resolve a short target name to a turbo filter flag
[private]
filter target="":
    #!/usr/bin/env bash
    t="$1"
    case "$t" in
      "") exit 0 ;;
      acc) t=accelerate ;;
      bp) t=breakpoint ;;
    esac
    if [ -d "apps/$t" ]; then echo "--filter=./apps/$t"
    elif [ -d "packages/$t" ]; then echo "--filter=./packages/$t"
    else echo "--filter=$t"; fi

# Resolve targets (app/package names or file/dir paths) to prettier paths
[private]
paths *targets:
    #!/usr/bin/env bash
    [ $# -eq 0 ] && { echo "."; exit 0; }
    for t in "$@"; do
      case "$t" in
        acc) t=accelerate ;;
        bp) t=breakpoint ;;
      esac
      if [ -d "apps/$t" ]; then echo "apps/$t"
      elif [ -d "packages/$t" ]; then echo "packages/$t"
      elif [ -e "$t" ]; then echo "$t"
      else echo "Unknown target: $t" >&2; exit 1; fi
    done

install:
    pnpm install --frozen-lockfile

dev target="":
    {{ turbo }} dev $(just filter "$1") {{ flags }}

web: (dev "web")

docs: (dev "docs")

media: (dev "media")

templates: (dev "templates")

acc: (dev "accelerate")

bp: (dev "breakpoint")

build target="":
    {{ turbo }} build $(just filter "$1") {{ flags }}

test target="":
    {{ turbo }} test $(just filter "$1") {{ flags }}

lint target="":
    {{ turbo }} lint $(just filter "$1") {{ flags }}

lint-fix target="":
    {{ turbo }} lint:fix $(just filter "$1") {{ flags }}

typecheck target="":
    {{ turbo }} check-types $(just filter "$1") {{ flags }}

# Format with prettier (same config as CI); takes app names or file paths
fmt *targets:
    #!/usr/bin/env bash
    set -euo pipefail
    out=$(just paths "$@")
    paths=(); while IFS= read -r p; do paths+=("$p"); done <<< "$out"
    pnpm exec prettier --ignore-path .prettierignore --write "${paths[@]}"

# Format files changed vs base (committed, staged, unstaged and untracked)
fmt-changed base="origin/main":
    #!/usr/bin/env bash
    set -euo pipefail
    out=$( { git diff --name-only --diff-filter=d "$(git merge-base "$1" HEAD)"; git ls-files --others --exclude-standard; } | sort -u)
    [ -z "$out" ] && { echo "No changed files"; exit 0; }
    paths=(); while IFS= read -r p; do paths+=("$p"); done <<< "$out"
    pnpm exec prettier --ignore-path .prettierignore --ignore-unknown --write "${paths[@]}"

fmt-check *targets:
    #!/usr/bin/env bash
    set -euo pipefail
    out=$(just paths "$@")
    paths=(); while IFS= read -r p; do paths+=("$p"); done <<< "$out"
    pnpm exec prettier --ignore-path .prettierignore --check "${paths[@]}"

# Everything CI checks: format, lint, types, tests
check target="": (fmt-check target) (lint target) (typecheck target) (test target)

clean:
    pnpm clean

i18n *args:
    node ./scripts/i18n/run.mjs {{ if args == "" { "all" } else { args } }}
