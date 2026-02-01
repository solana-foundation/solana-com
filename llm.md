# SKILL: Solana.com LLM/Agentic Audit and Optimization (Feb 2026)

## Intent

Audit this monorepo and implement best practices for LLM-friendly content,
agent-ready web surfaces, and machine-consumable documentation. Optimize for
clarity, accuracy, and ease of retrieval without degrading the human UX.

## Scope

- Apps: `apps/web`, `apps/docs`, `apps/media`, `apps/templates`
- Shared packages: `packages/*` (especially UI, i18n, and any docs tooling)
- Public assets and site roots (`/public`, `robots.txt`, `sitemap.xml`)

## Research Summary (Feb 2026)

Use these practices and constraints. Do not invent new standards.

- `llms.txt` spec: `/llms.txt` is a Markdown index with H1, summary blockquote,
  optional sections, and curated links. Key pages should also provide clean
  `.md` versions at the same URL with `.md` appended. Source:
  https://llmstxt.org/
- `llms-full.txt`: an expanded single-file version with inline content. Useful
  for IDE/RAG workflows but may exceed context windows. Source:
  https://langchain-ai.github.io/langgraph/llms-txt-overview/
- OpenAI crawlers: `OAI-SearchBot` (search results), `GPTBot` (training), and
  `ChatGPT-User` (user-initiated fetch). Control via `robots.txt`. Source:
  https://platform.openai.com/docs/bots
- Anthropic crawlers: `ClaudeBot` (training), `Claude-User` (user-initiated),
  `Claude-SearchBot` (search). Supports `Crawl-delay` and respects `robots.txt`.
  Source:
  https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- MCP standard: expose tools/resources/prompts via strict schemas; least
  privilege, stateless tools, explicit side effects. Source:
  https://modelcontextprotocol.io/docs/sdk and
  https://mcp-best-practice.github.io/mcp-best-practice/best-practice/
- GEO content guidance: answer-first structure, clear headings and lists,
  structured data, and E-E-A-T signals improve LLM citation quality. Source:
  https://moz.com/blog/generative-engine-optimization

## Success Criteria

- Agents can answer core Solana questions without heavy navigation.
- Markdown variants are available for docs and key content.
- AI crawler policy is explicit and aligned with product goals.
- LLM-facing documentation is curated, accurate, and versioned.

## Execution Plan

### 1. Audit and Inventory

- Inventory existing `llms.txt`, `robots.txt`, `sitemap.xml`, and doc pipelines.
- Locate canonical content sources for docs, RPC, SDKs, and marketing.
- Identify duplicate or conflicting content and define a single source of truth.
- Check existing scripts (e.g., `llmtxt-generator.py`) for reuse or upgrades.

### 2. LLM Documentation Surfaces

- Implement `/public/llms.txt` in the llmstxt.org format:
  - H1 title + summary blockquote.
  - Curated sections (Docs, RPC, SDKs, Tutorials, Core Concepts, Marketing).
  - One-line descriptions for every link.
- Implement `/public/llms-full.txt` (English only) with inline content.
  - Keep under ~100k tokens and prioritize code examples.
  - Include Core Concepts, RPC, Cookbook, and key SDK snippets.
- Split translations into `/public/llms-{locale}.txt`.
- Optionally generate `/public/llms-ctx.txt` and `/public/llms-ctx-full.txt` via
  `llms_txt2ctx` for IDE/RAG workflows.
- Remove UTM params from the files; add tracking only at serve time.

### 3. Serve Markdown Variants

- For docs and media routes, serve raw Markdown at `*.md` URLs.
- For directory-style URLs, serve `index.html.md` as per spec.
- Add content negotiation where feasible (`Accept: text/markdown`).
- Ensure markdown output is stable and includes only essential frontmatter.

### 4. Robots and AI Crawler Policy

- Update `robots.txt` to be explicit about AI bots:
  - Decide allow/disallow for `OAI-SearchBot` vs `GPTBot`.
  - Decide allow/disallow for `Claude-SearchBot` vs `ClaudeBot`.
  - Allow user-initiated bots unless policy prohibits them.
  - Add `Crawl-delay` for training bots if needed.
- Document the policy rationale in `LLM_AUDIT.md`.

### 5. Content and GEO Improvements

- Rewrite key pages to be answer-first and scannable:
  - Direct definitions, bullet lists, tables, and short paragraphs.
  - Avoid placing critical info only in images or videos.
- Add E-E-A-T signals: author, last-updated, citations, references.
- Add or improve JSON-LD for Article, FAQ, HowTo, Organization, Product, and
  Breadcrumb where applicable.
- Normalize naming and terminology across docs and marketing.

### 6. Agentic Interfaces

- Ensure public APIs have OpenAPI 3.1 specs with stable schemas.
- Provide an MCP server (or MCP resources) for:
  - Docs, RPC methods, SDK reference, release notes.
  - Search and retrieval tools with strict schemas.
- Follow MCP best practices: least privilege, read-only by default, clear
  side-effect disclosures, and explicit errors.

### 7. Validation

- Use `curl` to verify `/llms.txt`, `/llms-full.txt`, and `.md` routes.
- Confirm markdown output is complete and script-free.
- Run a minimal LLM QA set (5-10 prompts) for correctness.
- Validate `robots.txt` behavior for OpenAI and Anthropic bots.

## Output Requirements

- Update or create:
  - `/public/llms.txt`
  - `/public/llms-full.txt`
  - `/public/llms-{locale}.txt`
  - Markdown route handlers for docs/media
  - `robots.txt` policy updates
  - (Optional) MCP server under `packages/`
- Produce `LLM_AUDIT.md` with findings, changes, and follow-ups.
- Provide a short test plan in the final response.

## Sources (Feb 2026)

- https://llmstxt.org/
- https://langchain-ai.github.io/langgraph/llms-txt-overview/
- https://platform.openai.com/docs/bots
- https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- https://modelcontextprotocol.io/docs/sdk
- https://mcp-best-practice.github.io/mcp-best-practice/best-practice/
- https://moz.com/blog/generative-engine-optimization
