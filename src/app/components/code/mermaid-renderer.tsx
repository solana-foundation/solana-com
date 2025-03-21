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

export function MermaidRenderer({
  content,
  isModal = false,
  zoomLevel = 1,
}: {
  content: string;
  isModal?: boolean;
  zoomLevel?: number;
}) {
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

          // Extract viewBox values to handle dimensions properly
          const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
          let viewBoxValues = [];

          if (viewBoxMatch && viewBoxMatch[1]) {
            viewBoxValues = viewBoxMatch[1].split(" ").map(Number);
          }

          // Calculate aspect ratio if viewBox is available
          const aspectRatio =
            viewBoxValues.length === 4
              ? (viewBoxValues[2] / viewBoxValues[3]).toFixed(2)
              : 1;

          // Process the SVG - note we're only removing height from the main svg tag
          // and preserving height attributes on internal elements
          let processedSvg = svg
            .replace(/width="[^"]*"/, 'width="100%"')
            .replace(
              /style="max-width:[^"]*"/,
              `style="width:100%;aspect-ratio:${aspectRatio}"`,
            )
            .replace(/<svg/, '<svg preserveAspectRatio="xMinYMin meet"');

          // Remove height only from the main SVG element, not from rect elements
          const svgHeightMatch = processedSvg.match(
            /<svg[^>]*height="([^"]*)"[^>]*>/,
          );
          if (svgHeightMatch) {
            processedSvg = processedSvg.replace(
              /<svg([^>]*)height="[^"]*"([^>]*)>/,
              "<svg$1$2>",
            );
          }

          setSvg(processedSvg);
        }
      } catch (error) {
        console.error("Error while rendering mermaid", error);
        setSvg(`
            <pre class="mt-2 p-2 bg-gray-100 text-xs overflow-auto">${content}</pre>
        `);
      }
    }
  }, [content, id, isVisible, isModal]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svg }}
      className="w-full"
      style={{
        transform: `scale(${zoomLevel})`,
        transformOrigin: "top left",
        transition: "transform 0.2s ease-in-out",
        maxHeight: isModal ? "none" : "auto",
        width: "100%",
        overflow: "visible",
        height: "fit-content",
      }}
    />
  );
}
