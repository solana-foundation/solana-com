import { fireEvent, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CodeBlock,
  CodeGroup,
  Step,
  Steps,
  Tab,
  Tabs,
  focusWindow,
  panelRun,
} from "@/components/docs/docs-components";

vi.mock("@/lib/docs/ask-ai", () => ({ openAskAi: vi.fn() }));

beforeEach(() => {
  const Observer = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  vi.stubGlobal("IntersectionObserver", Observer);
  vi.stubGlobal("ResizeObserver", Observer);
});

/**
 * A highlighted fence as the MDX pipeline hands it to the `pre` component:
 * rehype-code puts each one in a fragment of its own.
 */
function fence(
  title: string,
  lines = 3,
  props: Record<string, string | undefined> = {},
) {
  return (
    <>
      <CodeBlock className="shiki" title={title} data-language="ts" {...props}>
        <code>
          {Array.from({ length: lines }, (_, i) => (
            <span key={i} className="line">
              {`${title} line ${i + 1}`}
            </span>
          ))}
        </code>
      </CodeBlock>
    </>
  );
}
const mark = (title: string) => fence(title, 3, { "data-panel": "true" });

/** The server render (no effects ran), as a DOM tree. */
function ssr(node: ReactElement) {
  const div = document.createElement("div");
  div.innerHTML = renderToStaticMarkup(node);
  return div;
}
const steps = (container: HTMLElement) =>
  [...container.querySelectorAll(".steps > .step")] as HTMLElement[];
const rail = (step: Element) =>
  step.querySelector(":scope > .step-body > .step-content > .step-code");
const titles = (el: Element | null) =>
  [...(el?.querySelectorAll(".code-block-filename span") ?? [])].map(
    (t) => t.textContent,
  );

describe("<Steps> without codePanel", () => {
  it("renders today's markup", () => {
    const html = renderToStaticMarkup(
      <Steps>
        <Step title="One">
          <p>Text</p>
          {fence("a.ts", 1)}
        </Step>
        <Step title="Two">
          <p>More</p>
        </Step>
      </Steps>,
    );
    expect(html).not.toContain("step-code");
    expect(html).not.toContain("data-code-panel");
    expect(html).toMatchInlineSnapshot(
      `"<div class="steps" role="list" data-title-size="p"><div class="step step-container" role="listitem"><div data-component-part="step-line" class="step-line"></div><div data-component-part="step-number" class="step-number"><div data-component-part="step-indicator" class="step-indicator"><div>1</div></div></div><div class="step-body"><p data-component-part="step-title" class="step-title">One</p><div data-component-part="step-content" class="prose step-content"><p>Text</p><div class="code-block not-prose" data-has-header="" data-language="ts" data-code-copy-scope=""><div data-component-part="code-block-header" class="code-block-header"><div data-component-part="code-block-header-filename" class="code-block-filename"><span>a.ts</span></div><div class="code-block-actions"><div class="code-block-copy-button "><button type="button" data-testid="copy-code-button" aria-label="Copy the contents from the code block" class="code-copy"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="code-copy-icon"><path d="M14.25 5.25H7.25C6.14543 5.25 5.25 6.14543 5.25 7.25V14.25C5.25 15.3546 6.14543 16.25 7.25 16.25H14.25C15.3546 16.25 16.25 15.3546 16.25 14.25V7.25C16.25 6.14543 15.3546 5.25 14.25 5.25Z"></path><path d="M2.80103 11.998L1.77203 5.07397C1.61003 3.98097 2.36403 2.96397 3.45603 2.80197L10.38 1.77297C11.313 1.63397 12.19 2.16297 12.528 3.00097"></path></svg></button><span class="sr-only" role="status"></span></div><div class="code-block-ask-button"><button type="button" aria-label="Ask AI about this code" class="code-copy"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="code-copy-icon"><path d="M5.65799 2.99L4.39499 2.569L3.97399 1.306C3.83699 0.898 3.16199 0.898 3.02499 1.306L2.60399 2.569L1.34099 2.99C1.13699 3.058 0.998993 3.249 0.998993 3.464C0.998993 3.679 1.13699 3.87 1.34099 3.938L2.60399 4.359L3.02499 5.622C3.09299 5.826 3.28499 5.964 3.49999 5.964C3.71499 5.964 3.90599 5.826 3.97499 5.622L4.39599 4.359L5.65899 3.938C5.86299 3.87 6.00099 3.679 6.00099 3.464C6.00099 3.249 5.86199 3.058 5.65799 2.99Z" fill="currentColor" stroke="none"></path><path d="M9.5 2.75L11.412 7.587L16.25 9.5L11.412 11.413L9.5 16.25L7.587 11.413L2.75 9.5L7.587 7.587L9.5 2.75Z"></path></svg></button></div></div></div><div role="presentation" data-component-part="code-block-root" class="code-block-root"><div data-component-part="scroll-area-viewport" class="code-block-viewport"><pre class="shiki" data-language="ts"><code><span class="line">a.ts line 1</span></code></pre></div></div></div></div></div></div><div class="step step-container" role="listitem"><div data-component-part="step-line" class="step-line step-line-last"></div><div data-component-part="step-number" class="step-number"><div data-component-part="step-indicator" class="step-indicator"><div>2</div></div></div><div class="step-body"><p data-component-part="step-title" class="step-title">Two</p><div data-component-part="step-content" class="prose step-content"><p>More</p></div></div></div></div>"`,
    );
  });
});

