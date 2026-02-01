# LLM/Agentic Audit Report

**Date**: February 2026  
**Repository**: solana-com (Solana Foundation website monorepo)

---

## Executive Summary

This audit optimized the Solana.com monorepo for LLM/agentic consumption
following current best practices (Feb 2026). The primary focus areas were:

1. **LLM Content Surfaces** - llms.txt files for machine-readable documentation
2. **AI Crawler Policies** - Explicit robots.txt rules for AI bots
3. **Agentic Interfaces** - OpenAPI/MCP evaluation (deferred)

---

## Inventory of LLM Surfaces

### Files Created/Updated

| File                                 | Purpose                                    | Status     |
| ------------------------------------ | ------------------------------------------ | ---------- |
| `/apps/web/public/llms.txt`          | English curated index (llmstxt.org spec)   | ✅ Created |
| `/apps/web/public/llms-full.txt`     | Comprehensive inline content (~20k tokens) | ✅ Created |
| `/apps/web/public/llms-{locale}.txt` | Localized versions (19 locales)            | ✅ Created |
| `/apps/web/public/robots.txt`        | AI bot policies                            | ✅ Updated |
| `/apps/docs/public/robots.txt`       | AI bot policies                            | ✅ Updated |
| `/llmtxt-generator.py`               | Automated generation script                | ✅ Updated |

### llms.txt Specification Compliance

