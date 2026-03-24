---
name: refresh-agent-context
description:
  Audit this Turborepo for stale or missing agent-reference docs, then refresh
  repo and app-level `AGENTS.md` and related onboarding docs using the bundled
  workspace inventory script. Use when apps, packages, routes, ports, or shared
  tooling changed and the repo needs a fresh agent-oriented context pass.
---

# Refresh Agent Context

Use this skill to keep the repo understandable for coding agents as the
Turborepo evolves.

## Goal

Detect drift between the actual workspace structure and the agent-facing docs,
then update the smallest set of docs that restore a fast path into the correct
app or package.

Prefer updating these files, in this order:

1. root `AGENTS.md`
2. root `README.md`
3. app-level `apps/*/AGENTS.md`
4. package docs only when they materially help route ownership or shared-code
   discovery

## Quick Start

From the repo root, run:

```bash
node skills/refresh-agent-context/scripts/workspace_inventory.mjs
```

This prints a current inventory of:

- app and package workspaces
- package names
- dev ports inferred from `package.json`
- asset prefixes and `NEXT_PUBLIC_APP_NAME` inferred from `next.config.ts`
- whether `AGENTS.md`, `README.md`, and `CLAUDE.md` exist per app

## Workflow

### 1. Build the current repo inventory

Run the inventory script first. Treat its output as the baseline snapshot of the
current monorepo shape.

### 2. Audit doc coverage

Check for:

- missing root `AGENTS.md`
- apps missing `AGENTS.md`
- empty or stub-only `AGENTS.md`
- stale README entries for app names, ports, package names, or CMS/framework
  ownership
- missing references to important shared packages such as `packages/i18n`,
  `packages/ui-chrome`, or `packages/ecosystem-data`
- route ownership that is not obvious from the current docs

### 3. Patch the minimal doc set

Prefer concise guides that answer these questions quickly:

- which workspace owns the requested feature
- which commands validate only that workspace
- which config files define routing, asset prefixes, or cross-app navigation
- which shared packages are likely involved

Do not turn the docs into a full architecture book. Keep them as jump-start
guides.

### 4. Verify against source files

Before finalizing:

- verify package names from `package.json`
- verify ports from workspace scripts
- verify asset prefixes, rewrites, and `NEXT_PUBLIC_APP_NAME` from
  `next.config.ts`
- verify content ownership from the actual `content/`, `src/`, or package layout

### 5. Report the audit

Summarize:

- what was stale or missing
- what docs were updated
- what could not be verified automatically

## Output Standards

- keep docs short and operational
- prefer tables for workspace maps and bullets for gotchas
- preserve existing OpenSpec-managed blocks in app `AGENTS.md`
- do not duplicate long app docs when a short pointer is enough
- if no changes are needed, say so and include the audit findings

## Example Requests

- "Refresh the repo's agent docs after adding a new app"
- "Audit the Turborepo and update AGENTS.md files"
- "Rebuild agent context after changing ports and route ownership"
- "Run the periodic agent-reference refresh"
