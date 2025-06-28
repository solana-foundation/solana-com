/**
 * Marquee component for continuously scrolling content to the left.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The elements to scroll in the marquee.
 * @param {string} [props.className] - Additional Tailwind classes for the marquee container.
 * @param {number} [props.speed=50] - Scrolling speed in pixels per second.
 *
 * @example
 * // Basic usage
 * <Marquee>
 *   <div className="mx-4">🌟 Item 1</div>
 *   <div className="mx-4">🚀 Item 2</div>
 *   <div className="mx-4">🔥 Item 3</div>
 * </Marquee>
 *
 * @example
 * // With custom speed and background
 * <Marquee className="bg-gray-100 py-2" speed={80}>
 *   <span className="mx-8">Custom Content 1</span>
 *   <span className="mx-8">Custom Content 2</span>
 * </Marquee>
 */

import React, { useRef, useEffect, useState } from "react";

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  speed?: number;
};

const Marquee: React.FC<MarqueeProps> = ({
  children,
  className = "",
  speed = 35,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.offsetWidth);
    }
  }, [children]);

  const duration = contentWidth > 0 ? contentWidth / speed : 0;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      aria-label="Scrolling content"
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: contentWidth
            ? `${duration}s linear 0s infinite normal none running marquee`
            : "none",
          animationPlayState: isHovered ? "paused" : "running",
        }}
      >
        <div ref={contentRef} className="flex">
          {children}
        </div>
        {/* Duplicate for seamless looping */}
        <div className="flex" aria-hidden="true">
          {children}
        </div>
      </div>
      {/* Keyframes in style tag for isolation */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${contentWidth}px); }
          }
        `}
      </style>
    </div>
  );
};

export default Marquee;
