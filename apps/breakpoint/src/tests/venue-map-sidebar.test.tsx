import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import MapSidebar from "@/components/venue/MapSidebar";
import { AMENITY_ICONS, VENUE_MAP } from "@/content/venue/map-data";
import type { AmenityType, MapSelection } from "@/content/venue/types";
import messages from "../../../../packages/i18n/messages/breakpoint/en/breakpoint.json";

const venue = messages.breakpoint.venue;
const amenityLabels = Object.fromEntries(
  Object.keys(AMENITY_ICONS).map((type) => [
    type,
    venue.amenities[type as AmenityType],
  ]),
) as Record<AmenityType, string>;

afterEach(cleanup);

function renderSidebar(selection: MapSelection | null = null) {
  const onSelect = vi.fn();
  const onFloorChange = vi.fn();
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <MapSidebar
        activeFloor={VENUE_MAP.floors[0]!}
        amenityLabels={amenityLabels}
        data={VENUE_MAP}
        floorLabels={{ ground: "Ground floor", first: "First floor" }}
        onFloorChange={onFloorChange}
        onSelect={onSelect}
        selection={selection}
      />
    </NextIntlClientProvider>,
  );
  return { onSelect, onFloorChange };
}

describe("standalone venue map sidebar", () => {
  it("selects a search result on another floor without a live schedule provider", () => {
    const { onSelect, onFloorChange } = renderSidebar();
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Royal Exchange" },
    });
    fireEvent.click(screen.getByRole("option", { name: /Royal Exchange/ }));
    expect(onFloorChange).toHaveBeenCalledWith("first");
    expect(onSelect).toHaveBeenCalledWith({
      kind: "zone",
      id: "royal-exchange",
    });
    expect(screen.getByRole("combobox")).toHaveValue("");
  });

  it("moves through results with arrows, selects with Enter, and dismisses with Escape", () => {
    const { onSelect, onFloorChange } = renderSidebar();
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "food" } });
    const options = screen.getAllByRole("option");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", options[0]!.id);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute("aria-activedescendant", options[1]!.id);
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith({ kind: "zone", id: "the-kernel" });
    expect(onFloorChange).toHaveBeenCalledWith("first");
    expect(input).toHaveValue("");
    fireEvent.change(input, { target: { value: "merch" } });
    expect(input).not.toHaveAttribute("aria-activedescendant");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    const last = screen.getAllByRole("option").at(-1)!;
    expect(input).toHaveAttribute("aria-activedescendant", last.id);
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-expanded", "false");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("shows stage details without links to an absent live agenda", () => {
    renderSidebar({ kind: "zone", id: "main-stage" });
    expect(
      screen.getByRole("heading", { name: "Main Stage" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /today.s sessions/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "All locations" }),
    ).toBeInTheDocument();
  });
});
