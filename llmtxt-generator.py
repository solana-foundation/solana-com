#!/usr/bin/env python3
"""
Script to generate LLMs.txt source files.
Generates:
- llms.txt (English, curated index)
- llms-en.txt (source file for Lingo translations)
"""

import os
import re

# Configuration
REPO_ROOT = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(REPO_ROOT, 'apps', 'web', 'public')

# AI agent resources section (English only, static URLs)
AI_AGENT_RESOURCES = [
    ("SKILL.md", "SKILL.md", "Comprehensive guide for AI agents to understand and build on Solana"),
    ("Full Documentation", "llms-full.txt", "Complete inline documentation with code examples and API reference"),
]

# Curated sections for the English source file
CURATED_SECTIONS = {
    "Core Concepts": [
        ("Accounts", "docs/core/accounts", "How Solana stores data in accounts"),
        ("Transactions", "docs/core/transactions", "The fundamental building blocks for interacting with Solana"),
        ("Programs", "docs/core/programs", "Smart contracts on Solana"),
        ("Program Derived Addresses", "docs/core/pda", "Deterministic addresses for program-controlled accounts"),
        ("Cross Program Invocation", "docs/core/cpi", "How programs invoke other programs"),
        ("Fees on Solana", "docs/core/fees", "Transaction costs and priority fees"),
    ],
    "Getting Started": [
        ("Introduction", "docs/intro", "Overview of Solana development"),
        ("Quick Start", "docs/intro/quick-start", "Build your first Solana program"),
        ("Installation", "docs/intro/installation", "Set up your local development environment"),
    ],
    "Tokens": [
        ("Token Basics", "docs/tokens/basics", "SPL Token fundamentals"),
        ("Create Mint", "docs/tokens/basics/create-mint", "Create new token mints"),
        ("Token Extensions", "docs/tokens/extensions", "Token-2022 program features"),
    ],
    "Frontend": [
        ("@solana/client", "docs/frontend/client", "Headless client runtime for Solana frontends"),
        ("@solana/react-hooks", "docs/frontend/react-hooks", "React hooks and provider for Solana apps"),
        ("Next.js + Solana React Hooks", "docs/frontend/nextjs-solana", "Set up wallet integration in Next.js"),
        ("@solana/web3-compat", "docs/frontend/web3-compat", "Compatibility layer for legacy web3.js apps"),
    ],
    "Client SDKs": [
        ("JavaScript/TypeScript SDK", "docs/clients/official/javascript", "Official TypeScript SDK for Solana"),
        ("Rust SDK", "docs/clients/official/rust", "Official Rust crates for Solana"),
        ("Python SDK", "docs/clients/community/python", "Community-maintained Python client"),
        ("Solana Gaming SDKs", "docs/clients/community/game-sdks", "Community SDKs for Solana game development"),
    ],
    "References": [
        ("RPC Endpoints", "docs/references/clusters", "Network clusters, public RPC endpoints, and rate limits"),
        ("Staking", "docs/references/staking", "Staking concepts and stake account details"),
        ("Terminology", "docs/references/terminology", "Glossary of Solana terms and definitions"),
    ],
    "RPC API": [
        ("HTTP Methods", "docs/rpc/http", "JSON-RPC API reference"),
        ("WebSocket Methods", "docs/rpc/websocket", "Real-time subscriptions"),
    ],
    "Payments": [
        ("Payments Overview", "docs/payments", "Build payment systems with instant settlement"),
        ("How Payments Work", "docs/payments/how-payments-work", "Core concepts for Solana payments"),
        ("Send Payments", "docs/payments/send-payments", "Send stablecoin payments with memos and batching"),
        ("Accept Payments", "docs/payments/accept-payments", "Integrate checkout and payment acceptance"),
        ("Production Readiness", "docs/payments/production-readiness", "Prepare payment systems for mainnet"),
    ],
}

