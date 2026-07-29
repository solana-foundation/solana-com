# Repository skills

This directory contains repo-scoped, agent-agnostic skills for repeatable
workflows in the Solana.com monorepo. Skills capture project-specific procedures
and guardrails that do not belong in runtime application code.

The portable interface follows the
[Agent Skills specification](https://agentskills.io/specification). Each skill
lives in its own directory and has a `SKILL.md` file with its trigger
description and operating instructions. A skill may also include:

- `references/` for detailed repository or domain guidance
- `scripts/` for deterministic workflow helpers
- `assets/` for files copied into generated output
- `agents/` for optional product-specific adapter metadata

The `SKILL.md` workflow must not depend on files under `agents/`. Compatible
agents can discover or register this directory using their normal skill
mechanism. Other agents can use the same workflow by reading the relevant
`SKILL.md` and its linked resources directly. Product-specific invocation
syntax, such as `$localize-page`, is optional.

Keep skills concise, validate them against the open specification, and update
them when repository conventions change.
