import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import CommunitySocial from "@/components/community/CommunitySocial";
import messages from "../../../../../packages/i18n/messages/web/en/common.json";

vi.mock("@workspace/i18n/use-router", () => ({
  useRouter: () => ({ locale: "en" }),
}));

function renderSocials(meetup?: number) {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <CommunitySocial data={{ meetup }} />
    </NextIntlClientProvider>,
  );
  return screen.getByRole("link", { name: /Meetup/ });
}

describe("CommunitySocial Meetup count", () => {
  it("renders the retrieved count with the existing label and number formatting", () => {
    const card = renderSocials(10431);
    expect(card).toHaveAttribute(
      "href",
      "https://www.meetup.com/topics/solana/",
    );
    expect(card).toHaveTextContent("10,431 members");
  });

  it("renders a genuine zero", () => {
    expect(renderSocials(0)).toHaveTextContent("0 members");
  });

  it("does not invent a count when no successful result is available", () => {
    const card = renderSocials();
    expect(within(card).getByText("Meetup")).toBeVisible();
    expect(card).not.toHaveTextContent("8,656");
    expect(card).not.toHaveTextContent("0 members");
    expect(screen.getByRole("link", { name: /Telegram/ })).toHaveTextContent(
      "70,463 members",
    );
    expect(screen.getByRole("link", { name: /Email/ })).toHaveTextContent(
      "hello@solana.com",
    );
  });
});
