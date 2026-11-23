import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import NextEditionBar from "@/components/sections/NextEditionBar";
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

function renderBar(announcement: NextEditionAnnouncement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <NextEditionBar announcement={announcement} />
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

    const reversed = { preview: ["bp27", "pre"] };
    expect(isNextEditionVisible(reversed, unpublished, false)).toBe(true);
    expect(resolveConferenceState(reversed, { production: false })).toBe("pre");
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

describe("NextEditionBar", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("omits unconfirmed facts instead of showing placeholders", () => {
    renderBar(unpublished);

    expect(screen.getByText("Solana BP27 is coming")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
  });

  it("plays the BP27 announcement video and posts signups to the BP27 list form", () => {
    renderBar(NEXT_EDITION);

    fireEvent.click(
      screen.getByRole("button", { name: /Watch and get updates/ }),
    );
    expect(screen.getByTitle("Breakpoint 2027 announcement")).toHaveAttribute(
      "src",
      expect.stringContaining("youtube.com/embed/jzxX5B_Ddiw"),
    );
    expect(NEXT_EDITION.signupFormId).toBe(BP27_UPDATES_FORM_ID);
    expect(BP27_UPDATES_FORM_ID).toBe("a85fd8f3-c4f1-4771-ac3e-03851ac82add");
  });

  it("is one button that opens the video and signup dialog", () => {
    renderBar(confirmed);

    const bar = screen.getByRole("button");
    expect(bar).toHaveTextContent("Solana BP27 is coming to Sample City");
    expect(bar.textContent?.replace(/\s+/g, " ")).toMatch(
      /15 ?– ?17 November 2027 · Sample Venue · Sample City, Sample Region/,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(bar);

    const dialog = screen.getByRole("dialog", {
      name: "Solana BP27 is coming to Sample City",
    });
    const video = screen.getByTitle("Breakpoint 2027 announcement");
    const email = screen.getByLabelText("Email");
    expect(video).toHaveAttribute(
      "src",
      expect.stringContaining("youtube.com/embed/sample-video"),
    );
    // The video sits above the signup.
    expect(
      video.compareDocumentPosition(email) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Get updates" })).toHaveAttribute(
      "type",
      "submit",
    );
    expect(
      screen.getByRole("link", { name: /Register for BP27/ }),
    ).toHaveAttribute("href", "https://luma.com/solana-breakpoint-2027");
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(dialog).not.toBeInTheDocument();
    expect(bar).toHaveFocus();
  });

  it("closes on a backdrop click but not on a click inside the dialog", () => {
    renderBar(confirmed);
    fireEvent.click(screen.getByRole("button"));

    fireEvent.click(screen.getByLabelText("Email"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("labels the bar for what the dialog holds", () => {
    renderBar({ ...confirmed, signupFormId: null });
    fireEvent.click(
      screen.getByRole("button", { name: /Watch the announcement/ }),
    );
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    cleanup();

    renderBar({ ...confirmed, videoId: null });
    fireEvent.click(screen.getByRole("button", { name: /Get updates/ }));
    expect(
      screen.queryByTitle("Breakpoint 2027 announcement"),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("posts signups to the configured Iterable form", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({ ok: true } as Response);

    renderBar(confirmed);
    fireEvent.click(screen.getByRole("button"));

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