describe("<Steps codePanel>", () => {
  it("puts each step's one code element in a panel rail", () => {
    const container = ssr(
      <Steps codePanel>
        <Step title="One">
          <p>Text</p>
          {fence("one.ts")}
        </Step>
        <Step title="Two">
          {fence("a.ts")}
          {fence("b.ts")}
        </Step>
        <Step title="Group">
          <CodeGroup>
            {fence("kit.ts")}
            {fence("legacy.ts")}
          </CodeGroup>
        </Step>
        <Step title="Tabs">
          <Tabs>
            <Tab title="Kit">{fence("tab.ts")}</Tab>
          </Tabs>
        </Step>
      </Steps>,
    );
    const list = container.querySelector(".steps")!;
    expect(list.hasAttribute("data-code-panel")).toBe(true);
    const [one, two, group, tabs] = steps(container);
    // The rail holds the box, the box holds the code; prose stays outside.
    const r1 = rail(one)!;
    expect(r1.firstElementChild?.classList.contains("step-code-box")).toBe(
      true,
    );
    expect(titles(r1)).toEqual(["one.ts"]);
    expect(r1.previousElementSibling?.textContent).toBe("Text");
    expect(rail(two)).toBeNull();
    expect(rail(group)?.querySelector(".code-group")).not.toBeNull();
    expect(rail(tabs)?.querySelector(".tabs")).not.toBeNull();
    expect(steps(container).map((s) => s.hasAttribute("data-active"))).toEqual([
      true,
      false,
      false,
      false,
    ]);
    expect(
      [...container.querySelectorAll(".step-code")].map((r) =>
        r.hasAttribute("data-shown"),
      ),
    ).toEqual([true, false, false]);
  });

  it("puts only marked fences in the panel when any fence is marked", () => {
    const container = ssr(
      <Steps codePanel>
        <Step title="Manifest">
          <p>Intro</p>
          {fence("terminal")}
          {mark("Cargo.toml")}
          {"\n"}
          {mark("src/lib.rs")}
          {fence("output")}
        </Step>
        <Step title="Build">
          <p>Run it.</p>
          {fence("terminal")}
        </Step>
        <Step title="Code">{mark("src/lib.rs")}</Step>
      </Steps>,
    );
    const [manifest, build, code] = steps(container);
    const r = rail(manifest)!;
    expect(titles(r)).toEqual(["Cargo.toml", "src/lib.rs"]);
    const content = manifest.querySelector(".step-content")!;
    expect(
      [...content.children].map((c) =>
        c === r ? "rail" : (c.textContent ?? "").slice(0, 8),
      ),
    ).toEqual(["Intro", "terminal", "rail", "outputou"]);
    expect(rail(build)).toBeNull();
    expect(titles(rail(code))).toEqual(["src/lib.rs"]);
  });

  it("activates the clicked step and shows its panel, else the previous one", () => {
    const { container } = render(
      <Steps codePanel>
        <Step title="One">{fence("one.ts")}</Step>
        <Step title="Two">{fence("two.ts")}</Step>
        <Step title="Three">{fence("three.ts")}</Step>
        <Step title="Four">
          <p>No code</p>
        </Step>
      </Steps>,
    );
    const all = steps(container);
    const shown = () =>
      all.map((s) => rail(s)?.hasAttribute("data-shown") ?? null);
    const active = () => all.map((s) => s.hasAttribute("data-active"));
    fireEvent.click(all[2].querySelector(".step-title")!);
    expect(active()).toEqual([false, false, true, false]);
    expect(shown()).toEqual([false, false, true, null]);
    fireEvent.click(all[0].querySelector(".step-title")!);
    expect(active()).toEqual([true, false, false, false]);
    expect(shown()).toEqual([true, false, false, null]);
    fireEvent.click(all[3].querySelector(".step-content p")!);
    expect(active()).toEqual([false, false, false, true]);
    expect(shown()).toEqual([false, false, true, null]);
  });
});

