"""Offline tests for the external PR membership and close guards."""

from __future__ import annotations

import json
import unittest
from argparse import Namespace
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from guarded_close import (
    GuardError,
    close_pr,
    main,
    read_comment,
    reconcile_closed_snapshot,
    validate_closed_snapshot,
    validate_snapshot,
)
from check_commit_security import CommitSecurityError, evaluate_commit_security, parse_commit_pages
from list_external_prs import IntakeError, build_output
from request_commit_security_update import build_comment, marker


def graphql_page(nodes: list[dict[str, object]]) -> dict[str, object]:
    return {
        "data": {
            "repository": {
                "pullRequests": {
                    "nodes": nodes,
                    "pageInfo": {"hasNextPage": False, "endCursor": None},
                }
            }
        }
    }


class IntakeTests(unittest.TestCase):
    def test_protected_authors_are_omitted_and_first_timers_sort_first(self) -> None:
        team_pages = [[{"login": "team-member"}]]
        pr_pages = [
            graphql_page(
                [
                    {
                        "number": 1,
                        "author": {"login": "org-member"},
                        "authorAssociation": "MEMBER",
                    },
                    {
                        "number": 2,
                        "author": {"login": "team-member"},
                        "authorAssociation": "COLLABORATOR",
                    },
                    {
                        "number": 3,
                        "author": {"login": "trusted-outside"},
                        "authorAssociation": "COLLABORATOR",
                    },
                    {
                        "number": 4,
                        "author": {"login": "prior-contributor"},
                        "authorAssociation": "CONTRIBUTOR",
                    },
                    {
                        "number": 5,
                        "author": {"login": "new-person"},
                        "authorAssociation": "FIRST_TIME_CONTRIBUTOR",
                    },
                ]
            )
        ]

        output = build_output(team_pages, pr_pages, {"trusted-outside"})
        self.assertEqual([item["number"] for item in output["pullRequests"]], [5, 4])
        rendered = json.dumps(output)
        self.assertNotIn("org-member", rendered)
        self.assertNotIn("team-member", rendered)
        self.assertNotIn("trusted-outside", rendered)

    def test_empty_team_roster_fails_closed(self) -> None:
        with self.assertRaises(IntakeError):
            build_output([[]], [graphql_page([])], {"trusted-outside"})

    def test_unknown_association_fails_closed(self) -> None:
        pages = [
            graphql_page(
                [
                    {
                        "number": 6,
                        "author": {"login": "mystery"},
                        "authorAssociation": "NEW_ENUM_VALUE",
                    }
                ]
            )
        ]
        with self.assertRaises(IntakeError):
            build_output([[{"login": "team-member"}]], pages, {"trusted-outside"})


