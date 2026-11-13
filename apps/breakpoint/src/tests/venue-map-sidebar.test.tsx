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
