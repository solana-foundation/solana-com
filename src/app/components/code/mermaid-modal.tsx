"use client";

import { Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { MermaidRenderer } from "./mermaid-renderer";
import { cn } from "@/app/components/utils";

export function MermaidModal({
  content,
  isOpen,
  onClose,
}: {
  content: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [initialZoomSet, setInitialZoomSet] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [overflowY, setOverflowY] = useState<
    "auto" | "hidden" | "scroll" | "visible"
  >("auto");
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  // Calculate optimal zoom level based on diagram and modal dimensions
  const calculateOptimalZoom = () => {
    if (!contentRef.current || !diagramRef.current) return 1;

    const container = contentRef.current;
    const diagram = diagramRef.current;

    // Get available space in the modal with minimal padding
    const availableWidth = container.clientWidth - 32;
    const availableHeight = container.clientHeight - 32;

    // Get diagram dimensions
    const diagramWidth = diagram.scrollWidth;
    const diagramHeight = diagram.scrollHeight;

    console.log("Diagram dimensions:", {
      diagramWidth,
      diagramHeight,
      availableWidth,
      availableHeight,
      ratio: diagramWidth / diagramHeight,
    });

    // Calculate both width and height ratios
    const widthRatio = availableWidth / diagramWidth;
    const heightRatio = availableHeight / diagramHeight;

    // Choose scaling based on diagram's own aspect ratio
    let scaledRatio;
    if (diagramHeight > diagramWidth) {
      // Tall diagram (height > width): fit to width
      scaledRatio = widthRatio * 0.95;
    } else {
      // Wide diagram (width > height): fit to height
      scaledRatio = heightRatio * 0.95;
    }

    // Ensure ratio is reasonable
    return Math.max(0.5, Math.min(2, Math.round(scaledRatio * 4) / 4));
  };

  // Center the diagram visually by adjusting scroll position
  const centerDiagram = () => {
    if (!contentRef.current || !diagramRef.current) return;

    const container = contentRef.current;
    const diagram = diagramRef.current;

    // Calculate diagram dimensions after scaling
    const scaledDiagramWidth = diagram.scrollWidth * zoomLevel;
    const scaledDiagramHeight = diagram.scrollHeight * zoomLevel;

    // Get container dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Calculate scroll positions to center the diagram if it's smaller than the container
    const scrollLeft =
      scaledDiagramWidth <= containerWidth
        ? 0
        : (scaledDiagramWidth - containerWidth) / 2;
    const scrollTop = scaledDiagramHeight <= containerHeight ? 0 : 0; // Keep at top for taller diagrams

    // Apply scroll positions
    requestAnimationFrame(() => {
      container.scrollLeft = scrollLeft;
      container.scrollTop = scrollTop;
      setScrollLeft(scrollLeft);
      setScrollTop(scrollTop);
    });
  };

  // Handle mouse down event to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!contentRef.current) return;

    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setScrollLeft(contentRef.current.scrollLeft);
    setScrollTop(contentRef.current.scrollTop);

    // Change cursor to grabbing
    if (contentRef.current) {
      contentRef.current.style.cursor = "grabbing";
    }
  };

  // Handle mouse move event to update scroll position
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !contentRef.current) return;

    e.preventDefault();

    // Calculate how far the mouse has been moved
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // Scroll the container
    contentRef.current.scrollLeft = scrollLeft - dx;
    contentRef.current.scrollTop = scrollTop - dy;
  };

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);

    // Change cursor back to grab
    if (contentRef.current) {
      contentRef.current.style.cursor = "grab";
    }
  };

  // Handle mouse leave event to stop dragging
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);

      // Change cursor back to grab
      if (contentRef.current) {
        contentRef.current.style.cursor = "grab";
      }
    }
  };

  // Set initial zoom level on first render
  useEffect(() => {
    if (isOpen && !initialZoomSet && contentRef.current && diagramRef.current) {
      // Wait for rendering to complete before calculating optimal zoom
      const timer = setTimeout(() => {
        const optimalZoom = calculateOptimalZoom();
        setZoomLevel(optimalZoom);
        setInitialZoomSet(true);

        // Additional timeout to ensure zoom is applied before centering
        setTimeout(() => {
          centerDiagram();
          // Check if we need a vertical scrollbar after zoom and centering
          setTimeout(checkOverflow, 50);
        }, 50);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isOpen, initialZoomSet]);

  // Reset initial zoom flag when modal closes
  useEffect(() => {
    if (!isOpen) {
      setInitialZoomSet(false);
    }
  }, [isOpen]);

  // Center diagram when modal opens or zoom changes
  useEffect(() => {
    if (isOpen && initialZoomSet) {
      // Wait for rendering to complete
      setTimeout(() => {
        centerDiagram();
      }, 100);
    }
  }, [isOpen, zoomLevel, initialZoomSet]);

  // Set cursor when modal opens
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.style.cursor = "grab";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => prev + 0.25);
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.25));
  };

  const handleResetZoom = () => {
    // Reset to the calculated optimal zoom, not a fixed value
    const optimalZoom = calculateOptimalZoom();
    setZoomLevel(optimalZoom);
  };

  // Add a function to check if content overflows and update the overflow state
  const checkOverflow = () => {
    if (!contentRef.current || !diagramRef.current) return;

    const container = contentRef.current;
    const diagram = diagramRef.current;

    // Calculate the total height of the content including padding
    const totalContentHeight = diagram.scrollHeight * zoomLevel + 32; // 32px for padding

    // Compare with container height
    if (totalContentHeight <= container.clientHeight) {
      setOverflowY("hidden");
    } else {
      setOverflowY("auto");
    }
  };

  // Update overflow when zoom level changes
  useEffect(() => {
    if (isOpen && initialZoomSet) {
      setTimeout(checkOverflow, 100);
    }
  }, [zoomLevel, isOpen, initialZoomSet]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative overflow-hidden border rounded shadow-lg border-ch-border bg-ch-background"
        style={{ width: "90vw", height: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "border-b-[1px] border-ch-border bg-ch-tabs-background px-3 py-0",
            "w-full h-9 flex items-center justify-between sticky top-0 z-10",
            "text-ch-tab-inactive-foreground text-sm font-mono",
          )}
        >
          <div className="flex items-center w-full h-5 gap-2">
            <span className="leading-none">Diagram</span>
            <div className="flex items-center gap-2 ml-auto mr-1">
              <button
                onClick={handleZoomIn}
                className="text-ch-tab-inactive-foreground hover:text-ch-tab-active-foreground focus:outline-none"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="text-ch-tab-inactive-foreground hover:text-ch-tab-active-foreground focus:outline-none"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="text-ch-tab-inactive-foreground hover:text-ch-tab-active-foreground focus:outline-none"
                aria-label="Reset zoom"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <span className="text-xs text-ch-tab-inactive-foreground">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={onClose}
                className="text-ch-tab-inactive-foreground hover:text-ch-tab-active-foreground focus:outline-none"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={contentRef}
          className="bg-ch-background"
          style={{
            height: "calc(80vh - 36px)",
            width: "100%",
            overflowX: "auto",
            overflowY: overflowY,
            cursor: "grab",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="w-full pt-4 pl-4"
            style={{
              minWidth: "100%",
              userSelect: isDragging ? "none" : "auto", // Prevent text selection during drag
            }}
          >
            <div
              ref={diagramRef}
              className="w-full"
              style={{
                display: "block",
                width: "100%",
              }}
            >
              <MermaidRenderer
                content={content}
                isModal={true}
                zoomLevel={zoomLevel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
