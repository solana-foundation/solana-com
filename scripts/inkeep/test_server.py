"""Verify the audit bridge's authentication boundary and failure handling."""

import json
import os
import unittest
from unittest.mock import patch

import httpx

import server


class ServerTests(unittest.IsolatedAsyncioTestCase):
    async def call(self, model, handler):
        client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
        with patch.dict(os.environ, {"INKEEP_API_KEY": "test-only-key"}), \
             patch.object(server.httpx, "AsyncClient", return_value=client):
            return await server.query(model, "Where are the docs?")

    async def test_rag_authenticates_to_fixed_endpoint_and_keeps_sources(self):
        documents = [{"url": "https://solana.com/docs", "source": {"data": "docs"}}]

        def handle(request):
            self.assertEqual(str(request.url),
                             "https://api.inkeep.com/v1/chat/completions")
            self.assertEqual(request.headers["authorization"], "Bearer test-only-key")
            self.assertEqual(json.loads(request.content)["model"], "inkeep-rag")
            return httpx.Response(200, json={"choices": [{"message": {
                "content": json.dumps({"content": documents})}}]})

        self.assertEqual(await self.call("inkeep-rag", handle),
                         {"status": 200, "sources": documents})

    async def test_qa_preserves_citations(self):
        answer = "Read [the docs](https://solana.com/docs)."
        result = await self.call("inkeep-qa-expert", lambda _: httpx.Response(
            200, json={"choices": [{"message": {"content": answer}}]}))
        self.assertEqual(result, {"status": 200, "answer": answer})

    async def test_error_body_is_never_returned(self):
        result = await self.call("inkeep-rag", lambda _: httpx.Response(
            403, text="provider diagnostic containing test-only-key"))
        self.assertEqual(result, {"status": 403, "error": "upstream_request_failed"})

    async def test_malformed_success_is_reported_as_failure(self):
        result = await self.call("inkeep-rag", lambda _: httpx.Response(200, json={}))
        self.assertEqual(result, {"status": 0, "error": "invalid_upstream_response"})

    async def test_missing_key_and_invalid_question_do_not_call_upstream(self):
        with patch.dict(os.environ, {"INKEEP_API_KEY": ""}), \
             patch.object(server.httpx, "AsyncClient") as client:
            self.assertEqual(await server.query("inkeep-rag", "docs"),
                             {"status": 0, "error": "missing_configuration"})
            client.assert_not_called()
        with patch.dict(os.environ, {"INKEEP_API_KEY": "test-only-key"}), \
             patch.object(server.httpx, "AsyncClient") as client:
            self.assertEqual(await server.query("inkeep-rag", " " * 2001),
                             {"status": 0, "error": "invalid_question"})
            client.assert_not_called()


if __name__ == "__main__":
    unittest.main()
