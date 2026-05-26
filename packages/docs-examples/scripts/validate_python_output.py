#!/usr/bin/env python3
"""
Sweep a Python example's captured stdout for silent-failure markers and
validate any logged Solana signatures.

Exits non-zero if either check fails so run-python-examples.sh can flag the
example even when its exit code was 0.
"""
from __future__ import annotations

import re
import sys

from solders.signature import Signature

# 87-88 char base58 strings — Solana signature shape.
SIGNATURE_RE = re.compile(r"[1-9A-HJ-NP-Za-km-z]{87,88}")

# Markers we treat as silent failures even when exit code was 0. Examples
# use try/except blocks that catch and print the error, which means the
# script exits cleanly but the operation didn't actually work.
FAIL_MARKERS = [
    re.compile(r"^Traceback ", re.MULTILINE),
    # Python exception-class lines at the start of a line, e.g. "TypeError:"
    # or "BaseException:". Requires at least one character before
    # Error/Exception so user catch-block prints like "Error getting token
    # balance: ..." or "Transaction failed: ..." don't false-positive.
    re.compile(
        r"^[A-Z][a-zA-Z]+(?:Error|Exception)\b[^:\n]{0,80}:", re.MULTILINE
    ),
    re.compile(r"\bFAIL\b"),
]


def main() -> int:
    if len(sys.argv) != 3:
        print(
            f"usage: {sys.argv[0]} <label> <stdout-file>",
            file=sys.stderr,
        )
        return 2

    label, path = sys.argv[1], sys.argv[2]
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        text = f.read()

    problems: list[str] = []

    for pattern in FAIL_MARKERS:
        match = pattern.search(text)
        if match:
            problems.append(
                f"silent-failure marker {pattern.pattern!r}: {match.group(0)!r}"
            )

    for sig in SIGNATURE_RE.findall(text):
        try:
            Signature.from_string(sig)
        except Exception as exc:
            problems.append(f"signature parse failed for {sig!r}: {exc}")

    if problems:
        print(f"::error::{label}: {len(problems)} validation issue(s)")
        for p in problems:
            print(f"  - {p}")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
