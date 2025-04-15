// Reference: https://github.com/the-guild-org/docs/blob/main/packages/remark-mermaid/src/mermaid.tsx
"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import type { MermaidConfig } from "mermaid";
import { Loader2 } from "lucide-react";

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
}: {
  content: string;
  isModal?: boolean;
}) {
  const id = useId();
  const [svg, setSvg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(containerRef);
  const svgPanZoomInstance = useRef<SvgPanZoom.Instance | null>(null);

  useEffect(() => {
    if (isModal && containerRef.current) {
      const svgElement = containerRef.current.querySelector("svg");
      if (svgElement) {
        const initializePanZoom = async () => {
          try {
            const svgPanZoom = (await import("svg-pan-zoom")).default;
            if (svgPanZoomInstance.current) {
              svgPanZoomInstance.current.destroy();
            }
            svgPanZoomInstance.current = svgPanZoom(svgElement, {
              zoomEnabled: true,
              controlIconsEnabled: true,
              fit: true,
              center: true,
              minZoom: 0.1,
              maxZoom: 10,
              zoomScaleSensitivity: 0.3,
            });
          } catch (error) {
            console.error("Failed to load svg-pan-zoom:", error);
          }
        };
        void initializePanZoom();
      }
    }

    return () => {
      if (svgPanZoomInstance.current) {
        svgPanZoomInstance.current.destroy();
        svgPanZoomInstance.current = null;
      }
    };
  }, [isModal, svg]);

  useEffect(() => {
    // Reset loading state when content changes
    setIsLoading(true);

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
      setIsLoading(true);

      const isDarkTheme =
        htmlElement.classList.contains("dark") ||
        htmlElement.attributes.getNamedItem("data-theme")?.value === "dark";

      const mermaidConfig: MermaidConfig = {
        startOnLoad: false,
        securityLevel: "loose",
        fontFamily: "inherit",
        themeCSS: "margin: 0;",
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

          // Process the SVG - note we're only removing height from the main svg tag
          // and preserving height attributes on internal elements
          let processedSvg = svg
            .replace(/width="[^"]*"/, 'width="100%"')
            .replace(
              /style="[^"]*"/,
              `style="width:100%;height:100%;max-height:${isModal ? "calc(100vh - 140px)" : "auto"};${isModal ? "position:relative;" : ""}"`,
            )
            .replace(/<svg/, '<svg preserveAspectRatio="xMidYMid meet"');

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
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error while rendering mermaid", error);
        setSvg(`
            <pre class="mt-2 p-2 bg-gray-100 text-xs overflow-auto">${content}</pre>
        `);
        setIsLoading(false);
      }
    }
  }, [content, id, isVisible, isModal]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-ch-background/80">
          <Loader2 className="w-8 h-8 text-ch-tab-active-foreground animate-spin" />
        </div>
      )}
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: svg }}
        className="w-full h-full"
        style={{
          position: "relative",
          maxHeight: isModal ? "calc(100vh - 140px)" : "auto",
          width: "100%",
          overflow: "visible",
          padding: "0",
        }}
      />
    </div>
  );
}
