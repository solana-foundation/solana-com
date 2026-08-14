import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArticleFigure } from "@/components/article-figure";

describe("ArticleFigure", () => {
  it("renders separate alt text and rich caption content", () => {
    const caption = React.createElement(
      "p",
      null,
      React.createElement("strong", null, "Fig.1:"),
      " Account growth. Source: ",
      React.createElement(
        "a",
        { href: "https://example.com/source" },
        "data query",
      ),
      ".",
    );
    const markup = renderToStaticMarkup(
      React.createElement(
        ArticleFigure,
        {
          src: "/uploads/posts/chart.png",
          alt: "Account growth over time",
        },
        caption,
      ),
    );

    expect(markup).toContain("<figure");
    expect(markup).toContain('<figcaption class="');
    expect(markup).toContain('alt="Account growth over time"');
    expect(markup).toContain("<strong>Fig.1:</strong>");
    expect(markup).toContain('href="https://example.com/source"');
  });

  it("does not render an incomplete figure without an image", () => {
    expect(
      renderToStaticMarkup(
        React.createElement(ArticleFigure, { alt: "Missing chart" }, "Caption"),
      ),
    ).toBe("");
  });
});
