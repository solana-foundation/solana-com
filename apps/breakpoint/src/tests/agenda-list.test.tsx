import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import AgendaList from "@/components/pages/agenda/AgendaList";
import { attachSpeakerProfiles } from "@/content/agenda/speaker-links";
import type { AgendaItem } from "@/content/agenda/types";
import messages from "../../../../packages/i18n/messages/breakpoint/en/breakpoint.json";

function renderList(list: AgendaItem[]) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <AgendaList items={list} />
    </NextIntlClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const items: AgendaItem[] = [
  {
    assetClasses: ["Money"],
    day: "Day 1",
    description: "How MoneyGram connects cash to digital assets.",
    duration: "10 min",
    format: "Keynote",
    id: "moneygram",
    location: "Main Stage",
    sortOrder: 635,
    speakerIds: ["recSoohoo"],
    speakers: [
      {
        company: "MoneyGram",
        id: "recSoohoo",
        name: "Anthony Soohoo",
        title: "CEO",
      },
    ],
    tag: "Keynote",
    time: "10:35",
    title: "MoneyGram Ramps",
  },
  {
    assetClasses: ["Credit & Collateral"],
    day: "Day 1",
    duration: "20 min",
    format: "Panel",
    id: "private-markets",
    location: "Main Stage",
    sortOrder: 745,
    speakers: [
      { company: "Apollo", name: "Christine Moy", title: "Partner" },
      {
        company: "Y Combinator",
        isModerator: true,
        name: "Nemil Dalal",
        title: "Visiting Partner",
      },
    ],
    tag: "Panel",
    time: "12:25",
    title: "Unlocking Private Markets",
  },
  {
    day: "Day 1",
    duration: "1hr",
    id: "lunch",
    location: "Main Stage",
    sortOrder: 780,
    speakers: [],
    time: "13:00",
    title: "Lunch",
    variant: "static",
  },
  {
    assetClasses: [],
    day: "Day 1",
    duration: "15 min",
    format: "Keynote",
    id: "consumer",
    location: "Royal Exchange",
    sortOrder: 780,
    speakers: [{ company: "Collector Crypt", name: "Jane Doe", title: "CEO" }],
    tag: "Keynote",
    time: "13:00",
    title: "Collector Crypt",
    track: "Consumer",
  },
  {
    assetClasses: ["Intelligence"],
    day: "Day 2",
    duration: "20 min",
    format: "Panel",
    id: "machine-economy",
    location: "Main Stage",
    sortOrder: 667,
    speakers: [
      { company: "Grayscale", name: "Krista Lynch", title: "Head of Trading" },
    ],
    tag: "Panel",
    time: "11:07",
    title: "The Machine Economy",
  },
];

function titles() {
  return screen
    .queryAllByRole("heading", { level: 2 })
    .map((heading) => heading.textContent);
}

