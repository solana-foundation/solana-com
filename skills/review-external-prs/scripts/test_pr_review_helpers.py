"""Offline tests for the external PR membership and close guards."""

from __future__ import annotations

import json
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from guarded_close import GuardError, read_comment, validate_snapshot
from list_external_prs import IntakeError, build_output


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

    def test_closing_comment_must_thank_the_contributor(self) -> None:
        with TemporaryDirectory() as directory:
            path = Path(directory) / "comment.md"
            path.write_text("This submission does not meet the bar.", encoding="utf-8")
            with self.assertRaises(GuardError):
                read_comment(path)


if __name__ == "__main__":
    unittest.main()