The `/llms.txt` file follows the [llmstxt.org](https://llmstxt.org/)
specification:

- **H1 Header**: `# Solana`
- **Blockquote Summary**: Description of Solana's purpose
- **Curated Sections**: Core Concepts, Getting Started, Tokens, RPC API,
  Cookbook, Program Development
- **No UTM Parameters**: Clean URLs for LLM consumption
- **English Only**: Main file is English; locale variants available as
  `llms-{locale}.txt`

### Generated Locale Files

```
llms-ar.txt  llms-es.txt  llms-id.txt  llms-ko.txt  llms-pl.txt  llms-tr.txt  llms-zh.txt
llms-de.txt  llms-fi.txt  llms-it.txt  llms-nl.txt  llms-pt.txt  llms-uk.txt
llms-el.txt  llms-fr.txt  llms-ja.txt  llms-ru.txt  llms-vi.txt
```

---

## robots.txt AI Bot Policies

### User-Initiated Search Bots (Allowed)

| Bot               | Provider   | Purpose                  |
| ----------------- | ---------- | ------------------------ |
| OAI-SearchBot     | OpenAI     | ChatGPT browsing feature |
| ChatGPT-User      | OpenAI     | Direct ChatGPT queries   |
| Claude-SearchBot  | Anthropic  | Claude search feature    |
| Claude-User       | Anthropic  | Direct Claude queries    |
| PerplexityBot     | Perplexity | AI search engine         |
| Applebot-Extended | Apple      | Apple Intelligence       |

### Training Data Bots (Allowed)

| Bot             | Provider     | Purpose                  |
| --------------- | ------------ | ------------------------ |
| GPTBot          | OpenAI       | Training data collection |
| ClaudeBot       | Anthropic    | Training data collection |
| anthropic-ai    | Anthropic    | General AI access        |
| Google-Extended | Google       | Gemini training          |
| Bytespider      | ByteDance    | AI training              |
| CCBot           | Common Crawl | Research dataset         |

**Rationale**: As public developer documentation, allowing AI training improves
Solana's representation in AI assistants and helps developers get accurate
answers about Solana.

---

## Deferred Items

### 1. Raw Markdown at \*.md URLs

**Status**: Implemented  
**Current State**: Docs and media apps serve raw markdown at `*.md` and
`index.html.md` URLs via middleware rewrites to `/api/md/...` with
`Content-Type: text/markdown`.

**Notes**:

- Directory-style URLs map to `index.html.md` when a corresponding page exists.
- Missing content returns a 404 from the API route.

### 2. GEO/LLM Content Improvements

**Status**: Deferred  
**Rationale**: Answer-first structure and E-E-A-T signals require content
editing across multiple pages. This is a content strategy task rather than a
technical implementation.

**Recommendation**:

- Create content guidelines for GEO optimization
- Apply to high-priority pages (landing pages, core concepts)
- Add JSON-LD structured data for key entities

### 3. OpenAPI 3.1 Specifications

**Status**: Deferred  
**Rationale**: The Solana RPC API is already documented in the `/docs/rpc/`
section. Creating a formal OpenAPI spec requires:

- Mapping all RPC methods to OpenAPI operations
- Defining request/response schemas
- Maintaining sync with upstream Solana client changes

**Recommendation**: Consider generating OpenAPI spec from the existing RPC
documentation MDX files.

### 4. MCP Tools/Resources

**Status**: Deferred  
**Rationale**: Model Context Protocol (MCP) integration requires:

- Server implementation for docs/RPC resources
- Authentication and rate limiting considerations
- Least-privilege access model design

**Recommendation**: Evaluate MCP server implementation as a separate project.
Potential resources:

- `docs://` - Read-only access to documentation
- `rpc://` - Proxied RPC calls with rate limiting
- `examples://` - Code snippets from cookbook

---

## Validation Steps

### 1. llms.txt Verification

```bash
# Verify llms.txt exists and is accessible
curl -s https://solana.com/llms.txt | head -20

# Verify no UTM parameters
grep -c "utm_" apps/web/public/llms.txt  # Should return 0

# Verify llms-full.txt exists
ls -la apps/web/public/llms-full.txt
```

### 2. robots.txt Verification

```bash
# Check for AI bot rules
grep -E "(GPTBot|ClaudeBot|OAI-SearchBot|Claude-SearchBot)" apps/web/public/robots.txt
```

### 3. Locale File Verification

```bash
# Count locale files
ls apps/web/public/llms-*.txt | wc -l  # Should be 19 (excluding English)
```

---

## LLM QA Prompts and Results

The following prompts can be used to test LLM understanding of Solana after
consuming the llms.txt content:

### Prompt 1: Core Concept Understanding

**Q**: "What is a Program Derived Address (PDA) in Solana and how is it
different from a regular account address?"

**Expected Answer**: A PDA is a deterministically derived address using a
program ID and optional seeds. Unlike regular addresses, PDAs have no
corresponding private key and can only be signed by their owning program.
They're used for program-controlled accounts and provide a way to create
hashmap-like structures on-chain.

### Prompt 2: Transaction Structure

**Q**: "What are the main components of a Solana transaction?"

**Expected Answer**: A Solana transaction consists of:

1. Signatures array - One signature per required signer
2. Message containing:
   - Header (number of signers, read-only accounts)
   - Account keys array
   - Recent blockhash (expires after ~1 minute)
   - Instructions array Maximum transaction size is 1232 bytes.

### Prompt 3: Fee Structure

**Q**: "How do transaction fees work on Solana?"

**Expected Answer**: Transaction fees have two components:

1. Base fee: 5000 lamports per signature (50% burned, 50% to validator)
2. Priority fee: Optional fee based on compute unit price × compute unit limit
   Priority fees help transactions get processed faster during network
   congestion.

### Prompt 4: CPI Explanation

**Q**: "What is a Cross Program Invocation (CPI) and what are its limitations?"

**Expected Answer**: CPI allows one program to invoke instructions on another
program. Key aspects:

- Programs can sign for PDAs derived from their program ID
- Signer privileges extend from caller to callee
- Maximum invocation depth is 4 (stack height starts at 1)
- Account permissions propagate through the call chain

### Prompt 5: Account Ownership

**Q**: "How does account ownership work in Solana?"

**Expected Answer**: Every account has an owner program specified in its `owner`
field. Only the owner program can:

- Modify the account's data
- Deduct lamports from the account The System Program creates new accounts and
  can transfer ownership to other programs.

### Prompt 6: Token Operations

**Q**: "What's the difference between the SPL Token program and Token-2022?"

**Expected Answer**:

- SPL Token (`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`): Original token
  program with basic mint, transfer, burn operations
- Token-2022 (`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`): Extended version
  with additional features like transfer fees, interest-bearing tokens,
  confidential transfers, and metadata extensions

### Prompt 7: RPC Usage

**Q**: "How do you check if a Solana transaction was confirmed?"

**Expected Answer**: Use the `getSignatureStatuses` RPC method with the
transaction signature. The response includes confirmation status (processed,
confirmed, finalized) and any error information. For reliable confirmation, wait
for "finalized" status.

### Prompt 8: Development Setup

**Q**: "What tools do I need to start developing on Solana?"

**Expected Answer**: Essential tools:

1. Solana CLI - For deploying and interacting with programs
2. Rust toolchain - For writing on-chain programs
3. Anchor Framework (optional) - High-level framework reducing boilerplate
4. @solana/kit or @solana/web3.js - TypeScript/JavaScript SDK
5. Local test validator - For development testing

---

## Follow-up Recommendations

1. **Automated llms.txt Updates**: The GitHub Action
   (`.github/workflows/generate-llms-txt.yml`) runs weekly. Consider triggering
   on documentation changes.

2. **Token Count Monitoring**: Monitor llms-full.txt size to ensure it stays
   under ~100k tokens for effective LLM consumption.

3. **AI Bot Analytics**: Track AI bot traffic in analytics to measure adoption
   of LLM-friendly content.

4. **Content Quality**: Regularly review and update curated content in llms.txt
   to reflect the most important documentation.

5. **MCP Implementation**: Evaluate implementing an MCP server for programmatic
   documentation access.

---

## References

- [llmstxt.org Specification](https://llmstxt.org/)
- [OpenAI Crawler Documentation](https://platform.openai.com/docs/bots)
- [Anthropic Crawler Documentation](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Generative Engine Optimization (Moz)](https://moz.com/blog/generative-engine-optimization)
