# Contributing Community Skills

This directory powers the community skill listings shown on `solana.com/skills`.

Because this repository is public, every submission must be treated as an
untrusted supply-chain input. Reviewers are not approving only marketing copy;
they are approving a link that users may later install or trust.

## Threat Model

The main risks for this workflow are:

- A submitter points to a mutable URL such as `tree/main`, a default branch, or
  a custom domain and later swaps the content after approval.
- A skill asks users or agents to run remote code, install from moving targets,
  or execute shell pipelines without review.
- A skill asks for high-value secrets such as private keys, seed phrases, or
  broad API credentials.
- A maintainer account or repository is later compromised and the skill content
  changes without a new review.
- A public PR adds a legitimate-looking link that is actually an affiliate,
  phishing, or credential-harvesting flow.

## Required Submission Rules

Every community skill submission must satisfy all of the following:

1. The URL must be immutable.
2. The skill must be published from a tagged release.
3. The tag must already exist before the PR is opened.
4. The PR must link the exact repository, tag, and commit SHA being reviewed.
5. The submitted skill path must resolve to the tagged content, not `main`,
   `master`, `develop`, `latest`, or an unversioned custom domain.

Accepted URL patterns:

- `https://github.com/<owner>/<repo>/tree/<tag>/<path>`
- `https://github.com/<owner>/<repo>/blob/<tag>/<path>`
- A GitHub release asset URL tied to a specific tag

Rejected URL patterns:

- `https://github.com/<owner>/<repo>`
- `https://github.com/<owner>/<repo>/tree/main/...`
- `https://raw.githubusercontent.com/<owner>/<repo>/main/...`
- Any URL using `latest`, a moving branch, or a mutable redirect
- Any custom-domain markdown URL unless Solana reviewers control the mirrored
  artifact and can verify a checksum

## Required PR Metadata

Each submission PR should include:

- Repository URL
- Exact tag name
- Exact commit SHA for that tag
- Skill path inside the repository
- Maintainer handle or team name
- Security contact or responsible maintainer
- Short description of what the skill can execute, install, or configure
- List of required secrets, if any
- Confirmation that no seed phrase or raw private key is ever requested

If a submitter cannot provide this metadata, reject the submission.

## Reviewer Checklist

Reviewers should verify all of the following before merging:

1. Provenance
   - The repository owner appears to be the real project, team, or maintainer.
   - The repository has normal project signals: history, issues, docs, and not
     just a fresh drop with no context.
   - Prefer org-owned repositories over personal accounts.

2. Immutability
   - The submitted URL is pinned to a tag.
   - The tag resolves to the commit SHA stated in the PR.
   - Prefer signed tags or signed releases when available.
   - If the repository has releases, prefer the release URL over a branch URL.

3. Executable surface
   - Search the submitted files for `curl | sh`, `wget | sh`, `bash <(curl`,
     `npx ...@latest`, `git clone`, or installs from GitHub branches.
   - Reject skills that rely on remote bootstrap scripts unless the exact script
     is separately reviewed and pinned.
   - Reject install flows that depend on `latest` tags or mutable package
     versions.

4. Secret handling
   - Reject any skill that asks for a seed phrase or raw wallet secret.
   - Strongly prefer wallet adapters, delegated auth, or scoped API keys.
   - If an API key is needed, the docs must say what scopes are required and how
     to rotate it.

5. Dependency and script review
   - Inspect package manifests for lifecycle scripts such as `postinstall`,
     `prepare`, or opaque install wrappers.
   - Prefer pinned dependency versions for installer tooling.
   - Reject repos that fetch additional code from mutable URLs during install.

6. Safety of examples
   - Command examples should not send transactions by default.
   - Dangerous examples must be labeled clearly and require explicit user
     action.
   - Mainnet examples should be separated from localnet or devnet examples.

7. Public repo hygiene
   - Require CODEOWNERS or a clear maintainer list when possible.
   - Prefer repos with branch protection and mandatory review for release tags.
   - Reject submissions that are obviously abandoned unless there is a strong
     reason to list them.

## Additional Rules For Public-Repo Security

- Do not merge direct edits to `communitySkills.ts` without human review.
- Treat link-only changes as security-sensitive changes.
- Require at least one reviewer to open the tagged files and inspect them.
- Record the review date and tag in the PR description or merge comment.
- If a listed skill publishes a new version, require a fresh review instead of
  silently updating an existing URL.
- If a repository is renamed, transferred, deleted, or force-pushed in a way
  that breaks provenance, remove the listing until it is re-reviewed.

## Ongoing Maintenance

Listed skills should be rechecked periodically for:

- Repository takeover or ownership transfer
- Security advisories on installer dependencies
- New tags that replace the originally listed tag
- Broken links, deleted tags, or rewritten history
- Documentation drift that starts requesting new secrets or permissions

## Strong Recommendations

These are not hard requirements, but they materially improve safety:

- Mirror approved skill files into a Solana-controlled snapshot repository.
- Store the reviewed commit SHA alongside the listing data.
- Add CI that rejects URLs pointing at moving branches or custom domains.
- Add CI that flags risky strings such as `curl | sh`, `@latest`, `postinstall`,
  `PRIVATE_KEY`, `mnemonic`, and `seed phrase`.
- Prefer one repository per skill instead of many skills hanging off one mutable
  monorepo branch.

## Rejection Criteria

Reject the submission if any of these are true:

- The URL is mutable.
- The content is hosted only on a custom domain.
- The repository has no tag for the submitted version.
- The installer or docs execute remote code from an unpinned source.
- The skill requests a seed phrase, raw private key, or broad production
  credentials.
- The reviewer cannot determine who actually maintains the skill.

## Minimal Submission Example

Use a pinned URL of this shape:

```text
https://github.com/example-org/example-skill/tree/v1.2.3/skill
```

In the PR, include:

```text
Repo: https://github.com/example-org/example-skill
Tag: v1.2.3
Commit: 0123456789abcdef0123456789abcdef01234567
Path: skill
Maintainer: @example-org/devrel
Secrets required: EXAMPLE_API_KEY (read-only)
Install behavior: no remote bootstrap scripts, no postinstall hooks
```