describe("CodePanelSteps", () => {
  it("clears the TOC flag on .content-row when it unmounts", () => {
    const row = document.createElement("div");
    row.className = "content-row";
    document.body.append(row);
    const { container, unmount } = render(
      <Steps codePanel>
        <Step title="One">{fence("one.ts")}</Step>
        <Step title="Two">{fence("two.ts")}</Step>
      </Steps>,
      { container: row },
    );
    container.querySelector(".steps")!.setAttribute("data-in-view", "");
    row.setAttribute("data-code-panel-over", "");
    unmount();
    expect(row.hasAttribute("data-code-panel-over")).toBe(false);
    row.remove();
  });
});

describe("panelRun", () => {
  it("takes the one code element of an unmarked step", () => {
    expect(panelRun(["\n", <p key="p" />, fence("a")], false)).toEqual([2, 2]);
    expect(panelRun([<CodeGroup key="g" />], false)).toEqual([0, 0]);
    expect(panelRun([fence("a"), fence("b")], false)).toBeNull();
    expect(panelRun([<p key="p" />], false)).toBeNull();
  });

  it("takes adjacent marked fences across blank text", () => {
    expect(
      panelRun([fence("a"), mark("b"), "\n", mark("c"), fence("d")], true),
    ).toEqual([1, 3]);
    expect(panelRun([mark("b"), <p key="p" />, mark("c")], true)).toEqual([
      0, 0,
    ]);
    expect(panelRun([fence("a")], true)).toBeNull();
  });
});

describe("focusWindow", () => {
  it("opens on the focus with a line of context, 6 to 16 rows", () => {
    expect(focusWindow("116-126", 126)).toEqual({ from: 113, rows: 13 });
    expect(focusWindow("36-85", 137)?.rows).toBe(16);
    expect(focusWindow("36-85", 137)?.from).toBe(34);
    expect(focusWindow("7", 20)).toEqual({ from: 5, rows: 6 });
  });

  it("keeps the top window for focus in lines 1–5, or none", () => {
    expect(focusWindow("3", 40)).toBeNull();
    expect(focusWindow("1-5", 40)).toBeNull();
    expect(focusWindow(undefined, 40)).toBeNull();
  });

  it("ignores lines outside the block", () => {
    expect(focusWindow("3,200-210", 40)).toBeNull();
    expect(focusWindow("30-60", 40)).toEqual({ from: 27, rows: 13 });
  });

  it("is never taller than the block", () => {
    expect(focusWindow("1-9", 9)).toEqual({ from: 0, rows: 9 });
    expect(focusWindow("3-12", 12)).toEqual({ from: 0, rows: 12 });
  });
});

describe("collapsed blocks open on their focus", () => {
  const root = (el: HTMLElement) =>
    el.querySelector<HTMLElement>(".code-block-root")!;
  const block = (props: Record<string, string | undefined>, lines = 126) =>
    ssr(fence("Example", lines, { "data-expandable": "true", ...props }));

  it("windows an expandable fence on its focused lines", () => {
    const r = root(block({ "data-focus": "116-126" }));
    expect(r.hasAttribute("data-focus-window")).toBe(true);
    expect(r.getAttribute("style")).toBe(
      "height:calc(13 * 1.5rem + 4rem);--focus-from:113",
    );
    expect(r.firstElementChild?.classList.contains("code-focus-fade")).toBe(
      true,
    );
  });

  it("draws no fade when the window starts at line 1", () => {
    const r = root(block({ "data-focus": "2-12" }, 40));
    expect(r.hasAttribute("data-focus-window")).toBe(true);
    expect(r.getAttribute("style")).toContain("--focus-from:0");
    expect(r.querySelector(".code-focus-fade")).toBeNull();
  });

  it("windows on highlighted lines when there is no focus", () => {
    const r = root(block({ "data-highlight": "40-44" }));
    expect(r.hasAttribute("data-focus-window")).toBe(true);
    expect(r.getAttribute("style")).toContain("--focus-from:38");
    // With both, the focus wins.
    const both = root(
      block({ "data-highlight": "40-44", "data-focus": "100-101" }),
    );
    expect(both.getAttribute("style")).toContain("--focus-from:98");
  });

  it("keeps today's markup otherwise", () => {
    const today = (props: Record<string, string | undefined>, lines = 126) => {
      const r = root(block(props, lines));
      expect(r.hasAttribute("data-focus-window")).toBe(false);
      expect(r.querySelector(".code-focus-fade")).toBeNull();
      expect(r.className).toBe("code-block-root");
      return r;
    };
    const style = (r: HTMLElement) => r.getAttribute("style");
    expect(style(today({ "data-focus": "3" }))).toBe("height:190px");
    expect(style(today({ "data-focus": "116-126", "data-wrap": "true" }))).toBe(
      "height:190px",
    );
    expect(
      style(today({ "data-focus": "116-126", "data-expandable": undefined })),
    ).toBeNull();
    expect(style(today({ "data-focus": "7" }, 8))).toBeNull();
  });
});
