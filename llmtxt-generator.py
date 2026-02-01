#!/usr/bin/env python3
"""
Script to generate LLMs.txt files for all locales.
Generates:
- llms.txt (English, curated index)
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
    "RPC API": [
        ("HTTP Methods", "docs/rpc/http", "JSON-RPC API reference"),
        ("WebSocket Methods", "docs/rpc/websocket", "Real-time subscriptions"),
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
    "Program Development": [
        ("Developing Programs", "docs/programs", "Build on-chain programs"),
        ("Anchor Framework", "docs/programs/anchor", "High-level framework for Solana programs"),
        ("Testing Programs", "docs/programs/testing", "Test programs with bankrun and other tools"),
    ],
}


def with_locale_prefix(locale: str, path: str) -> str:
    """Prefix non-default locales for Next Intl routes."""
    if locale == "en":
        return path
    return f"{locale}/{path}"

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
            path = with_locale_prefix(locale, path_template)
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
        
        if locale == "en":
            # English goes to llms.txt (main file)
            output_path = os.path.join(OUTPUT_DIR, "llms.txt")
            content = generate_llms_txt(locale)
        else:
            # Other locales go to llms-{locale}.txt
            output_path = os.path.join(OUTPUT_DIR, f"llms-{locale}.txt")
            if os.path.isfile(output_path):
                with open(output_path, "r", encoding="utf-8") as f:
                    content = f.read()
            else:
                content = generate_llms_txt(locale)

        content = normalize_llms_urls(content)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Generated: {output_path}")
    
    print(f"\nGenerated {len(LOCALES)} llms.txt files")


if __name__ == "__main__":
    main()