# Additional English-only sections
ENGLISH_EXTRAS = {
    "Cookbook": [
        ("Send SOL", "developers/cookbook/transactions/send-sol", "Transfer SOL between accounts"),
        ("Create Account", "developers/cookbook/accounts/create-account", "Create accounts on Solana"),
        ("Get Balance", "developers/cookbook/accounts/get-account-balance", "Retrieve SOL balance"),
        ("Add Priority Fees", "developers/cookbook/transactions/add-priority-fees", "Increase transaction priority"),
        ("Create Keypair", "developers/cookbook/wallets/create-keypair", "Generate new keypairs"),
    ],
    "Guides": [
        ("AI Tools on Solana", "developers/guides/getstarted/intro-to-ai", "Overview of AI tools and workflows on Solana"),
        ("Introduction to x402", "developers/guides/getstarted/intro-to-x402", "Build a simple HTTP 402 payment flow"),
        ("Build an x402 Facilitator", "developers/guides/getstarted/build-a-x402-facilitator", "End-to-end x402 facilitator demo"),
        ("Actions and Blinks", "developers/guides/advanced/actions", "Build Solana Actions APIs and shareable blinks"),
        ("Game Development Quickstart", "developers/guides/games/getting-started-with-game-development", "Get started building games on Solana"),
    ],
    "Program Development": [
        ("Developing Programs", "docs/programs", "Build on-chain programs"),
        ("Anchor Framework", "docs/programs/anchor", "High-level framework for Solana programs"),
        ("Testing Programs", "docs/programs/testing", "Test programs with bankrun and other tools"),
    ],
}

def normalize_llms_urls(content: str) -> str:
    content = re.sub(
        r"https://solana\.com/docs/en(?=/|$)",
        "https://solana.com/docs",
        content,
    )
    content = re.sub(
        r"https://solana\.com/docs/([a-z]{2})(?=/)",
        r"https://solana.com/\1/docs",
        content,
    )
    content = re.sub(
        r"https://solana\.com/cookbook(?=/|$)",
        "https://solana.com/developers/cookbook",
        content,
    )
    return content


def generate_llms_txt() -> str:
    """Generate llms.txt content for the English source file."""
    base_url = "https://solana.com"
    lines = [
        "# Solana",
        "",
        "> Solana is the high-performance blockchain designed for mass adoption, capable of processing thousands of transactions per second with sub-second finality.",
        "",
        "This documentation provides comprehensive guides, references, and tutorials for developers building on Solana.",
        "",
        "## AI Agent Resources",
        "",
    ]
    # Add AI agent resources
    for title, path, description in AI_AGENT_RESOURCES:
        url = f"{base_url}/{path}"
        lines.append(f"- [{title}]({url}): {description}")
    lines.append("")
    
    # Add curated sections
    for section_name, links in CURATED_SECTIONS.items():
        lines.append(f"## {section_name}")
        lines.append("")
        for title, path, description in links:
            url = f"{base_url}/{path}"
            lines.append(f"- [{title}]({url}): {description}")
        lines.append("")
    
    # Add English-only extras
    for section_name, links in ENGLISH_EXTRAS.items():
        lines.append(f"## {section_name}")
        lines.append("")
        for title, path, description in links:
            url = f"{base_url}/{path}"
            lines.append(f"- [{title}]({url}): {description}")
        lines.append("")
    
    # Add optional resources section
    lines.append("## Optional")
    lines.append("")
    lines.append("- [Solana StackExchange](https://solana.stackexchange.com): Community Q&A")
    lines.append("- [Validator Setup](https://docs.anza.xyz/operations/setup-a-validator): Run a validator node")
    lines.append("")
    
    return "\n".join(lines)


def write_output(filename: str, content: str) -> str:
    output_path = os.path.join(OUTPUT_DIR, filename)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)
    return output_path


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    content = normalize_llms_urls(generate_llms_txt())

    for filename in ("llms-en.txt", "llms.txt"):
        output_path = write_output(filename, content)
        print(f"Generated: {output_path}")

    print("\nTranslations are handled by Lingo via .github/workflows/i18n.yml")


if __name__ == "__main__":
    main()
