# /// script
# requires-python = ">=3.11"
# dependencies = ["mcp==1.30.0", "httpx==0.28.1"]
# ///
"""Run the benchmark through MCP and write answers and source metadata as JSON."""

import argparse
import asyncio
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import sys
import time

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

ROOT = Path(__file__).resolve().parent
TOOLS = ("search_solana_docs", "ask_solana_question")


async def audit(output: Path, credential_context: str, case_ids: list[str]) -> bool:
    if not os.environ.get("INKEEP_API_KEY", "").strip():
        raise SystemExit("Set server-only INKEEP_API_KEY before running the audit.")
    benchmarks = json.loads((ROOT / "benchmark.json").read_text())
    if case_ids:
        available_ids = {case["id"] for case in benchmarks}
        if set(case_ids) - available_ids:
            raise SystemExit("Unknown benchmark case ID.")
        benchmarks = [case for case in benchmarks if case["id"] in case_ids]
    parameters = StdioServerParameters(
        command=sys.executable, args=[str(ROOT / "server.py")], env=dict(os.environ)
    )
    results = []
    async with stdio_client(parameters) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            available = {tool.name for tool in (await session.list_tools()).tools}
            if not set(TOOLS).issubset(available):
                raise RuntimeError("Required MCP tools are unavailable.")
            # Keep the order stable and bound concurrency to avoid flooding Inkeep.
            semaphore = asyncio.Semaphore(3)

            async def run(case: dict, tool: str) -> dict:
                async with semaphore:
                    started = time.monotonic()
                    try:
                        response = await session.call_tool(
                            tool, {"question": case["query"]}
                        )
                        data = response.structuredContent
                        if data is None:
                            data = json.loads(response.content[0].text)
                        if response.isError:
                            data = {"status": 0, "error": "mcp_tool_failed"}
                        # Persist URLs/titles rather than full retrieved documents.
                        if "sources" in data:
                            data["sources"] = [
                                {key: doc.get(key, "") for key in
                                 ("title", "url", "record_type")}
                                for doc in data["sources"]
                            ]
                    except Exception:
                        # Exception text can include provider response/request data.
                        data = {"status": 0, "error": "mcp_call_failed"}
                    return {
                        "id": case["id"], "query": case["query"], "tool": tool,
                        "seconds": round(time.monotonic() - started, 2), **data,
                    }

            results = await asyncio.gather(*(
                run(case, tool) for case in benchmarks for tool in TOOLS
            ))
    report = {
        "recorded_at": datetime.now(timezone.utc).isoformat(),
        "credential_context": credential_context,
        "transport": "MCP stdio",
        "models": ["inkeep-rag", "inkeep-qa-expert"],
        "results": results,
    }
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    successful = sum(r.get("status") == 200 and not r.get("error") for r in results)
    print(f"{successful}/{len(results)} requests succeeded. Results: {output}")
    return successful == len(results)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--credential-context", required=True,
                        help="Non-secret project/environment label for provenance")
    parser.add_argument("--case", action="append", default=[],
                        help="Run only this case ID; repeat for multiple cases")
    options = parser.parse_args()
    sys.exit(0 if asyncio.run(audit(options.output, options.credential_context,
                                  options.case)) else 1)
