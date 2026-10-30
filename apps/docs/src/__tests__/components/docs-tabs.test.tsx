import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CodeGroup,
  Tab,
  Tabs,
  Warning,
} from "@/components/docs/docs-components";

vi.mock("@/lib/docs/ask-ai", () => ({ openAskAi: vi.fn() }));

/** A highlighted fence as the MDX pipeline hands it to the components. */
function fence(title: string, lines: number, expandable = true) {
  return (
    <pre
      className="shiki"
      title={title}
      data-language="ts"
      data-expandable={expandable ? "true" : undefined}
    >
      <code>
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className="line">
            {`${title} line ${i + 1}`}
          </span>
        ))}
      </code>
    </pre>
  );
}

function selected() {
  return screen
    .getAllByRole("tab")
    .filter((t) => t.getAttribute("aria-selected") === "true")
    .map((t) => t.textContent);
}

describe("code group expansion", () => {
  it("expands and collapses each grouped panel on its own", () => {
    const { container } = render(
      <CodeGroup>
        {fence("One", 20)}
        {fence("Two", 12)}
      </CodeGroup>,
    );
    const panels = container.querySelectorAll(".code-group-panel");
    const button = screen.getByRole("button", { name: "See all 20 lines" });
    expect(button.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(button);
    expect(panels[0].hasAttribute("data-expanded")).toBe(true);
    expect(panels[1].hasAttribute("data-expanded")).toBe(false);
    expect(button.textContent).toBe("Collapse");
    expect(button.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(button);
    expect(panels[0].hasAttribute("data-expanded")).toBe(false);
    expect(button.textContent).toBe("See all 20 lines");
  });
});

describe("code group notices", () => {
  it("shows a non-code child at the top of the next fence's panel", () => {
    const { container } = render(
      <CodeGroup>
        {fence("Kit", 2, false)}
        <Warning>No longer maintained</Warning>
        {fence("Web3.js (legacy)", 2, false)}
      </CodeGroup>,
    );
    expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual([
      "Kit",
      "Web3.js (legacy)",
    ]);
    const panels = container.querySelectorAll(".code-group-panel");
    expect(panels).toHaveLength(2);
    expect(panels[0].querySelector(".callout")).toBeNull();
    const callout = panels[1].querySelector(".callout");
    expect(callout?.textContent).toBe("No longer maintained");
    // Above the code; copying still takes only the code.
    expect(
      callout!.compareDocumentPosition(panels[1].querySelector("pre")!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    // `.code-block-root` is `height: 100%`. Under a notice it sits in a
    // wrapper of its own, so it is as tall as the code, not as the whole
    // panel (which would push its bottom past the panels' clip edge).
    // Panels without a notice keep it as their direct child.
    const root = (panel: Element) =>
      panel.querySelector('[data-component-part="code-block-root"]')!;
    expect(root(panels[0]).parentElement).toBe(panels[0]);
    const wrapper = root(panels[1]).parentElement!;
    expect(wrapper).not.toBe(panels[1]);
    expect(wrapper.parentElement).toBe(panels[1]);
    expect(wrapper.getAttribute("class")).toBeNull();
    expect(wrapper.getAttribute("style")).toBeNull();
  });
});

describe("tab keyboard navigation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("moves selection and focus with arrows, Home and End in <Tabs>", () => {
    render(
      <Tabs>
        <Tab title="Alpha">a</Tab>
        <Tab title="Beta">b</Tab>
        <Tab title="Gamma">c</Tab>
      </Tabs>,
    );
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();

    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    expect(selected()).toEqual(["Beta"]);
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1].tabIndex).toBe(0);
    expect(tabs[0].tabIndex).toBe(-1);

    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    expect(selected()).toEqual(["Gamma"]);
    expect(document.activeElement).toBe(tabs[2]);

    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    expect(document.activeElement).toBe(tabs[0]);

    fireEvent.keyDown(document.activeElement!, { key: "ArrowLeft" });
    expect(selected()).toEqual(["Gamma"]);
    expect(document.activeElement).toBe(tabs[2]);

    fireEvent.keyDown(document.activeElement!, { key: "Home" });
    expect(selected()).toEqual(["Alpha"]);
    expect(document.activeElement).toBe(tabs[0]);

    fireEvent.keyDown(document.activeElement!, { key: "End" });
    expect(selected()).toEqual(["Gamma"]);
    expect(document.activeElement).toBe(tabs[2]);
  });

  it("follows the shown order when the reader's OS tab moves first", () => {
    vi.spyOn(navigator, "platform", "get").mockReturnValue("Win32");
    render(
      <div className="sol-os-tabs">
        <Tabs>
          <Tab title="macOS">m</Tab>
          <Tab title="Linux">l</Tab>
          <Tab title="Windows">w</Tab>
        </Tabs>
      </div>,
    );
    const [mac, linux, windows] = screen.getAllByRole("tab");
    expect(selected()).toEqual(["Windows"]);
    windows.focus();

    fireEvent.keyDown(windows, { key: "ArrowRight" });
    expect(document.activeElement).toBe(mac);
    fireEvent.keyDown(mac, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(windows);
    fireEvent.keyDown(windows, { key: "End" });
    expect(selected()).toEqual(["Linux"]);
    expect(document.activeElement).toBe(linux);
    fireEvent.keyDown(linux, { key: "Home" });
    expect(document.activeElement).toBe(windows);
  });

  it("gives <CodeGroup> tabs one tab stop and arrow-key navigation", () => {
    render(
      <CodeGroup>
        {fence("Kit", 3, false)}
        {fence("CLI", 3, false)}
      </CodeGroup>,
    );
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((t) => t.tabIndex)).toEqual([0, -1]);
    tabs[0].focus();

    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(selected()).toEqual(["CLI"]);
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs.map((t) => t.tabIndex)).toEqual([-1, 0]);

    fireEvent.keyDown(tabs[1], { key: "ArrowLeft" });
    expect(selected()).toEqual(["Kit"]);
    expect(document.activeElement).toBe(tabs[0]);
  });
});
