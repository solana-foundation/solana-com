import katex from "katex";
import React from "react";

type LatexProps = {
  formula?: string;
  displayMode?: boolean;
};

export function Latex({ formula, displayMode = false }: LatexProps) {
  const source = formula?.trim();

  if (!source) {
    return null;
  }

  const markup = katex.renderToString(source, {
    displayMode,
    output: "htmlAndMathml",
    throwOnError: false,
    trust: false,
  });

  if (displayMode) {
    return (
      <div
        className="latex-display"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  }

  return (
    <span
      className="latex-inline"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
