import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { createTranslator } from "next-intl";
import messages from "../../../../packages/i18n/messages/breakpoint/en/breakpoint.json";
import FindMutuals from "@/components/pages/here-for/FindMutuals";

const mocks = vi.hoisted(() => ({ share: vi.fn() }));
vi.mock("@workspace/i18n/client", () => ({
  useTranslations: () =>
    createTranslator({
      locale: "en",
      messages,
      namespace: "breakpoint.hereFor",
    }),
}));
vi.mock("@workspace/i18n/routing", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/components/Button", () => ({
  default: ({ label, onClick }: { label: string; onClick?: () => void }) => (
    <button onClick={onClick}>{label}</button>
  ),
}));
vi.mock("@/components/pages/here-for/client", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("@/components/pages/here-for/client")
  >()),
  openXIntent: mocks.share,
  useMe: () => [
    {
      status: "ready",
      data: {
        handle: "@alice",
        adds: ["@person000000000"],
        mutuals: Array.from(
          { length: 10 },
          (_, i) => `@person${String(i).padStart(9, "0")}`,
        ),
        suggestions: Array.from({ length: 3 }, (_, i) => ({
          handle: `@others${String(i).padStart(9, "0")}`,
          claimed: false,
          reasons: [],
          score: 1,
        })),
      },
    },
  ],
}));

afterEach(cleanup);

it("keeps a ten-mutual share within a normal X post while displaying every mutual", () => {
  render(<FindMutuals locale="en" />);
  fireEvent.click(screen.getByRole("button", { name: "Post your mutuals" }));
  const [text, url] = mocks.share.mock.calls[0]!;
  expect(text).toContain("+7 more");
  expect(text).toContain("Who do you want to meet?");
  // X counts a shared URL as 23 characters, plus its separating space.
  expect(text.length + 24).toBeLessThanOrEqual(280);
  expect(url).toContain("card=mutuals");
  expect(
    screen.getByRole("link", { name: /person000000009/ }),
  ).toBeInTheDocument();
});
