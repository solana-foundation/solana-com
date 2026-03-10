## ADDED Requirements

### Requirement: Keystatic GitHub storage targets staging branch

Keystatic SHALL be configured in GitHub storage mode with the repository `solana-foundation/solana-com`, path prefix `apps/media`, and the target branch set to `staging`. The `branchPrefix` configuration SHALL be removed so edits commit directly to `staging` rather than creating feature branches.

#### Scenario: Editor saves a post

- **WHEN** an authenticated editor saves a post in the Keystatic admin UI
- **THEN** Keystatic commits the changes directly to the `staging` branch on GitHub

#### Scenario: Editor creates a new draft post

- **WHEN** an authenticated editor creates a new post with status "draft"
- **THEN** the post is saved as a commit to the `staging` branch on GitHub

### Requirement: Deploy key authentication for Git operations

Keystatic SHALL authenticate Git operations (reads and writes) to GitHub using a token provided via the `KEYSTATIC_GITHUB_TOKEN` environment variable. This token corresponds to a deploy key with write access configured at `solana-foundation/solana-com`. GitHub OAuth SHALL NOT be used for Git operations.

#### Scenario: Keystatic pushes content via deploy key

- **WHEN** Keystatic commits content changes to GitHub
- **THEN** the Git operation authenticates using `KEYSTATIC_GITHUB_TOKEN` (not GitHub OAuth)

#### Scenario: Deploy key has write access

- **WHEN** the deploy key is configured in GitHub repository settings
- **THEN** it SHALL have write access enabled to allow pushing commits

### Requirement: Continuous edit persistence

Keystatic SHALL push changes to the `staging` branch each time an editor saves content. Edits are persisted on an ongoing basis, not batched.

#### Scenario: Multiple saves by an editor

- **WHEN** an editor saves content multiple times during an editing session
- **THEN** each save results in a separate commit pushed to the `staging` branch

### Requirement: Vercel staging branch deployment

Vercel SHALL be configured to deploy the `staging` branch of the repository. The staging deployment provides a live preview URL where draft content can be reviewed.

#### Scenario: Content pushed to staging branch

- **WHEN** a commit is pushed to the `staging` branch
- **THEN** Vercel automatically builds and deploys the updated content to a staging preview URL

#### Scenario: Staging preview shows draft content

- **WHEN** a reviewer visits the Vercel staging deployment URL
- **THEN** they see the latest content including draft posts saved by editors

### Requirement: Local development fallback

When `KEYSTATIC_GITHUB_TOKEN` is not set (or `KEYSTATIC_LOCAL=true`), Keystatic SHALL fall back to local filesystem storage mode. This preserves the existing local development experience.

#### Scenario: Local development without token

- **WHEN** `KEYSTATIC_GITHUB_TOKEN` is not set
- **THEN** Keystatic uses local filesystem storage and does not attempt GitHub operations

#### Scenario: Explicit local mode

- **WHEN** `KEYSTATIC_LOCAL=true` is set
- **THEN** Keystatic uses local filesystem storage regardless of other GitHub env vars
