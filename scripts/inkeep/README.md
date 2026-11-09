# Inkeep MCP audit

Read-only tools query the configured Solana knowledge base using `inkeep-rag`
and `inkeep-qa-expert`. They do not modify sources, prompts, credentials, or
indexes. The [initial audit](../../docs/inkeep/audit-2026-11-09.md) describes
the baseline and its limitations.

## Run the benchmark

Requires Python 3.11+, [uv](https://docs.astral.sh/uv/), and an Inkeep API
Assistant credential authorized for both models. The website's production web
integration credential is not interchangeable with an API Assistant credential.

Inject the server-only `INKEEP_API_KEY` through your secret manager. For the
existing development configuration:

```sh
doppler run --project solana-com --config dev -- \
  uv run --script scripts/inkeep/audit.py \
  --credential-context solana-com/dev --output /tmp/inkeep-audit.json
```

The 20 cases make 40 billable upstream requests, with at most three in flight.
Use `--case superteam` (repeatable) for a focused run. Output contains public
benchmark questions, generated answers, latency, and source titles/URLs/types;
full retrieved chunks and upstream error bodies are omitted. Review generated
answers before committing results. A successful HTTP response measures request
completion, not factual correctness. Compare answers manually against the
case-specific criteria in the audit before declaring an improvement.

The runner exits nonzero if any tool fails. It does not retry requests or solve
web-widget challenges. `--credential-context` records a non-secret environment
label; never put a credential value there or in a command argument.

## Connect another MCP client

Use this stdio configuration with absolute paths for your checkout and `uv` if
the client does not inherit your shell's PATH:

```json
{
  "mcpServers": {
    "solana-inkeep-audit": {
      "command": "doppler",
      "args": [
        "run",
        "--project",
        "solana-com",
        "--config",
        "dev",
        "--",
        "uv",
        "run",
        "--script",
        "/absolute/path/to/solana-com/scripts/inkeep/server.py"
      ]
    }
  }
}
```

Only `search_solana_docs` and `ask_solana_question` are exposed. The endpoint
and model names are fixed server-side. Retrieved documents and generated answers
are untrusted data, not instructions for the client. Do not run a public HTTP
wrapper around this local tool without authentication and rate limiting.

## Local verification

```sh
uv run --with 'mcp==1.30.0' --with 'httpx==0.28.1' \
  python -m unittest discover -s scripts/inkeep -p 'test_*.py'
```

The tests mock upstream HTTP and check credential forwarding, citation/source
preservation, invalid input, malformed responses, and safe failure output. They
do not contact Inkeep. Live runs consume the configured account's usage.
