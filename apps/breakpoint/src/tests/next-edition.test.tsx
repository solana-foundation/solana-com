import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import NextEditionSection from "@/components/sections/NextEditionSection";
import { resolveConferenceState } from "@/content/conference-state";
import { BP27_UPDATES_FORM_ID } from "@/content/links";
import {
  isNextEditionVisible,
  NEXT_EDITION,
  type NextEditionAnnouncement,
} from "@/content/next-edition";
import { formatEventDateRange } from "@/lib/event-dates";
import messages from "../../../../packages/i18n/messages/breakpoint/en/breakpoint.json";

const unpublished: NextEditionAnnouncement = {
  ...NEXT_EDITION,
  published: false,
  city: null,
  venue: null,
  region: null,
  startDate: null,
  endDate: null,
  videoId: null,
  thumbnail: null,
  signupArtwork: null,
  signupFormId: null,
};

const confirmed: NextEditionAnnouncement = {
  ...unpublished,
  city: "Sample City",
  venue: "Sample Venue",
  region: "Sample Region",
  startDate: "2027-11-15",
  endDate: "2027-11-17",
  videoId: "sample-video",
  signupFormId: "form-123",
};

function byRevealedText(tagName: string, pattern: RegExp) {
  return (_: string, element: Element | null) =>
    element?.tagName === tagName &&
    pattern.test((element.textContent ?? "").replace(/\s+/g, " "));
}

function renderSection(announcement: NextEditionAnnouncement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <NextEditionSection announcement={announcement} />
    </NextIntlClientProvider>,
  );
}

describe("isNextEditionVisible", () => {
  it("always renders a published announcement", () => {
    expect(
      isNextEditionVisible(
        undefined,
        { ...unpublished, published: true },
        true,
      ),
    ).toBe(true);
  });

  it("never previews an unpublished announcement in production", () => {
    expect(isNextEditionVisible({ preview: "bp27" }, unpublished, true)).toBe(
      false,
    );
  });

  it("previews an unpublished announcement outside production on request", () => {
    expect(isNextEditionVisible(undefined, unpublished, false)).toBe(false);
    expect(isNextEditionVisible({ preview: "other" }, unpublished, false)).toBe(
      false,
    );
    expect(isNextEditionVisible({ preview: "bp27" }, unpublished, false)).toBe(
      true,
    );
    expect(
      isNextEditionVisible({ preview: ["x", "bp27"] }, unpublished, false),
    ).toBe(true);
  });

  it("combines with the live-edition preview on the same query", () => {
    const params = { preview: ["live", "bp27"] };
    expect(isNextEditionVisible(params, unpublished, false)).toBe(true);
    expect(resolveConferenceState(params, { production: false })).toBe("live");
  });
});

describe("formatEventDateRange", () => {
  it("formats a day-first range for English", () => {
    const formatted = formatEventDateRange("en", "2027-11-15", "2027-11-17");
    expect(formatted?.replace(/\s/g, " ")).toMatch(
      /^15\s?–\s?17 November 2027$/,
    );
  });

  it("returns null without a start date and handles a single day", () => {
    expect(formatEventDateRange("en", null, "2027-11-17")).toBeNull();
    expect(formatEventDateRange("en", "2027-11-15", null)).toBe(
      "15 November 2027",
    );
  });
});

describe("NextEditionSection", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("omits unconfirmed facts instead of showing placeholders", () => {
    renderSection(unpublished);

    expect(
      screen.getByRole("heading", { level: 2, name: "Solana BP27 is coming" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Dates")).not.toBeInTheDocument();
    expect(screen.queryByText("Venue")).not.toBeInTheDocument();
    expect(screen.queryByText(/Play video/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        level: 2,
        name: "Sign up for updates and early registration for Breakpoint 2027",
      }),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
  });

  it("ships the stand-in sizzle and posts signups to the BP27 list form", () => {
    renderSection(NEXT_EDITION);

    fireEvent.click(screen.getByRole("button", { name: /^Play video$/ }));
    expect(screen.getByTitle(/Breakpoint 2027 announcement/)).toHaveAttribute(
      "src",
      expect.stringContaining("youtube.com/embed/Mys5RoZPWMg"),
    );
    expect(NEXT_EDITION.signupFormId).toBe(BP27_UPDATES_FORM_ID);
    expect(BP27_UPDATES_FORM_ID).toBe("a85fd8f3-c4f1-4771-ac3e-03851ac82add");
  });

  it("renders confirmed details and the announcement video", () => {
    renderSection(confirmed);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Solana BP27 is coming to Sample City",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(byRevealedText("DD", /15 ?– ?17 November 2027/)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        byRevealedText("DD", /^Sample Venue ?Sample City, Sample Region$/),
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Play video" }));
    expect(screen.getByTitle("Breakpoint 2027 announcement")).toHaveAttribute(
      "src",
      expect.stringContaining("youtube.com/embed/sample-video"),
    );
  });

  it("posts signups to the configured Iterable form", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({ ok: true } as Response);

    renderSection(confirmed);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "builder@example.com" },
    });
    fireEvent.submit(screen.getByLabelText("Email").closest("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=form-123",
        expect.objectContaining({ method: "POST" }),
      );
    });
    expect(await screen.findByText("You’re on the list.")).toBeInTheDocument();
  });
});