class CloseGuardTests(unittest.TestCase):
    def snapshot(self, **overrides: object) -> dict[str, object]:
        base: dict[str, object] = {
            "number": 9,
            "state": "OPEN",
            "headRefOid": "a" * 40,
            "author": {"login": "external"},
            "authorAssociation": "FIRST_TIME_CONTRIBUTOR",
            "url": "https://github.com/solana-foundation/solana-com/pull/9",
        }
        base.update(overrides)
        return base

    def test_external_unchanged_open_pr_passes(self) -> None:
        checked = validate_snapshot(self.snapshot(), 9, "a" * 40, {"team-member"})
        self.assertEqual(checked["number"], 9)

    def test_team_member_is_refused_even_as_collaborator(self) -> None:
        with self.assertRaises(GuardError):
            validate_snapshot(
                self.snapshot(
                    author={"login": "team-member"},
                    authorAssociation="COLLABORATOR",
                ),
                9,
                "a" * 40,
                {"team-member"},
            )

    def test_changed_head_is_refused(self) -> None:
        with self.assertRaises(GuardError):
            validate_snapshot(self.snapshot(headRefOid="b" * 40), 9, "a" * 40, set())

    def test_closed_pr_is_refused(self) -> None:
        with self.assertRaises(GuardError):
            validate_snapshot(self.snapshot(state="CLOSED"), 9, "a" * 40, set())

    def test_closed_snapshot_requires_the_reviewed_head(self) -> None:
        checked = validate_closed_snapshot(
            self.snapshot(state="CLOSED"), 9, "a" * 40
        )
        self.assertEqual(checked["headRefOid"], "a" * 40)

        with self.assertRaises(GuardError):
            validate_closed_snapshot(
                self.snapshot(state="CLOSED", headRefOid="b" * 40), 9, "a" * 40
            )

    @patch("guarded_close.subprocess.run")
    @patch("guarded_close.fetch_pr_snapshot")
    def test_close_rechecks_head_and_does_not_attach_comment(
        self, fetch_snapshot, run
    ) -> None:
        fetch_snapshot.return_value = self.snapshot()
        run.return_value.returncode = 0

        close_pr(9, "a" * 40, {"team-member"})

        command = run.call_args.args[0]
        self.assertEqual(
            command,
            ["gh", "pr", "close", "9", "--repo", "solana-foundation/solana-com"],
        )
        self.assertNotIn("--comment", command)

    @patch("guarded_close.subprocess.run")
    @patch("guarded_close.fetch_pr_snapshot")
    def test_close_refuses_a_changed_head_before_mutation(
        self, fetch_snapshot, run
    ) -> None:
        fetch_snapshot.return_value = self.snapshot(headRefOid="b" * 40)

        with self.assertRaises(GuardError):
            close_pr(9, "a" * 40, set())

        run.assert_not_called()

    @patch("guarded_close.reopen_pr")
    def test_changed_head_after_close_is_reopened_and_rejected(self, reopen) -> None:
        with self.assertRaises(GuardError):
            reconcile_closed_snapshot(
                9,
                "a" * 40,
                self.snapshot(state="CLOSED", headRefOid="b" * 40),
            )

        reopen.assert_called_once_with(9)

    @patch("guarded_close.reopen_pr")
    @patch("guarded_close.post_closing_comment")
    @patch("guarded_close.close_pr")
    @patch("guarded_close.fetch_pr_snapshot")
    @patch("guarded_close.load_static_protected_authors", return_value=set())
    @patch("guarded_close.parse_team_members", return_value=set())
    @patch("guarded_close.fetch_team_payload", return_value={})
    def test_force_push_during_comment_reopens_and_fails(
        self,
        fetch_team_payload,
        parse_team_members,
        load_static_protected_authors,
        fetch_pr_snapshot,
        close,
        post_comment,
        reopen,
    ) -> None:
        """A post-close comment cannot make a raced close look successful."""
        with TemporaryDirectory() as directory:
            comment_file = Path(directory) / "comment.md"
            comment_file.write_text("Thank you for the contribution.", encoding="utf-8")
            arguments = Namespace(
                number=9,
                expected_head="a" * 40,
                reason="spam",
                comment_file=comment_file,
                apply=True,
            )
            fetch_pr_snapshot.side_effect = [
                self.snapshot(),
                self.snapshot(state="CLOSED"),
                self.snapshot(state="CLOSED", headRefOid="b" * 40),
            ]

            with patch("guarded_close.parse_args", return_value=arguments):
                self.assertEqual(main(), 2)

        close.assert_called_once_with(9, "a" * 40, set())
        post_comment.assert_called_once_with(9, "Thank you for the contribution.")
        reopen.assert_called_once_with(9)

    def test_closing_comment_must_thank_the_contributor(self) -> None:
        with TemporaryDirectory() as directory:
            path = Path(directory) / "comment.md"
            path.write_text("This submission does not meet the bar.", encoding="utf-8")
            with self.assertRaises(GuardError):
                read_comment(path)


class CommitSecurityTests(unittest.TestCase):
    def commit(self, sha: str, verified: bool = True, reason: str = "valid") -> dict[str, object]:
        return {
            "sha": sha,
            "commit": {"verification": {"verified": verified, "reason": reason}},
        }

    def test_one_verified_commit_conforms(self) -> None:
        report = evaluate_commit_security([self.commit("a" * 40)], "a" * 40)
        self.assertTrue(report["conforming"])

    def test_unverified_commit_reports_reason(self) -> None:
        report = evaluate_commit_security(
            [self.commit("a" * 40, verified=False, reason="unsigned")], "a" * 40
        )
        self.assertFalse(report["conforming"])
        self.assertEqual(report["failures"], [{"sha": "a" * 40, "reason": "unsigned"}])

    def test_multiple_verified_commits_require_squash(self) -> None:
        report = evaluate_commit_security(
            [self.commit("a" * 40), self.commit("b" * 40)], "b" * 40
        )
        self.assertFalse(report["conforming"])
        self.assertTrue(report["verified"])
        self.assertFalse(report["squashed"])

    def test_changed_head_or_malformed_pages_fail_closed(self) -> None:
        with self.assertRaises(CommitSecurityError):
            evaluate_commit_security([self.commit("a" * 40)], "b" * 40)
        with self.assertRaises(CommitSecurityError):
            parse_commit_pages({"sha": "a" * 40})

    def test_request_comment_uses_a_per_head_marker_and_reason_codes(self) -> None:
        report = {
            "head": "a" * 40,
            "commitCount": 2,
            "failures": [{"sha": "a" * 40, "reason": "unsigned"}],
        }
        comment = build_comment(report)
        self.assertIn("squash this PR to one commit", comment)
        self.assertIn("`unsigned`", comment)
        self.assertIn(marker("a" * 40), comment)


if __name__ == "__main__":
    unittest.main()
