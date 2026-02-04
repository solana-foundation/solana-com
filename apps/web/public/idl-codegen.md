# IDLs + client generation (Codama / Shank / Kinobi)

## Goal
Never hand-maintain multiple program clients by manually re-implementing serializers.
Prefer an IDL-driven, code-generated workflow.

## Codama (preferred)
- Use Codama as the "single program description format" to generate:
 - TypeScript clients (including Kit-friendly output)
 - Rust clients (when available/needed)
 - documentation artifacts

## Anchor → Codama
If the program is Anchor:
1) Produce Anchor IDL from the build
2) Convert Anchor IDL to Codama nodes (nodes-from-anchor)
3) Render a Kit-native TypeScript client (codama renderers)

## Native Rust → Shank → Codama
If the program is native:
1) Use Shank macros to extract a Shank IDL from annotated Rust
2) Convert Shank IDL to Codama
3) Generate clients via Codama renderers

## Repository structure recommendation
- `programs/ /` (program source)
- `idl/.json` (Anchor/Shank IDL)
- `codama/.json` (Codama IDL)
- `clients/ts/ /` (generated TS client)
- `clients/rust/ /` (generated Rust client)

## Generation guardrails
- Codegen outputs should be checked into git if:
 - you need deterministic builds
 - you want users to consume the client without running codegen
- Otherwise, keep codegen in CI and publish artifacts.

## "Do not do this"
- Do not write IDLs by hand unless you have no alternative.
- Do not hand-write Borsh layouts for programs you own; use the IDL/codegen pipeline.
