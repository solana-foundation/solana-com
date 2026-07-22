import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Latex } from "@/components/latex";

describe("Latex", () => {
  it("renders accessible inline math", () => {
    const markup = renderToStaticMarkup(
      React.createElement(Latex, { formula: "E = mc^2" }),
    );

    expect(markup).toContain('class="latex-inline"');
    expect(markup).toContain('class="katex"');
    expect(markup).toContain("<math");
  });

  it("renders display math in an overflow-safe wrapper", () => {
    const markup = renderToStaticMarkup(
      React.createElement(Latex, {
        formula: "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}",
        displayMode: true,
      }),
    );

    expect(markup).toContain('class="latex-display"');
    expect(markup).toContain('class="katex-display"');
  });

  it("does not emit markup for an empty formula", () => {
    expect(
      renderToStaticMarkup(React.createElement(Latex, { formula: "   " })),
    ).toBe("");
  });

  it("shows invalid input without failing the article render", () => {
    const markup = renderToStaticMarkup(
      React.createElement(Latex, { formula: "\\not-a-command{" }),
    );

    expect(markup).toContain("katex-error");
  });
});
