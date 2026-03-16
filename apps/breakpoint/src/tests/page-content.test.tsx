import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import enMessages from "../../public/locales/en/common.json";
import { BreakpointPage } from "@/components/BreakpointPage";
import { buildBreakpointPageContent } from "@/content/page";

describe("BreakpointPage", () => {
  it("renders the core brochure sections", () => {
    render(
      <BreakpointPage
        content={buildBreakpointPageContent(enMessages.breakpoint)}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Breakpoint 2026" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /highest-signal annual gathering/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /stronger global center of gravity/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute(
      "href",
      "#cta",
    );
  });

  it("renders same-page section anchors for brochure navigation", () => {
    render(
      <BreakpointPage
        content={buildBreakpointPageContent(enMessages.breakpoint)}
      />,
    );

    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
      "href",
      "#overview",
    );
    expect(screen.getByRole("link", { name: "Video" })).toHaveAttribute(
      "href",
      "#video",
    );
  });
});
