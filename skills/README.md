# Repository skills

This directory contains repo-scoped skills for repeatable agent workflows in the
Solana.com monorepo. Skills capture project-specific procedures and guardrails
that do not belong in runtime application code.

Each skill lives in its own directory and has a `SKILL.md` file with its trigger
description and operating instructions. A skill may also include:

- `agents/` for skill-list metadata
- `references/` for detailed repository or domain guidance
- `scripts/` for deterministic workflow helpers
- `assets/` for files copied into generated output

Invoke a skill by name, for example `$localize-page`. Keep skills concise,
validate them with the standard skill validator, and update them when repository
conventions change.
