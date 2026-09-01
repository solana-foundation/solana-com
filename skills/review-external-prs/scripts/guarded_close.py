"""Close one reviewed external PR after rechecking protected-author guards."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

from list_external_prs import (
    EXTERNAL_ASSOCIATIONS,
    ORG,
    PROTECTED_ASSOCIATIONS,
    REPO,
    TARGET_REPO,
    IntakeError,
    fetch_team_payload,
    load_static_protected_authors,
    parse_team_members,
    run_gh,
)

REASONS = (
    "spam",
    "trust-threshold",
    "duplicate",
    "already-addressed",
    "no-op",
    "wrong-repository",
)
OID_PATTERN = re.compile(r"[0-9a-fA-F]{40}|[0-9a-fA-F]{64}")

PR_GUARD_QUERY = """
query($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      number
      state
      headRefOid
      author { login }
      authorAssociation
      url
    }
  }
}
""".strip()


class GuardError(RuntimeError):
    """Raised when a live close is not safe to perform."""


def fetch_pr_snapshot(number: int) -> dict[str, Any]:
    try:
        payload = run_gh(
            [
                "api",
                "--hostname",
                "github.com",
                "graphql",
                "-f",
                f"owner={ORG}",
                "-f",
                f"name={REPO}",
                "-F",
                f"number={number}",
                "-f",
                f"query={PR_GUARD_QUERY}",
            ]
        )
    except IntakeError as exc:
        raise GuardError(str(exc)) from exc

    if not isinstance(payload, dict) or payload.get("errors"):
        raise GuardError("GitHub GraphQL returned an invalid PR snapshot")
    data = payload.get("data")
    repository = data.get("repository") if isinstance(data, dict) else None
    pull_request = (
        repository.get("pullRequest") if isinstance(repository, dict) else None
    )
    if not isinstance(pull_request, dict):
        raise GuardError(f"PR #{number} was not found in {TARGET_REPO}")
    return pull_request


def validate_snapshot(
    snapshot: dict[str, Any],
    number: int,
    expected_head: str,
    protected_logins: set[str],
) -> dict[str, Any]:
    if snapshot.get("number") != number:
        raise GuardError("GitHub returned a different PR number")

    association = snapshot.get("authorAssociation")
    author = snapshot.get("author")
    login = author.get("login") if isinstance(author, dict) else None
    normalized_login = login.casefold() if isinstance(login, str) else None

    if association in PROTECTED_ASSOCIATIONS or normalized_login in protected_logins:
        raise GuardError("refusing to close a protected-author PR")
    if association not in EXTERNAL_ASSOCIATIONS:
        raise GuardError("author association is unknown; refusing to close")
    if snapshot.get("state") != "OPEN":
        raise GuardError(f"PR #{number} is not open")

    current_head = snapshot.get("headRefOid")
    if current_head != expected_head:
        raise GuardError(
            f"PR #{number} head changed; expected {expected_head}, got {current_head}"
        )

    return {
        "number": number,
        "url": snapshot.get("url"),
        "author": login,
        "authorAssociation": association,
        "headRefOid": current_head,
    }


def read_comment(path: Path) -> str:
    try:
        comment = path.read_text(encoding="utf-8").strip()
    except OSError as exc:
        raise GuardError(f"cannot read comment file: {path}") from exc
    if not comment:
        raise GuardError("closing comment is empty")
    if len(comment) > 8_000:
        raise GuardError("closing comment exceeds the 8,000-character safety limit")
    if "thank" not in comment.casefold():
        raise GuardError("closing comment must thank the contributor")
    return comment


def close_pr(number: int, comment: str) -> None:
    try:
        completed = subprocess.run(
            [
                "gh",
                "pr",
                "close",
                str(number),
                "--repo",
                TARGET_REPO,
                "--comment",
                comment,
            ],
            check=False,
            capture_output=True,
            text=True,
            timeout=60,
        )
    except FileNotFoundError as exc:
        raise GuardError("GitHub CLI (gh) was not found on PATH") from exc
    except subprocess.TimeoutExpired as exc:
        raise GuardError(
            "gh pr close timed out; inspect the live PR state before retrying"
        ) from exc
    if completed.returncode != 0:
        detail = completed.stderr.strip() or "unknown gh error"
        raise GuardError(
            "gh pr close returned an error; inspect the live PR state before "
            f"retrying: {detail}"
        )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Safely close one reviewed external solana-com PR."
    )
    parser.add_argument("number", type=int)
    parser.add_argument("--expected-head", required=True)
    parser.add_argument("--reason", choices=REASONS, required=True)
    parser.add_argument("--comment-file", type=Path, required=True)
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Perform the close. Without this flag, validate and print a dry run.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.number <= 0:
        print("error: PR number must be positive", file=sys.stderr)
        return 2
    if not OID_PATTERN.fullmatch(args.expected_head):
        print(
            "error: --expected-head must be a full 40- or 64-character OID",
            file=sys.stderr,
        )
        return 2

    try:
        comment = read_comment(args.comment_file)
        # Resolve the complete dynamic roster immediately before the PR check.
        team_members = parse_team_members(fetch_team_payload())
        protected_logins = team_members | load_static_protected_authors()
        checked = validate_snapshot(
            fetch_pr_snapshot(args.number),
            args.number,
            args.expected_head,
            protected_logins,
        )

        result = {
            "mode": "apply" if args.apply else "dry-run",
            "repository": TARGET_REPO,
            "reason": args.reason,
            **checked,
        }
        if not args.apply:
            print(json.dumps(result, indent=2))
            return 0

        close_pr(args.number, comment)
        final_snapshot = fetch_pr_snapshot(args.number)
        if final_snapshot.get("state") != "CLOSED":
            raise GuardError(
                "gh returned success but the PR is not closed; inspect it before retrying"
            )
        result["state"] = "CLOSED"
        print(json.dumps(result, indent=2))
        return 0
    except (GuardError, IntakeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
