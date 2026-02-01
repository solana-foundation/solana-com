#!/usr/bin/env python3
"""
Script to generate LLMs.txt files for all locales.
Generates:
- llms.txt (English, curated index)
- llms-full.txt (English, inline content)
- llms-{locale}.txt for each configured locale
"""

import os
import re
from typing import Dict, List, Tuple

# Configuration
REPO_ROOT = os.path.dirname(os.path.abspath(__file__))
DOCS_DIR = os.path.join(REPO_ROOT, 'apps', 'docs', 'content', 'docs')
OUTPUT_DIR = os.path.join(REPO_ROOT, 'apps', 'web', 'public')

# All supported locales (from packages/i18n/src/config.ts)
LOCALES = [
    "en", "ar", "de", "el", "es", "fi", "fr", "hi", "id", "it",
    "ja", "ko", "nl", "pl", "pt", "ru", "tr", "uk", "vi", "zh"
]

# Language names for each locale
LANGUAGE_NAMES = {
    "en": "English",
    "zh": "汉语 (Chinese)",
    "ru": "Русский (Russian)",
    "es": "Español (Spanish)",
    "fr": "Français (French)",
    "id": "Bahasa Indonesia",
    "pt": "Português (Portuguese)",
    "vi": "Tiếng Việt (Vietnamese)",
    "de": "Deutsch (German)",
    "tr": "Türkçe (Turkish)",
    "ko": "한국어 (Korean)",
    "uk": "Українська (Ukrainian)",
    "ar": "العربية (Arabic)",
    "it": "Italiano (Italian)",
    "pl": "Polski (Polish)",
    "ja": "日本語 (Japanese)",
    "nl": "Nederlands (Dutch)",
    "el": "Ελληνικά (Greek)",
    "fi": "suomi (Finnish)",
    "hi": "हिन्दी (Hindi)",
}

# Curated sections for each locale (same structure, localized URLs)
CURATED_SECTIONS = {
    "Core Concepts": [
        ("Accounts", "docs/{locale}/core/accounts", "How Solana stores data in accounts"),
        ("Transactions", "docs/{locale}/core/transactions", "The fundamental building blocks for interacting with Solana"),
        ("Programs", "docs/{locale}/core/programs", "Smart contracts on Solana"),
        ("Program Derived Addresses", "docs/{locale}/core/pda", "Deterministic addresses for program-controlled accounts"),
        ("Cross Program Invocation", "docs/{locale}/core/cpi", "How programs invoke other programs"),
        ("Fees on Solana", "docs/{locale}/core/fees", "Transaction costs and priority fees"),
    ],
    "Getting Started": [
        ("Introduction", "docs/{locale}/intro", "Overview of Solana development"),
        ("Quick Start", "docs/{locale}/intro/quick-start", "Build your first Solana program"),
        ("Installation", "docs/{locale}/intro/installation", "Set up your local development environment"),
    ],
    "Tokens": [
        ("Token Basics", "docs/{locale}/tokens/basics", "SPL Token fundamentals"),
        ("Create Mint", "docs/{locale}/tokens/basics/create-mint", "Create new token mints"),
        ("Token Extensions", "docs/{locale}/tokens/extensions", "Token-2022 program features"),
    ],
    "RPC API": [
        ("HTTP Methods", "docs/{locale}/rpc/http", "JSON-RPC API reference"),
        ("WebSocket Methods", "docs/{locale}/rpc/websocket", "Real-time subscriptions"),
    ],
}

# Additional English-only sections
ENGLISH_EXTRAS = {
    "Cookbook": [
        ("Send SOL", "cookbook/transactions/send-sol", "Transfer SOL between accounts"),
        ("Create Account", "cookbook/accounts/create-account", "Create accounts on Solana"),
        ("Get Balance", "cookbook/accounts/get-account-balance", "Retrieve SOL balance"),
        ("Add Priority Fees", "cookbook/transactions/add-priority-fees", "Increase transaction priority"),
        ("Create Keypair", "cookbook/wallets/create-keypair", "Generate new keypairs"),
    ],
    "Program Development": [
        ("Developing Programs", "docs/en/programs", "Build on-chain programs"),
        ("Anchor Framework", "docs/en/programs/anchor", "High-level framework for Solana programs"),
        ("Testing Programs", "docs/en/programs/testing", "Test programs with bankrun and other tools"),
    ],
}


def generate_llms_txt(locale: str) -> str:
    """Generate llms.txt content for a specific locale."""
    base_url = "https://solana.com"
    lang_name = LANGUAGE_NAMES.get(locale, locale)
    
    # Header
    if locale == "en":
        lines = [
            "# Solana",
            "",
            "> Solana is the high-performance blockchain designed for mass adoption, capable of processing thousands of transactions per second with sub-second finality.",
            "",
            "This documentation provides comprehensive guides, references, and tutorials for developers building on Solana.",
            "",
        ]
    else:
        lines = [
            f"# Solana ({lang_name})",
            "",
            f"> Solana documentation in {lang_name}.",
            "",
            f"This is the {lang_name} version of the Solana developer documentation.",
            "",
        ]
    
    # Add curated sections
    for section_name, links in CURATED_SECTIONS.items():
        lines.append(f"## {section_name}")
        lines.append("")
        for title, path_template, description in links:
            path = path_template.format(locale=locale)
            url = f"{base_url}/{path}"
            lines.append(f"- [{title}]({url}): {description}")
        lines.append("")
    
    # Add English-only extras
    if locale == "en":
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


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Generate locale-specific files
    for locale in LOCALES:
        locale_dir = os.path.join(DOCS_DIR, locale)
        
        # Only generate if locale directory exists
        if not os.path.isdir(locale_dir):
            print(f"Skipping {locale} - directory not found")
            continue
        
        content = generate_llms_txt(locale)
        
        if locale == "en":
            # English goes to llms.txt (main file)
            output_path = os.path.join(OUTPUT_DIR, "llms.txt")
        else:
            # Other locales go to llms-{locale}.txt
            output_path = os.path.join(OUTPUT_DIR, f"llms-{locale}.txt")
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Generated: {output_path}")
    
    print(f"\nGenerated {len(LOCALES)} llms.txt files")


if __name__ == "__main__":
    main()
