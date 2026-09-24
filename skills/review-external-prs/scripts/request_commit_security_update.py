"""Request a signed, squashed rewrite of one guarded external PR."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from typing import Any

from check_commit_security import CommitSecurityError, check_pr
from guarded_close import GuardError, fetch_pr_snapshot, validate_snapshot
from list_external_prs import IntakeError, fetch_team_payload, load_static_protected_authors, parse_team_members, run_gh


def marker(head: str) -> str:
    return f"<!-- review-external-prs:commit-security:{head} -->"


def build_comment(report: dict[str, Any]) -> str:
    reasons = sorted({failure["reason"] for failure in report["failures"]})
    reason_text = ", ".join(f"`{reason}`" for reason in reasons) or "no signature failure"
    return "\n".join(
        [
            "Thanks for the contribution. Before this can proceed through review, "
            "please squash this PR to one commit and amend/sign that final commit "
            "so GitHub shows it as **Verified**.",
            "",
            f"The current head has {report['commitCount']} commit(s), and GitHub "
            f"reports {reason_text} for the commit verification check.",
            "",
            "Please force-push the updated branch when ready; we will re-run the "
            "review against the new head.",
            marker(report["head"]),
        ]
    )


def comments_contain_marker(number: int, head: str) -> bool:
    endpoint = f"repos/solana-foundation/solana-com/issues/{number}/comments?per_page=100"
    payload = run_gh(["api", "--hostname", "github.com", "--paginate", "--slurp", endpoint])
    pages = payload if isinstance(payload, list) else [payload]
    for page in pages:
        if not isinstance(page, list):
            raise CommitSecurityError("comment response has an unexpected shape")
        for comment in page:
            body = comment.get("body") if isinstance(comment, dict) else None
            if isinstance(body, str) and marker(head) in body:
                return True
    return False


def revalidate_before_comment(number: int, expected_head: str) -> None:
    protected_logins = parse_team_members(fetch_team_payload()) | load_static_protected_authors()
    validate_snapshot(fetch_pr_snapshot(number), number, expected_head, protected_logins)


def post_comment(number: int, comment: str) -> None:
    completed = subprocess.run(
        [
            "gh",
            "api",
            "--method",
            "POST",
            f"repos/solana-foundation/solana-com/issues/{number}/comments",
            "-f",
            f"body={comment}",
        ],
        check=False,
        capture_output=True,
        text=True,
        timeout=60,
    )
    if completed.returncode != 0:
        detail = completed.stderr.strip() or "unknown gh error"
        raise CommitSecurityError(f"comment request failed: {detail}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Request a signed, squashed rewrite for one external PR."
    )
    parser.add_argument("number", type=int)
    parser.add_argument("--expected-head", required=True)
    parser.add_argument("--apply", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        report = check_pr(args.number, args.expected_head)
        if report["conforming"]:
            raise CommitSecurityError("PR already has one GitHub-verified signed commit")
        already_requested = comments_contain_marker(args.number, args.expected_head)
        result: dict[str, Any] = {
            "mode": "apply" if args.apply else "dry-run",
            "number": args.number,
            "head": args.expected_head,
            "alreadyRequested": already_requested,
            "commitCount": report["commitCount"],
            "verificationReasons": sorted({item["reason"] for item in report["failures"]}),
        }
        if args.apply and not already_requested:
            revalidate_before_comment(args.number, args.expected_head)
            post_comment(args.number, build_comment(report))
            result["commented"] = True
        else:
            result["commented"] = False
        print(json.dumps(result, indent=2))
        return 0
    except (CommitSecurityError, GuardError, IntakeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
