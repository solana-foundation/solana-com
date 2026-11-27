import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Tabs } from "@/components/shared/tabs";

function NestedTabs() {
  return (
    <Tabs
      label="Jobs"
      items={[
        {
          name: "Pay",
          content: (
            <Tabs
              label="Agents"
              items={[
                { name: "Claude", content: <p>pay claude</p> },
                { name: "Codex", content: <p id="codex">pay codex</p> },
              ]}
            />
          ),
        },
        { name: "Build", content: <p>build</p> },
      ]}
    />
  );
}

describe("shared Tabs hash selection", () => {
  afterEach(() => window.history.replaceState(null, "", "/"));

  it("selects the inner panel without moving the outer tabs", () => {
    window.history.replaceState(null, "", "/agents#codex");
    render(<NestedTabs />);

    expect(screen.getByRole("tab", { name: "Pay" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Codex" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("pay codex")).toBeVisible();
  });
});
