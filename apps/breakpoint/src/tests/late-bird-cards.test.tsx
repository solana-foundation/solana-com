import { act, cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import TicketsSection from "@/components/sections/TicketsSection";
import TicketsGrid, {
  type RegistrationTicket,
} from "@/components/pages/registration/RegistrationTicketsGrid";
import { GENERAL_ADMISSION_HREF } from "@/content/links";
import { LATE_BIRD_START_AT } from "@/content/ticket-pricing";
import messages from "../../../../packages/i18n/messages/breakpoint/en/breakpoint.json";

const initialNow = LATE_BIRD_START_AT - 2000;

function renderWithMessages(component: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  );
}

describe("Late Bird ticket cards", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("switches the homepage checkout card when the page stays open", () => {
    vi.useFakeTimers();
    vi.setSystemTime(initialNow);
    renderWithMessages(<TicketsSection initialNow={initialNow} />);

    expect(
      screen.getByRole("link", { name: "General Admission" }),
    ).toHaveAttribute("href", GENERAL_ADMISSION_HREF);
    expect(screen.getByRole("article", { name: "Late Bird" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    act(() => vi.advanceTimersByTime(2000));

    const lateBird = screen.getByRole("link", { name: "Late Bird" });
    expect(lateBird).toHaveAttribute("href", GENERAL_ADMISSION_HREF);
    expect(lateBird).toHaveTextContent("$800");
    expect(
      screen.queryByRole("link", { name: "General Admission" }),
    ).not.toBeInTheDocument();
  });

  it("switches the registration card when the page stays open", () => {
    const tickets: RegistrationTicket[] = [
      {
        id: "general",
        title: "General Admission",
        description: "General admission",
        ctaLabel: "Get tickets",
        price: "$450",
        priceAfterIncrease: "$550",
        href: GENERAL_ADMISSION_HREF,
        tone: "featured",
      },
      {
        id: "lateBird",
        title: "Late Bird",
        description: "Final pricing",
        ctaLabel: "Coming soon",
        price: "$800",
        tone: "disabled",
      },
    ];

    vi.useFakeTimers();
    vi.setSystemTime(initialNow);
    renderWithMessages(
      <TicketsGrid
        generalCtaLabel="Get tickets"
        initialNow={initialNow}
        tickets={tickets}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "General Admission" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Late Bird" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Coming soon" }),
    ).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(2000));

    expect(
      screen.queryByRole("heading", { name: "General Admission" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Late Bird" }).closest("article"),
    ).toHaveTextContent("$800");
    expect(screen.getByRole("link", { name: "Get tickets" })).toHaveAttribute(
      "href",
      GENERAL_ADMISSION_HREF,
    );
  });
});
