// Reference: https://github.com/the-guild-org/docs/blob/main/packages/remark-mermaid/src/mermaid.tsx
"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import type { MermaidConfig } from "mermaid";

function useIsVisible(ref: RefObject<HTMLElement>) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // disconnect after once visible to avoid re-rendering of chart when `isIntersecting` will
        // be changed to true/false
        observer.disconnect();
        setIsIntersecting(true);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}

export function MermaidRenderer({ content }: { content: string }) {
  const id = useId();
  const [svg, setSvg] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(containerRef);

  useEffect(() => {
    // Fix when inside element with `display: hidden`
    if (!isVisible) {
      return;
    }

    const htmlElement = document.documentElement;
    const observer = new MutationObserver(renderChart);
    observer.observe(htmlElement, { attributes: true });
    renderChart();

    return () => {
      observer.disconnect();
    };

    // Handle theme switching
    async function renderChart() {
      const isDarkTheme =
        htmlElement.classList.contains("dark") ||
        htmlElement.attributes.getNamedItem("data-theme")?.value === "dark";

      const mermaidConfig: MermaidConfig = {
        startOnLoad: false,
        securityLevel: "loose",
        fontFamily: "inherit",
        themeCSS: "margin: 1.5rem auto 0;",
        theme: isDarkTheme ? "dark" : "neutral",
      };

      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize(mermaidConfig);

        if (containerRef.current) {
          const { svg } = await mermaid.render(
            // strip invalid characters for `id` attribute
            id.replaceAll(":", ""),
            content.replaceAll("\\n", "\n"),
            containerRef.current,
          );

          setSvg(svg);
        }
      } catch (error) {
        console.error("Error while rendering mermaid", error);
        setSvg(`
            <pre class="mt-2 p-2 bg-gray-100 text-xs overflow-auto">${content}</pre>
        `);
      }
    }
  }, [content, id, isVisible]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svg }}
      className="flex justify-center my-2 overflow-auto"
    />
  );
}
