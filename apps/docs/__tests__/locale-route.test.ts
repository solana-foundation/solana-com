import { describe, expect, it, vi } from "vitest";

const navigation = vi.hoisted(() => ({
  redirect: vi.fn((to: string) => {
    throw new Error(`REDIRECT:${to}`);
  }),
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));
vi.mock("next/navigation", () => navigation);

import { GET } from "../src/app/[locale]/route";

const call = (locale: string) =>
  GET(new Request("https://solana-com-docs.vercel.app/x"), {
    params: Promise.resolve({ locale }),
  });

describe("docs locale index route", () => {
  it("redirects known locales to their docs index", async () => {
    await expect(call("de")).rejects.toThrow("REDIRECT:/de/docs");
    await expect(call("en")).rejects.toThrow("REDIRECT:/en/docs");
  });

  it("refuses to echo unknown segments into Location (no open redirect)", async () => {
    await expect(call("/evil.com")).rejects.toThrow("NOT_FOUND");
    await expect(call("evil.com")).rejects.toThrow("NOT_FOUND");
    expect(navigation.redirect).not.toHaveBeenCalledWith("//evil.com/docs");
  });
});