describe("AgendaList", () => {
  it.each(["session", "static"] as const)(
    "shows pre-event registration as a %s regardless of the selected stage",
    (variant) => {
      renderList([
        ...items,
        {
          day: "Pre-Event",
          id: "registration",
          location: "Registration Area",
          sortOrder: 600,
          speakers: [],
          time: "10:00",
          title: "Early Registration",
          variant,
        },
      ]);

      expect(
        screen.queryByRole("tab", { name: "Registration Area" }),
      ).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("tab", { name: /Royal Exchange/ }));
      fireEvent.click(screen.getByRole("tab", { name: /Pre-Event/ }));

      expect(titles()).toEqual(["Early Registration"]);
      expect(screen.getByText("Registration Area")).toBeInTheDocument();
      expect(
        screen.queryByRole("tab", { name: /Main Stage/ }),
      ).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole("tab", { name: /Day 1/ }));
      expect(titles()).toEqual(["Collector Crypt"]);
      expect(
        screen.getByRole("tab", { name: /Royal Exchange/ }),
      ).toHaveAttribute("aria-selected", "true");
    },
  );

  it("shows Day 1 Main Stage with speaker roles, asset pills and breaks", () => {
    renderList(items);

    expect(titles()).toEqual([
      "MoneyGram Ramps",
      "Unlocking Private Markets",
      "Lunch",
    ]);
    expect(screen.getByText("Anthony Soohoo")).toBeInTheDocument();
    expect(screen.getByText("CEO, MoneyGram")).toBeInTheDocument();
    expect(screen.getByText("Moderator ·")).toBeInTheDocument();
    expect(
      [...document.querySelectorAll("[data-agenda-asset-class]")].map(
        (pill) => pill.textContent,
      ),
    ).toEqual(["Money", "Credit & Collateral"]);
    // Format lives in the expanded view, not on the collapsed card.
    expect(screen.queryByText("Keynote")).not.toBeInTheDocument();
  });

  it("switches stages and days without mixing sessions", () => {
    renderList(items);
    expect(
      screen.getByRole("tab", { name: "Main Stage Ground floor" }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("tab", { name: "Royal Exchange First floor" }),
    ).toHaveAttribute("aria-selected", "false");

    fireEvent.click(screen.getByRole("tab", { name: /Royal Exchange/ }));
    expect(titles()).toEqual(["Collector Crypt"]);

    fireEvent.click(screen.getByRole("tab", { name: /Day 2/ }));
    expect(titles()).toEqual([]);
    expect(
      screen.getByText("Day 2 sessions on the Royal Exchange are coming soon."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /Main Stage/ }));
    expect(titles()).toEqual(["The Machine Economy"]);
  });

  it("searches every day and stage at once and groups results by day", () => {
    renderList(items);
    const search = screen.getByLabelText("Search");

    fireEvent.change(search, { target: { value: "soohoo" } });
    expect(titles()).toEqual(["MoneyGram Ramps"]);
    expect(
      screen.getByText("1 session matches across all days and stages."),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Day 1/ })).toBeDisabled();

    // Descriptions count, not just titles and speakers.
    fireEvent.change(search, { target: { value: "cash" } });
    expect(titles()).toEqual(["MoneyGram Ramps"]);

    // Other stages and days are included without touching the tabs.
    fireEvent.change(search, { target: { value: "collector" } });
    expect(titles()).toEqual(["Collector Crypt"]);
    fireEvent.change(search, { target: { value: "intelligence" } });
    expect(titles()).toEqual(["The Machine Economy"]);
    expect(screen.getByText(/Day 2 · .*17 Nov/)).toBeInTheDocument();
    // Breaks are not search results.
    fireEvent.change(search, { target: { value: "lunch" } });
    expect(titles()).toEqual([]);
    expect(
      screen.getByText("No sessions match “lunch” on any day or stage."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(search).toHaveValue("");
    expect(titles()).toEqual([
      "MoneyGram Ramps",
      "Unlocking Private Markets",
      "Lunch",
    ]);
    expect(screen.getByRole("tab", { name: /Day 1/ })).toBeEnabled();
  });

  it("shows a Royal Exchange track pill that searches that track", () => {
    renderList(items);
    fireEvent.click(screen.getByRole("tab", { name: /Royal Exchange/ }));
    expect(titles()).toEqual(["Collector Crypt"]);

    const pill = screen.getByRole("button", {
      name: "Search Consumer Track sessions",
    });
    expect(pill).toHaveTextContent("Consumer Track");
    // Searches the raw track so a translated pill label still matches.
    fireEvent.click(pill);
    expect(screen.getByLabelText("Search")).toHaveValue("Consumer");
    expect(titles()).toEqual(["Collector Crypt"]);
  });

  it("searches an asset class when its pill is clicked", () => {
    renderList(items);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Search Credit & Collateral sessions",
      }),
    );
    expect(screen.getByLabelText("Search")).toHaveValue("Credit & Collateral");
    expect(titles()).toEqual(["Unlocking Private Markets"]);
    expect(
      screen.queryByRole("button", {
        name: "Expand Unlocking Private Markets",
      }),
    ).not.toBeNull();
  });

  it("expands a session to show its format, description and X links", () => {
    const withProfiles = attachSpeakerProfiles(items, [
      {
        company: "MoneyGram",
        id: "recSoohoo",
        name: "Anthony Soohoo",
        slug: "anthony-soohoo",
        sortOrder: 0,
        xUrl: "https://x.com/soohoo",
      },
    ]);
    renderList(withProfiles);

    expect(
      screen.queryByRole("link", { name: "Anthony Soohoo on X" }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Expand MoneyGram Ramps" }),
    );
    expect(screen.getByText("Keynote")).toBeInTheDocument();
    expect(
      screen.getByText("How MoneyGram connects cash to digital assets."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Anthony Soohoo on X" }),
    ).toHaveAttribute("href", "https://x.com/soohoo");

    fireEvent.click(
      screen.getByRole("button", { name: "Collapse MoneyGram Ramps" }),
    );
    expect(screen.queryByText("Keynote")).not.toBeInTheDocument();
  });

  it("moves between tabs with the arrow keys and keeps one tab focusable", () => {
    renderList(items);

    const day1 = screen.getByRole("tab", { name: /Day 1/ });
    const day2 = screen.getByRole("tab", { name: /Day 2/ });
    expect(day1).toHaveAttribute("tabindex", "0");
    expect(day2).toHaveAttribute("tabindex", "-1");

    day1.focus();
    fireEvent.keyDown(day1, { key: "ArrowRight" });
    expect(titles()).toEqual(["The Machine Economy"]);
    expect(screen.getByRole("tab", { name: /Day 2/ })).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("tab", { name: /Day 2/ }), {
      key: "Home",
    });
    expect(titles()).toEqual([
      "MoneyGram Ramps",
      "Unlocking Private Markets",
      "Lunch",
    ]);

    const main = screen.getByRole("tab", { name: /Main Stage/ });
    main.focus();
    fireEvent.keyDown(main, { key: "ArrowLeft" });
    expect(titles()).toEqual(["Collector Crypt"]);
    expect(screen.getByRole("tab", { name: /Royal Exchange/ })).toHaveFocus();
  });
});
