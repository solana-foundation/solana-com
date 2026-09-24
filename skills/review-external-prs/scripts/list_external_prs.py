"""List open PRs whose authors are outside the protected Solana roster.

The live path intentionally performs the team lookup before asking GitHub for
minimal PR identity metadata. Protected PR titles, bodies, and diffs are never
requested or emitted.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from collections.abc import Iterable
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

TARGET_REPO = "solana-foundation/solana-com"
ORG = "solana-foundation"
REPO = "solana-com"
PROTECTED_TEAM = "foundation-members"
PROTECTED_ASSOCIATIONS = frozenset({"MEMBER", "OWNER"})
EXTERNAL_ASSOCIATIONS = frozenset(
    {
        "COLLABORATOR",
        "CONTRIBUTOR",
        "FIRST_TIMER",
        "FIRST_TIME_CONTRIBUTOR",
        "MANNEQUIN",
        "NONE",
    }
)
FIRST_TIME_ASSOCIATIONS = frozenset({"FIRST_TIMER", "FIRST_TIME_CONTRIBUTOR"})
PROTECTED_AUTHORS_FILE = (
    Path(__file__).resolve().parent.parent / "references" / "protected-authors.txt"
)

PR_QUERY = """
query($owner: String!, $name: String!, $endCursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequests(
      states: OPEN
      first: 100
      after: $endCursor
      orderBy: {field: CREATED_AT, direction: ASC}
    ) {
      nodes {
        number
        author { login }
        authorAssociation
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}
""".strip()


class IntakeError(RuntimeError):
    """Raised when the protected-author gate cannot be established safely."""


def run_gh(arguments: list[str]) -> Any:
    try:
        completed = subprocess.run(
            ["gh", *arguments],
            check=False,
            capture_output=True,
            text=True,
            timeout=120,
        )
    except FileNotFoundError as exc:
        raise IntakeError("GitHub CLI (gh) was not found on PATH") from exc
    except subprocess.TimeoutExpired as exc:
        raise IntakeError("gh command timed out after 120 seconds") from exc

    if completed.returncode != 0:
        detail = completed.stderr.strip() or "unknown gh error"
        raise IntakeError(f"gh command failed: {detail}")

    try:
        return json.loads(completed.stdout)
    except json.JSONDecodeError as exc:
        raise IntakeError("gh returned invalid JSON") from exc


def fetch_team_payload() -> Any:
    endpoint = f"orgs/{ORG}/teams/{PROTECTED_TEAM}/members?per_page=100"
    return run_gh(
        [
            "api",
            "--hostname",
            "github.com",
            "--paginate",
            "--slurp",
            endpoint,
        ]
    )


def fetch_pr_payload() -> Any:
    return run_gh(
        [
            "api",
            "--hostname",
            "github.com",
            "graphql",
            "--paginate",
            "--slurp",
            "-f",
            f"owner={ORG}",
            "-f",
            f"name={REPO}",
            "-f",
            f"query={PR_QUERY}",
        ]
    )


def load_static_protected_authors(path: Path = PROTECTED_AUTHORS_FILE) -> set[str]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise IntakeError(f"cannot read protected-author list: {path}") from exc

    authors = {
        line.strip().lstrip("@").casefold()
        for line in lines
        if line.strip() and not line.lstrip().startswith("#")
    }
    if not authors:
        raise IntakeError("protected-author list is empty")
    return authors


def parse_team_members(payload: Any) -> set[str]:
    pages = payload if isinstance(payload, list) else [payload]
    members: set[str] = set()
    for page in pages:
        if not isinstance(page, list):
            raise IntakeError("team roster response has an unexpected shape")
        for member in page:
            login = member.get("login") if isinstance(member, dict) else None
            if not isinstance(login, str) or not login.strip():
                raise IntakeError("team roster contains an entry without a login")
            members.add(login.casefold())

    if not members:
        raise IntakeError("Foundation team lookup returned no members")
    return members


def _graphql_pages(payload: Any) -> Iterable[dict[str, Any]]:
    pages = payload if isinstance(payload, list) else [payload]
    for page in pages:
        if not isinstance(page, dict):
            raise IntakeError("pull request response has an unexpected shape")
        if page.get("errors"):
            raise IntakeError("GitHub GraphQL returned errors")
        yield page


def parse_external_prs(
    payload: Any, protected_logins: set[str]
) -> list[dict[str, Any]]:
    candidates: dict[int, dict[str, Any]] = {}

    for page in _graphql_pages(payload):
        data = page.get("data")
        repository = data.get("repository") if isinstance(data, dict) else None
        if not isinstance(repository, dict):
            raise IntakeError(f"repository {TARGET_REPO} was not returned")
        connection = repository.get("pullRequests")
        nodes = connection.get("nodes") if isinstance(connection, dict) else None
        if not isinstance(nodes, list):
            raise IntakeError("pull request nodes are missing")

        for node in nodes:
            if not isinstance(node, dict):
                raise IntakeError("pull request node has an unexpected shape")
            number = node.get("number")
            association = node.get("authorAssociation")
            author = node.get("author")
            login = author.get("login") if isinstance(author, dict) else None

            if not isinstance(number, int) or number <= 0:
                raise IntakeError("pull request number is invalid")
            if not isinstance(association, str):
                raise IntakeError(f"PR #{number} has no author association")
            normalized_login = login.casefold() if isinstance(login, str) else None

            if (
                association in PROTECTED_ASSOCIATIONS
                or normalized_login in protected_logins
            ):
                continue
            if association not in EXTERNAL_ASSOCIATIONS:
                raise IntakeError(
                    f"PR #{number} has an unrecognized author association; "
                    "refusing to classify it"
                )

            candidate = {
                "number": number,
                "author": login if isinstance(login, str) else None,
                "authorAssociation": association,
                "firstTimeContributor": association in FIRST_TIME_ASSOCIATIONS,
            }
            previous = candidates.get(number)
            if previous is not None and previous != candidate:
                raise IntakeError(f"PR #{number} changed during paginated intake")
            candidates[number] = candidate

    return sorted(
        candidates.values(),
        key=lambda item: (not item["firstTimeContributor"], item["number"]),
    )


def build_output(
    team_payload: Any,
    pr_payload: Any,
    static_protected_authors: set[str],
) -> dict[str, Any]:
    protected_logins = parse_team_members(team_payload) | static_protected_authors
    return {
        "schemaVersion": 1,
        "repository": TARGET_REPO,
        "generatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "pullRequests": parse_external_prs(pr_payload, protected_logins),
    }


def read_fixture(path: str) -> tuple[Any, Any]:
    try:
        if path == "-":
            fixture = json.load(sys.stdin)
        else:
            with Path(path).open(encoding="utf-8") as handle:
                fixture = json.load(handle)
    except (OSError, json.JSONDecodeError) as exc:
        raise IntakeError(f"cannot read fixture: {path}") from exc

    if not isinstance(fixture, dict):
        raise IntakeError("fixture must be a JSON object")
    if "teamPages" not in fixture or "pullRequestPages" not in fixture:
        raise IntakeError("fixture requires teamPages and pullRequestPages")
    return fixture["teamPages"], fixture["pullRequestPages"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="List open non-protected PRs in solana-foundation/solana-com."
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Write JSON to this path instead of stdout.",
    )
    parser.add_argument(
        "--fixture",
        metavar="PATH",
        help=argparse.SUPPRESS,
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        static_authors = load_static_protected_authors()
        if args.fixture:
            team_payload, pr_payload = read_fixture(args.fixture)
        else:
            # Resolve the protected team before requesting even minimal PR data.
            team_payload = fetch_team_payload()
            parse_team_members(team_payload)
            pr_payload = fetch_pr_payload()
        output = build_output(team_payload, pr_payload, static_authors)
    except IntakeError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    rendered = json.dumps(output, indent=2, sort_keys=False) + "\n"
    if args.output:
        try:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(rendered, encoding="utf-8")
        except OSError as exc:
            print(f"error: cannot write output: {exc}", file=sys.stderr)
            return 2
        print(
            f"wrote {len(output['pullRequests'])} external PR(s) to {args.output}",
            file=sys.stderr,
        )
    else:
        sys.stdout.write(rendered)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
