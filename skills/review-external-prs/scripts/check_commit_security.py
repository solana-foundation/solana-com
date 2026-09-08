"""Check external PR commit signing and squash conformance through GitHub."""

from __future__ import annotations

import argparse
import json
import sys
from typing import Any

from guarded_close import GuardError, fetch_pr_snapshot, validate_snapshot
from list_external_prs import (
    ORG,
    REPO,
    IntakeError,
    fetch_team_payload,
    load_static_protected_authors,
    parse_team_members,
    run_gh,
)


class CommitSecurityError(RuntimeError):
    """Raised when commit integrity cannot be established safely."""


def parse_commit_pages(payload: Any) -> list[dict[str, Any]]:
    """Flatten GitHub's --paginate --slurp commit response."""
    pages = payload if isinstance(payload, list) else [payload]
    commits: list[dict[str, Any]] = []
    for page in pages:
        if not isinstance(page, list):
            raise CommitSecurityError("commit response has an unexpected shape")
        for commit in page:
            if not isinstance(commit, dict):
                raise CommitSecurityError("commit entry has an unexpected shape")
            sha = commit.get("sha")
            if not isinstance(sha, str) or not sha:
                raise CommitSecurityError("commit entry has no SHA")
            commits.append(commit)
    if not commits:
        raise CommitSecurityError("PR has no commits")
    return commits


def evaluate_commit_security(
    commits: list[dict[str, Any]], expected_head: str
) -> dict[str, Any]:
    """Return a report without exposing signature payloads or key material."""
    if commits[-1].get("sha") != expected_head:
        raise CommitSecurityError("PR head changed while reading commit metadata")

    failures: list[dict[str, str]] = []
    for commit in commits:
        commit_data = commit.get("commit")
        verification = (
            commit_data.get("verification") if isinstance(commit_data, dict) else None
        )
        sha = commit["sha"]
        if not isinstance(verification, dict):
            failures.append({"sha": sha, "reason": "verification-unavailable"})
            continue
        if verification.get("verified") is not True:
            reason = verification.get("reason")
            failures.append(
                {
                    "sha": sha,
                    "reason": reason if isinstance(reason, str) and reason else "unverified",
                }
            )

    return {
        "head": expected_head,
        "commitCount": len(commits),
        "verified": not failures,
        "squashed": len(commits) == 1,
        "failures": failures,
        "conforming": len(commits) == 1 and not failures,
    }


def fetch_commits(number: int) -> list[dict[str, Any]]:
    endpoint = f"repos/{ORG}/{REPO}/pulls/{number}/commits?per_page=100"
    return parse_commit_pages(
        run_gh(["api", "--hostname", "github.com", "--paginate", "--slurp", endpoint])
    )


def check_pr(number: int, expected_head: str) -> dict[str, Any]:
    protected_logins = parse_team_members(fetch_team_payload()) | load_static_protected_authors()
    snapshot = validate_snapshot(
        fetch_pr_snapshot(number), number, expected_head, protected_logins
    )
    return {**snapshot, **evaluate_commit_security(fetch_commits(number), expected_head)}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Check whether an external PR has one GitHub-verified signed commit."
    )
    parser.add_argument("number", type=int)
    parser.add_argument("--expected-head", required=True)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        result = check_pr(args.number, args.expected_head)
    except (CommitSecurityError, GuardError, IntakeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    print(json.dumps(result, indent=2))
    return 0 if result["conforming"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
