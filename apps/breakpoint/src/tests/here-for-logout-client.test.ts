import { afterEach, expect, it, vi } from "vitest";
import { signOutOfX } from "@/components/pages/here-for/client";

afterEach(() => vi.unstubAllGlobals());

it("only reports successful sign-out after the server confirms it", async () => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  fetch.mockResolvedValueOnce({ ok: true });
  expect(await signOutOfX()).toBe(true);
  fetch.mockResolvedValueOnce({ ok: false, status: 503 });
  expect(await signOutOfX()).toBe(false);
  fetch.mockRejectedValueOnce(new Error("Network unavailable"));
  expect(await signOutOfX()).toBe(false);
});
